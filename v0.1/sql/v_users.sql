/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_users.sql
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

CREATE OR REPLACE VIEW v_users AS
SELECT u.user_id                                           user_id,
       u.first_name                                       first_name,
       u.last_name                                        last_name,
       CONCAT(IFNULL(u.first_name, ''),
              ' ',
              IFNULL(u.last_name, ''))                    full_name,
       u.username                                         username,
       u.email                                            email,
       u.user_role_id                                     user_role_id,
       ur.user_role                                       user_role,
       u.user_status_id                                   user_status_id,
       us.user_status                                     user_status,
       u.created_by,
       DATE_FORMAT(u.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       u.modified_by,
       DATE_FORMAT(u.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
FROM   users        u
INNER JOIN
       user_roles   ur
ON     u.user_role_id = ur.user_role_id
INNER JOIN
       user_status  us
ON     u.user_status_id = us.user_status_id
WHERE  u.deleted        = FALSE;

