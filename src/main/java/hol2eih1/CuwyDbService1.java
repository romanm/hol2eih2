package hol2eih1;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.cuwy1.holDb.model.CountryHol;
import org.cuwy1.holDb.model.DepartmentHistory;
import org.cuwy1.holDb.model.DepartmentHol;
import org.cuwy1.holDb.model.DiagnosHol;
import org.cuwy1.holDb.model.DiagnosIcd10;
import org.cuwy1.holDb.model.DistrictHol;
import org.cuwy1.holDb.model.HistoryHolDb;
import org.cuwy1.holDb.model.HistoryTreatmentAnalysis;
import org.cuwy1.holDb.model.Icd10UaClass;
import org.cuwy1.holDb.model.LocalityHol;
import org.cuwy1.holDb.model.Operation;
import org.cuwy1.holDb.model.OperationGroup;
import org.cuwy1.holDb.model.OperationSubGroup;
import org.cuwy1.holDb.model.PatientDepartmentMovement;
import org.cuwy1.holDb.model.PatientDiagnosisHol;
import org.cuwy1.holDb.model.PatientHistory;
import org.cuwy1.holDb.model.PatientHolDb;
import org.cuwy1.holDb.model.RegionHol;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;

@Component("cuwyDbService1")
public class CuwyDbService1 {
	
	private static final Logger logger = LoggerFactory.getLogger(CuwyDbService1.class);
	
	@Autowired private JdbcTemplate jdbcTemplateHol1MySql;
	public JdbcTemplate getJdbcTemplate() { return jdbcTemplateHol1MySql; }
	
	public Icd10UaClass getIcd10UaChilds(Icd10UaClass icd10Class) {
		String sql = "SELECT * FROM icd i1 WHERE icd_start >= ? AND icd_end <= ? AND icd_id != ? ";
		String sql2 = sql.replaceFirst("\\?", "" + icd10Class.getIcdStart())
				.replaceFirst("\\?", "" + icd10Class.getIcdEnd())
				.replaceFirst("\\?", "" + icd10Class.getIcdId());
		logger.info("\n "+sql2);
		List<Icd10UaClass> icd10Classes = jdbcTemplateHol1MySql.query(
				sql2,
				new Icd2TreeMapper(icd10Class));
		return icd10Class;
	}

	String sqlOperationGroup = "SELECT * FROM operation_group";
	String sqlOperationSubGroup = "select * from operation_subgroup";
	String sqlOperation = "SELECT * FROM operation";
	public List<OperationGroup> getOperationTree() {
		logger.info("\n "+sqlOperationGroup+"\n "+sqlOperationSubGroup+"\n "+sqlOperation);
		Map<Integer, OperationGroup> operationGroupMap = new HashMap<Integer, OperationGroup>();
		Map<Integer, OperationSubGroup> operationSubGroupMap = new HashMap<Integer, OperationSubGroup>();
		Operation operationTreeRoot = new Operation();
		List<OperationGroup> operationGroups
			= jdbcTemplateHol1MySql.query( sqlOperationGroup, new OperationGroupMapper(operationGroupMap));
		jdbcTemplateHol1MySql.query( sqlOperationSubGroup, new OperationSubGroupMapper(operationGroupMap,operationSubGroupMap));
		jdbcTemplateHol1MySql.query( sqlOperation, new OperationMapper(operationSubGroupMap));
		return operationGroups;
	}
	public List<Map<String,Object>> icd10UaAllToFile() {
		String sql = "select * from icd";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientsProMonth;
	}
	public Icd10UaClass getIcd10UaGroups() {
		String sql = "SELECT * FROM icd";
//		String sql = "SELECT * FROM icd i1 WHERE i1.icd_code not like '%.%'";
//		String sql = "SELECT * FROM icd i1 WHERE i1.icd_code like '%-%' ";
		logger.info("\n "+sql);
		Icd10UaClass icd10UaRoot = new Icd10UaClass();
		List<Icd10UaClass> icd10Classes = jdbcTemplateHol1MySql.query(
				sql,
				new Icd2TreeMapper(icd10UaRoot));
		return icd10UaRoot;
	}
	
	class OperationSubGroupMapper<T> implements RowMapper<T>{
		private Map<Integer, OperationGroup> operationGroupMap;
		private Map<Integer, OperationSubGroup> operationSubGroupMap;
		public OperationSubGroupMapper(Map<Integer, OperationGroup> operationGroupMap,
				Map<Integer, OperationSubGroup> operationSubGroupMap) {
			this.operationSubGroupMap = operationSubGroupMap;
			this.operationGroupMap = operationGroupMap;
		}
		@Override
		public T mapRow(ResultSet rs, int arg1) throws SQLException {
			OperationSubGroup operationSubGroup = new OperationSubGroup();
			operationSubGroup.setOperationSubgroupId(rs.getInt("operation_subgroup_id"));
			operationSubGroup.setOperationGroupId(rs.getInt("operation_group_id"));
			operationSubGroup.setOperationSubgroupSort(rs.getInt("operation_subgroup_sort"));
			operationSubGroup.setOperationSubgroupName(rs.getString("operation_subgroup_name"));
			OperationGroup operationGroup = operationGroupMap.get(operationSubGroup.getOperationGroupId());
			if(null == operationGroup.getOperationSubGroupChilds())
				operationGroup.setOperationSubGroupChilds(new ArrayList<OperationSubGroup>());
			operationGroup.getOperationSubGroupChilds().add(operationSubGroup);
			operationSubGroupMap.put(operationSubGroup.getOperationSubgroupId(), operationSubGroup);
			return (T) operationSubGroup;
		}
		
	}
	class OperationGroupMapper<T> implements RowMapper<T>{
		private Map<Integer, OperationGroup> operationGroupMap;
		public OperationGroupMapper(Map<Integer, OperationGroup> operationGroupMap) {
			this.operationGroupMap = operationGroupMap;
		}

		@Override
		public T mapRow(ResultSet rs, int index) throws SQLException {
			OperationGroup operationGroup = new OperationGroup();
			operationGroup.setOperationGroupId(rs.getInt("operation_group_id"));
			operationGroup.setOperationGroupName(rs.getString("operation_group_name"));
			operationGroup.setOperationGroupSort(rs.getInt("operation_group_sort"));
			operationGroupMap.put(operationGroup.getOperationGroupId(), operationGroup);
			return (T) operationGroup;
		}
		
	}
	class OperationMapper<T> implements RowMapper<T>{

		private Map<Integer, OperationSubGroup> operationSubGroupMap;

		public OperationMapper(Map<Integer, OperationSubGroup> operationSubGroupMap) {
			this.operationSubGroupMap = operationSubGroupMap;
		}

		@Override
		public T mapRow(ResultSet rs, int index) throws SQLException {
			Operation operation = new Operation();
			operation.setOperationId(rs.getInt("operation_id"));
			operation.setOperationSubgroupId(rs.getInt("operation_subgroup_id"));
			operation.setOperationCode(rs.getString("operation_code"));
			operation.setOperationName(rs.getString("operation_name"));
			operation.setOperationUrgent(rs.getBoolean("operation_urgent"));
			OperationSubGroup operationSubGroup = operationSubGroupMap.get(operation.getOperationSubgroupId());
			if(null == operationSubGroup.getOperationChilds())
				operationSubGroup.setOperationChilds(new ArrayList<Operation>());
			operationSubGroup.getOperationChilds().add(operation);
			return (T) operation;
		}
		
	}
	class Icd2TreeMapperBasic<T> {
		protected Icd10UaClass createIcd10UaClass(ResultSet rs) throws SQLException {
			Icd10UaClass icd10UaClass = new Icd10UaClass();
			icd10UaClass.setIcdId(rs.getInt("icd_id"));
			icd10UaClass.setIcdLeftKey(rs.getInt("icd_left_key"));
			icd10UaClass.setIcdRightKey(rs.getInt("icd_right_key"));
			icd10UaClass.setIcdStart(rs.getInt("icd_start"));
			icd10UaClass.setIcdEnd(rs.getInt("icd_end"));
			icd10UaClass.setIcdCode(rs.getString("icd_code"));
			icd10UaClass.setIcdName(rs.getString("icd_name"));
			return icd10UaClass;
		}
	}
	
	class Icd2TreeMapper<T> extends Icd2TreeMapperBasic<T> implements RowMapper<T>{
		private Icd10UaClass icd10UaRoot;
		private List<Icd10UaClass> icd10UaPfad;
		public Icd2TreeMapper(Icd10UaClass icd10UaRoot) {
			this.icd10UaRoot = icd10UaRoot;
			this.icd10UaPfad = new ArrayList<Icd10UaClass>();
			icd10UaPfad.add(icd10UaRoot);
			logger.debug("-----------------------");
		}
		@Override
		public T mapRow(ResultSet rs, int rowNum) throws SQLException {
			Icd10UaClass icd10UaClass = createIcd10UaClass(rs);
			int i = icd10UaPfad.size()-1;
			for (; i>0; i--) 
				if(icd10UaClass.getIcdEnd() <= icd10UaPfad.get(i).getIcdEnd())
					break;
			icd10UaPfad.get(i).addChild(icd10UaClass);
			if(icd10UaPfad.size() > i+1)
				icd10UaPfad = icd10UaPfad.subList(0, i+1);
			icd10UaPfad.add(icd10UaClass);
			return (T) icd10UaClass;
		}
	}
	public List<Icd10UaClass> getIcd10UaChilds() {
		int icdLeftKey = 1;
		String sql = "SELECT * FROM icd WHERE icd_left_key = ?";
		logger.info("\n "+sql.replaceFirst("\\?", ""+icdLeftKey));
		List<Icd10UaClass> icd10Classes = jdbcTemplateHol1MySql.query(
				sql, new Object[] { icdLeftKey },
				new RowMapper<Icd10UaClass>() {
					@Override
					public Icd10UaClass mapRow(ResultSet rs, int rowNum) throws SQLException {
						Icd10UaClass icd10UaClass = new Icd10UaClass();
						icd10UaClass.setIcdId(rs.getInt("icd_id"));
						icd10UaClass.setIcdStart(rs.getInt("icd_start"));
						icd10UaClass.setIcdEnd(rs.getInt("icd_end"));
						icd10UaClass.setIcdCode(rs.getString("icd_code"));
						icd10UaClass.setIcdName(rs.getString("icd_name"));
						return icd10UaClass;
					}
				});

		showList(icd10Classes);
		return icd10Classes;
	}

	private void showList(List<Icd10UaClass> icd10Classes) {
		for (Icd10UaClass icd10Class : icd10Classes) {
			System.out.println(icd10Class);
		}
	}

	class DiagnosHolRowMapper implements RowMapper<DiagnosHol> {
		@Override
		public DiagnosHol mapRow(ResultSet rs, int rowNum) throws SQLException {
			return new DiagnosHol(rs.getInt("diagnos_id"), 
					rs.getString("diagnos_name"),
					rs.getString("diagnos_name_short")
					);
		}
	}
	class DepartmentHolRowMapper implements RowMapper<DepartmentHol> {
		@Override
		public DepartmentHol mapRow(ResultSet rs, int rowNum)
				throws SQLException {
			return new DepartmentHol(rs.getInt("department_id"), 
					rs.getString("department_name"),
					rs.getBoolean("department_active"),
					rs.getShort("department_profile_id"),
					rs.getString("personal_username")
					);
		}
	}
	public DepartmentHol getDepartmentsHol(int id) {
		final String sql = "SELECT * FROM ("
		+ sqlDepartmentsHol
		+ ") department WHERE department_id = ?";
		logger.debug(sql.replaceFirst("\\?", ""+id));
		return jdbcTemplateHol1MySql.queryForObject( sql, new Object[] { id }, new DepartmentHolRowMapper());
	}
	final static String sqlDepartmentsHol = "SELECT p.personal_username"
			+ ", d.department_id, d.department_name, d.department_profile_id, d.department_active "
			+ " FROM personal_department pd, personal p, department d "
			+ " WHERE p.personal_id=pd.personal_id AND pd.department_id=d.department_id "
			+ " AND d.department_active AND pd.position_id = 3";
	public List<DepartmentHol> getDepartmentsHol() {
//		final String sql = "SELECT * FROM department";
		return jdbcTemplateHol1MySql.query(
				sqlDepartmentsHol, 
				new DepartmentHolRowMapper());
	}
	public List<Map<String, Object>> getFirstNames() {
		String sql = "SELECT * from ("
				+ " SELECT COUNT(patient_name) cnt, patient_name, patient_gender "
				+ " FROM patient GROUP BY patient_name order by cnt desc) pn"
				+ " WHERE cnt >4 AND length(patient_name) > 1"
				;
		logger.debug(sql);
		List<Map<String, Object>> firstNames = jdbcTemplateHol1MySql.queryForList(sql);
		return firstNames;
	}
	public List<Map<String, Object>> getTreatmentAnalysis() {
		String sql = "SELECT "
				+ " treatment_analysis_id,treatment_analysis_name,treatment_analysis_type "
				+ " FROM treatment_analysis "
				;
		List<Map<String, Object>> directsHol = jdbcTemplateHol1MySql.queryForList(sql);
		return directsHol;
	}
	public List<Map<String, Object>> getDirectsHol() {
		String sql = "SELECT * FROM direct";
		List<Map<String, Object>> directsHol = jdbcTemplateHol1MySql.queryForList(sql);
		return directsHol;
	}
	
	public List<DiagnosHol> getDiagnosesHol() {
		return jdbcTemplateHol1MySql.query(
				"SELECT * FROM diagnos", 
				new DiagnosHolRowMapper());
	}

