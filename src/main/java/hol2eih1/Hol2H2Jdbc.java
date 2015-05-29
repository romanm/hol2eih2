package hol2eih1;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cuwy1.holDb.model.HistoryHolDb;
import org.h2.Driver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.support.SqlLobValue;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.jdbc.support.lob.LobHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

@Component("hol2H2Jdbc")
public class Hol2H2Jdbc {
	private static final Logger logger = LoggerFactory.getLogger(Hol2H2Jdbc.class);

	private JdbcTemplate jdbcTemplate;
	LobHandler lobHandler = new DefaultLobHandler();
	 
	public Hol2H2Jdbc(){
		System.out.println("------------Hol2H2Jdbc-----url------");
		logger.debug(":: url = "+AppConfig.urlDb);
		System.out.println("------------Hol2H2Jdbc-----url------END");

		SimpleDriverDataSource dataSource = new SimpleDriverDataSource();
		dataSource.setDriverClass(Driver.class);
		dataSource.setUrl(AppConfig.urlDb);
		dataSource.setUsername("sa");
//		dataSource.setPassword("");
		this.jdbcTemplate = new JdbcTemplate(dataSource);
		logger.debug("------CuwyCpoeHolDb2-------"+jdbcTemplate);
		updateDbVersion();
	}

	private void updateDbVersion() {
//		initDbVersionControl();
		final Map<String, Object> dbVersionUpdate = readJsonDbFile2map();
		final List<Map> sqlVersionUpdateList = (List) dbVersionUpdate.get("dbVersionUpdateList");
		final List<String> sqls0 = (List<String>) ((Map) sqlVersionUpdateList.get(0)).get("sqls");
		for (String sql : sqls0) 
			jdbcTemplate.update(sql);
		String sqlDbVersion = "select * from DBVERSION ORDER BY DBVERSION_ID DESC LIMIT 1";
		List<Map<String, Object>> dbVersion = jdbcTemplate.queryForList(sqlDbVersion);
		logger.debug(" "+dbVersion);
		int thisDbVersionId = dbVersion.size() == 0 ? 0:(int) dbVersion.get(0).get("DBVERSION_ID");
		logger.debug(" "+thisDbVersionId);
		for (Map map : sqlVersionUpdateList) {
			final Integer dbVersionId = (Integer) map.get("dbVersionId");
			if(dbVersionId > thisDbVersionId){
				logger.debug("update DB structure to version"+dbVersionId);
				final List<String> sqls = (List<String>) map.get("sqls");
				for (String sql : sqls) {
					if(sql.indexOf("sql_update")>0){
						System.out.println(sql);
						List<Map<String, Object>> sqlUpdateList = jdbcTemplate.queryForList(sql);
						for (Map<String, Object> sqlToUpdateMap : sqlUpdateList) {
							String sqlToUpdate = (String) sqlToUpdateMap.get("sql_update");
							System.out.println(sqlToUpdate);
							jdbcTemplate.update(sqlToUpdate);
							
						}
					}else{
						logger.debug(sql);
						jdbcTemplate.update(sql);
					}
				}
				jdbcTemplate.update("INSERT INTO DBVERSION (DBVERSION_ID) VALUES (?)",dbVersionId);
			}
		}
	}
//	final String fileNameDbVersionUpdate = AppConfig.applicationFolderPfad + "src/main/resources/dbVersionUpdate.sql.json.js";
	final String fileNameDbVersionUpdate = AppConfig.applicationResourcesFolderPfad + "dbVersionUpdate.sql.json.js";
	private Map<String, Object> readJsonDbFile2map() {
		logger.debug(fileNameDbVersionUpdate);
		File file = new File(fileNameDbVersionUpdate);
		logger.debug(" o - "+file);
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> readJsonDbFile2map = null;// = new HashMap<String, Object>();
		try {
			readJsonDbFile2map = mapper.readValue(file, Map.class);
			logger.debug(" o - "+readJsonDbFile2map);
		} catch (JsonParseException e1) {
			e1.printStackTrace();
		} catch (JsonMappingException e1) {
			e1.printStackTrace();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		logger.debug(" o - "+readJsonDbFile2map);
		return readJsonDbFile2map;
	}

	public Integer nextDbId() {
		return jdbcTemplate.queryForObject("select nextval('dbid')", Integer.class);
	}

	public Map<String, Object> getHistory(Integer hid) {
		String sql = "SELECT history_id FROM hol2.history1 WHERE history_id = ?";
		List<Map<String, Object>> r = jdbcTemplate.queryForList(sql,hid);
		if(r.isEmpty())
			return null;
		return r.get(0);
	}
	

	public void insertHistory( HistoryHolDb historyHolDb) {
		final int hol1HistoryId = historyHolDb.getHistoryId();
		final Integer historyId = historyHolDb.getTmpId();
		final String sql = "INSERT INTO hol2.history1 (history_self, history_id, hol1_history_id) VALUES (?, ?, ?)";
		jdbcTemplate.update( sql, new Object[] {new SqlLobValue(object2JsonString(historyHolDb), lobHandler), historyId, hol1HistoryId }
		, new int[] {Types.CLOB, Types.INTEGER, Types.INTEGER} );
	}
	public void updateHistory(Integer tmpId, Object obj2json) {
		final String sql = "UPDATE hol2.history1 SET history_self = ? WHERE history_id = ?";
		jdbcTemplate.update( sql, new Object[] {new SqlLobValue(object2JsonString(obj2json), lobHandler), tmpId }
		, new int[] {Types.CLOB, Types.INTEGER} );
	}
	public void insertEpicrise(Integer epicriseId, Integer h2id, Map<String, Object> epicrise) {
		final String sql = "INSERT INTO hol2.epicrise1 (epicrise_self, epicrise_id, history_id) VALUES (?, ?, ?)";
		jdbcTemplate.update( sql,
		new Object[] {new SqlLobValue(object2JsonString(epicrise), lobHandler), epicriseId, h2id },
		new int[] {Types.CLOB, Types.INTEGER, Types.INTEGER}
		);
	}
	public void updateEpicrise(Integer epicriseId, Map<String, Object> epicrise) {
		final String sql = "UPDATE hol2.epicrise1 SET epicrise_self = ? WHERE epicrise_id = ? ";
		jdbcTemplate.update( sql,
		new Object[] {new SqlLobValue(object2JsonString(epicrise), lobHandler), epicriseId },
		new int[] {Types.CLOB, Types.INTEGER}
		);
	}
	private String object2JsonString(Object historyHolDb) {
		StringWriter out = new StringWriter();
		ObjectMapper mapper = new ObjectMapper();
		ObjectWriter writerWithDefaultPrettyPrinter = mapper.writerWithDefaultPrettyPrinter();
		try {
			writerWithDefaultPrettyPrinter.writeValue(out, historyHolDb);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		final String string = out.toString();
		return string;
	}
	public Map<String, Object> getEpicriseId(Integer hid) {
//		String sql = "SELECT epicrise_hol1_hid FROM epicrise1 WHERE epicrise_hol1_hid = ?";
		String sql = "SELECT epicrise_id FROM hol2.epicrise1 e, hol2.history1 h WHERE h.history_id=epicrise_id and hol1_history_id = ?";
		List<Map<String, Object>> r = jdbcTemplate.queryForList(sql,hid);
		if(r.isEmpty())
			return null;
		return r.get(0);
	}
	public Map<String, Object> getEpicriseFromHistoryId(Integer hid) {
		String sql = "SELECT e.* FROM hol2.epicrise1 e, hol2.history1 h WHERE e.history_id=h.history_id AND h.hol1_history_id = ?";
		logger.debug(sql.replace("\\?", hid.toString()));
		List<Map<String, Object>> r = jdbcTemplate.queryForList(sql,hid);
		logger.debug(""+r.size());
		if(r.isEmpty()){
			//insert new epicrise and history
			// insert history
			final Integer history_epicrise_id = nextDbId();
			HistoryHolDb historyHolDb = new HistoryHolDb();
			historyHolDb.setTmpId(history_epicrise_id);
			historyHolDb.setHistoryId(hid);
			insertHistory(historyHolDb);
			// insert epicrise
			Map<String, Object> epicrise = new HashMap<String, Object>();
			epicrise.put("hid", hid);
			insertEpicrise(history_epicrise_id, history_epicrise_id, epicrise);
			r = jdbcTemplate.queryForList(sql,hid);
		}
		return r.get(0);
	}

}
