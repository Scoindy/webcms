USE dev1;

CREATE OR REPLACE VIEW v_digital_library AS
SELECT d.library_id     library_id,
       d.media_type_id  media_type_id,
       mt.media_type    media_type,
       d.title          title,
       d.url            url,
       d.thumbnail_url  thumbnail_url,
       d.filename       filename,
       d.mime_type      mime_type,
       d.size           size,
       d.width          width,
       d.height         height,
       d.created_date   created_date
FROM   digital_library  d
INNER JOIN
       media_types      mt
ON     d.media_type_id = mt.media_type_id
WHERE  d.soft_delete   = FALSE;