	static String sqlPatientDiagnosisHol1 = "SELECT concat(p.patient_surname,' ',p.patient_name,' ',p.patient_patronnymic) name"
			+ ", dh.department_history_in"
			+ ", h.history_in"
			+ ", h.history_out"
			+ ", h.history_no"
			+ ", h.history_id"
			+ ", h.patient_id"
			+ ", hd.max_diagnosis_id"
			+ ", icd_code, icd_name"
			+ " FROM department_history dh, history h, patient p, icd i,"
			+ "(SELECT history_id,diagnos_id,max(diagnos_id) max_diagnosis_id, icd_id FROM history_diagnos GROUP BY history_id) hd"
			+ " WHERE h.patient_id = p.patient_id AND h.history_id=hd.history_id "
			+ " AND i.icd_id = hd.icd_id "
			+ " AND h.history_id=dh.history_id "
			+ " AND dh.department_id = ? "
			;
	public List<PatientDiagnosisHol> getDepartmentsArchivesHolPatientsDiagnose(Integer departmentId, String seekInArchives) {
		String sql = sqlPatientDiagnosisHol1 
				+ " AND dh.department_history_out IS NOT NULL "
				;
		System.out.println(sql);
		sql = "SELECT p.* FROM ("
				+ sql
				+ ") p WHERE name like '%?%'"
				+ " ORDER BY history_in DESC "
				+ " lIMIT 10"
				;
		System.out.println(sql);
		final String sql2 = sql.replaceFirst("\\?", ""+departmentId).replaceFirst("\\?", seekInArchives);
		logger.info("\n"+sql2);
		return jdbcTemplateHol1MySql.query(
//				sql, new Object[] { departmentId, seekInArchives }, 
		sql2, 
		new RowMapper<PatientDiagnosisHol>(){
			@Override
			public PatientDiagnosisHol mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				PatientDiagnosisHol patientDiagnosisHol = new PatientDiagnosisHol();
				patientDiagnosisHol.setName(rs.getString("name"));
				patientDiagnosisHol.setHistory_in(rs.getTimestamp("history_in"));
				patientDiagnosisHol.setHistory_out(rs.getTimestamp("history_out"));
				patientDiagnosisHol.setIcd_code(rs.getString("icd_code"));
				patientDiagnosisHol.setIcd_name(rs.getString("icd_name"));
				patientDiagnosisHol.setPatient_id(rs.getInt("patient_id"));
				patientDiagnosisHol.setHistory_no(rs.getInt("history_no"));
				patientDiagnosisHol.setHistory_id(rs.getInt("history_id"));
				patientDiagnosisHol.setDiagnos_id(rs.getShort("max_diagnosis_id"));
				return patientDiagnosisHol;
			}
		});
	}
	public List<PatientDiagnosisHol> getDepartmentsHolPatientsDiagnose(Integer departmentId) {
		String sql = sqlPatientDiagnosisHol1 
		+ " AND dh.department_history_out IS NULL "
		;
		logger.info("\n"+sql.replaceFirst("\\?", ""+departmentId));
		return jdbcTemplateHol1MySql.query(
		sql, new Object[] { departmentId }, 
		new RowMapper<PatientDiagnosisHol>(){
			@Override
			public PatientDiagnosisHol mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				PatientDiagnosisHol patientDiagnosisHol = new PatientDiagnosisHol();
				patientDiagnosisHol.setName(rs.getString("name"));
				patientDiagnosisHol.setHistory_in(rs.getTimestamp("history_in"));
				patientDiagnosisHol.setIcd_code(rs.getString("icd_code"));
				patientDiagnosisHol.setIcd_name(rs.getString("icd_name"));
				patientDiagnosisHol.setPatient_id(rs.getInt("patient_id"));
				patientDiagnosisHol.setHistory_no(rs.getInt("history_no"));
				patientDiagnosisHol.setHistory_id(rs.getInt("history_id"));
				patientDiagnosisHol.setDiagnos_id(rs.getShort("max_diagnosis_id"));
				return patientDiagnosisHol;
			}
		});
	}


	String sql_WHERE_YearWeek = " YEAR(h.history_in)= ? AND WEEKOFYEAR(h.history_in) = ? ";
	String sqlPatientsYearWeek = "SELECT * FROM history h WHERE " + sql_WHERE_YearWeek;

	public List<HistoryHolDb> getHistorysYearWeek(Integer year, Integer week) {
		return getHistory(year, week, sqlPatientsYearWeek);
	}

	public List<HistoryHolDb> getHistorysYearWeek(Integer year, Integer week,
			Integer departmentId) {
		String andDeparment = " AND history_department_id = ? ".replaceFirst("\\?", "" + departmentId);
		return getHistory(year, week, sqlPatientsYearWeek + andDeparment);
	}

	private List<HistoryHolDb> getHistory(Integer year, Integer week, String sqlPatientsYearWeek) {
		logger.info("\n"+sqlPatientsYearWeek.replaceFirst("\\?", ""+year).replaceFirst("\\?", ""+week));
		Map<Integer, HistoryHolDb> mapHistoryOfPatient = new HashMap<Integer, HistoryHolDb>();
		List patientsYearWeek = jdbcTemplateHol1MySql.query(
				sqlPatientsYearWeek, new Object[] { year, week }, 
				new HistoryHolDbRowMapper(mapHistoryOfPatient)
				);
		String sql2 = "SELECT p.* FROM patient p, (" + sqlPatientsYearWeek
		+ ") h WHERE p.patient_id = h.patient_id";
		logger.info("\n"+sql2.replaceFirst("\\?", ""+year).replaceFirst("\\?", ""+week));
		jdbcTemplateHol1MySql.query(
				sql2, new Object[] { year, week }, 
				new PatientHolDbRowMapper(mapHistoryOfPatient)
				);
		String sql3 = sqlPatientDepartmentMovement.replaceFirst("\\?", 
			"SELECT h.history_id FROM (" + sqlPatientsYearWeek + ") h");
		logger.info("\n"+sql3.replaceFirst("\\?", ""+year).replaceFirst("\\?", ""+week));
		jdbcTemplateHol1MySql.query(
				sql3, new Object[] { year, week }, 
				new PatientDepartmentMovementRowMapper(mapHistoryOfPatient)
				);
		return patientsYearWeek;
	}

	String sqlinsertDepartmentHistory = "";
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	public void insertDepartmentHistory(
			final PatientDepartmentMovement patientDepartmentMovement) {
		jdbcTemplateHol1MySql.update(DepartmentHistoryMapSet.insertPatientDepartmentMovement
				, new DepartmentHistoryMapSet(patientDepartmentMovement));
	}
	public void movePatientDepartment(final HistoryHolDb history, final Map<String, Integer> roleTypes) {
		final DepartmentHistory departmentHistory = history.getDepartmentHistorys().get(0);
		logger.debug("\n"+departmentHistory);
		final Timestamp departmentHistoryIn = departmentHistory.getDepartmentHistoryIn();
		final Timestamp departmentHistoryOut = new Timestamp(departmentHistoryIn.getTime()-1000);
		jdbcTemplateHol1MySql.update( sqlExitUpdateDepartmentHistoryFirst,
				new Object[] {departmentHistory.getHistoryId()
				, roleTypes.get("per"), roleTypes.get("dep"), departmentHistoryOut, departmentHistoryOut },
				new int[] {Types.INTEGER, Types.INTEGER, Types.INTEGER, Types.TIMESTAMP, Types.TIMESTAMP}
				);
		final Map<String, Object> personalDepartmentHolDb = getPersonalDepartmentHolDb(roleTypes.get("per"));
		logger.debug(""+personalDepartmentHolDb);
		final Integer personalDepartmentIdIn = ((Long) personalDepartmentHolDb.get("personal_department_id")).intValue();
		departmentHistory.setPersonalDepartmentIdIn(personalDepartmentIdIn);
		jdbcTemplateHol1MySql.update(DepartmentHistoryMapSet.insertDepartmentHistoryMin
				, new DepartmentHistoryMapSet(departmentHistory, DepartmentHistoryMapSet.insertDepartmentHistoryMin));
		logger.debug(""+history);
		jdbcTemplateHol1MySql.update( sqlUpdateHistoryHistoryDepartmentId,
				new Object[] {history.getHistoryDepartmentId(), history.getHistoryId()},
				new int[] {Types.INTEGER, Types.INTEGER}
				);
	}
	public void movePatientDepartment(final DepartmentHistory departmentHistory, Map<String, Integer> roleTypes) {
		logger.debug(""+departmentHistory);
		final Timestamp patientMoveTimeOut = new Timestamp(Calendar.getInstance().getTimeInMillis());
		final Timestamp patientMoveTimeIn = new Timestamp(patientMoveTimeOut.getTime()+1000);
		final String patientMoveTimeInStr = sdf.format(patientMoveTimeIn);
		logger.debug(""+patientMoveTimeOut+"/"+patientMoveTimeIn+"//"+patientMoveTimeInStr);
		final int personalId = departmentHistory.getPersonalId();
		logger.debug(sqlExitUpdateDepartmentHistoryFirst
				.replaceFirst("\\?", ""+departmentHistory.getHistoryId())
				.replaceFirst("\\?", ""+roleTypes.get("per"))
				.replaceFirst("\\?", ""+roleTypes.get("dep"))
				.replaceFirst("\\?", "'"+patientMoveTimeInStr+"'")
				.replaceFirst("\\?", "'"+patientMoveTimeInStr+"'")
				);
		jdbcTemplateHol1MySql.update( sqlExitUpdateDepartmentHistoryFirst,
				new Object[] {departmentHistory.getHistoryId(), roleTypes.get("per"), roleTypes.get("dep"), patientMoveTimeInStr, patientMoveTimeInStr },
				new int[] {Types.INTEGER, Types.INTEGER, Types.INTEGER, Types.VARCHAR, Types.VARCHAR}
				);
		if(true)
			return ;
		final Map<String, Object> personalDepartmentHolDb = getPersonalDepartmentHolDb(personalId);
		logger.debug(""+personalDepartmentHolDb);
		final Integer personalDepartmentIdIn = ((Long) personalDepartmentHolDb.get("personal_department_id")).intValue();
		departmentHistory.setPersonalDepartmentIdIn(personalDepartmentIdIn);
		jdbcTemplateHol1MySql.update(DepartmentHistoryMapSet.insertDepartmentHistoryMin
				, new DepartmentHistoryMapSet(departmentHistory, DepartmentHistoryMapSet.insertDepartmentHistoryMin));
	}
	public void removeExitHistoryHolDb(final Map<String, Object> historyHolDb, Map<String, Integer> roleTypes) {
		int historyId = (int) historyHolDb.get("historyId");
		jdbcTemplateHol1MySql.update( sqlRemoveExitUpdateHistory, new Object[] {historyId}, new int[] {Types.INTEGER});
		final Integer personId = roleTypes.get("per");
		jdbcTemplateHol1MySql.update( sqlExitUpdateDepartmentHistory,
				new Object[] {historyId, personId, roleTypes.get("dep") },
				new int[] {Types.INTEGER, Types.INTEGER, Types.INTEGER}
				);
	}
	public void exitHistoryHolDb(final Map<String, Object> historyHolDb, Map<String, Integer> roleTypes) {
		jdbcTemplateHol1MySql.update(sqlExitUpdateHistory, new HistoryExitHolDbPSSetter(historyHolDb));
		//update to department history doctor and out date
		final Integer personId = roleTypes.get("per");
		int historyId = (int) historyHolDb.get("historyId");
		jdbcTemplateHol1MySql.update( sqlExitUpdateDepartmentHistory,
				new Object[] {historyId, personId, roleTypes.get("dep") },
				new int[] {Types.INTEGER, Types.INTEGER, Types.INTEGER}
				);
	}
	
	String sqlExitUpdateDepartmentHistoryFirst = " UPDATE department_history dh, "
			+ " (SELECT MAX(department_history_id) ax, history_id FROM department_history "
			+ " WHERE history_id = ? GROUP BY history_id) m, "
			+ " (SELECT personal_department_id FROM personal_department "
			+ " WHERE personal_id = ? AND department_id = ?) pd "
			+ " SET dh.personal_department_id_out = pd.personal_department_id "
			+ " , dh.department_history_out = ? "
			+ " , dh.department_history_bed_day = TIMESTAMPDIFF(HOUR, department_history_in, ? ) DIV 24 "
			+ " WHERE m.ax = dh.department_history_id ";
	String sqlUpdateHistoryHistoryDepartmentId = "UPDATE history "
			+ " SET history_department_id = ? "
			+ " WHERE history_id = ? ";
	String sqlRemoveExitUpdateHistory = "update history set history_out = null where history_id = ? ";
	String sqlExitUpdateHistory = "UPDATE history "
			+ " SET treatment_id = ? "
			+ " , result_id = ? "
			+ " , restored_id = ? "
			+ " , history_other_treatment = ? "
			+ " , history_expertise_conslusion = ? "
			+ " , history_special = ? "
			+ " , history_out = ? "
			+ " WHERE history_id = ? ";
	String sqlExitUpdateDepartmentHistory = "UPDATE department_history dh, history h, "
			+ " (SELECT MAX(department_history_id) ax , history_id FROM department_history"
			+ " WHERE history_id = ? GROUP BY history_id) m, "
			+ " (SELECT personal_department_id FROM personal_department "
			+ " WHERE personal_id = ? AND department_id = ?) pd "
			+ " SET dh.personal_department_id_out = pd.personal_department_id"
			+ " , dh.department_history_out = h.history_out"
			+ " , dh.department_history_bed_day = TIMESTAMPDIFF(HOUR, department_history_in, h.history_out) DIV 24 "
			+ " WHERE m.ax = dh.department_history_id AND h.history_id = m.history_id";
	String sqlPatientDepartmentMovement ="SELECT * FROM "
			+ "( SELECT "
			+ " h.patient_id, dh.history_id, d.department_id, d.department_name,"
			+ " dh.personal_department_id_in, dh.personal_department_id_out,"
			+ " dh.department_history_in, dh.department_history_out"
			+ " FROM department d, department_history dh, history h"
			+ " WHERE h.history_id = dh.history_id AND d.department_id=dh.department_id"
			+ ") ddh LEFT JOIN (SELECT "
			+ " pd.personal_department_id,"
			+ " p.personal_id,"
			+ " p.personal_surname,"
			+ " p.personal_name ,"
			+ " p.personal_patronymic"
			+ " FROM personal p, personal_department pd "
			+ " WHERE p.personal_id=pd.personal_id ) ppd"
			+ " ON ddh.personal_department_id_out = ppd.personal_department_id"
			+ " WHERE ddh.history_id IN ( ? ) ORDER BY department_history_in";
	private class DepartmentHistoryMapSet<T> implements RowMapper<T>,PreparedStatementSetter{
		public static final String selectDepartmentHistory = "SELECT * FROM department_history WHERE history_id = ?";
		public static final String insertPatientDepartmentMovement = "INSERT INTO department_history "
				+ "(history_id, department_id, personal_department_id_in, personal_department_id_out"
				+ ", department_history_in, department_history_out"
				+ ") VALUES (?,?,?,?"
				+ ",?,?)";
		public static final String insertDepartmentHistoryMin = "INSERT INTO department_history "
				+ "(history_id, department_id, personal_department_id_in, department_history_in)"
				+ "VALUES(?,?,?,?)"
				;
		public static final String insertDepartmentHistory = "INSERT INTO department_history "
				+ "(history_id, department_id, personal_department_id_in, personal_department_id_out"
				+ ", department_history_bed_day, department_history_in, department_history_out"
				+ ") VALUES (?,?,?,?"
				+ ",?,?,?)";
		public DepartmentHistoryMapSet() {
		}
		private DepartmentHistory departmentHistory;
		public DepartmentHistoryMapSet(DepartmentHistory departmentHistory) {
			this.departmentHistory = departmentHistory;
		}
		private PatientDepartmentMovement patientDepartmentMovement;
		private String sql;
		public DepartmentHistoryMapSet(
				PatientDepartmentMovement patientDepartmentMovement) {
			this.patientDepartmentMovement = patientDepartmentMovement;
		}
		public DepartmentHistoryMapSet(DepartmentHistory departmentHistory,
				String sql) {
			this(departmentHistory);
			this.sql = sql;
		}
		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			System.out.println("------------------------");
			System.out.println(sql);
			System.out.println(departmentHistory);
			if(patientDepartmentMovement != null){
				ps.setInt(1, patientDepartmentMovement.getHistoryId());
				ps.setInt(2, patientDepartmentMovement.getDepartmentId());
//				ps.setInt(3, patientDepartmentMovement.getPersonalDepartmentIdIn());
				ps.setInt(3, 126);
				ps.setNull(4, Types.INTEGER);
				ps.setTimestamp(5, patientDepartmentMovement.getDepartmentHistoryIn());
				ps.setTimestamp(6, patientDepartmentMovement.getDepartmentHistoryOut());
			}else if(DepartmentHistoryMapSet.insertDepartmentHistoryMin.equals(sql)){
				ps.setInt(1, departmentHistory.getHistoryId());
				ps.setInt(2, departmentHistory.getDepartmentId());
				ps.setInt(3, departmentHistory.getPersonalDepartmentIdIn());
				ps.setTimestamp(4, departmentHistory.getDepartmentHistoryIn());
			}else if(departmentHistory != null){
				ps.setInt(1, departmentHistory.getHistoryId());
				ps.setInt(2, departmentHistory.getDepartmentId());
				ps.setInt(3, departmentHistory.getPersonalDepartmentIdIn());
				ps.setInt(4, departmentHistory.getPersonalDepartmentIdOut());
				ps.setInt(5, departmentHistory.getDepartmentHistoryBedDay());
				ps.setTimestamp(6, departmentHistory.getDepartmentHistoryIn());
				ps.setTimestamp(7, departmentHistory.getDepartmentHistoryOut());
			}
		}
		@Override
		public T mapRow(ResultSet rs, int idx) throws SQLException {
			final DepartmentHistory departmentHistory = new DepartmentHistory();
			departmentHistory.setHistoryId(rs.getInt("history_id"));
			departmentHistory.setDepartmentId(rs.getInt("department_id"));
			departmentHistory.setDepartmentHistoryId(rs.getInt("department_history_id"));
			departmentHistory.setPersonalDepartmentIdIn(rs.getInt("personal_department_id_in"));
			departmentHistory.setPersonalDepartmentIdOut(rs.getInt("personal_department_id_out"));
			departmentHistory.setDepartmentHistoryBedDay(rs.getInt("department_history_bed_day"));
			departmentHistory.setDepartmentHistoryIn(rs.getTimestamp("department_history_in"));
			departmentHistory.setDepartmentHistoryOut(rs.getTimestamp("department_history_out"));
			return null;
		}
	}

	class DiagnosisOnAdmissionPSSetter implements PreparedStatementSetter{

		private DiagnosIcd10 diagnosisOnAdmission;

		public DiagnosisOnAdmissionPSSetter(
				DiagnosIcd10 diagnosisOnAdmission) {
			this.diagnosisOnAdmission = diagnosisOnAdmission;
		}

		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			logger.info(diagnosisOnAdmission.toString());
			ps.setInt(1, diagnosisOnAdmission.getHistoryId());
			ps.setInt(2, diagnosisOnAdmission.getDiagnosId());
			ps.setInt(3, diagnosisOnAdmission.getPersonalDepartmentId());
			ps.setInt(4, diagnosisOnAdmission.getIcdId());
			ps.setInt(5, diagnosisOnAdmission.getIcdStart());
			ps.setInt(6, diagnosisOnAdmission.getIcdEnd());
		}
		
	}
	class HistoryExitHolDbPSSetter implements PreparedStatementSetter{

		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			logger.debug(historyHolDb.keySet().toString());
			ps.setInt(1, getInt(historyHolDb, "treatmentId"));
			ps.setInt(2, getInt(historyHolDb, "resultId"));
			ps.setInt(3, getInt(historyHolDb, "restoredId"));
			ps.setString(4, (String) historyHolDb.get("historyOtherTreatment"));
			ps.setString(5, (String) historyHolDb.get("historyExpertiseConslusion"));
			ps.setString(6, (String) historyHolDb.get("historySpecial"));
			final Object object = historyHolDb.get("historyOut");
			logger.debug(""+object);
			final Timestamp historyOut = new Timestamp((long) object);
			ps.setTimestamp(7, historyOut);

			ps.setInt(8, (int) historyHolDb.get("historyId"));
		}
		
		private Map<String, Object> historyHolDb;
		public HistoryExitHolDbPSSetter(Map<String, Object> historyHolDb) {
			this.historyHolDb = historyHolDb;
		}
	}
	class HistoryHolDbPSSetter implements PreparedStatementSetter{
		private HistoryHolDb historyHolDb;
		public HistoryHolDbPSSetter(HistoryHolDb historyHolDb) {
			this.historyHolDb = historyHolDb;
		}

		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			ps.setInt(1, historyHolDb.getHistoryNo());
			ps.setInt(2, historyHolDb.getHistoryUrgent());
			ps.setInt(3, historyHolDb.getPatientHolDb().getPatientId());
			ps.setInt(4, historyHolDb.getDirectId());
			ps.setInt(5, historyHolDb.getHistoryDepartmentIn());
			ps.setInt(6, historyHolDb.getHistoryDepartmentId());
			ps.setInt(7, historyHolDb.getHistoryAgeYear());
			ps.setInt(8, historyHolDb.getHistoryAgeMonth());
			ps.setInt(9, historyHolDb.getHistoryAgeDay());
			ps.setInt(10, historyHolDb.getHistoryId());
		}
	}
	class HistoryHolDbRowMapper implements RowMapper<HistoryHolDb>{
		private Map<Integer, HistoryHolDb> mapHistoryOfPatient;

		public HistoryHolDbRowMapper() { }

		public HistoryHolDbRowMapper(
				Map<Integer, HistoryHolDb> mapHistoryOfPatient) {
			this.mapHistoryOfPatient = mapHistoryOfPatient;
		}

		@Override
		public HistoryHolDb mapRow(ResultSet rs, int rowNum) throws SQLException {
			HistoryHolDb historyHolDb = new HistoryHolDb();
			historyHolDb.setHistoryId(rs.getInt("history_id"));
			historyHolDb.setHistoryNo(rs.getInt("history_no"));
			historyHolDb.setPatientId(rs.getInt("patient_id"));
			historyHolDb.setDirectId(rs.getInt("direct_id"));
			//----------------
			historyHolDb.setTreatmentId(rs.getInt("treatment_id"));
			historyHolDb.setResultId(rs.getInt("result_id"));
			historyHolDb.setRestoredId(rs.getInt("restored_id"));
			historyHolDb.setHistoryOtherTreatment(rs.getString("history_other_treatment"));
			historyHolDb.setHistoryExpertiseConslusion(rs.getString("history_expertise_conslusion"));
			historyHolDb.setHistorySpecial(rs.getString("history_special"));
			historyHolDb.setHistoryOut(rs.getTimestamp("history_out"));
			//----------------
			historyHolDb.setHistoryDepartmentIn(rs.getInt("history_department_in"));
			historyHolDb.setHistoryIn(rs.getTimestamp("history_in"));
			if(mapHistoryOfPatient != null)
				mapHistoryOfPatient.put(historyHolDb.getPatientId(), historyHolDb);
			return historyHolDb;
		}
		
	}

	public HistoryHolDb getHistoryHolDbById(int historyId) {
		String sql = "SELECT * FROM history WHERE history_id = ? ";
		logger.info("\n"+sql.replaceFirst("\\?", ""+historyId));
		return jdbcTemplateHol1MySql.queryForObject(
				sql, new Object[] { historyId }, 
				new HistoryHolDbRowMapper()
				);
	}
	public HistoryHolDb getHistoryHolDbByNo(int historyNo) {
		String sql = "SELECT * FROM history WHERE history_out IS NULL AND history_no = ? ";
		logger.info("\n"+sql.replaceFirst("\\?", ""+historyNo));
		/*
		return null;
		 * */
		return jdbcTemplateHol1MySql.queryForObject(
				sql, new Object[] { historyNo }, 
				new HistoryHolDbRowMapper()
				);
	}
	public PatientHistory getPatientHistoryByNo(int historyNo) {
		String sql ="SELECT * FROM patient p, history h"
		+ " WHERE h.history_out IS NULL AND h.patient_id=p.patient_id"
		+ " AND h.history_no= ? ";
		logger.info("\n"+sql+historyNo);
		return jdbcTemplateHol1MySql.queryForObject(
			sql, new Object[] { historyNo }, 
			new RowMapper<PatientHistory>(){
				@Override
				public PatientHistory mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					PatientHistory patientHistory = new PatientHistory();
					patientHistory.setHistory_id(rs.getInt("history_id"));
					patientHistory.setPatientId(rs.getInt("patient_id"));
					patientHistory.setPatient_gender(rs.getBoolean("patient_gender"));
					patientHistory.setPatient_dob(rs.getDate("patient_dob"));
					patientHistory.setPatient_blood(rs.getString("patient_blood"));
					patientHistory.setPatient_rh(rs.getBoolean("patient_rh"));
					patientHistory.setPatient_street(rs.getString("patient_street"));
					patientHistory.setPatient_house(rs.getString("patient_house"));
					patientHistory.setPatient_flat(rs.getString("patient_flat"));
					patientHistory.setPatient_job(rs.getString("patient_job"));
					patientHistory.setPatient_tbc(rs.getBoolean("patient_tbc"));
					patientHistory.setPatient_sc(rs.getBoolean("patient_sc"));
					patientHistory.setPatient_bj(rs.getBoolean("patient_bj"));
					patientHistory.setPatient_t(rs.getBoolean("patient_t"));
					patientHistory.setPatient_hbs(rs.getBoolean("patient_hbs"));
					patientHistory.setPatient_rw(rs.getBoolean("patient_rw"));
					patientHistory.setPatient_rw_date(rs.getDate("patient_rw_date"));
					return patientHistory;
				}
			});
	}

	
	public List<DepartmentHistory> getDepartmentHistorys(int historyId) {
		logger.info("\n"+DepartmentHistoryMapSet.selectDepartmentHistory.replaceFirst("\\?", ""+historyId));
		return jdbcTemplateHol1MySql.query(
				DepartmentHistoryMapSet.selectDepartmentHistory, new Object[] { historyId }, 
				new DepartmentHistoryMapSet()
			);
	}
	
	public List<PatientDepartmentMovement> getPatientDepartmentMovements(int historyId) {
		logger.info("-------------------------\n"+sqlPatientDepartmentMovement.replaceFirst("\\?", ""+historyId));
		return jdbcTemplateHol1MySql.query(
				sqlPatientDepartmentMovement, new Object[] { historyId }, 
				new PatientDepartmentMovementRowMapper()
			);
	}

	private class PatientDepartmentMovementRowMapper<T> implements RowMapper<T>{
		private Map<Integer, HistoryHolDb> mapHistoryOfPatient;
		public PatientDepartmentMovementRowMapper(
				Map<Integer, HistoryHolDb> mapHistoryOfPatient) {
			this.mapHistoryOfPatient = mapHistoryOfPatient;
		}
		
		public PatientDepartmentMovementRowMapper() { }

		@Override
		public T mapRow(ResultSet rs, int rowNum) throws SQLException {
			PatientDepartmentMovement patientDepartmentMovement = new PatientDepartmentMovement();
			patientDepartmentMovement.setHistoryId(rs.getInt("history_id"));
			patientDepartmentMovement.setPatientId(rs.getInt("patient_id"));
			patientDepartmentMovement.setDepartmentId(rs.getInt("department_id"));
			patientDepartmentMovement.setDepartmentName(rs.getString("department_name"));
			patientDepartmentMovement.setPersonalSurname(rs.getString("personal_surname"));
			patientDepartmentMovement.setPersonalName(rs.getString("personal_name"));
			patientDepartmentMovement.setPersonalPatronymic(rs.getString("personal_patronymic"));
			patientDepartmentMovement.setDepartmentHistoryIn(rs.getTimestamp("department_history_in"));
			patientDepartmentMovement.setDepartmentHistoryOut(rs.getTimestamp("department_history_out"));
			if(mapHistoryOfPatient != null){
				int patientId = patientDepartmentMovement.getPatientId();
				HistoryHolDb historyHolDb = mapHistoryOfPatient.get(patientId);
				if(historyHolDb.getPatientDepartmentMovements() == null)
					historyHolDb.setPatientDepartmentMovements(new ArrayList<PatientDepartmentMovement>());
				historyHolDb.getPatientDepartmentMovements().add(patientDepartmentMovement);
			}
			return (T) patientDepartmentMovement;
		}

	}

	public List<HistoryTreatmentAnalysis> getHistoryTreatmentAnalysises(int historyId) {
//		String sql ="SELECT * FROM history_treatment_analysis WHERE history_id=?";
		logger.info("\n"+sqlSelectHistoryTreatmentAnalysis.replaceFirst("\\?", ""+historyId));
		return jdbcTemplateHol1MySql.query(
			sqlSelectHistoryTreatmentAnalysis, new Object[] { historyId }, 
			new RowMapper<HistoryTreatmentAnalysis>(){
				@Override
				public HistoryTreatmentAnalysis mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					HistoryTreatmentAnalysis historyTreatmentAnalysis = new HistoryTreatmentAnalysis();
					historyTreatmentAnalysis.setHistoryTreatmentAnalysisText(rs.getString("history_treatment_analysis_text"));
					historyTreatmentAnalysis.setHistoryTreatmentAnalysisName(rs.getString("treatment_analysis_name"));
					historyTreatmentAnalysis.setTreatmentAnalysisId(rs.getInt("treatment_analysis_id"));
					historyTreatmentAnalysis.setHistoryTreatmentAnalysisDatetime(rs.getTimestamp("history_treatment_analysis_datetime"));
					historyTreatmentAnalysis.setHistoryTreatmentAnalysisDate(rs.getTimestamp("history_treatment_analysis_date"));
					historyTreatmentAnalysis.setHistoryTreatmentAnalysisId(rs.getInt("history_treatment_analysis_id"));
					return historyTreatmentAnalysis;
				}
			});
	}

	public List<DiagnosIcd10> getDiagnosis(int historyId) {
		logger.info("\n"+sqlDiagnosis.replaceFirst("\\?", ""+historyId));
		final List<DiagnosIcd10> diagnosIcd10List = jdbcTemplateHol1MySql.query(
				sqlDiagnosis, new Object[] { historyId }, 
				new RowMapper<DiagnosIcd10>(){
			@Override
			public DiagnosIcd10 mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				DiagnosIcd10 diagnosIcd10 = new DiagnosIcd10();
				diagnosIcd10.setHistoryDiagnosDate(rs.getTimestamp("history_diagnos_date"));
				diagnosIcd10.setIcdCode(rs.getString("icd_code"));
				diagnosIcd10.setIcdName(rs.getString("icd_name"));
				diagnosIcd10.setHistoryDiagnosAdditional(rs.getString("history_diagnos_additional"));
				diagnosIcd10.setHistoryDiagnosId(rs.getInt("history_diagnos_id"));
				diagnosIcd10.setDiagnosId(rs.getInt("diagnos_id"));
				diagnosIcd10.setHistoryId(rs.getInt("history_id"));
				diagnosIcd10.setIcdId(rs.getInt("icd_id"));
				diagnosIcd10.setIcdStart(rs.getInt("icd_start"));
				diagnosIcd10.setIcdEnd(rs.getInt("icd_end"));
				diagnosIcd10.setPersonalDepartmentId(rs.getInt("personal_department_id"));
				return diagnosIcd10;
			}
		});
		return diagnosIcd10List;
	}
	String sqlDiagnosis = "SELECT * FROM history_diagnos hd, icd i"
			+ " WHERE i.icd_id = hd.icd_id AND history_id = ? ORDER BY diagnos_id";
