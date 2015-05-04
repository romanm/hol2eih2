package hol2eih1;	

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.cuwy1.holDb.model.ConfigHol;
import org.cuwy1.holDb.model.CountryHol;
import org.cuwy1.holDb.model.DepartmentHistory;
import org.cuwy1.holDb.model.DepartmentHol;
import org.cuwy1.holDb.model.DiagnosHol;
import org.cuwy1.holDb.model.DiagnosIcd10;
import org.cuwy1.holDb.model.HistoryHolDb;
import org.cuwy1.holDb.model.HistoryTreatmentAnalysis;
import org.cuwy1.holDb.model.Icd10UaClass;
import org.cuwy1.holDb.model.PatientDepartmentMovement;
import org.cuwy1.holDb.model.PatientDiagnosisHol;
import org.cuwy1.holDb.model.PatientHolDb;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

@Controller
public class Hol2Eih1Rest {

	private static final Logger logger = LoggerFactory.getLogger(Hol2Eih1Rest.class);
	@Autowired private CuwyDbService1 cuwyDbService1;
	@Autowired private Hol2Service hol2Service;

	@ExceptionHandler(value = Hol2Exception.class)
	public String heightError(Hol2Exception ex) {
		return "error";
	}

	@RequestMapping(value="/", method=RequestMethod.GET)
	public String home(@RequestParam Map<String,String> allRequestParams, Principal userPrincipal) {
		logger.info("\n Start /");
		logger.debug(""+allRequestParams);
		logger.debug(""+userPrincipal);
		if(null != userPrincipal){
		}
		return "redirect";
	}
	
	@RequestMapping(value = "/seekIcd10Tree/{query}", method = RequestMethod.GET)
	public @ResponseBody Icd10UaClass seekIcd10Tree(@PathVariable String query) {
		logger.warn(" /seekIcd10Db/{query} query = "+query);
		Icd10UaClass icd10UaGroups = cuwyDbService1.seekIcd10UaGroups(query);
		return icd10UaGroups;
	}

	@RequestMapping(value = "/db/movePatientDepartment", method = RequestMethod.POST)
	public  @ResponseBody DepartmentHistory movePatientDepartment(@RequestBody DepartmentHistory departmentHistory, Principal userPrincipal) {
		logger.debug("/db/movePatientDepartment = " );
		cuwyDbService1.insertDepartmentHistory(departmentHistory);
		logger.debug("/db/movePatientDepartment ---------------------- END " );
		return departmentHistory;
	}

	@RequestMapping(value = "/db/movePatientDepartment2", method = RequestMethod.POST)
	public  @ResponseBody Map<String, Object> movePatientDepartment2(@RequestBody Map<String, Object> patientHistory, Principal userPrincipal) {
		logger.debug(""+patientHistory);
		final Object movePatientDepartment = patientHistory.get("movePatientDepartment");
		logger.debug(""+movePatientDepartment);
		DepartmentHistory departmentHistory = new DepartmentHistory();
		departmentHistory.setDepartmentHistoryId(0);
		cuwyDbService1.insertDepartmentHistory(departmentHistory);
		return patientHistory;
	}

	//	@RequestMapping(value = "/save/epicrise", method = RequestMethod.POST)
//	@RequestMapping(value = "/db/saveepicrise", method = RequestMethod.GET)
	
	@RequestMapping(value = "/db/saveepicrise", method = RequestMethod.POST)
	public  @ResponseBody Map<String, Object> saveEpicrise(@RequestBody Map<String, Object> epicrise, Principal userPrincipal) {
		logger.info("\n Start /db/saveepicrise");
		logger.debug(""+userPrincipal);
		if(null == userPrincipal)
			return null;
		System.out.println("-------------------------------");
		epicrise.put("server", "add from server");
		epicrise = cuwyDbService1.saveEpicrise(epicrise);
		epicrise = hol2Service.saveEpicrise(epicrise);
		System.out.println("-------------------------------");
		return epicrise;
	}
	
