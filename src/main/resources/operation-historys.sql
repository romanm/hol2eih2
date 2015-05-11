SELECT og.operation_group_name, osg.operation_subgroup_name, o.operation_name, ore.operation_result_name
, d.department_name, ps.surgery_name, o.operation_code, oh.*
FROM 
(SELECT oh.*,  oc.operation_complication_name, anesthetist_name FROM operation_history oh
LEFT JOIN operation_complication oc ON oh.operation_complication_id = oc.operation_complication_id
LEFT JOIN
(SELECT concat(personal_surname,', ',personal_name,' ',personal_patronymic) anesthetist_name, personal_id FROM personal) pa
ON oh.anesthetist_id = pa.personal_id
WHERE oh.history_id = ?
) oh
,(SELECT concat(personal_surname,', ',personal_name,' ',personal_patronymic) surgery_name, personal_id
FROM personal) ps
, operation_group og, operation_subgroup osg, operation o, department d, operation_result ore
WHERE oh.operation_result_id = ore.operation_result_id
AND oh.personal_id = ps.personal_id AND  oh.department_id =  d.department_id
AND og.operation_group_id=oh.operation_group_id  AND osg.operation_subgroup_id=oh.operation_subgroup_id
AND o.operation_id=oh.operation_id