//		+ " WHERE 2 = hd.diagnos_id AND i.icd_id = hd.icd_id AND history_id=?";
	public DiagnosIcd10 getDiagnosisOnAdmission(int historyId) {
		logger.info("\n"+sqlDiagnosis.replaceFirst("\\?", ""+historyId));
		return jdbcTemplateHol1MySql.queryForObject(
				sqlDiagnosis, new Object[] { historyId }, 
				new RowMapper<DiagnosIcd10>(){
					@Override
					public DiagnosIcd10 mapRow(ResultSet rs, int rowNum)
							throws SQLException {
						DiagnosIcd10 diagnosisOnAdmission = new DiagnosIcd10();
						diagnosisOnAdmission.setHistoryDiagnosDate(rs.getTimestamp("history_diagnos_date"));
						diagnosisOnAdmission.setIcdCode(rs.getString("icd_code"));
						diagnosisOnAdmission.setIcdName(rs.getString("icd_name"));
						diagnosisOnAdmission.setDiagnosId(rs.getInt("diagnos_id"));
						diagnosisOnAdmission.setHistoryId(rs.getInt("history_id"));
						diagnosisOnAdmission.setIcdId(rs.getInt("icd_id"));
						diagnosisOnAdmission.setIcdStart(rs.getInt("icd_start"));
						diagnosisOnAdmission.setIcdEnd(rs.getInt("icd_end"));
						diagnosisOnAdmission.setPersonalDepartmentId(rs.getInt("personal_department_id"));
						return diagnosisOnAdmission;
					}
				});
	}

	public List<RegionHol> getRegions(Integer districtId) {
		String like = "%хм%";
		String sql = "SELECT * FROM region where district_id = ? AND region_name like ?";
		logger.info("\n"+sql+districtId);
		return jdbcTemplateHol1MySql.query(
			sql, new Object[] { districtId, like }, 
			new RowMapper<RegionHol>(){
				@Override
				public RegionHol mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					RegionHol regionHol = new RegionHol();
					regionHol.setRegionId(rs.getInt("region_id"));
					regionHol.setDistrictId(rs.getInt("district_id"));
					regionHol.setRegionName(rs.getString("region_name"));
					return regionHol;
				}
			});
	}
	
	private final class InsAppOperationHistory extends InsAddMap implements PreparedStatementSetter {
		public InsAppOperationHistory(Map<String, Object> map, String sql) {
			super(map, sql);
		}

		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			ps.setString(1, (String) map.get("operation_additional"));
			final Timestamp timestamp = new Timestamp((long) map.get("operation_history_start_long"));
			final Timestamp timestamp2 = new Timestamp((long) map.get("operation_history_end_long"));
			ps.setTimestamp(2, timestamp);
			ps.setTimestamp(3, timestamp2);
			ps.setInt(4, (int) map.get("operation_history_duration_sec"));

			ps.setInt(5, setFiendInt("personal_id"));
			ps.setInt(6, setFiendInt("department_id"));
			ps.setInt(7, (int) map.get("operation_result_id"));

			logger.debug(map.toString());
//			ps.setInt(8, (int) map.get("anesthetist_id"));
			setFieldWithNull(ps, 8, "anesthetist_id");
			setFieldWithNull(ps, 9, "operation_complication_id");

			ps.setInt(10, (int) map.get("operation_id"));
			ps.setInt(11, (int) map.get("icd_id"));

			if(isInsert){
				int nextOperationHistoryId = getAutoIncrement("operation_history");
				map.put("operation_history_id", nextOperationHistoryId);
				ps.setInt(13, (int) map.get("history_id"));
			}
			ps.setInt(12, (int) map.get("operation_history_id"));
			logger.debug(ps.toString());
		}

		private int setFiendInt(final String fieldName) {
			final Object object = map.get(fieldName);
			int personalId;
			if(object instanceof String)
				personalId = Integer.parseInt((String) object);
				else
					personalId = (int) object;
			return personalId;
		}
	}

	final String sqlInsertOperationHistory = "INSERT INTO operation_history "
		+ " (operation_additional, operation_history_start, operation_history_end, operation_history_duration "
		+ " , personal_id, department_id, operation_result_id "
		+ " , operation_id, operation_subgroup_id, operation_group_id "
		+ " , icd_id, icd_start, icd_end "
		+ " , anesthetist_id, operation_complication_id "
		+ " , operation_history_id, history_id "
		+ " ) SELECT oh1.*, oh2.* FROM "
		+ "(SELECT ? AS operation_additional, ? AS operation_history_start, ? AS operation_history_end, ?"
		+ " , ?, ?, ?"
		+ " , o.operation_id, o.operation_subgroup_id, os.operation_group_id "
		+ " , icd.icd_id, icd.icd_start, icd.icd_end"
		+ " , ? AS anesthetist_id, ? AS operation_complication_id"
		+ " FROM operation_subgroup os, operation o, icd icd "
		+ " WHERE o.operation_id = ? AND os.operation_subgroup_id = o.operation_subgroup_id AND icd.icd_id = ?) oh1"
		+ ", ( SELECT ?, ? ) oh2 ";

	final String sqlUpdateOperationHistory = "UPDATE operation_history oh, operation_subgroup os, operation o, icd icd SET "
	+ " oh.operation_additional = ?, oh.operation_history_start = ?, oh.operation_history_end = ?, oh.operation_history_duration = ? "
	+ ", oh.personal_id = ?, oh.department_id = ?, oh.operation_result_id = ? "
	+ ", oh.operation_id = o.operation_id, oh.operation_subgroup_id = os.operation_subgroup_id , oh.operation_group_id = os.operation_group_id "
	+ ", oh.icd_id = icd.icd_id, oh.icd_start=icd.icd_start, oh.icd_end=icd.icd_end "
	+ ", oh.anesthetist_id = ? ,oh.operation_complication_id = ?"
	+ " WHERE os.operation_subgroup_id = o.operation_subgroup_id AND o.operation_id = ? AND icd.icd_id = ? AND oh.operation_history_id = ? ";

	final String deleteOperationHistory = "DELETE FROM operation_history WHERE operation_history_id = ? ";

	//+ " WHERE os.operation_subgroup_id = o.operation_subgroup_id AND o.operation_id = ? AND oh.history_id = ? ";
	public void insertOperationHistory(Map<String, Object> map) {
		logger.debug(sqlInsertOperationHistory);
		jdbcTemplateHol1MySql.update(sqlInsertOperationHistory, new InsAppOperationHistory(map, sqlInsertOperationHistory));
	}
	public void updateOperationHistory(Map<String, Object> map) {
		logger.debug(sqlUpdateOperationHistory);
		jdbcTemplateHol1MySql.update(sqlUpdateOperationHistory, new InsAppOperationHistory(map, sqlUpdateOperationHistory));
	}
	public void deleteOperationHistory(Integer operationHistoryId) {
		jdbcTemplateHol1MySql.update(deleteOperationHistory, operationHistoryId);
	}

	public void updateHistoryDiagnosis(Map<String, Object> map) {
		jdbcTemplateHol1MySql.update(sqlUpdateHistoryDiagnos, new InsAppDiagnosHistory(map, sqlUpdateHistoryDiagnos));
	}
	public void insertHistoryDiagnosis(final Map<String, Object> map) {
		jdbcTemplateHol1MySql.update(sqlInsertHistoryDiagnos, new InsAppDiagnosHistory(map, sqlInsertHistoryDiagnos));
	}
	String sqlUpdateHistoryDiagnos = "UPDATE history_diagnos hd, icd i SET"
			+ " hd.history_diagnos_additional = ?,"
			+ " hd.icd_id=i.icd_id, hd.icd_start=i.icd_start, hd.icd_end=i.icd_end "
			+ " WHERE i.icd_id = ? AND hd.history_diagnos_id = ? ";
	String sqlInsertHistoryDiagnos = "INSERT INTO history_diagnos "
			+ "(history_id, history_diagnos_date, diagnos_id, personal_department_id"
			+ ", icd_id, icd_start, icd_end, history_diagnos_additional"
			+ ") VALUES "
			+ "(?,now(),?,?"
			+ ",?,?,?,?)";
	
	private final class InsAppDiagnosHistory extends InsAddMap implements PreparedStatementSetter {
		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			if(isInsert){
				ps.setInt(1, (int) map.get("historyId"));
//				ps.setTimestamp(2, new Timestamp(new Date().getTime()));
				ps.setInt(2, (int) map.get("diagnosId"));
				ps.setInt(3, (int) personalDepartmentIdIn);
				ps.setInt(4, (int) map.get("icdId"));
				ps.setInt(5, (int) map.get("icdStart"));
				ps.setInt(6, (int) map.get("icdEnd"));
				setFieldWithNull( ps,7,"historyDiagnosAdditional");
			}else{
				setFieldWithNull( ps,1,"historyDiagnosAdditional");
				ps.setInt(2, (int) map.get("icdId"));
				ps.setInt(3, (int) map.get("historyDiagnosId"));
			}
		}

		private final Integer personalDepartmentIdIn;
		private InsAppDiagnosHistory(Map<String, Object> map, String sql) {
			super(map, sql);
			logger.debug(map.toString());
			this.personalDepartmentIdIn = personalId2departmentPersonalId(map);
		}
	}
	private int personalId2departmentPersonalId(Map<String, Object> map) {
		final int personalId = Integer.parseInt(map.get("userPersonalId").toString());
		final Map<String, Object> personalDepartmentHolDb = getPersonalDepartmentHolDb(personalId);
		final int intValue = ((Long) personalDepartmentHolDb.get("personal_department_id")).intValue();
		return intValue;
	}

	private abstract class InsAddMap{
		private InsAddMap(Map<String, Object> map, String sql) {
			logger.debug(sql.indexOf("INSERT INTO") +"  " + sql);
			this.isInsert = sql.indexOf("INSERT INTO") >= 0;
			this.map = map;
		}
		
		protected final Map<String, Object> map;
		protected boolean isInsert;
		protected void setFieldWithNull( PreparedStatement ps, final int i, String key)
				throws SQLException {
			final Object fieldWithNull = map.get(key);
			logger.debug(i+" "+key+" = "+fieldWithNull+" = "+(null == fieldWithNull));
			if(null == fieldWithNull){
				ps.setNull(i, Types.CHAR);
			}else{
				ps.setString(i, (String) fieldWithNull);
			}
		}
	}

	public void insertDiagnosisOnAdmission(final DiagnosIcd10 diagnosisOnAdmission) {
		System.out.println(diagnosisOnAdmission);
		jdbcTemplateHol1MySql.update(sqlInsertHistoryDiagnos, new DiagnosisOnAdmissionPSSetter(diagnosisOnAdmission));
	}
	
	
	public void insertHistoryHolDb(final HistoryHolDb historyHolDb) {
		int nextHistoryId = getAutoIncrement("history");
		historyHolDb.setHistoryId(nextHistoryId);
		logger.debug(" = "+historyHolDb.getPatientHolDb().getPatientDob());
		historyHolDb.setHistoryAgeYear(historyHolDb.getPatientHolDb().patientAge());
		historyHolDb.setHistoryAgeMonth(historyHolDb.getPatientHolDb().patientMonth());
		historyHolDb.setHistoryAgeDay(historyHolDb.getPatientHolDb().patientDay());
		System.out.println("---------------------------------------");
		logger.debug(sqlInsertHistory);
		System.out.println("---------------------------------------");
		jdbcTemplateHol1MySql.update(sqlInsertHistory, new HistoryHolDbPSSetter(historyHolDb));
	}
	String sqlInsertHistory = "INSERT INTO history "
			+ "( history_in, history_no, history_urgent, patient_id, direct_id"
			+ ", history_department_in "
			+ ", history_department_id "
			+ ", history_age_year, history_age_month, history_age_day "
			+ ", history_id "
			+ ") VALUES "
			+ "( NOW(), ?, ?, ?, ?"
			+ ", ?, ?, ?, ?, ?, ?)";
