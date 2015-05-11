SELECT d.department_id, department_name, cnt_in, cnt_out, cnt_likuvalos, IF(cnt_dep_dead is null, 0, cnt_dep_dead) cnt_dep_dead, dep_bed FROM 
(
SELECT dh.department_id, count(*) cnt_likuvalos FROM department_history dh
WHERE YEAR(dh.department_history_out) = ? AND MONTH(dh.department_history_out) >= ? AND MONTH(dh.department_history_out) <= ?
OR (
YEAR(dh.department_history_in) = ? AND MONTH(dh.department_history_in) >= ? AND MONTH(dh.department_history_in) <= ?
)
GROUP BY dh.department_id
) dh_likuvalos
,(
SELECT dh.department_id, count(*) cnt_in FROM department_history dh
WHERE YEAR(dh.department_history_in) = ? AND MONTH(dh.department_history_in) >= ? AND MONTH(dh.department_history_in) <= ?
GROUP BY dh.department_id
) dh_in
, (
SELECT dh.department_id, count(*) cnt_out FROM department_history dh
WHERE YEAR(dh.department_history_out) = ? AND MONTH(dh.department_history_out) >= ? AND MONTH(dh.department_history_out) <= ?
GROUP BY dh.department_id
) dh_out
left join (SELECT history_id, history_department_out , count(history_department_out) cnt_dep_dead FROM history h
WHERE YEAR(h.history_out) = ? AND MONTH(h.history_out) >= ? AND MONTH(h.history_out) <= ? and h.result_id = 5
GROUP BY history_department_out
) cnt_dead
ON dh_out.department_id=cnt_dead.history_department_out
,( SELECT * FROM department  WHERE department_active) d
,(SELECT department_bed dep_bed, max(department_bed_start) dbs, department_id FROM department_bed
GROUP BY department_id) dep_bed
WHERE d.department_id=dh_in.department_id
AND d.department_id=dh_out.department_id
AND d.department_id=dh_likuvalos.department_id
AND d.department_id=dep_bed.department_id

ORDER BY department_name
