USE dev1;

CREATE OR REPLACE VIEW v_indigo_users AS
SELECT iu.indigo_user_id    user_id,
       iu.first_name        first_name,
       iu.last_name         last_name,
       iu.full_name         full_name,
       iu.username          username,
       iu.email             email,
       iu.user_role_id      user_role_id,
       iur.user_role        user_role,
       iu.user_status_id    user_status_id,
       ius.user_status      user_status
FROM   indigo_users        iu
INNER JOIN
       indigo_user_roles   iur
ON     iu.user_role_id = iur.user_role_id
INNER JOIN
       indigo_user_status  ius
ON     iu.user_status_id = ius.user_status_id
WHERE  iu.soft_delete    = FALSE;
