/*******************************************************************************
*  Name        : sp_load_myportfolio_subscriptions
*  Description : processes the subscriptions data into flc_clients_raw
*  Author      : Scott Walkinshaw
*  Date        : 27th June 2011
*
*  Notes       : The DBC webservices are terribly badly named. This one should
*                really be called subscription_list as it deals with subscribes
*                and unsubscribes from subscription lists. Not to be confused
*                with the actual subscription_list webservice that is also
*                known as forms=4 but doesn't have anything to do with
*                subscription lists. Duh.
*
********************************************************************************
*  File Modification History
********************************************************************************
*  Who  | Date      | Vers | Description
*  SW   | 19 Jul 11 | 1.0  | Initial issue
*******************************************************************************/
USE FlightCentre_MyPortfolio_Datamart_Prod;

DROP PROCEDURE IF EXISTS sp_load_myportfolio_subscriptions;

DELIMITER //
CREATE PROCEDURE sp_load_myportfolio_subscriptions (
                   IN p_fileName VARCHAR(100),
                   IN p_fileDate DATE,
                   IN p_fileRows INT,
                   IN p_loadType ENUM('LOAD','RELOAD')
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_noOfExceptions       INTEGER DEFAULT 0;
  DECLARE v_NoOfIgnores          INTEGER DEFAULT 0;
  DECLARE v_NoProcessed          INTEGER DEFAULT 0;
  DECLARE v_loadDatabaseName     VARCHAR(256);
  DECLARE v_liveDatabaseName     VARCHAR(256);
  DECLARE v_loadTableName        VARCHAR(256);
  DECLARE v_stageTableName       VARCHAR(256);
  DECLARE v_liveTableName        VARCHAR(256);
  DECLARE v_loadViewName         VARCHAR(256);
  DECLARE v_objectName           VARCHAR(100) DEFAULT 'MP_SUBSCRIPTIONS';
  DECLARE v_objectDisplayName    VARCHAR(100) DEFAULT 'Flight Centre My Portfolio Subscriptions';
  DECLARE v_exceptionName        VARCHAR(64);
  DECLARE v_eventSequence        INT; 
  DECLARE v_rowCount             INTEGER;
  DECLARE v_EventType            VARCHAR(128) DEFAULT 'LOAD';
  DECLARE v_exception            BOOLEAN      DEFAULT FALSE;
  DECLARE v_exceptions           ENUM('OK','SQLEXCEPTION') DEFAULT 'OK';
  DECLARE v_liveTablePrimaryKey  VARCHAR(256);
  DECLARE v_FileToClean          VARCHAR(512);

--   DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_exceptions = 'SQLEXCEPTION';


MainBlock:BEGIN

  SET SQL_BIG_SELECTS = TRUE;

  /****
  *  Start of load event
  ****/
  SET v_eventSequence := ETL.sf_add_etl_event (
                           v_objectName,
                           p_Filename,
                           v_EventType,
                           'PROCESSING'
                         );
        
  /****
  *  Get object details
  ****/
  CALL ETL.sp_get_object_details (
         v_objectName,
         v_eventsequence,
         v_loadTableName,
         v_stageTableName,
         v_liveTableName,
         v_loadViewName,
         v_loadDatabaseName,
         v_liveDatabaseName,
         v_liveTablePrimaryKey,
         v_exception
       );
      
  IF v_exception = TRUE THEN 
    LEAVE MainBlock;
  END IF;
    
  /****
  *  Check file
  ****/
  CALL ETL.sp_check_file (
         v_objectName,
         p_fileName,
         p_fileDate,
         v_loadDatabaseName,
         v_loadTableName,
         p_loadType,
         v_eventSequence,
         v_exception
       );

  IF v_exception = TRUE THEN 
    LEAVE MainBlock;
  END IF;
            
  /****
  *  Close load event
  ****/
  CALL ETL.sp_update_etl_event (
             v_eventSequence,
             'DONE'
           );

  /****
  *  Start of CLEANSE event
  ****/
  SET v_eventSequence := ETL.sf_add_etl_event (
                               v_objectName,
                               v_loadTableName,
                               'CLEANSE',
                               'PROCESSING'
                             );
         
  SET v_NoOfIgnores := v_NoOfIgnores + ROW_COUNT();

  /****
  *  Check all records have a datamine ID
  *  
  *  have seen from the data that when consultants
  *  click the email themselves the appear without
  *  a datamine ID as they do not have one in MP
  ****/
  CALL ETL.sp_check_columns_mandatory (
             v_loadDatabaseName,
             v_loadTableName,
             "datamine_id, activity_date",
             v_rowCount,
             v_exception
           );
      
  IF v_exception = TRUE THEN
     LEAVE MainBlock; 
  END IF;
  SET v_noOfExceptions := v_noOfExceptions + v_rowCount;
         
  /****
  *  Check for duplicate datamine IDs
  CALL ETL.sp_check_columns_unique (
             v_loadDatabaseName,
             v_loadTableName,
             "datamine_id",
             v_rowCount,
             v_exception
           );
      
  IF v_exception = TRUE THEN 
    LEAVE MainBlock;
  END IF;
  SET v_noOfExceptions := v_noOfExceptions + v_rowCount;
  ****/
           
  /****
  *  Check data can be cast
  ****/
  CALL ETL.sp_check_column_casts (
         v_loadDatabaseName,
         v_loadTableName,
         v_rowCount,
         v_exception
       );
      
  IF v_exception = TRUE THEN 
    LEAVE MainBlock; 
  END IF;
  SET v_noOfExceptions := v_noOfExceptions + v_rowCount; 
      
  /****
  *  Record the stats
  ****/
  CALL ETL.sp_log_cleaning_results (
             v_loadDatabaseName,
             v_eventSequence,
             v_loadTableName,
             v_rowCount,
             v_exception
           ); 
      
  IF v_exception = TRUE THEN
     LEAVE MainBlock;
  END IF;

  /****
  *  Close the cleanse event
  ****/   
  CALL ETL.sp_update_etl_event (
             v_eventSequence,
            'DONE'
           );

  /****
  *  Load the data into flc_mp_subscriptions_stage
  ****/
  CALL ETL.sp_load_to_stage (
             v_objectName,
             v_loadDatabaseName,
             'FlightCentre_MyPortfolio_Datamart_Prod',
             v_loadViewName,
             v_stageTableName,
             'source_id, source_type, source_subtype, firstname, lastname, brand_permission, brand_permission_mod_date, email, email_mod_date, email_modified, email_permission, email_permission_mod_date, valid_email, marketing_flags_modified, marketing_flags_mod_date, record_mod_date, version_number, version_from_date, version_to_date',
              v_exception
            );
        IF v_exception = TRUE THEN
    LEAVE MainBlock;
  END IF;

  /****
  *  Extact data for cleaning
  ****/
  SET v_FileToClean := CONCAT('MPF_',SUBSTRING_INDEX(p_fileName,'.',1),'_For_Clean');
  IF (SELECT COUNT(*)
      FROM   FlightCentre_MyPortfolio_Datamart_Loading.flc_mp_subscriptions_stage) > 0 THEN
    CALL ETL.sp_select_to_file(
               '/Clients/FlightCentre/Datamart/Raw/Outbound/CleanContacts/',
               v_FileToClean,
               p_Filedate,
               'FlightCentre_MyPortfolio_Datamart_Prod',
               'v_flc_mp_subscriptions_clean',
               'source_id, version_number, source_type, address1, address2, address3, city, state, country, postcode, email, home_phone, work_phone, mobile_phone'
             );
  END IF;

  
  /****
  *  Load data into wpc_customer_raw
  ****/
  CALL ETL.sp_load_to_live_dim2 (
             v_objectName,
             v_loadDatabaseName,
             v_stageTableName,
             'FlightCentre_Datamart_Prod',
             v_liveTableName,
             'source_id, source_type',
             'source_id, source_type,brand, marketing_flags_modified, marketing_flags_mod_date, brand_permission, brand_permission_mod_date, dm_universal_exclusion, dm_universal_exclusion_date, latest_referral,title,firstname,preferred_name,lastname,date_created,preferred_store_code,date_of_birth,region,email,email_permission,valid_email,last_bounce_date,mobile_phone,phone_modified,phone_mod_date,phone_permission,activated_mobile,address1,address2,address3,city,postcode,personal_details_modified,personal_details_mod_date,email_mod_date,postal_permission,postal_permission_mod_date,email_modified,email_permission_mod_date,phone_permission_mod_date,source_subtype,postal_modified,weekly_deals,enewsletter,instantdeals,asia,africa,australia,canadaalaska,europe,middleeast,newzealand,sthamerica,sthpacific,uk,usa,`1835travel`,over50travel,adventure,islandsbeaches,campingmotorhomes,cruise,coachtouring,cultural,driving,festivals,foodwine,indulgence,outdoors,romance,shopping,shortbreaks,skisnowboard,sporting,oe,weddings,working,roundworld,postal_mod_date,version_number,version_from_date, version_to_date, record_mod_date,  usual_departure_airport, campaign_id, message_id, user_password',
              v_exception
            );
      
  /****
  *  Set the datamine ID to be the row number
  ****/
  CALL FlightCentre_Datamart_Prod.sp_update_raw_client_datamine_id();
      
END MainBlock;

ExceptionHandler:BEGIN
  
  CASE v_exceptions
  WHEN 'OK' THEN 
    SELECT 0 AS v_exception;
    LEAVE ExceptionHandler;
  WHEN 'OBJECTNOTFOUND' THEN

    /****
    *  Record error
    ****/
    CALL ETL.sp_update_etl_event (
               v_eventSequence,
               'EXCEPTION'
             );

    CALL ETL.sp_add_etl_log (
               v_eventSequence,
               'EXCEPTION',
               CONCAT('ETL object not found: ',v_objectName),
               v_objectName,
               'DESCRIPTION'
              );
    SELECT 1 AS v_exceptions;
  ELSE
    CALL ETL.sp_add_etl_log (
               v_eventSequence,
               'EXCEPTION',
               CONCAT('Unhandled exception :',v_exceptions),
               v_objectName,
               'DESCRIPTION'
             );
    /***
    *  WTF is this doing?
    *  record the event bug don't exit?
    *  
    *  SELECT 0 AS v_exceptions;
    ****/
    SELECT 1 AS v_exceptions;
  END CASE;
END ExceptionHandler;

END;
//
