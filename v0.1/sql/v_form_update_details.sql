/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_form_update_details.sql
* Description   : view used to populate the update details form
* Author        : Scott Walkinshaw
* Date          : 13th January 2012
* Parameters    : 
* Comments      : 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 13 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_form_update_details AS
SELECT c.uuid,
       cp.first_name,
       cp.last_name,
       cp.address_1,
       cp.address_2,
       cp.address_3,
       cp.address_4,
       cp.postcode,
       cp.phone_work,
       cp.phone_mobile
FROM   contacts          c
INNER JOIN
       contact_profiles  cp
ON     c.contact_id = cp.contact_id;

