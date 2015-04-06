package org.cuwy1.holDb.model;

import java.util.Date;
import java.util.List;

import org.cuwy1.holDb.model.PatientHolDb;

public class PatientHistory {

	public PatientHistory(){}
	private PatientHolDb patientHolDb;
	private int history_id;
	private int patientId;
	private boolean patient_gender;
	private boolean patient_rh;
	private boolean patient_bj;
	private boolean patient_sc;
	private boolean patient_tbc;
	private boolean patient_t;
	private boolean patient_hbs;
	private boolean patient_rw;
	private Date patient_rw_date;
	private Date patient_dob;
	private String patientName;
	private String patient_blood;
	private String patient_street;
	private String patient_house;
	private String patient_flat;
	private String patient_job;
	private List<PatientDepartmentMovement> patientDepartmentMovements;
	private List<HistoryTreatmentAnalysis> historyTreatmentAnalysises;
	private DiagnosIcd10 diagnosisOnAdmission;

	public boolean isPatient_gender() {
		return patient_gender;
	}
	public void setPatient_gender(boolean patient_gender) {
		this.patient_gender = patient_gender;
	}
	public Date getPatient_dob() {
		return patient_dob;
	}
	public void setPatient_dob(Date patient_dob) {
		this.patient_dob = patient_dob;
	}
	public String getPatient_blood() {
		return patient_blood;
	}
	public void setPatient_blood(String patient_blood) {
		this.patient_blood = patient_blood;
	}

	public boolean isPatient_rh() {
		return patient_rh;
	}

	public void setPatient_rh(boolean patient_rh) {
		this.patient_rh = patient_rh;
	}

	public String getPatient_street() {
		return patient_street;
	}

	public void setPatient_street(String patient_street) {
		this.patient_street = patient_street;
	}

	public String getPatient_house() {
		return patient_house;
	}

	public void setPatient_house(String patient_house) {
		this.patient_house = patient_house;
	}

	public String getPatient_flat() {
		return patient_flat;
	}

	public void setPatient_flat(String patient_flat) {
		this.patient_flat = patient_flat;
	}
	public String getPatient_job() {
		return patient_job;
	}
	public void setPatient_job(String patient_job) {
		this.patient_job = patient_job;
	}
	public boolean isPatient_bj() {
		return patient_bj;
	}
	public void setPatient_bj(boolean patient_bj) {
		this.patient_bj = patient_bj;
	}
	public boolean isPatient_sc() {
		return patient_sc;
	}
	public void setPatient_sc(boolean patient_sc) {
		this.patient_sc = patient_sc;
	}
	public boolean isPatient_tbc() {
		return patient_tbc;
	}
	public void setPatient_tbc(boolean patient_tbc) {
		this.patient_tbc = patient_tbc;
	}
	public Date getPatient_rw_date() {
		return patient_rw_date;
	}
	public void setPatient_rw_date(Date patient_rw_date) {
		this.patient_rw_date = patient_rw_date;
	}
	public boolean isPatient_rw() {
		return patient_rw;
	}
	public void setPatient_rw(boolean patient_rw) {
		this.patient_rw = patient_rw;
	}
	public boolean isPatient_hbs() {
		return patient_hbs;
	}
	public void setPatient_hbs(boolean patient_hbs) {
		this.patient_hbs = patient_hbs;
	}
	public boolean isPatient_t() {
		return patient_t;
	}
	public void setPatient_t(boolean patient_t) {
		this.patient_t = patient_t;
	}
	public List<PatientDepartmentMovement> getPatientDepartmentMovements() {
		return patientDepartmentMovements;
	}
	public void setPatientDepartmentMovements(
			List<PatientDepartmentMovement> patientDepartmentMovements) {
		this.patientDepartmentMovements = patientDepartmentMovements;
	}
	public int getHistory_id() {
		return history_id;
	}
	public void setHistory_id(int history_id) {
		this.history_id = history_id;
	}
	public List<HistoryTreatmentAnalysis> getHistoryTreatmentAnalysises() {
		return historyTreatmentAnalysises;
	}
	public void setHistoryTreatmentAnalysises(
			List<HistoryTreatmentAnalysis> historyTreatmentAnalysises) {
		this.historyTreatmentAnalysises = historyTreatmentAnalysises;
	}
	public DiagnosIcd10 getDiagnosisOnAdmission() {
		return diagnosisOnAdmission;
	}
	public void setDiagnosisOnAdmission(DiagnosIcd10 diagnosisOnAdmission) {
		this.diagnosisOnAdmission = diagnosisOnAdmission;
	}
	public int getPatientId() {
		return patientId;
	}
	public void setPatientId(int patientId) {
		this.patientId = patientId;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public PatientHolDb getPatientHolDb() {
		return patientHolDb;
	}
	public void setPatientHolDb(PatientHolDb patientHolDb) {
		this.patientHolDb = patientHolDb;
	}
}