	@RequestMapping(value = "/hol/quartalReport_{departmentId}", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> quartalReport(@PathVariable Integer departmentId
			, Principal userPrincipal, HttpSession session) throws IOException {
		final HashMap<String, Object> map = new HashMap<String, Object>();
		DepartmentHol departmentHol = cuwyDbService1.getDepartmentsHol(departmentId);
		departmentHol.setUser(userPrincipal);
		map.put("department", departmentHol);
//		final List<Map<String, Object>> dsMistoSelo = cuwyDbService1.dsMistoSelo2(departmentId);
		final List<Map<String, Object>> dsMistoSelo = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlMistoSelo_cDs_group);
		map.put("dsMistoSelo", dsMistoSelo);
//		final List<Map<String, Object>> dsNapravlenya = cuwyDbService1.dsNapravlenya(departmentId);
//		map.put("dsNapravlenya", dsNapravlenya);
//		final List<Map<String, Object>> dsReferral = cuwyDbService1.dsReferral(departmentId);
		final List<Map<String, Object>> dsReferral = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlReferral_cDs_group);
		map.put("dsReferral", dsReferral);
		final List<Map<String, Object>> adReferral = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlReferral_pAd);
		map.put("adReferral", adReferral);
		final List<Map<String, Object>> dsDeadOrvipisany = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlDeadOrvipisany_cDs_group);
		map.put("dsDeadOrvipisany", dsDeadOrvipisany);
		final List<Map<String, Object>> adDeadOrvipisany = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlDeadOrvipisany_pAd);
		map.put("adDeadOrvipisany", adDeadOrvipisany);
		final List<Map<String, Object>> dsPerevedeni = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlPerevedeni2hol_cDs_group);
		map.put("dsPerevedeni", dsPerevedeni);
		final List<Map<String, Object>> adPerevedeni = cuwyDbService1.queryForList(departmentId, CuwyDbService1.sqlPerevedeni2hol_pAd);
		map.put("adPerevedeni", adPerevedeni);
		return map;
	}
	@RequestMapping(value = "/hol/jornalMovePatient_{departmentId}", method = RequestMethod.GET)
	public @ResponseBody DepartmentHol jornalMovePatient(@PathVariable Integer departmentId
			, Principal userPrincipal, HttpSession session) throws IOException {
		logger.info("\n Start /hol/department_"+departmentId);
		logger.info("\n Start /hol/department_"+session);
		DepartmentHol departmentHol = cuwyDbService1.getDepartmentsHol(departmentId);
		final List<Map<String, Object>> jornalMovePatient = cuwyDbService1.jornalMovePatient(departmentId);
		departmentHol.setJornalMovePatient(jornalMovePatient);
		departmentHol.setUser(userPrincipal);
		return departmentHol;
	}
	
	@RequestMapping(value = "/hol/department_{departmentId}", method = RequestMethod.GET)
	public @ResponseBody DepartmentHol getHolDepartment(@PathVariable Integer departmentId, Principal userPrincipal, HttpSession session) throws IOException {
		logger.info("\n Start /hol/department_"+departmentId);
		logger.info("\n Start /hol/department_"+session);
		DepartmentHol departmentHol = cuwyDbService1.getDepartmentsHol(departmentId);
		logger.debug(""+userPrincipal);
		if(null == userPrincipal){
			setLoginRedirectValue(session, "department", departmentId);
			return departmentHol;
		}
		departmentHol.setUser(userPrincipal);

		List<PatientDiagnosisHol> departmentsHolPatientsDiagnose
		= cuwyDbService1.getDepartmentsHolPatientsDiagnose(departmentId);
		System.out.println(departmentsHolPatientsDiagnose);
		departmentHol.setPatientesDiagnosisHol(departmentsHolPatientsDiagnose);
		return departmentHol;
	}
	@RequestMapping(value = "/db/epicrise_id_{historyId}", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> getHol2PatientHistoryById(@PathVariable Integer historyId, Principal userPrincipal, HttpSession session) throws IOException {
		logger.info("\n Start /db/epicrise_id_"+historyId);
		if(null == userPrincipal){
			setLoginRedirectValue(session, "epicrise", historyId);
			return null;
		}
		Map<String, Object> epicrise = hol2Service.readEpicrise(historyId);
		logger.debug(""+epicrise.size());
		final Map patientHistory = (Map) epicrise.get("patientHistory");
		System.out.println(patientHistory.keySet());
		logger.debug(""+patientHistory.get("user"));
		patientHistory.put("user", userPrincipal);
		return epicrise;
	}
	private void setLoginRedirectValue(HttpSession session, final String htmlPage,
			Integer historyId) {
		session.setAttribute("htmlPage", htmlPage);
		session.setAttribute("hno", historyId);
	}
	
	@RequestMapping(value = "/db/saveoperation", method = RequestMethod.POST)
	public  @ResponseBody Map<String, Object> saveOperation(@RequestBody Map<String, Object> historyHolDb, Principal userPrincipal) {
		logger.info("\n Start /db/saveoperation"+historyHolDb.keySet());
		final List<Map<String, Object>> operationHistorys = (List<Map<String, Object>>) historyHolDb.get("operationHistorys");
		logger.info("operationHistorys = "+operationHistorys);
		for (Map<String, Object> map : operationHistorys) {
			logger.debug(""+map);
			if(null != map){
				Integer operationHistoryId = (Integer) map.get("operation_history_id");
				logger.debug(""+operationHistoryId);
				if(null == operationHistoryId){
					cuwyDbService1.insertOperationHistory(map);
				}else{
					cuwyDbService1.updateOperationHistory(map);
				}
			}
		}
		return historyHolDb;
	}

	@RequestMapping(value = "/db/savehistory", method = RequestMethod.POST)
	public  @ResponseBody Map<String, Object> saveHistory(@RequestBody Map<String, Object> historyHolDb, Principal userPrincipal) {
		logger.info("\n Start /db/savehistory"+historyHolDb.keySet());
		final List<Map<String, Object>> diagnosis = (List<Map<String, Object>>) historyHolDb.get("diagnosis");
		logger.info(" diagnosis "+diagnosis);
		for (Map<String, Object> map : diagnosis) {
			logger.debug(""+map);
			if(null != map){
				map.put("userPersonalId", historyHolDb.get("userPersonalId"));
				map.put("historyId", historyHolDb.get("historyId"));
				Integer historyDiagnosId = (Integer) map.get("historyDiagnosId");
				logger.debug(""+historyDiagnosId);
				if(null == historyDiagnosId){
					cuwyDbService1.insertHistoryDiagnosis(map);
				}else{
					Integer diagnosId = (Integer) map.get("diagnosId");
					if(diagnosId >2 || diagnosId<5) {
						cuwyDbService1.updateHistoryDiagnosis(map);
					}
				}
			}
		}
		logger.info(" diagnosis ");
		return historyHolDb;
	}
	
	@RequestMapping(value = "/db/history_id_{historyId}", method = RequestMethod.GET)
	public @ResponseBody HistoryHolDb getHolPatientHistoryById(@PathVariable Integer historyId, Principal userPrincipal, HttpSession session) throws IOException {
		logger.info("\n Start /db/history_id_"+historyId);
		session.setAttribute("hno", historyId);
		logger.debug(""+historyId);
		HistoryHolDb historyHolDb = cuwyDbService1.getHistoryHolDbById(historyId);
		PatientHolDb patientHolDb = cuwyDbService1.getPatientHolDb(historyHolDb.getPatientId());
		historyHolDb.setPatientHolDb(patientHolDb);
		logger.debug(""+historyHolDb);
		logger.debug(""+session);
		logger.debug(""+userPrincipal);
		showUser((UsernamePasswordAuthenticationToken) userPrincipal);
		if(null == userPrincipal){
			setLoginRedirectValue(session, "history", historyId);
		}else{
			addShortPatientHistory(historyHolDb);
			logger.debug(""+historyHolDb);
			historyHolDb.setUser(userPrincipal);
			getOperation(historyHolDb);
		}
		return historyHolDb;
	}

	private void getOperation(HistoryHolDb shortPatientHistory) {
		List<Map<String, Object>> operationHistorys = cuwyDbService1.getOperationHistorys(shortPatientHistory);
		shortPatientHistory.setOperationHistorys(operationHistorys);
	}

	private void addShortPatientHistory(HistoryHolDb historyHolDb) {
		System.out.println("---------addShortPatientHistory-----------");
		int historyId = historyHolDb.getHistoryId();
		List<PatientDepartmentMovement> patientDepartmentMovements
		= cuwyDbService1.getPatientDepartmentMovements(historyId);
		logger.debug(""+patientDepartmentMovements);
		historyHolDb.setPatientDepartmentMovements(patientDepartmentMovements);
		List<HistoryTreatmentAnalysis> historyTreatmentAnalysises
		= cuwyDbService1.getHistoryTreatmentAnalysises(historyId);
		logger.debug(""+historyTreatmentAnalysises);
		historyHolDb.setHistoryTreatmentAnalysises(historyTreatmentAnalysises);
		if(historyTreatmentAnalysises.size() == 0) {
			final Map<String, Object> epicrise2 = hol2Service.readEpicriseId(historyId);
			logger.debug("epicrise2 = "+epicrise2);
			historyHolDb.setEpicrise2saved(epicrise2 != null);
			if(epicrise2 == null){
//				Map<String, Object> epicrise = hol2Service.readEpicrise(historyId);
			}
		}
		final List<DiagnosIcd10> diagnosis = cuwyDbService1.getDiagnosis(historyId);
		historyHolDb.setDiagnosis(diagnosis);
		
//		DiagnosisOnAdmission diagnosisOnAdmission
//		= cuwyDbService1.getDiagnosisOnAdmission(historyId);
//		historyHolDb.setDiagnosisOnAdmission(diagnosisOnAdmission);
		logger.debug(""+historyHolDb);
	}
	@RequestMapping("/user")
	public  @ResponseBody  UsernamePasswordAuthenticationToken user(Principal userPrincipal) {
		final UsernamePasswordAuthenticationToken user = (UsernamePasswordAuthenticationToken) userPrincipal;
		System.out.println("------------");
		System.out.println(user);
		System.out.println("------------");
		showUser(user);
		return user;
	}

	private void showUser(UsernamePasswordAuthenticationToken user) {
		if(null != user){
			final SecurityContext context = SecurityContextHolder.getContext();
			System.out.println(context);
			final Authentication authentication = context.getAuthentication();
			System.out.println(authentication);
			final User principal = (User) authentication.getPrincipal();
			System.out.println(principal);
			final Collection<GrantedAuthority> authorities = principal.getAuthorities();
			System.out.println(authorities);
			for (GrantedAuthority grantedAuthority : authorities) {
				System.out.println(grantedAuthority);
			}
		}
	}

	//-----read json object-----------------------------------------------------
	@RequestMapping(value="/hol/anesthetists", method=RequestMethod.GET)
	public @ResponseBody List<Map<String, Object>> json_anesthetists_liste() {
		logger.info("\n Start /hol/anesthetists");
		final List<Map<String, Object>> anesthetistListe = cuwyDbService1.getAnesthetistListe();
		return anesthetistListe;
	}
	@RequestMapping(value="/hol/surgerys", method=RequestMethod.GET)
	public @ResponseBody List<Map<String, Object>> json_surgerys_liste() {
		logger.info("\n Start /hol/surgerys");
		final List<Map<String, Object>> surgeryListe = cuwyDbService1.getSurgeryListe();
		return surgeryListe;
	}
	@RequestMapping(value="/hol/operation-complication", method=RequestMethod.GET)
	public @ResponseBody List<Map<String, Object>> json_complication_liste() {
		logger.info("\n Start /hol/operation-complication");
		final List<Map<String, Object>> complicationListe = cuwyDbService1.getComplicationListe();
		return complicationListe;
	}
	//-----read json object--------------------------------------------------END
	//-----build json db files--------------------------------------------------

	@RequestMapping(value = "/config/create_file", method = RequestMethod.GET)
	public @ResponseBody ConfigHol createConfigFile() {
		ConfigHol configHol = new ConfigHol();
		final List<CountryHol> readCountries = cuwyDbService1.readCountries();
		final List<DepartmentHol> departmentsHol = cuwyDbService1.getDepartmentsHol();
		final List<Map<String, Object>> directsHol = cuwyDbService1.getDirectsHol();
		final List<Map<String, Object>> treatmentAnalysis = cuwyDbService1.getTreatmentAnalysis();
		final List<Map<String, Object>> firstNames = cuwyDbService1.getFirstNames();
		final List<DiagnosHol> diagnosesHol = cuwyDbService1.getDiagnosesHol();
		final List<Map<String, Object>> complicationListe = cuwyDbService1.getComplicationListe();
		final List<Map<String, Object>> operationResultListe = cuwyDbService1.getOperationResultListe();
		configHol.setCountries(readCountries);
		configHol.setDepartments(departmentsHol);
		configHol.setDirects(directsHol);
		configHol.setTreatmentAnalysis(treatmentAnalysis);
		configHol.setFirstNames(firstNames);
		configHol.setDiagnosesHol(diagnosesHol);
		configHol.setComplicationListe(complicationListe);
		configHol.setOperationResultListe(operationResultListe);
//		writeToJsonDbFile(readCountries, addressesJsonFileName);
		writeToPrettyJsDbFile("var configHol = ", configHol, AppConfig.configJsFileName);
		return configHol;
	}
	private void writeToPrettyJsDbFile(String variable, Object objectForJson, String fileName) {
		File file = new File(AppConfig.applicationFolderPfad + AppConfig.innerDbFolderPfad + fileName);
		ObjectMapper mapper = new ObjectMapper();
		ObjectWriter writerWithDefaultPrettyPrinter = mapper.writerWithDefaultPrettyPrinter();
		try {
			FileOutputStream fileOutputStream = new FileOutputStream(file);
//			writerWithDefaultPrettyPrinter.writeValueAsBytes(variable.getBytes());
			writerWithDefaultPrettyPrinter.writeValue(fileOutputStream, objectForJson);
		} catch ( IOException e) {
			e.printStackTrace();
		}
	}
	//-----build json db files-----------------------------------------------END
	
}
