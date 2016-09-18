set head off    
set lines 110
set feedback off
set pages 0     

spool &&1 
SELECT LPAD(' ',2*Level) ||
       position ||' '|| operation ||' '||
       options   ||' '||
       DECODE(object_owner, NULL,'', object_owner||'.'||object_name) ||' '||
       DECODE(optimizer, NULL, '', optimizer) ||' '||
       DECODE(cost, NULL, '', ' Cost='||cost||
                              ' Rows Expected='||Cardinality) 
FROM   plan_table
CONNECT BY prior ID = parent_id 
AND     statement_id = 'SCOTT'
START WITH id = 0 
AND     statement_id = 'SCOTT'
/        
         
spool off
exit     
