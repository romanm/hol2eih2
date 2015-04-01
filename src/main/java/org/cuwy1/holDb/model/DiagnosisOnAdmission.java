package org.cuwy1.holDb.model;

import java.sql.Timestamp;

public class DiagnosisOnAdmission {
	private String icdCode, icdName;
	private int historyId, diagnosId, icdStart, icdEnd, icdId, personalDepartmentId;
	private Timestamp historyDiagnosDate;
	
	@Override
	public String toString() {
		return String.format(
				"\n DiagnosisOnAdmission: {"
				+ "icdCode = '%s', icdName = '%s', diagnosId = '%s'"
				+ "\n, icdStart = '%s', icdEnd = '%s', icdId = '%s', personalDepartmentId = '%s'"
				+ ", historyDiagnosDate = '%s'"
				+ "}",
				icdCode, icdName, diagnosId, icdStart, icdEnd, icdId, personalDepartmentId
				, historyDiagnosDate
				);
	}
	
	public String getIcdCode() {
		return icdCode;
	}
	public void setIcdCode(String icdCode) {
		this.icdCode = icdCode;
	}
	public String getIcdName() {
		return icdName;
	}
	public void setIcdName(String icdName) {
		this.icdName = icdName;
	}
	public Timestamp getHistoryDiagnosDate() {
		return historyDiagnosDate;
	}
	public void setHistoryDiagnosDate(Timestamp historyDiagnosDate) {
		this.historyDiagnosDate = historyDiagnosDate;
	}
	public int getDiagnosId() {
		return diagnosId;
	}
	public void setDiagnosId(int diagnosId) {
		this.diagnosId = diagnosId;
	}
	
	public int getIcdId() {
		return icdId;
	}
	public void setIcdId(int icdId) {
		this.icdId = icdId;
	}
	public int getIcdEnd() {
		return icdEnd;
	}
	public void setIcdEnd(int icdEnd) {
		this.icdEnd = icdEnd;
	}
	public int getIcdStart() {
		return icdStart;
	}
	public void setIcdStart(int icdStart) {
		this.icdStart = icdStart;
	}
	public int getPersonalDepartmentId() {
		return personalDepartmentId;
	}
	public void setPersonalDepartmentId(int personalDepartmentId) {
		this.personalDepartmentId = personalDepartmentId;
	}

	public int getHistoryId() {
		return historyId;
	}

	public void setHistoryId(int historyId) {
		this.historyId = historyId;
	}

}