//		+ "( now(),'15025',0,32111,1,1,66,0,0)";
	public void insertPatientHolDb(final PatientHolDb patientHolDb) {
		if(null == patientHolDb.getPatientHouse())
			patientHolDb.setPatientHouse("-");
		if(null == patientHolDb.getPatientStreet())
			patientHolDb.setPatientStreet("-");
//		int nextId = nextPatientId();
		int nextPatientId = getAutoIncrement("patient");
		patientHolDb.setPatientId(nextPatientId);
		String sql="INSERT INTO patient "
				+ "( patient_surname, patient_name, patient_patronnymic, patient_gender, patient_dob"
				+ ", country_id, district_id, region_id, locality_id, patient_street, patient_house, patient_job"
				+ ", patient_phone_1, patient_phone_2 , patient_flat"
				+ ", patient_blood, patient_rh, patient_bj "
				+ ", patient_id"
				+ ") VALUES "
				+ "( ?,?,?,?,?"
				+ ", ?,?,?,?,?,?,?"
				+ ", ?,?,?"
				+ ", ?,?,?,?"
				+ ") ";
		logger.info("\n"+sql+"\n"+patientHolDb);
		logger.info("\n"+sql+"\n"+patientHolDb.getPatientId());
		jdbcTemplateHol1MySql.update(sql, new PatientHolDbPSSetter(patientHolDb));
	}

	public void updatePatientHolDb(final PatientHolDb patientHolDb) {
		logger.info("\n"+patientHolDb);
		String sql = "UPDATE patient SET "
				+ " patient_surname = ?, patient_name = ?, patient_patronnymic = ?, patient_gender = ?, patient_dob = ? "
				+ ", country_id = ?, district_id = ?, region_id = ?, locality_id = ?, patient_street = ?, patient_house = ?, patient_job = ? "

				+ ", patient_phone_1 = ?"
				+ ", patient_phone_2 = ? "
				+ ", patient_flat = ? "
				+ ", patient_blood = ? "
				+ ", patient_rh = ? "
				+ ", patient_bj = ? "
				+ " WHERE patient_id = ?";
		logger.info("\n"+sql+patientHolDb.getPatientId());
		jdbcTemplateHol1MySql.update(sql, new PatientHolDbPSSetter(patientHolDb));
	}

	class PatientHolDbPSSetter implements PreparedStatementSetter{
		private PatientHolDb patientHolDb;

		public PatientHolDbPSSetter(PatientHolDb patientHolDb) {
			this.patientHolDb = patientHolDb;
		}

		@Override
		public void setValues(PreparedStatement ps) throws SQLException {
			ps.setString(1, patientHolDb.getPatientSurname());
			ps.setString(2, patientHolDb.getPatientPersonalName());
			ps.setString(3, patientHolDb.getPatientPatronymic());
			ps.setBoolean(4, patientHolDb.getPatientGender()==1?true:false);
			ps.setTimestamp(5, patientHolDb.getPatientDob());
			
			ps.setInt(6, patientHolDb.getCountryId());
			ps.setInt(7, patientHolDb.getDistrictId());
			ps.setInt(8, patientHolDb.getRegionId());
			ps.setInt(9, patientHolDb.getLocalityId());
			ps.setString(10, patientHolDb.getPatientStreet());
			ps.setString(11, patientHolDb.getPatientHouse());
			ps.setString(12, patientHolDb.getPatientJob());
			
			ps.setString(13, patientHolDb.getPatientPhoneHome());
			ps.setString(14, patientHolDb.getPatientPhoneMobil());
			ps.setString(15, patientHolDb.getPatientFlat());
			ps.setString(16, patientHolDb.getPatientBlood());
			patientHolDb.setPatientRh(patientHolDb.getPatientRh2() == 1 ? true : false);
			ps.setBoolean(17, patientHolDb.getPatientRh());
			String patientBj = patientHolDb.getPatientBj();
			ps.setString(18, "".equals(patientBj)?null:patientBj);
			ps.setInt(19, patientHolDb.getPatientId());
		}

	}

	private class PatientHolDbRowMapper implements RowMapper<PatientHolDb>{
		private Map<Integer, HistoryHolDb> mapHistoryOfPatient;
		public PatientHolDbRowMapper(){ }
		public PatientHolDbRowMapper(
				Map<Integer, HistoryHolDb> mapHistoryOfPatient) {
			this.mapHistoryOfPatient = mapHistoryOfPatient;
		}
		@Override
		public PatientHolDb mapRow(ResultSet rs, int rowNum) throws SQLException {
			PatientHolDb patientHolDb = new PatientHolDb();
			patientHolDb.setCountryId(rs.getInt("country_id"));
			patientHolDb.setDistrictId(rs.getInt("district_id"));
			patientHolDb.setRegionId(rs.getInt("region_id"));
			patientHolDb.setLocalityId(rs.getInt("locality_id"));
			
			patientHolDb.setPatientId(rs.getInt("patient_id"));
			patientHolDb.setPatientSurname(rs.getString("patient_surname"));
			patientHolDb.setPatientPersonalName(rs.getString("patient_name"));
			patientHolDb.setPatientGender(rs.getBoolean("patient_gender")?1:0);
			patientHolDb.setPatientPatronymic(rs.getString("patient_patronnymic"));
			patientHolDb.setPatientDob(rs.getTimestamp("patient_dob"));
			patientHolDb.setPatientStreet(rs.getString("patient_street"));
			patientHolDb.setPatientHouse(rs.getString("patient_house"));
			patientHolDb.setPatientFlat(rs.getString("patient_flat"));
			patientHolDb.setPatientJob(rs.getString("patient_job"));
			patientHolDb.setPatientPhoneHome(rs.getString("patient_phone_1"));
			patientHolDb.setPatientPhoneMobil(rs.getString("patient_phone_2"));
			patientHolDb.setPatientBlood(rs.getString("patient_blood"));
			patientHolDb.setPatientRh(rs.getBoolean("patient_rh"));
			patientHolDb.setPatientRh2FromBoolean(patientHolDb.getPatientRh());
			String patient_bj = rs.getString("patient_bj");
			patientHolDb.setPatientBj(patient_bj==null?"":patient_bj);
			patientHolDb.setPatientHivFromBoolean(rs.getBoolean("patient_aid"));
			patientHolDb.setPatientHbsFromBoolean(rs.getBoolean("patient_hbs"));
			patientHolDb.setPatientRwFromBoolean(rs.getBoolean("patient_rw"));
			patientHolDb.setPatientRwDate(rs.getDate("patient_rw_date"));
			if(mapHistoryOfPatient != null){
				HistoryHolDb historyHolDb = mapHistoryOfPatient.get(patientHolDb.getPatientId());
				historyHolDb.setPatientHolDb(patientHolDb);
			}
			return patientHolDb;
		}
	}

	public Map<String, Object> getPersonalDepartmentHolDb(int personalId) {
		String sql = "SELECT personal_department_id FROM personal_department WHERE personal_id = ?";
		logger.info("\n"+sql+" "+personalId);
		final Map<String, Object> personalDepartment = jdbcTemplateHol1MySql.queryForMap(
				sql, new Object[] { personalId }
				);
		logger.info(""+personalDepartment);
		return personalDepartment;
	}

	public PatientHolDb getPatientHolDb(int patientId) {
		String sql = "SELECT * FROM patient p WHERE patient_id = ?";
		logger.info("\n"+sql+patientId);
		return jdbcTemplateHol1MySql.queryForObject(
			sql, new Object[] { patientId }, 
			new PatientHolDbRowMapper()
			);
	}

	public void setPatientName(PatientHistory patientHistory) {
		int patientId = patientHistory.getPatientId();
		String sql = "SELECT CONCAT(p.patient_surname,' ',p.patient_name,' ',p.patient_patronnymic) name"
				+ " FROM patient p WHERE patient_id= ?";
		logger.info("\n"+sql+patientId);
		PatientHistory patientHistoryDb = jdbcTemplateHol1MySql.queryForObject(
				sql, new Object[] { patientId }, 
				new RowMapper<PatientHistory>(){
					@Override
					public PatientHistory mapRow(ResultSet rs, int rowNum)
							throws SQLException {
						PatientHistory patientHistoryDb = new PatientHistory();
						patientHistoryDb.setPatientName(rs.getString("name"));
						return patientHistoryDb;
					}
				});
		patientHistory.setPatientName(patientHistoryDb.getPatientName());
	}

	public List<CountryHol> readCountries() {
//		logger.info("\n"+sqlCountry);
		Map<Integer, CountryHol> mapCountryHol = new HashMap<Integer, CountryHol>();
		Map<Integer, DistrictHol> mapDistrictHol = new HashMap<Integer, DistrictHol>();
		Map<Integer, RegionHol> mapRegionHol = new HashMap<Integer, RegionHol>();
		List<CountryHol> countries = jdbcTemplateHol1MySql.query(
				sqlCountry, new Object[] {}, 
				new CountryRowMapper(mapCountryHol)
				);
//		logger.info("\n"+sqlDistrict);
		jdbcTemplateHol1MySql.query(
				sqlDistrict, new Object[] {}, 
				new DestrictRowMapper(mapCountryHol, mapDistrictHol)
				);
		jdbcTemplateHol1MySql.query(
				sqlRegion, new Object[] {}, 
				new RegionRowMapper(mapDistrictHol, mapRegionHol)
				);
		jdbcTemplateHol1MySql.query(
				sqlLocality, new Object[] {}, 
				new LocalityRowMapper(mapRegionHol)
				);
		return countries;
	}

	String sqlCountry	= "SELECT * FROM country";
	String sqlDistrict	= "SELECT * FROM district ORDER BY district_name";
	String sqlRegion	= "SELECT * FROM region ORDER BY region_name";
	String sqlLocality	= "SELECT * FROM locality ORDER BY locality_name";
	//	String sqlRegion	= "SELECT * FROM region WHERE region_active ORDER BY region_name";

	private class LocalityRowMapper<T> implements RowMapper<T>{
		private Map<Integer, RegionHol> mapRegionHol;
		public LocalityRowMapper(Map<Integer, RegionHol> mapRegionHol) {
			this.mapRegionHol = mapRegionHol;
		}
		@Override
		public T mapRow(ResultSet rs, int rowNum) throws SQLException {
			final LocalityHol localityHol = new LocalityHol();
			localityHol.setLocalityId(rs.getInt("locality_id"));
			localityHol.setLocalityType(rs.getInt("locality_type"));
			localityHol.setLocalityName(rs.getString("locality_name"));
			localityHol.setRegionId(rs.getInt("region_id"));
			final RegionHol regionHol = mapRegionHol.get(localityHol.getRegionId());
			if(regionHol.getLocalitysHol() == null)
				regionHol.setLocalitysHol(new ArrayList<LocalityHol>());
			regionHol.getLocalitysHol().add(localityHol);
			return (T) localityHol;
		}
	}
	private class RegionRowMapper<T> implements RowMapper<T>{
		private Map<Integer, DistrictHol> mapDistrictHol;
		private Map<Integer, RegionHol> mapRegionHol;
		public RegionRowMapper(Map<Integer, DistrictHol> mapDistrictHol, Map<Integer, RegionHol> mapRegionHol) {
			this.mapDistrictHol = mapDistrictHol;
			this.mapRegionHol = mapRegionHol;
		}
		@Override
		public T mapRow(ResultSet rs, int rowNum) throws SQLException {
			RegionHol regionHol = new RegionHol();
			regionHol.setRegionId(rs.getInt("region_id"));
			regionHol.setDistrictId(rs.getInt("district_id"));
			regionHol.setRegionName(rs.getString("region_name"));
			mapRegionHol.put(regionHol.getRegionId(), regionHol);
			DistrictHol districtHol = mapDistrictHol.get(regionHol.getDistrictId());
			if(districtHol.getRegionsHol() == null)
				districtHol.setRegionsHol(new ArrayList<RegionHol>());
			districtHol.getRegionsHol().add(regionHol);
			return (T) regionHol;
		}
	}
	private class DestrictRowMapper<T> implements RowMapper<T>{
		private Map<Integer, CountryHol>	mapCountryHol;
		private Map<Integer, DistrictHol>	mapDistrictHol;
		public DestrictRowMapper(Map<Integer, CountryHol> mapCountryHol, Map<Integer, DistrictHol> mapDistrictHol) {
			this.mapCountryHol	= mapCountryHol;
			this.mapDistrictHol	= mapDistrictHol;
		}
		@Override
		public T mapRow(ResultSet rs, int rowNum) throws SQLException {
			DistrictHol districtHol = new DistrictHol();
			districtHol.setCountryId(rs.getInt("country_id"));
			districtHol.setDistrictId(rs.getInt("district_id"));
			districtHol.setDistrictName(rs.getString("district_name"));
			mapDistrictHol.put(districtHol.getDistrictId(), districtHol);
			CountryHol countryHol = mapCountryHol.get(districtHol.getCountryId());
			if(countryHol.getDistrictsHol() == null)
				countryHol.setDistrictsHol(new ArrayList<DistrictHol>());
			countryHol.getDistrictsHol().add(districtHol);
			return (T) districtHol;
		}
		
	}
	private class CountryRowMapper<T> implements RowMapper<T>{
		private Map<Integer, CountryHol> mapCountryHol;
		public CountryRowMapper(Map<Integer, CountryHol> mapCountryHol) {
			this.mapCountryHol=mapCountryHol;
		}
		@Override
		public T mapRow(ResultSet rs, int rowNum) throws SQLException {
			CountryHol countryHol = new CountryHol();
			countryHol.setCountryId(rs.getInt("country_id"));
			countryHol.setCountryName(rs.getString("country_name"));
			mapCountryHol.put(countryHol.getCountryId(), countryHol);
			return (T) countryHol;
		}
		
	}

	public List<Map<String, Object>> countPatientsProYear() {
		String sql = "SELECT YEAR(h.history_in) year, COUNT(year(h.history_in)) yearPatientCount "
				+ " FROM history h GROUP BY YEAR(h.history_in) "
				+ " ORDER BY YEAR(h.history_in) DESC";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientProYear = jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientProYear;
	}

	public List<Map<String, Object>> countPatientsProWeeks(Integer year,
			Integer minWeek, Integer maxWeek) {
		String sql = "SELECT WEEKOFYEAR(h.history_in) weekNr, COUNT(WEEKOFYEAR(h.history_in)) weekPatientCount "
				+ " FROM history h "
				+ " WHERE YEAR(h.history_in) = ? AND (WEEKOFYEAR(h.history_in) = ? OR WEEKOFYEAR(h.history_in) = ?) "
				+ " GROUP BY WEEKOFYEAR(h.history_in) ORDER BY WEEKOFYEAR(h.history_in) DESC";
		logger.info("\n"+sql+" "+year+" "+minWeek+" "+maxWeek);
		List<Map<String, Object>> countPatientsProWeek 
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { year, minWeek, maxWeek });
		return countPatientsProWeek;
	}

	public List<Map<String, Object>> countPatientsProWeeks(Integer year, Integer monthNr) {
		String sql = "SELECT WEEKOFYEAR(h.history_in) weekNr"
				+ ", COUNT(WEEKOFYEAR(h.history_in)) weekPatientCount "
				+ " FROM history h "
				+ " WHERE YEAR(h.history_in) = ? AND MONTH(h.history_in) = ? "
				+ " GROUP BY WEEKOFYEAR(h.history_in) ORDER BY WEEKOFYEAR(h.history_in) DESC";
		logger.info("\n"+sql+" "+year+" "+monthNr);
		List<Map<String, Object>> countPatientsProWeek 
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { year, monthNr });
		return countPatientsProWeek;
	}

	public List<Map<String, Object>> countPatientsProMonth(Integer year) {
		String sql = "SELECT MONTH(h.history_in) monthNr, COUNT(MONTH(h.history_in)) monthPatientCount "
				+ " FROM history h "
				+ " WHERE YEAR(h.history_in)= ? GROUP BY MONTH(h.history_in) ORDER BY MONTH(h.history_in) DESC";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { year });
		return countPatientsProMonth;
	}

	public List<Map<String, Object>> seekLocality(Integer regionId) {
		String sql = "SELECT * FROM locality WHERE region_id = ? ";
		logger.info("\n"+sql.replaceFirst("\\?", ""+regionId));
		List<Map<String, Object>> countPatientsProWeek 
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { regionId });
		return countPatientsProWeek;
	}

	public List<Map<String, Object>> patientsYearWeekRsList(Integer year, Integer week) {
		logger.info("\n"+sqlPatientsYearWeek+" "+year+" "+week);
		List<Map<String, Object>> countPatientsProWeek 
		= jdbcTemplateHol1MySql.queryForList(sqlPatientsYearWeek, new Object[] { year, week });
		return countPatientsProWeek;
	}

	public List<Map<String, Object>> getArchiveOperationOrder() {
		String sql = "SELECT o_saved.operation_name op_name_saved, oo.*, o.*, p.* "
				+ " FROM order_operation oo, operation o_saved,"
				+ " (SELECT operation_id, operation_code, operation_name, operation_subgroup_name, operation_group_name "
				+ " FROM operation o, operation_subgroup osg, operation_group og "
				+ "WHERE o.operation_subgroup_id=osg.operation_subgroup_id "
				+ " AND osg.operation_group_id=og.operation_group_id) o,"
				+ " (SELECT d.department_name, p.personal_name, p.personal_surname, p.personal_patronymic , pd.personal_department_id, po.position_name"
				+ " FROM personal_department pd, personal p, department d, position po"
				+ " WHERE p.personal_id=pd.personal_id AND d.department_id=pd.department_id AND po.position_id=pd.position_id) p"
				+ " WHERE p.personal_department_id=oo.personal_department_id AND o.operation_id=oo.operation_id "
				+ " AND o_saved.operation_id=oo.new_operation_id";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientsProMonth;
	}

	public List<Map<String,Object>> getActiveOperationOrder() {
		String sql = "SELECT * FROM order_operation oo, "
				+ " (SELECT operation_id, operation_code, operation_name, operation_subgroup_name "
				+ ", operation_group_name "
				+ " FROM operation o, operation_subgroup osg, operation_group og "
				+ " WHERE o.operation_subgroup_id=osg.operation_subgroup_id "
				+ " AND osg.operation_group_id=og.operation_group_id) o "
				+ ",(SELECT d.department_name, p.personal_name, p.personal_surname, p.personal_patronymic "
				+ ", pd.personal_department_id, po.position_name "
				+ " FROM "
				+ " personal_department pd, personal p, department d, position po "
				+ " WHERE p.personal_id=pd.personal_id AND d.department_id=pd.department_id "
				+ " AND po.position_id=pd.position_id) p "
				+ " WHERE oo.new_operation_id IS NULL and p.personal_department_id=oo.personal_department_id "
				+ " AND o.operation_id=oo.operation_id ";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientsProMonth;
	}
	public List<Map<String,Object>> getPersonalListe() {
		String sql = "SELECT p.personal_id, p.personal_surname, p.personal_name, p.personal_patronymic,"
				+ " pdd.department_name FROM personal p LEFT JOIN ("
				+ "SELECT pd.personal_id, d.* FROM personal_department pd, department d"
				+ " WHERE d.department_id = pd.department_id"
				+ ") pdd ON p.personal_id = pdd.personal_id";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientsProMonth;
	}

	public List<Map<String, Object>> getOperationListe() {
		String sql = "SELECT o.*,osg.operation_subgroup_name,og.* "
				+ " FROM operation o, operation_subgroup osg, operation_group og "
				+ " WHERE o.operation_subgroup_id = osg.operation_subgroup_id AND og.operation_group_id = osg.operation_group_id "
				+ " ORDER BY operation_group_sort ";
//		+ " ORDER BY operation_code ";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientsProMonth;
	}
	public List<Map<String, Object>> getSurgeryOperationListe(Integer personalId) {
		String sql = "SELECT oh.*, operation_name, operation_code "
				+ " FROM (select operation_id, count(operation_id) operation_cnt, operation_additional "
				+ " FROM operation_history "
				+ " WHERE personal_id = ? GROUP BY operation_id) oh, operation o "
				+ " WHERE o.operation_id=oh.operation_id ORDER BY operation_cnt DESC";
		final List<Map<String, Object>> queryForList = jdbcTemplateHol1MySql.queryForList(sql, new Object[] { personalId});
		return queryForList;
	}
	public List<Map<String, Object>> getAnestesiaListe() {
		String sql = "SELECT * FROM anestesia";
		logger.info("\n"+sql);
		List<Map<String, Object>> anestesiaListe 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return anestesiaListe;
	}

	public List<Map<String, Object>> getAnesthetistListe() {
		String sql = "SELECT * FROM personal WHERE personal_anesthetist";
		logger.info("\n"+sql);
		List<Map<String, Object>> surgeryListe 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return surgeryListe;
	}

	public List<Map<String, Object>> getSurgeryListe() {
		String sql = "SELECT * FROM personal WHERE personal_surgeon";
		logger.info("\n"+sql);
		List<Map<String, Object>> surgeryListe 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return surgeryListe;
	}
	
	public List<Map<String, Object>> getOperationResultListe() {
		String sql = "select * from operation_result";
		logger.info("\n"+sql);
		List<Map<String, Object>> operationResultListe 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return operationResultListe;
	}
	public List<Map<String, Object>> getComplicationListe() {
		String sql = "SELECT * FROM operation_complication";
		logger.info("\n"+sql);
		List<Map<String, Object>> countPatientsProMonth 
		= jdbcTemplateHol1MySql.queryForList(sql);
		return countPatientsProMonth;
	}

	public Icd10UaClass seekIcd10UaGroups(String query) {
		String sql = "SELECT * FROM icd i1 WHERE CONCAT(i1.icd_code, ' ',i1.icd_name ) LIKE '%?%' LIMIT 50";
		String sql2 = sql.replaceFirst("\\?", query);
		logger.debug(sql2);
		Icd10UaClass icd10UaRoot = new Icd10UaClass();
		List<Icd10UaClass> icd10Classes = jdbcTemplateHol1MySql.query(
				sql2,
				new Icd2TreeMapper(icd10UaRoot));
		logger.debug(""+icd10UaRoot);
		return icd10UaRoot;
	}
	public List<Map<String, Object>> seekIcd10Db(String query) {
		String sql = "SELECT * FROM icd i1 WHERE CONCAT(i1.icd_code, ' ',i1.icd_name ) LIKE '%?%'";
		String sql2 = sql.replaceFirst("\\?", query);
		logger.info("\n"+sql2);
		List<Map<String, Object>> seekIcd10 
		= jdbcTemplateHol1MySql.queryForList(sql2);
		List<Map<String, Object>> icdTree = new ArrayList<Map<String,Object>>();
		if(seekIcd10.size()>0){
			icdTree.add(seekIcd10.get(0));
			for (int i = 1; i < seekIcd10.size(); i++) {
				final String icdCodeL = (String) icdTree.get(icdTree.size()-1).get("icd_code");
				final String icdCode = (String) seekIcd10.get(i).get("icd_code");
				if(icdCode.contains(icdCodeL))
				{
					
				}
			}
		}
		return seekIcd10;
//		return icdTree;
	}

	String sqlNextPatientId = "SELECT patient_id+1 nextId FROM patient ORDER BY patient_id DESC LIMIT 1";
	String sqlNextYearHistoryId = 
			"SELECT history_no + 1 nextId FROM history WHERE YEAR(history_in) = ? ORDER BY history_no DESC LIMIT 1";
	public int nextPatientId() {
		return readNextId(sqlNextPatientId);
	}
	public int nextHistoryNo(int year) {
		return readNextIdDouble(sqlNextYearHistoryId.replaceFirst("\\?", ""+year));
	}
	public int getAutoIncrement(String tableName) {
		String sql = "SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES "
				+ " WHERE TABLE_SCHEMA = 'hol' AND TABLE_NAME = '?' ";
		String sql2 = sql.replaceFirst("\\?", tableName);
		logger.info("\n"+sql2);
		List<Map<String, Object>> nextIdList
			= jdbcTemplateHol1MySql.queryForList(sql2);
//		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { tableName });
		BigInteger nextId = (BigInteger) nextIdList.get(0).values().toArray()[0];
		return nextId.intValue();
	}

	private int readNextId(String sql) {
		logger.info("\n"+sql);
		List<Map<String, Object>> nextIdList
		= jdbcTemplateHol1MySql.queryForList(sql);
		BigInteger nextId = (BigInteger) nextIdList.get(0).get("nextId");
		return nextId.intValue();
	}
	private int readNextIdDouble(String sql) {
		logger.info("\n"+sql);
		List<Map<String, Object>> nextIdList
		= jdbcTemplateHol1MySql.queryForList(sql);
		Double nextId = (Double) nextIdList.get(0).get("nextId");
		return nextId.intValue();
	}

	static String sqlOperationHistorys = null; //operation-historys.sql
	public List<Map<String, Object>> getOperationHistorys(HistoryHolDb shortPatientHistory) {
		sqlOperationHistorys = readSqlFromFile("operation-historys.sql", sqlOperationHistorys);
		logger.info("\n"+sqlOperationHistorys.replaceFirst("\\?", ""+shortPatientHistory.getHistoryId()));
		List<Map<String, Object>> lmso
			= jdbcTemplateHol1MySql.queryForList(sqlOperationHistorys, new Object[] { shortPatientHistory.getHistoryId()});
		return lmso;
	}

	private String readSqlFromFile(final String sqlFileName, String sql) {
		if(sql == null) {
			sql = readSqlFromFile(sqlFileName);
		}
		return sql;
	}

	private final String readSqlFromFile(String sqlFileName) {
		Path path = FileSystems.getDefault().getPath(AppConfig.applicationResourcesFolderPfad, sqlFileName);
		logger.debug(""+path);
		final StringBuffer stringBuffer = new StringBuffer();
		try (BufferedReader reader = Files.newBufferedReader(path, Charset.forName("UTF-8"))) {
			String line = null;
			while ((line = reader.readLine()) != null) {
				stringBuffer.append(line);
				stringBuffer.append(" ");
			}
		} catch (IOException x) {
			System.err.format("IOException: %s%n", x);
		}
		logger.debug(""+stringBuffer);
		return stringBuffer.toString();
	}
	
