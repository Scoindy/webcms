set head off
set lines 80
set feedback off
set pages 0

spool &&1
SELECT LPAD(' ',2*(level-1))  ||
       operation              ||' '||
       options                ||' '||
       object_name            ||' '||
       object_type            ||' '||
--       object_instance        ||' '||
       DECODE(id, 0, 'Total Cost = '||position, '['||cost||']')
FROM   plan_table
START WITH 
       id = 0  --  statement_id = 'SCOTT'
CONNECT BY
       prior id = parent_id
/

spool off
exit

