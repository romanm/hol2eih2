package org.cuwy1.holDb.model;

import java.sql.Timestamp;


public class PatientDiagnosisHol {
	private String name, icd_name, icd_code;
	private int patient_id;
	private int history_no;
	private int history_id;
	private short diagnos_id;
	private boolean collapsed = true;
	private boolean collapseMovePatient = true;
	private Timestamp history_in, history_out;
	public Timestamp getHistory_out() {
		return history_out;
	}

	public void setHistory_out(Timestamp history_out) {
		this.history_out = history_out;
	}

	private PatientHistory patientHistory;


	@Override
	public String toString() {
		return "PatientDiagnosisHol [name=" + name + "\n, icd_name=" + icd_name 
				+ ", icd_code=" + icd_code 
				+ "\n, patient_id=" + patient_id 
				+ ", history_no=" + getHistory_no() 
				+ ", history_no=" + getHistory_id() 
				+ ", diagnos_id=" + diagnos_id 
				+ ", collapsed=" + collapsed 
				+ ", history_in=" + history_in 
				+ "]";
	}
	
	public PatientDiagnosisHol(){
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIcd_name() {
		return icd_name;
	}

	public void setIcd_name(String icd_name) {
		this.icd_name = icd_name;
	}

	public String getIcd_code() {
		return icd_code;
	}

	public void setIcd_code(String icd_code) {
		this.icd_code = icd_code;
	}

	public int getPatient_id() {
		return patient_id;
	}

	public void setPatient_id(int patient_id) {
		this.patient_id = patient_id;
	}


	public Timestamp getHistory_in() {
		return history_in;
	}

	public void setHistory_in(Timestamp history_in) {
		this.history_in = history_in;
	}

	public int getDiagnos_id() {
		return diagnos_id;
	}

	public void setDiagnos_id(short diagnos_id) {
		this.diagnos_id = diagnos_id;
	}

	public boolean isCollapsed() {
		return collapsed;
	}

	public void setCollapsed(boolean collapsed) {
		this.collapsed = collapsed;
	}

	public int getHistory_no() {
		return history_no;
	}

	public void setHistory_no(int history_no) {
		this.history_no = history_no;
	}

	public PatientHistory getPatientHistory() {
		return patientHistory;
	}

	public void setPatientHistory(PatientHistory patientHistory) {
		this.patientHistory = patientHistory;
	}

	public int getHistory_id() {
		return history_id;
	}

	public void setHistory_id(int history_id) {
		this.history_id = history_id;
	}

	public boolean isCollapseMovePatient() {
		return collapseMovePatient;
	}

	public void setCollapseMovePatient(boolean collapseMovePatient) {
		this.collapseMovePatient = collapseMovePatient;
	}

}