//	public List<Map<String, Object>> dsReferral(Integer departmentId) {
//		logger.info("\n"+sqlGroupReferral.replaceFirst("\\?", ""+departmentId));
//		List<Map<String, Object>> groupReferral
//		= jdbcTemplateHol1MySql.queryForList(sqlGroupReferral, new Object[] { departmentId});
//		return groupReferral;
//	}
	public List<Map<String, Object>> dsNapravlenya(Integer departmentId) {
		String sql = "SELECT cds_code, COUNT(direct_id) cnt_direct_id, direct_id direct_id, dr_name , cDs, pip from ( \n "
				+ sqlMoveQuartal
				+ "\n) s GROUP BY s.cds_code, s.direct_id"
				+ "\n ORDER BY s.cds_code, s.direct_id"
				+ "\n";
		logger.info("\n Село Місто \n"+sql.replaceFirst("\\?", ""+departmentId));
		List<Map<String, Object>> dsMistoSelo
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { departmentId});
		return dsMistoSelo;
	}
//	public List<Map<String, Object>> dsMistoSelo2(Integer departmentId) {
//		return queryForList(departmentId, sqlMistoSelo_cDs_group);
//	}


	List<Map<String, Object>> monthPeriodReport(Integer departmentId, Integer fromMonth, Integer toMonth, String sql) {
		logger.info("\n----------------------------------------------- \n "
				+sql.replaceFirst("\\?", ""+departmentId));
		List<Map<String, Object>> list
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { departmentId, fromMonth, toMonth});
		return list;
	}
	public List<Map<String, Object>> dsMistoSelo(Integer departmentId) {
		String sql = "SELECT cds_code, COUNT(locality_type) cnt_locality_type, locality_type, cDs, pip FROM ( \n "
				+ sqlMoveQuartal
				+ "\n ) s GROUP BY s.cds_code, s.locality_type "
				+ "\n  ORDER BY s.cds_code ";
		logger.info("\n"+sql.replaceFirst("\\?", ""+departmentId));
		List<Map<String, Object>> dsMistoSelo
		= jdbcTemplateHol1MySql.queryForList(sql, new Object[] { departmentId});
		return dsMistoSelo;
	}
	public List<Map<String, Object>> icd10uk() {
		List<Map<String, Object>> icd10uk
		= jdbcTemplateHol1MySql.queryForList("select icd_code, icd_name from icd;");
		return icd10uk;
	}
	public List<Map<String, Object>> jornalMovePatient(Integer departmentId) {
		logger.info("\n"+sqlMoveQuartal.replaceFirst("\\?", ""+departmentId));
		List<Map<String, Object>> jmp
			= jdbcTemplateHol1MySql.queryForList(sqlMoveQuartal, new Object[] { departmentId});
		return jmp;
	}
	
	
	
	String sqlHistoryInDepartmentProYearMonths1
	= "SELECT d.department_id ,YEAR(history_in) ,MONTH(history_in) , h.* \n"
			+ " FROM history h, department d \n"
			+ " WHERE YEAR(history_in) = 2014 AND (MONTH(history_in) > 1 OR MONTH(history_in) < 7) AND d.department_id = 5 \n"
			+ " AND d.department_id = h.history_department_in";

	String sqlPatientAdress = "SELECT p.patient_id,CONCAT(p.patient_surname,' ',p.patient_name,' ',p.patient_patronnymic) pip "
			+ "\n ,CONCAT(r.region_name, if(d.district_id=1,'', CONCAT(', ',d.district_name,' обл. ') )) r_name"
			+ "\n ,r.region_id r_id, d.district_name d_name, d.district_id d_id, l.locality_type "
			+ "\n FROM patient p, region r, district d, locality l "
			+ "\n WHERE r.region_id=p.region_id and r.district_id=d.district_id AND p.locality_id=l.locality_id";
	
	String sqlMoveQuartal = "SELECT  pip, history_no, d_id, d_name, direct_id, dr_name, r_id, r_name"
			+ ", locality_type, d_in, d_out, b_d, pDs, cds_code, cDs "
			+ "\n FROM (\n"
			+ sqlPatientAdress
			+ "\n) p, "
			+ "\n (SELECT  h.patient_id ,h.history_id, h.history_no , dh.department_history_in d_in , dh.department_history_out  d_out "
			+ "\n , if(dh.department_history_bed_day = 0,1,dh.department_history_bed_day) b_d, dr.direct_id , dr.direct_name dr_name "
			+ "\n FROM history h, department_history dh, direct dr "
			+ "\n WHERE YEAR(dh.department_history_in) = 2015 AND (MONTH(dh.department_history_in) >= 1 AND MONTH(dh.department_history_in) <= 6) "
			+ "\n AND dh.department_id = ? AND dh.history_id = h.history_id AND dr.direct_id=h.direct_id) historyInDepartmentProYearMonths "
			+ "\n LEFT JOIN ( SELECT  hd.history_id pHistoryId, concat(icd.icd_code, ' ',icd.icd_name, ' ',hd.history_diagnos_additional) pDs "
			+ "\n FROM history_diagnos hd, icd icd "
			+ "\n WHERE hd.diagnos_id = 2  AND icd.icd_id = hd.icd_id) dsPostupiv ON pHistoryId = historyInDepartmentProYearMonths.history_id "
			+ "\n LEFT JOIN ( SELECT  hd.history_id cHistoryId , substring_index(icd.icd_code,'.',1) cds_code "
			+ "\n , concat(icd.icd_code, ' ',icd.icd_name, ' ',hd.history_diagnos_additional) cDs "
			+ "\n FROM history_diagnos hd, icd icd "
			+ "\n WHERE hd.diagnos_id = 3  AND icd.icd_id = hd.icd_id) dsClin ON cHistoryId = historyInDepartmentProYearMonths.history_id "
			+ "\n WHERE p.patient_id = historyInDepartmentProYearMonths.patient_id ORDER BY historyInDepartmentProYearMonths.d_in ";

	static String sqlHistoryInDepartmentProYearMonths
	= "SELECT  h.patient_id ,h.history_id, h.history_no , dh.department_history_in d_in , dh.department_history_out  d_out "
			+ "\n , (dh.department_history_bed_day + 1) b_d, dr.direct_id , dr.direct_name dr_name "
			+ "\n ,dhf.department_id "
			+ "\n ,IF(dr.direct_id=1,1,if(dhf.department_id > 0,99999,0)) referral "
			+ "\n  FROM history h, department_history dh "
			+ "\n  LEFT JOIN department_history dhf on dh.history_id = dhf.history_id "
			+ "\n and TIMESTAMPDIFF(SECOND,dhf.department_history_out,dh.department_history_in) = 1 "
			+ "\n  , direct dr "
			+ "\n   WHERE YEAR(dh.department_history_in) = 2015 AND (MONTH(dh.department_history_in) >= 1 AND MONTH(dh.department_history_in) < 7) "
			+ "\n    AND dh.department_id = ? AND dh.history_id = h.history_id AND dr.direct_id=h.direct_id";

	static String sqlReferral = "\n SELECT h.history_id, h.patient_id, (dh.department_history_bed_day +1) b_d "
			+ "\n ,IF(dr.direct_id=1,1,IF(dhf.department_id > 0,99999,0)) referral "
			+ "\n ,h.history_no , dh.department_history_in d_in , dh.department_history_out d_out "
			+ "\n , dr.direct_id , dr.direct_name dr_name ,dhf.department_id "
			+ "\n FROM history h, department_history dh LEFT JOIN department_history dhf ON dh.history_id = dhf.history_id "
			+ "\n AND TIMESTAMPDIFF(SECOND,dhf.department_history_out,dh.department_history_in) = 1 , direct dr "
			+ "\n WHERE dh.department_id = ? AND YEAR(dh.department_history_in) = 2015 "
			+ "\n AND MONTH(dh.department_history_in) >= ? AND MONTH(dh.department_history_in) <= ? "
			+ "\n AND dh.history_id = h.history_id AND dr.direct_id=h.direct_id";

	static String sql_pAd = "SELECT p.patient_id, p.district_id, p.region_id, p.locality_id, l.locality_type "
			+ "\n , IF(l.locality_id=1 or l.locality_id=821,CONCAT('1_',locality_name),CONCAT('0_',region_name)) adress_code"
			+ "\n , IF(l.locality_id=1 or l.locality_id=821,1,0) locality_type2, r.region_name, d.district_name, l.locality_name "
			+ "\n FROM patient p, locality l, region r, district d "
			+ "\n WHERE p.locality_id = l.locality_id AND r.region_id = p.region_id AND d.district_id = p.district_id";

	static String sql_cDs = "SELECT hd.history_id, substring_index(i1.icd_code,'.',1) cds_code, CONCAT(i1.icd_code, ' ',i1.icd_name) icd_name1, i2.icd_name cDs "
			+ "\n  FROM history_diagnos hd, icd i1,icd i2 WHERE hd.diagnos_id = 3 AND i1.icd_id = hd.icd_id "
			+ "\n AND substring_index(i1.icd_code,'.',1) = i2.icd_code";

	static String sqlPerevedeni2hol ="SELECT h.history_id, h.patient_id, result_id, dhf.department_id, (dh.department_history_bed_day + 1) b_d "
			+ "\n FROM history h ,  department_history dh LEFT JOIN department_history dhf "
			+ "\n ON dh.history_id = dhf.history_id AND TIMESTAMPDIFF(SECOND,dh.department_history_out,dhf.department_history_in) = 1 "
			+ "\n WHERE h.history_id=dh.history_id and dh.department_id=? AND dhf.department_id IS NOT NULL AND "
			+ "\n YEAR(h.history_out)=2015  AND (MONTH(h.history_out) >= ? AND MONTH(h.history_out) <= ?)";

	static String sqlPerevedeni2hol_pAd = ""
			+ "SELECT locality_type, locality_type2, adress_code, region_id, count(region_id) cnt_region, sum(b_d) sum_b_d, region_name, district_name, locality_name"
			+ "\n FROM (SELECT pAd.*, perevedeni2hol.b_d ,perevedeni2hol.department_id "
			+ "\n FROM (\n" + sql_pAd + "\n ) pAd, (\n" + sqlPerevedeni2hol + "\n) perevedeni2hol"
			+ " WHERE perevedeni2hol.patient_id = pAd.patient_id ) h "
			+ "\n GROUP BY locality_type2, district_id, region_id"
			+ "\n ORDER BY adress_code";
	static String sqlPerevedeni2hol_cDs_group = "\n  SELECT cds_code, COUNT(cds_code) cnt_cds_code, SUM(b_d) sum_b_d, cDs FROM ( "
			+ "\n SELECT cds_code, cDs, sqlPerevedeni2hol.* FROM ( "
			+ sql_cDs
			+ "\n ) cDs, ( "
			+ sqlPerevedeni2hol
			+ "\n ) sqlPerevedeni2hol WHERE sqlPerevedeni2hol.history_id = cDs.history_id"
			+ "\n ) h GROUP BY cds_code ORDER BY cds_code";

	static String sqlDeadOrvipisany ="SELECT h.history_id, h.patient_id, result_id, IF(result_id=5,0,result_id) deadVipisan, (dh.department_history_bed_day + 1) b_d"
			+ "\n FROM history h, department_history dh LEFT JOIN department_history dhf "
			+ "\n ON dh.history_id = dhf.history_id AND TIMESTAMPDIFF(SECOND,dh.department_history_out,dhf.department_history_in) = 1 "
			+ "\n WHERE h.result_id<7 and h.history_id=dh.history_id AND dh.department_id = ? AND dhf.department_id IS NULL AND "
			+ "\n YEAR(h.history_out)=2015  AND (MONTH(h.history_out) >= ? AND MONTH(h.history_out) <= ?)";
	
	static String sqlDeadOrvipisany_pAd = "SELECT locality_type, locality_type2, adress_code, region_id, COUNT(deadVipisan) cnt_deadVipisan, deadVipisan, SUM(b_d) sum_b_d, region_name, district_name, locality_name "
			+ "\n FROM ( SELECT pAd.*, sqlDeadOrvipisany.deadVipisan, sqlDeadOrvipisany.b_d "
			+ "\n FROM (\n" +sql_pAd +"\n ) pAd, ( \n" +sqlDeadOrvipisany +"\n ) sqlDeadOrvipisany "
			+"\n WHERE sqlDeadOrvipisany.patient_id = pAd.patient_id "
			+ "\n ) h"
			+ "\n GROUP BY locality_type2, district_id, region_id, deadVipisan"
			+ "\n ORDER BY adress_code";

	static String sqlDeadOrvipisany_cDs_group = "\n SELECT cds_code, deadVipisan, COUNT(deadVipisan) cnt_deadVipisan, SUM(b_d) sum_b_d, cDs FROM ("
			+ "\n SELECT cds_code, cDs, sqlDeadOrvipisany.* FROM (\n"
			+sql_cDs
			+"\n ) cDs, ( \n"
			+sqlDeadOrvipisany
			+"\n ) sqlDeadOrvipisany "
			+"\n WHERE sqlDeadOrvipisany.history_id= cDs.history_id "
			+"\n ) h "
			+"\n GROUP BY cds_code,deadVipisan "
			+"\n ORDER BY cds_code";
	static String sqlReferral_pAd = "SELECT locality_type, locality_type2, adress_code, region_id, count(referral) cnt_referral, referral, SUM(b_d) sum_b_d, region_name, district_name, locality_name "
			+ "\n FROM (SELECT pAd.*, referral.b_d, referral.referral"
			+ "\n FROM (\n" + sql_pAd + "\n ) pAd, (\n" + sqlReferral + "\n) referral"
			+ "\n WHERE referral.patient_id = pAd.patient_id ) h "
			+ "\n GROUP BY locality_type, district_id, region_id, referral"
