/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_contact_profiles.sql
* Description   : DDL for v_contacts view - used to dynamically upate
*                 the contact_profiles table from p_contact_maintenance
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

CREATE OR REPLACE VIEW v_contact_profiles AS
SELECT contact_id,
       title              profile_field_01,
       first_name         profile_field_02,
       last_name          profile_field_03,
       company            profile_field_04,
       department         profile_field_05,
       address_1          profile_field_06,
       address_2          profile_field_07,
       address_3          profile_field_08,
       address_4          profile_field_09,
       postcode           profile_field_10,
       phone_work         profile_field_11,
       phone_mobile       profile_field_12,
       fax                profile_field_13,
       datamine_bdm       profile_field_14,
       retail_watch_flag  profile_field_15
FROM   contact_profiles

