use dev2;

update campaign_emails
set accepted = true
where contact_id < 199
AND  campaign_email_id = 1;

update campaign_emails
set bounced = true
where contact_id > 198
AND  campaign_email_id = 1;


update campaign_emails
set  rendered = true
where contact_id > 189
AND  campaign_email_id = 1;