//			+ "\n ORDER BY locality_type, district_id, region_name"
			+ "\n ORDER BY adress_code";
	;
	static String sqlReferral_cDs_group = "SELECT cds_code, COUNT(referral) cnt_ref, referral, SUM(b_d) sum_b_d,b_d, cDs "
			+ "\n  FROM ( \n " + sql_cDs + "\n ) cDs, ( \n " + sqlReferral + "\n ) referral "
			+ "\n WHERE referral.history_id=cDs.history_id "
			+ "\n GROUP BY cds_code, referral "
			+ "\n ORDER BY cds_code, referral";
	static String sqlReferral_cDs_group2 = "SELECT cds_code, COUNT(referral) cnt_ref, referral, SUM(b_d) sum_b_d,b_d, cDs "
			+ "\n FROM ( SELECT substring_index(icd.icd_code,'.',1) cds_code, referral, b_d , concat(icd.icd_code, ' ',icd.icd_name) cDs "
			+ "\n FROM ( \n"
			+ sqlHistoryInDepartmentProYearMonths
			+ "\n ) h, history_diagnos hd, icd "
			+ "WHERE hd.diagnos_id = 3 AND hd.history_id = h.history_id AND icd.icd_id = hd.icd_id"
			+ "\n ) h GROUP BY h.cds_code, referral ORDER BY h.cds_code, referral";

	static String sqlMistoSelo_cDs_group = "SELECT hd.cds_code, COUNT(locality_type) cnt_locality_type, locality_type, SUM(b_d) sum_b_d , cDs "
			+ "\n FROM ( "
			+ "\n SELECT p.patient_id ,CONCAT(r.region_name, if(d.district_id=1,'', CONCAT(', ',d.district_name,' обл. ') )) r_name "
			+ "\n ,r.region_id r_id, d.district_name d_name, d.district_id d_id, l.locality_type "
			+ "\n FROM patient p, region r, district d, locality l "
			+ "\n WHERE r.region_id=p.region_id and r.district_id=d.district_id AND p.locality_id=l.locality_id"
			+ "\n ) pa, ("
			+ sqlReferral
			+ "\n ) h, ( "
