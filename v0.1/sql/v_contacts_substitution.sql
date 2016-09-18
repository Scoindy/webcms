/*******************************************************************************
*                                                                              *
********************************************************************************
* Name          : v_contacts_substitution.sql
* Description   : DDL for v_contacts_substitution view
* Author        : Scott Walkinshaw
* Date          : 7th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_contacts_substitution AS
SELECT c.contact_id,
       c.client_id       `Client ID`,
       c.full_name       `Full Name`,
       c.email_address   `Email Address`,
       cp.title          `Title`,
       cp.first_name     `First Name`, 
       cp.last_name      `Last Name`,
       cp.company        `Company`,
       cp.department     `Department`,
       cp.address_1      `Address 1`,
       cp.address_2      `Address 2`,
       cp.address_3      `Address 3`,
       cp.address_4      `Address 4`,
       cp.postcode       `Postcode`,
       cp.phone_work     `Phone Work`,
       cp.phone_mobile   `Phone Mobile`,
       cp.fax            `Fax`,
       cp.datamine_bdm   `Datamine BDM`
FROM   contacts          c
INNER JOIN
       contact_profiles  cp
ON     c.contact_id = cp.contact_id
WHERE  c.deleted    = FALSE;
