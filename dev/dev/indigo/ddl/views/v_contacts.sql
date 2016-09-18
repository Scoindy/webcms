USE dev1;

CREATE OR REPLACE VIEW v_contacts AS
SELECT indigo_id,
       client_id,
       full_name,
       date_of_birth,
       age,
       address_1,
       address_2,
       address_3,
       postcode,
       phone_home,
       phone_work,
       email,
       postal_permission,
       sms_permission,
       email_permission,
       created_date,
       modified_date
FROM   contacts
WHERE  soft_delete = FALSE;
