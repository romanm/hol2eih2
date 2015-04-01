package org.cuwy1.holDb.model;

import java.sql.Timestamp;

public class PatientDepartmentMovement {
	private int historyId, patientId, departmentId;
	private String departmentName;
	private String personalSurname;
	private String personalName;
	private String personalPatronymic;
	private Timestamp departmentHistoryIn;
	private Timestamp departmentHistoryOut;
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return String.format(
				"\n PatientDepartmentMovement: {"
				+ "historyId = '%s', patientId = '%s', departmentId = '%s', departmentName = '%s'"
				+ "\n, personalSurname = '%s', personalName = '%s', personalPatronymic = '%s', departmentHistoryIn = '%s'"
				+ ", departmentHistoryOut = '%s'"
				+ "}",
				historyId, patientId, departmentId, departmentName
				, personalSurname, personalName, personalPatronymic
				, departmentHistoryIn, departmentHistoryOut
				);
	}
	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public Timestamp getDepartmentHistoryIn() {
		return departmentHistoryIn;
	}

	public void setDepartmentHistoryIn(Timestamp departmentHistoryIn) {
		this.departmentHistoryIn = departmentHistoryIn;
	}

	public Timestamp getDepartmentHistoryOut() {
		return departmentHistoryOut;
	}

	public void setDepartmentHistoryOut(Timestamp departmentHistoryOut) {
		this.departmentHistoryOut = departmentHistoryOut;
	}

	public String getPersonalPatronymic() {
		return personalPatronymic;
	}

	public void setPersonalPatronymic(String personalPatronymic) {
		this.personalPatronymic = personalPatronymic;
	}

	public String getPersonalName() {
		return personalName;
	}

	public void setPersonalName(String personalName) {
		this.personalName = personalName;
	}

	public String getPersonalSurname() {
		return personalSurname;
	}

	public void setPersonalSurname(String personalSurname) {
		this.personalSurname = personalSurname;
	}

	public int getHistoryId() {
		return historyId;
	}

	public void setHistoryId(int historyId) {
		this.historyId = historyId;
	}

	public int getPatientId() {
		return patientId;
	}

	public void setPatientId(int patientId) {
		this.patientId = patientId;
	}

	public int getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(int departmentId) {
		this.departmentId = departmentId;
	}
}
