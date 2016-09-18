/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_user_roles.sql
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

CREATE OR REPLACE VIEW v_user_roles AS
SELECT user_role_id,
       user_role
FROM   user_roles;

