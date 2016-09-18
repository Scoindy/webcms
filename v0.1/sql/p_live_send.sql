/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_live_send.sql
* Description   : Sends live emails to contacts
* Author        : Scott Walkinshaw
* Date          : 3rd January 2012
* Parameters    : 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Dec 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_live_send;
DELIMITER $$
CREATE PROCEDURE p_live_send (
                   IN   p_action       VARCHAR(1),
                   IN   p_campaign_id  INT,
                   IN   p_segment_id   VARCHAR(64),
                   IN   p_email_id     VARCHAR(64),
                   OUT  p_status       CHAR(1),
                   OUT  p_string       VARCHAR(512),
                   OUT  p_error        VARCHAR(512),
                   OUT  p_error_code   VARCHAR(512),
                   OUT  p_new_id       VARCHAR(16),
                   OUT  p_count        VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object          VARCHAR(32)    DEFAULT 'p_live_send';
  DECLARE v_event           INT            DEFAULT 0;
  DECLARE v_query           VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql             VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows            INT            DEFAULT 0;
  DECLARE v_debug           VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep             CHAR           DEFAULT '|';
  DECLARE v_segments        INT            DEFAULT 0; 
  DECLARE v_dummy           VARCHAR(64);
  DECLARE v_i               INT            DEFAULT 1;
  DECLARE v_run_id          INT            DEFAULT 1;
  DECLARE v_segment_id      VARCHAR(1024);
  DECLARE v_count           INT             DEFAULT 0;
  DECLARE v_done            BOOLEAN         DEFAULT FALSE;
  DECLARE v_db              VARCHAR(16);
  DECLARE v_column          VARCHAR(64);
  DECLARE v_position        INT;
  DECLARE v_columns         VARCHAR(1024)   DEFAULT '';
  DECLARE v_contact_id      INT;
  DECLARE v_html            LONGTEXT;

  DECLARE v_email_subject   VARCHAR(128);
  DECLARE v_email_body      TEXT;
  DECLARE v_email_body2     TEXT;
  DECLARE v_sender_name     VARCHAR(128);
  DECLARE v_sender_address  VARCHAR(128);
  DECLARE v_reply_to        VARCHAR(128);
  DECLARE v_template_id     VARCHAR(128);

  DECLARE v_seg_query      VARCHAR(1024)   DEFAULT '';

  DECLARE e_exception      INT            DEFAULT FALSE;

  DECLARE c_1 CURSOR FOR
  SELECT contact_id
  FROM   campaign_emails
  WHERE  campaign_email_id = p_new_id
  ORDER BY
         contact_id;


  DECLARE CONTINUE HANDLER FOR NOT FOUND          SET v_done      = TRUE;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN SET e_exception = TRUE; END;

  SET SQL_BIG_SELECTS = TRUE;

main:BEGIN

  /****
  *  Log entry
  ****/
  CALL p_event (
         v_object,
         1,
         v_event
       );

  /****
  *  Out parameter defaults
  ****/
  SET p_string := 'empty';
  SET p_status := '-1';
  SET p_count  := '-1';
  SET p_error  := 'OK';
/*
  campaign_email_id  INT          NOT NULL                COMMENT "campaign email ID",
  record             INT          NOT NULL                COMMENT "ID for each email",
  campaign_id        INT          NOT NULL                COMMENT "Unique campaign ID",
  email_id           INT          NOT NULL                COMMENT "email ID",
  email_body  
*/

  /****
  *  Get the next id if creating
  *
  *  we need to send the new id back to the browser
  *  but need to rethink this as > 1 person
  *  could be creating filters at the same time
  *  opt 1 - could lock the table until the proc finished
  *  opt 2 - select the id back out of the table using the name
  *  opt 3 - keep them in a table (could skip sequence though)
  ****/
  IF p_action = 'L' THEN
    SELECT IFNULL(MAX(campaign_email_id + 1), 1)
    INTO   p_new_id
    FROM   campaign_emails;
  END IF;

    /****
    *  Count the number of separators in p_segment_id
    *  to find out how many segments we have
    ****/
    SET    v_segment_id := p_segment_id;
    SELECT LENGTH(v_segment_id) - LENGTH(REPLACE(v_segment_id, v_sep, ''))
    INTO   v_segments;

    /****
    *  Strip the first separator off the parameters
    ****/
    SET p_segment_id := SUBSTR(p_segment_id, 2);

    /****
    *  Separate the rule strings and build query
    ****/
    WHILE (v_i <= v_segments) DO

      /****
      *  Profile Fields
      ****/
      SELECT SUBSTRING_INDEX(p_segment_id, v_sep, 1)
      INTO   v_segment_id;
      SELECT SUBSTRING(p_segment_id, LOCATE(v_sep, p_segment_id) + 1)
      INTO   p_segment_id;

      SET v_i := v_i + 1;

    END WHILE;

  /****
  *  First get the segment query
  ****/
  SELECT query
  INTO   v_seg_query
  FROM   segments
  WHERE  segment_id = p_segment_id;
 
  /****
  *  Get the email details
  ****/
  SELECT email_subject,
         email_body,
         sender_name,
         sender_address,
         reply_to,
         template_id
  INTO   v_email_subject,
         v_email_body,
         v_sender_name,
         v_sender_address,
         v_reply_to,
         v_template_id
  FROM   emails
  WHERE  email_id = p_email_id;

  /****
  *  Insert contacts 
  *  into into campaign_emails
  ****/
  SET v_sql := CONCAT('INSERT INTO campaign_emails (campaign_email_id, contact_id, email_address) SELECT ', p_new_id, ', contact_id, email_address ', v_seg_query);

  SET    @v_dsql = v_sql;
  PREPARE v_dsql FROM @v_dsql;
  EXECUTE v_dsql;

  /**** 
  *  Loop through each contact
  ****/
  set v_done := FALSE;
  OPEN c_1;
  c_1: LOOP

    FETCH c_1
    INTO v_contact_id;

    /****
    *  Exit loop when we've build query
    ****/
    IF v_done THEN
      CLOSE c_1;
      LEAVE c_1;
    END IF;

    /****
    *  Call field substitution routine
    ****/
    SET @v_email_body2 := v_email_body;
    SET @p_error       := p_error;
    SET @p_error_code  := p_error_code;

    CALL p_substitution (
           v_contact_id,
           v_template_id,
           @v_email_body2,
           @p_error,
           @p_error_code
         );

    SET v_email_body2 := @v_email_body2;
    SET p_error       := @p_error;
    SET p_error_code  := @p_error_code;

    /****
    *  Update the campaign_emails table with the email details
    *
    *  probably make this into an insert for performance
    ****/
    UPDATE campaign_emails
    SET    campaign_id       = p_campaign_id,
           email_id          = p_email_id,
           email_subject     = v_email_subject,
           email_body        = v_email_body2,
           sender_name       = v_sender_name,
           sender_address    = v_sender_address,
           reply_to          = v_reply_to
    WHERE  campaign_email_id = p_new_id
    AND    contact_id        = v_contact_id;

  END LOOP c_1;

  /****
  *  Update the campaigns table
  *  with the campaign_email_id
  ****/
  UPDATE campaigns
  SET    campaign_email_id  = p_new_id,
         campaign_status_id = 4
  WHERE  campaign_id        = p_campaign_id;

END main;

ehandler:BEGIN

  CASE e_exception
  WHEN FALSE THEN
 
    /****
    *  Log success
    ****/
    CALL p_event (
           v_object,
           2,
           v_event
         );
    CALL p_log (
           v_event,
           CONCAT('maintained campaign [', p_campaign_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                          ']:[', 
                           p_campaign_name, 
                           ']:action [', 
                           p_action,
                           ']:',
                           p_error);
    /****
    *  Log failure
    ****/
    CALL p_log (
           v_event,
           p_error
         );
    CALL p_event (
           v_object,
           3,
           v_event
         );
    SET p_status := '0';
  END CASE;

END ehandler;
END;
$$