//			+ "\n SELECT hd.history_id, substring_index(icd.icd_code,'.',1) cds_code, CONCAT(icd.icd_code, ' ',icd.icd_name) cDs "
//			+ "\n FROM history_diagnos hd, icd icd WHERE icd.icd_id = hd.icd_id  AND hd.diagnos_id = 3"
			+ sql_cDs
			+ "\n ) hd "
			+ "\n WHERE pa.patient_id = h.patient_id AND hd.history_id = h.history_id "
			+ "\n GROUP BY hd.cds_code, locality_type ORDER BY hd.cds_code, locality_type ";

	//---------------epicrise---------------------------------------------------
	public Map<String, Object> saveEpicrise(Map<String, Object> epicrise) {
		saveEpicriseToFile(epicrise, 0);
		return epicrise;
	}
	private void saveEpicriseToFile(final Map<String, Object> epicrise, int hId) {
		final Date savedDate = new Date();
		epicrise.put("savedDate", savedDate);
		writeToJsonDbFile(epicrise, AppConfig.getEpicriseDbJsonName(hId));
	}
	//---------------epicrise------------------------------------------------END

	Map<String, Object> readJsonFile(String fileName) {
		File file = new File(AppConfig.applicationFolderPfad + AppConfig.innerJsFolderPfad + fileName);
		logger.debug(file.getName()+" -- "+file);
		Map<String, Object> responseBody = null;
		try {
			FileInputStream fileInputStream;
			fileInputStream = new FileInputStream(file);
			final InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
			responseBody = new ObjectMapper().readValue(inputStreamReader, Map.class);
//			logger.debug("\n"+responseBody);
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return responseBody;
	}
	void writeToJsonDbFile(Map java2jsonObject, String fileName) {
		//delete old parameters and document tiles
		java2jsonObject.remove("savedTs");
		writeToJsonDbFile((Object) java2jsonObject, fileName);
	}

	void writeToJsonDbFile(Object java2jsonObject, String fileName) {
		File file = new File(AppConfig.applicationFolderPfad + AppConfig.innerDbFolderPfad + fileName);
		logger.warn(""+file);
		ObjectMapper mapper = new ObjectMapper();
		ObjectWriter writerWithDefaultPrettyPrinter = mapper.writerWithDefaultPrettyPrinter();
		try {
			//			logger.warn(writerWithDefaultPrettyPrinter.writeValueAsString(java2jsonObject));
			FileOutputStream fileOutputStream = new FileOutputStream(file);
			writerWithDefaultPrettyPrinter.writeValue(fileOutputStream, java2jsonObject);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void setAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		String sql = "SELECT concat('dep-',d.department_id,'_per-',p.personal_id) role, p.personal_username username"
				+ " FROM personal_department pd, personal p, department d "
				+ " WHERE pd.personal_id = p.personal_id AND d.department_id=pd.department_id";
		List<Map<String, Object>> userRoleList = jdbcTemplateHol1MySql.queryForList(sql);
		for (Map<String, Object> map : userRoleList) {
			final String username = (String) map.get("username");
			final String role = (String) map.get("role");
			auth.inMemoryAuthentication().withUser(username).password(username).roles(role);
		}
		logger.debug(""+auth);
	}


	public List<Map<String, Object>> basicAnalysis(Integer year, Integer mBegin, Integer mEnd) {
		final String sqlBasicAnalysis = readSqlFromFile("sql-basic-analysis.sql");
		final ArrayList<Object> arrayList = new ArrayList<>();
		arrayList.add(year);
		arrayList.add(mBegin);
		arrayList.add(mEnd);
		logger.debug(arrayList.toString());
		final List<Object> subList = arrayList.subList(0, 3);
		logger.debug(subList.toString());
		for (int i = 0; i < 4; i++) {
			arrayList.add(year);
			arrayList.add(mBegin);
			arrayList.add(mEnd);
//			arrayList.addAll(subList);
		}
		logger.debug(arrayList.toString());
		List<Map<String, Object>> list
		= jdbcTemplateHol1MySql.queryForList(sqlBasicAnalysis, arrayList.toArray());
		return list;
	}

	
	private String getHistoryTreatmentAnalysisText(Map<String, Object> epiMap) {
		Map value = (Map) epiMap.get("value");
		String textHtml = (String) value.get("textHtml");
		return textHtml;
	}
	void insertHistoryTreatmentAnalysis(Integer historyId, Map<String, Object> epiMap, String historyTreatmentAnalysisText) {
		if(historyTreatmentAnalysisOnce.contains(epiMap.get("treatmentAnalysId")))
			return;
		Integer historyTreatmentAnalysisId = getAutoIncrement("history_treatment_analysis");
		final Integer sort = (Integer) epiMap.get("sort");
		final Object treatmentAnalysIdObj = epiMap.get("treatmentAnalysId");
		if(treatmentAnalysIdObj == null){
			return;
		}
		Integer treatmentAnalysId = getInt(epiMap,"treatmentAnalysId");
		logger.debug(sqlInsertHistoryTreatmentAnalysis.replaceFirst("\\?", historyTreatmentAnalysisText)
		.replaceFirst("\\?", treatmentAnalysId.toString())
		.replaceFirst("\\?", sort.toString())
		.replaceFirst("\\?", historyTreatmentAnalysisId.toString())
		.replaceFirst("\\?", historyId.toString()));
		
		jdbcTemplateHol1MySql.update( sqlInsertHistoryTreatmentAnalysis,
				new Object[] {historyTreatmentAnalysisText, sort, treatmentAnalysId, historyTreatmentAnalysisId, historyId },
				new int[] {Types.VARCHAR, Types.INTEGER, Types.INTEGER, Types.INTEGER, Types.INTEGER}
				);
		epiMap.put("htaId",historyTreatmentAnalysisId);
	}
	final String sqlDeleteHistoryTreatmentAnalysis = 
			"DELETE FROM history_treatment_analysis "
			+ " WHERE history_treatment_analysis_id = ? ";
	final String sqlSelectHistoryTreatmentAnalysis ="SELECT ta.treatment_analysis_name, ta.treatment_analysis_id, hta.* "
			+ " FROM history_treatment_analysis hta, treatment_analysis ta "
			+ " WHERE ta.treatment_analysis_id=hta.treatment_analysis_id and hta.history_id = ?";
	final String sqlUpdateHistoryTreatmentAnalysis3 = " UPDATE history_treatment_analysis "
			+ " SET history_treatment_analysis_sort = ? "
			+ " WHERE history_treatment_analysis_id = ? ";
	final String sqlUpdateHistoryTreatmentAnalysis1 = " UPDATE history_treatment_analysis "
			+ " SET history_treatment_analysis_text = ? "
			+ "\n , history_treatment_analysis_sort = ? "
			+ " WHERE history_treatment_analysis_id = ? ";
	final String sqlInsertHistoryTreatmentAnalysis = " INSERT INTO history_treatment_analysis "
			+ " (history_treatment_analysis_text, history_treatment_analysis_sort "
			+ " , treatment_analysis_id, history_treatment_analysis_id "
			+ " , history_id, history_treatment_analysis_datetime ) "
			+ " VALUES (?, ?, ?, ?, ?, NOW()) ";

	private Integer getInt(Map<String, Object> map, String key) {
		Integer oInt = null;
		final Object o = map.get(key);
		if (o == null){}
		else if(o instanceof Integer){
			oInt = (Integer) o;
		}else{
			oInt = Integer.parseInt((String) o);
		}
		return oInt;
	}
	int deleteHistoryTreatmentAnalysisSort(Integer htaId) {
		logger.debug(sqlDeleteHistoryTreatmentAnalysis
				.replaceFirst("\\?", htaId.toString()));
		final int update = jdbcTemplateHol1MySql.update( sqlDeleteHistoryTreatmentAnalysis, new Object[] {htaId }
		, new int[] {Types.INTEGER} );
		return update;
	}
	int updateHistoryTreatmentAnalysisSort(Integer htaId, Integer sort) {
		logger.debug(sqlUpdateHistoryTreatmentAnalysis3
				.replaceFirst("\\?", sort.toString())
				.replaceFirst("\\?", htaId.toString()));
		final int update = jdbcTemplateHol1MySql.update( sqlUpdateHistoryTreatmentAnalysis3, new Object[] {sort, htaId }
		, new int[] {Types.VARCHAR, Types.INTEGER} );
		return update;
	}
	int updateHistoryTreatmentAnalysis(Integer htaId, Map<String, Object> epiMap, String historyTreatmentAnalysisText) {
		final Integer sort = (Integer) epiMap.get("sort");
		logger.debug(sqlUpdateHistoryTreatmentAnalysis1
				.replaceFirst("\\?", historyTreatmentAnalysisText)
				.replaceFirst("\\?", sort.toString())
				.replaceFirst("\\?", htaId.toString()));
		final int update = jdbcTemplateHol1MySql.update( sqlUpdateHistoryTreatmentAnalysis1, new Object[] {historyTreatmentAnalysisText, sort, htaId }
		, new int[] {Types.VARCHAR, Types.INTEGER, Types.INTEGER} );
		return update;
	}

	Map<String, Object> epicriseTemplate = null;
	Set historyTreatmentAnalysisOnce = ImmutableSet.of(4);
	public void saveHistoryTreatmentAnalysis(Map<String, Object> epicrise) {
		final List<Map<String, Object>> delPart = (List<Map<String, Object>>) epicrise.get("delPart");
		if(delPart != null)
			for (int i = 0; i < delPart.size(); i++) {
				if(delPart.get(i) instanceof Map){
					Map<String, Object> delMap = delPart.get(i);
					Integer htaId = getInt(delMap, "htaId");
					if(htaId != null){
						deleteHistoryTreatmentAnalysisSort(htaId);
					}
				}
			}
		epicrise.remove(delPart);
		final List<Map<String, Object>> epicriseGroups = (List<Map<String, Object>>) epicrise.get("epicriseGroups");
		Integer hid =  Integer.parseInt((String) epicrise.get("hid"));
		final Integer userPersonalId = Integer.parseInt((String) epicrise.get("userPersonalId"));
//		final int departmentPersonalId = personalId2departmentPersonalId(epicrise);
//		epicrise.put("departmentPersonalId", departmentPersonalId);
		for (int sort = 0; sort < epicriseGroups.size(); sort++) {
			Map<String, Object> epiMap = epicriseGroups.get(sort);
			epiMap.put("sort", sort);
			final String nameGroup = (String) epiMap.get("name");
			final Boolean
			isTextHtml = (Boolean) epiMap.get("isTextHtml")
			,isLabor = (Boolean) epiMap.get("isLabor");
			Integer htaId = getInt(epiMap, "htaId");

			String historyTreatmentAnalysisText = null;
			if(isLabor!=null && isLabor){
				historyTreatmentAnalysisText = getLaborTable(epiMap);
			}else if("Діагнози".equals(nameGroup)){
				final List<Map<String, Object>> diagnosis = (List<Map<String, Object>>) epiMap.get("diagnosis");
				logger.info(" diagnosis "+diagnosis);

				for (Map<String, Object> map : diagnosis) {
					logger.info(" diagnos "+map);
					Integer historyDiagnosId = (Integer) map.get("historyDiagnosId");
					logger.info(" historyDiagnosId "+historyDiagnosId);
					insertUpdateDiagnos(map, userPersonalId, hid);
				}

			}else if(isTextHtml!=null && isTextHtml){
				historyTreatmentAnalysisText = getHistoryTreatmentAnalysisText(epiMap);
			}
			if((isTextHtml!=null && isTextHtml) || (isLabor!=null && isLabor)){
				if(htaId != null){
					final int updateHistoryTreatmentAnalysis = updateHistoryTreatmentAnalysis(htaId, epiMap, historyTreatmentAnalysisText);
					if(updateHistoryTreatmentAnalysis == 0){
						insertHistoryTreatmentAnalysis(hid, epiMap, historyTreatmentAnalysisText);
					}
				}else{
					insertHistoryTreatmentAnalysis(hid, epiMap, historyTreatmentAnalysisText);
				}
			}else if(htaId != null){
				updateHistoryTreatmentAnalysisSort(htaId,sort);
			}
		}
	}

	void insertUpdateDiagnos(Map<String, Object> map, Integer userPersonalId, Integer historyId) {
		map.put("userPersonalId", userPersonalId);
		map.put("historyId", historyId);
		Integer historyDiagnosId = (Integer) map.get("historyDiagnosId");
		logger.debug(""+historyDiagnosId);
		if(null == historyDiagnosId){
			insertHistoryDiagnosis(map);
		}else{
			Integer diagnosId = (Integer) map.get("diagnosId");
			if(diagnosId >2 || diagnosId<5) {
				map.put("userPersonalId", userPersonalId);
				updateHistoryDiagnosis(map);
			}
		}
	}
	
	private String getLaborTable(Map<String, Object> epiMap) {
		Map value = (Map) epiMap.get("value");
		if(value == null){
			value = new HashMap<>();
		}
		Map<String,Object> laborValues = (Map) value.get("laborValues");
		if(laborValues == null){
			laborValues = new HashMap<>();
		}
		if(epicriseTemplate == null){
			epicriseTemplate = readJsonFile("epicriseTemplate.json");
		}
		Map<String,List> epicriseBlock  = (Map<String, List>) epicriseTemplate.get("epicriseBlock");
		final String laborGroupName = (String) epiMap.get("name");
		final List<Map<String,Object>> laborGroup = (List) epicriseBlock.get(laborGroupName);
		Element tableTbody = DocumentHelper.createDocument()
				.addElement("table").addAttribute("rules", "none").addAttribute("class", "mceItemTable")
//				.addElement("tbody")
				;
		final Element trHead = tableTbody
				.addElement("tr").addElement("td").addAttribute("class", "head").addText("Назва")
				.getParent().addElement("td").addAttribute("class", "head").addText("Результат")
				.getParent();
		boolean isOdd = true;
		for (Map<String, Object> labor : laborGroup) {
			final Element td1 = tableTbody.addElement("tr").addElement("td").addAttribute("class", "name");
			final String laborName = (String) labor.get("name");
			final String laborUnit = (String) labor.get("unit");
			td1.addText(laborName);
			final Element td2 = td1.getParent().addElement("td").addAttribute("class", "value");
			//add value
			final Map laborValue = (Map) laborValues.get(laborName);
			td2.addText((laborValue != null)?(String)laborValue.get("value"):" ");
			if(laborUnit != null){
				td1.getParent().addElement("td").addAttribute("class", "description")
				.addText(laborUnit);
			}
			td1.getParent().addAttribute("class", isOdd?"odd":"even");
			isOdd = !isOdd;
		}
//		logger.debug(tableTbody.getParent().asXML());
		return tableTbody.asXML();
//		return tableTbody.getParent().asXML();
	}

	//depricated
	Map<String, String> isIdInTableMap = ImmutableMap.of(
		"history_treatment_analysis"
		,"SELECT history_treatment_analysis_id FROM history_treatment_analysis_id WHERE history_treatment_analysis_id = ? ");
	private boolean isIdInTable(Integer htaId, String tableName) {
		final String sql = isIdInTableMap.get(tableName);
		logger.debug("\n "+sql.replaceFirst("\\?", htaId.toString()));
		List<Map<String, Object>> l = jdbcTemplateHol1MySql.queryForList(sql);
		if(l.size()>0)
			return true;
		return false;
	}

}
