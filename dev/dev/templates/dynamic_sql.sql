
  SET v_sql = CONCAT('INSERT INTO indigo_users (client_id, first_name, last_name, username, password) VALUES ( ',
                     '100,', p_first_name,',', p_last_name,',',p_username,',',v_sha1,')');
  SELECT v_sql;
  SET @v_sql = v_sql;
  PREPARE v_sql_p FROM  @v_sql;
  EXECUTE v_sql_p;
  DEALLOCATE PREPARE v_sql_p;

