use dev2;
DELIMITER $$
DROP TRIGGER IF EXISTS t_ce_u;
CREATE TRIGGER t_ce_u BEFORE UPDATE ON campaign_emails
FOR EACH ROW BEGIN
  IF NEW.sent = TRUE THEN
    SET NEW.email_status_id = 1,
        NEW.status_datetime = NEW.sent_datetime;
  ELSEIF NEW.rendered = TRUE THEN
     SET NEW.email_status_id = 2,
         NEW.status_datetime = NEW.rendered_datetime;
  END IF;
  SET NEW.modified_by   = USER(),
      NEW.modified_date = NOW();
END
$$

/*
    SET NEW.modified_by   = USER();
         NEW.status_datetime = NEW.sent_datetime;
  ELSEIF NEW.rendered = TRUE THEN
     SET NEW.email_status_id = 2,
         NEW.status_datetime = NEW.rendered_datetime;
*/
