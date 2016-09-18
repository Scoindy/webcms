/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_contacts.sql
* Description   : DDL for v_contacts view
* Author        : Scott Walkinshaw
* Date          : 
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 01 Jun 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_contacts AS
SELECT c.contact_id,
       c.client_id,
       TRIM(CONCAT(IFNULL(cp.first_name, ''), ' ', IFNULL(cp.last_name, '')))  full_name,
       c.email_address,
       CASE 
       WHEN c.email_permission = 'Y' THEN
         1
       ELSE
         0
       END  email_permission,
       cp.created_by,
       DATE_FORMAT(cp.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       cp.modified_by,
       DATE_FORMAT(cp.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date,
       cp.title                    profile_field_01,
       cp.first_name               profile_field_02,
       cp.last_name                profile_field_03,
       cp.company                  profile_field_04,
       cp.department               profile_field_05,
       cp.address_1                profile_field_06,
       cp.address_2                profile_field_07,
       cp.address_3                profile_field_08,
       cp.address_4                profile_field_09,
       cp.postcode                 profile_field_10,
       cp.phone_work               profile_field_11,
       cp.phone_mobile             profile_field_12,
       cp.fax                      profile_field_13,
       cp.datamine_bdm             profile_field_14,
       CASE cp.retail_watch_flag
       WHEN 1 THEN 
        'Y'
       ELSE
        'N'
       END                         profile_field_15
FROM   contacts          c
INNER JOIN
       contact_profiles  cp
ON     c.contact_id = cp.contact_id
WHERE  c.deleted    = FALSE;

