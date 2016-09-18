/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_media_maintenance.sql
* Description   : Indigo media maintenance
* Author        : Scott Walkinshaw
* Date          : 8th January 2012
* Parameters    : 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Dec 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_media_maintenance;
DELIMITER $$
CREATE PROCEDURE p_media_maintenance (
                   IN   p_action         VARCHAR(1),
                   IN   p_media_id       INT,
                   IN   p_media_name     VARCHAR(256),
                   IN   p_description    VARCHAR(1024),
                   IN   p_media_type_id  INT,
                   IN   p_url            VARCHAR(1024),
                   IN   p_thumbnail_url  VARCHAR(1024),
                   IN   p_filename       VARCHAR(1024),
                   IN   p_mime_type      VARCHAR(1024),
                   IN   p_size           VARCHAR(1024),
                   IN   p_width          VARCHAR(1024),
                   IN   p_height         VARCHAR(1024),
                   OUT  p_status         CHAR(1),
                   OUT  p_string         VARCHAR(512),
                   OUT  p_error          VARCHAR(512),
                   OUT  p_error_code     VARCHAR(512),
                   OUT  p_new_id         VARCHAR(16),
                   OUT  p_count          VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_media_maintenance';
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
  DECLARE v_media_body     LONGTEXT;

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
  *  What are we doing to the media?
  ****/
  CASE p_action 
  WHEN 'I' THEN

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
    SELECT IFNULL(MAX(media_id + 1), 1)
    INTO   p_new_id
    FROM   media;

    INSERT INTO media (
      media_id,
      media_name,
      description,
      media_type_id,
      url,
      thumbnail_url,
      filename,
      mime_type,
      size,
      width,
      height
    ) VALUES (
      p_new_id,
      p_media_name,
      p_description,
      p_media_type_id,
      p_url,
      p_thumbnail_url,
      p_filename,
      p_mime_type,
      ROUND(p_size / 1024),
      p_width,
      p_height
    );

    IF e_exception THEN
      SET p_error := CONCAT('Error creating media object [',
                             p_media_name,
                             ']');
      SET p_error_code := '10';
    END IF;

  WHEN 'U' THEN

   UPDATE media
   SET    media_name    = p_media_name,
          description   = p_description,
          media_type_id = p_media_type_id
   WHERE  media_id      = p_media_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error updating media object [',
                             p_media_name,
                             ']');
      SET p_error_code := '11';
    END IF;

  WHEN 'D' THEN

    UPDATE media
    SET    deleted     = TRUE
    WHERE  media_id = p_media_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error deleting media object [',
                             p_media_name,
                             ']');
      SET p_error_code := '12';
    END IF;

  ELSE

    SET p_error := 'Unknown action';

  END CASE;

END main;

ehandler:BEGIN

  CASE 
  WHEN e_exception = FALSE AND
       p_error     = 'OK'  THEN
 
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
           CONCAT('maintained media [', p_media_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                          ']:[', 
                           p_media_name, 
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
