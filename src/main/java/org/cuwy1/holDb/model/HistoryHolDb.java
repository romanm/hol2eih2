package org.cuwy1.holDb.model;

import java.security.Principal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public class HistoryHolDb {
	private boolean epicrise2saved;
	
	public boolean isEpicrise2saved() {
		return epicrise2saved;
	}
	public void setEpicrise2saved(boolean epicrise2saved) {
		this.epicrise2saved = epicrise2saved;
	}
	private int requiredFieldFullProcent;
	private int historyId, historyNo, historyUrgent, patientId, directId, historyDepartmentIn,
	historyDepartmentId,
	historyAgeYear, historyAgeMonth, historyAgeDay ;
	private Timestamp historyIn;
	private PatientHolDb patientHolDb;
	private boolean perevid = false;
	private List<PatientDepartmentMovement> patientDepartmentMovements;
	private List<HistoryTreatmentAnalysis> historyTreatmentAnalysises;
	private DiagnosisOnAdmission diagnosisOnAdmission;
	private List<Map<String, Object>> operationHistorys;

	@Override
	public String toString() {
		return String.format(
				"\n HistoryHolDb {"
				+ "historyId = '%s', historyNo = '%s', historyUrgent = '%s'"
				+ "\n, patientId = '%s', directId = '%s', historyDepartmentIn = '%s'"
				+ "\n, historyAgeYear = '%s', historyAgeMonth = '%s', historyAgeDay = '%s'"
				+ "\n, patientHolDb = {%s}"
				+ ", diagnosisOnAdmission = {%s}"
				+ "}",
				historyId, historyNo, historyUrgent, patientId, directId, historyDepartmentIn,
				historyAgeYear, historyAgeMonth, historyAgeDay
				, patientHolDb, diagnosisOnAdmission
				);
	}
	public int getRequiredFieldFullProcent() {
		return requiredFieldFullProcent;
	}
	public void setRequiredFieldFullProcent(int requiredFieldFullProcent) {
		this.requiredFieldFullProcent = requiredFieldFullProcent;
	}
	public int getHistoryId() {
		return historyId;
	}

	public void setHistoryId(int historyId) {
		this.historyId = historyId;
	}

	public int getHistoryNo() {
		return historyNo;
	}

	public void setHistoryNo(int historyNo) {
		this.historyNo = historyNo;
	}

	public List<PatientDepartmentMovement> getPatientDepartmentMovements() {
		return patientDepartmentMovements;
	}

	public void setPatientDepartmentMovements(List<PatientDepartmentMovement> patientDepartmentMovements) {
		this.patientDepartmentMovements = patientDepartmentMovements;
	}

	public List<HistoryTreatmentAnalysis> getHistoryTreatmentAnalysises() {
		return historyTreatmentAnalysises;
	}

	public void setHistoryTreatmentAnalysises(List<HistoryTreatmentAnalysis> historyTreatmentAnalysises) {
		this.historyTreatmentAnalysises = historyTreatmentAnalysises;
	}

	public DiagnosisOnAdmission getDiagnosisOnAdmission() {
		return diagnosisOnAdmission;
	}

	public void setDiagnosisOnAdmission(DiagnosisOnAdmission diagnosisOnAdmission) {
		this.diagnosisOnAdmission = diagnosisOnAdmission;
	}

	public int getPatientId() {
		return patientId;
	}

	public void setPatientId(int patientId) {
		this.patientId = patientId;
	}

	public PatientHolDb getPatientHolDb() {
		return patientHolDb;
	}

	public void setPatientHolDb(PatientHolDb patientHolDb) {
		this.patientHolDb = patientHolDb;
	}

	public Timestamp getHistoryIn() {
		return historyIn;
	}

	public void setHistoryIn(Timestamp historyIn) {
		this.historyIn = historyIn;
	}

	public boolean isPerevid() {
		return perevid;
	}

	public void setPerevid(boolean perevid) {
		this.perevid = perevid;
	}

	public int getDirectId() {
		return directId;
	}

	public void setDirectId(int directId) {
		this.directId = directId;
	}

	public int getHistoryDepartmentIn() {
		return historyDepartmentIn;
	}

	public void setHistoryDepartmentIn(int historyDepartmentIn) {
		this.historyDepartmentIn = historyDepartmentIn;
	}

	public int getHistoryUrgent() {
		return historyUrgent;
	}

	public void setHistoryUrgent(int historyUrgent) {
		this.historyUrgent = historyUrgent;
	}

	public int getHistoryAgeYear() {
		return historyAgeYear;
	}

	public void setHistoryAgeYear(int historyAgeYear) {
		this.historyAgeYear = historyAgeYear;
	}

	public int getHistoryAgeMonth() {
		return historyAgeMonth;
	}

	public void setHistoryAgeMonth(int historyAgeMonth) {
		this.historyAgeMonth = historyAgeMonth;
	}

	public int getHistoryAgeDay() {
		return historyAgeDay;
	}

	public void setHistoryAgeDay(int historyAgeDay) {
		this.historyAgeDay = historyAgeDay;
	}
	public int getHistoryDepartmentId() {
		return historyDepartmentId;
	}
	public void setHistoryDepartmentId(int historyDepartmentId) {
		this.historyDepartmentId = historyDepartmentId;
	}
	public List<Map<String, Object>> getOperationHistorys() {
		return operationHistorys;
	}
	public void setOperationHistorys(List<Map<String, Object>> operationHistorys) {
		this.operationHistorys = operationHistorys;
	}
	Integer tmpId;
	private Principal user;
	public Principal getUser() {
		return user;
	}
	public void setTmpId(Integer tmpId) {
		this.tmpId = tmpId;
	}
	public Integer getTmpId() {
		return tmpId;
	}
	public void setUser(Principal user) {
		this.user = user;
	}
}
