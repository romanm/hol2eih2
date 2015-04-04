package org.cuwy1.holDb.model;

public class DiagnosHol {
	private int diagnosId;
	private String diagnosName, diagnosNameShort;
	public DiagnosHol(int diagnosId, String diagnosName, String diagnosNameShort) {
		this.diagnosId = diagnosId; 
		this.diagnosName =diagnosName ;
		this.diagnosNameShort=diagnosNameShort;
	}
	@Override
	public String toString() {
		return String.format(
				"\n DiagnosHol: {"
						+ "diagnosId = '%s', diagnosName = '%s', diagnosNameShort = '%s'"
						+ "}",
						diagnosId, diagnosName, diagnosNameShort
				);
	}
	public int getDiagnosId() {
		return diagnosId;
	}
	public void setDiagnosId(int diagnosId) {
		this.diagnosId = diagnosId;
	}
	public String getDiagnosName() {
		return diagnosName;
	}
	public void setDiagnosName(String diagnosName) {
		this.diagnosName = diagnosName;
	}
	public String getDiagnosNameShort() {
		return diagnosNameShort;
	}
	public void setDiagnosNameShort(String diagnosNameShort) {
		this.diagnosNameShort = diagnosNameShort;
	}
}
