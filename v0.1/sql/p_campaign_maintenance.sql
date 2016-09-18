/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_campaign_maintenance.sql
* Description   : Indigo campaign maintenance
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

DROP PROCEDURE IF EXISTS p_campaign_maintenance;
DELIMITER $$
CREATE PROCEDURE p_campaign_maintenance (
                   IN   p_action            VARCHAR(1),
                   IN   p_campaign_id       INT,
                   IN   p_campaign_name     VARCHAR(256),
                   IN   p_description       VARCHAR(1024),
                   IN   p_campaign_type_id  INT,
                   IN   p_start_date        VARCHAR(64),
                   IN   p_end_date          VARCHAR(64),
                   IN   p_segment_id        VARCHAR(64),
                   IN   p_email_id          VARCHAR(64),
                   OUT  p_status            CHAR(1),
                   OUT  p_string            VARCHAR(512),
                   OUT  p_error             VARCHAR(512),
                   OUT  p_error_code        VARCHAR(512),
                   OUT  p_new_id            VARCHAR(16),
                   OUT  p_count             VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_campaign_maintenance';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep            CHAR           DEFAULT '|';
  DECLARE v_segments       INT            DEFAULT 0; 
  DECLARE v_dummy          VARCHAR(64);
  DECLARE v_i              INT            DEFAULT 1;
  DECLARE v_run_id         INT            DEFAULT 1;
  DECLARE v_segment_id     VARCHAR(1024);
  DECLARE v_count          INT             DEFAULT 0;
  DECLARE v_done           BOOLEAN         DEFAULT FALSE;
  DECLARE v_db             VARCHAR(16);
  DECLARE v_column         VARCHAR(64);
  DECLARE v_position       INT;
  DECLARE v_columns        VARCHAR(1024)   DEFAULT '';

  DECLARE e_exception      INT            DEFAULT FALSE;

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
  IF p_action = 'I' THEN
    SELECT IFNULL(MAX(campaign_id + 1), 1)
    INTO   p_new_id
    FROM   campaigns;
  END IF;

  /****
  *  If updating delete the old segments - they will be replaced
  *
  *  NOTE: could soft delete them - I'd need a auto_increment column on the table
  ****/
  IF p_action = 'U' THEN
    DELETE
    FROM   campaign_segments
    WHERE  campaign_id = p_campaign_id;
  END IF;

  /****
  *  Create segment rule record
  ****/
  IF p_action = 'I' OR
     p_action = 'U' THEN

    /****
    *  Count the number of separators in p_operator
    *  to find out how many segment rules we have
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

      INSERT INTO campaign_segments (
        campaign_id,
        campaign_segment_id,
        segment_id
      ) VALUES (
        IFNULL(p_new_id, p_campaign_id),
        v_i,
        v_segment_id
      );
      SET v_i := v_i + 1;

    END WHILE;
  END IF;

  /****
  *  What are we doing to the campaign?
  ****/
  CASE p_action 
  WHEN 'I' THEN

    INSERT INTO campaigns (
      campaign_id,
      campaign_name,
      description,
      campaign_type_id,
      campaign_status_id,
      start_date,
      end_date,
      email_id
    ) VALUES (
      p_new_id,
      p_campaign_name,
      p_description,
      1, -- p_campaign_type_id,
      1, -- set new to active
      STR_TO_DATE(p_start_date, '%d/%m/%Y'),
      STR_TO_DATE(p_end_date,   '%d/%m/%Y'),
      p_email_id
    );

/*
    IF e_exception THEN
      SET p_error := CONCAT('Error creating campaign [',
                             p_campaign_name,
                             ']');
      SET p_error_code := '10';
    END IF;
*/

  SET e_exception = 0;

  WHEN 'U' THEN

   UPDATE campaigns
   SET    campaign_name = p_campaign_name,
          description   = p_description,
          start_date    = STR_TO_DATE(p_start_date, '%d/%m/%Y'),
          end_date      = STR_TO_DATE(p_end_date,   '%d/%m/%Y'),
          email_id      = p_email_id
   WHERE  campaign_id   = p_campaign_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error updating campaign [',
                             p_campaign_name,
                             ']');
      SET p_error_code := '11';
    END IF;

  WHEN 'D' THEN

    UPDATE campaigns
    SET    deleted     = TRUE
    WHERE  campaign_id = p_campaign_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error deleting campaign [',
                             p_campaign_name,
                             ']');
      SET p_error_code := '12';
    END IF;

  END CASE;

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
