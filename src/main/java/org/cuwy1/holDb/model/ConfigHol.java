package org.cuwy1.holDb.model;

import java.util.List;
import java.util.Map;

public class ConfigHol {
	private List<CountryHol> countries;
	private List<DepartmentHol> departments;
	private Map<Integer, Integer> departmentsIdPosition;
	private List<DiagnosHol> diagnosesHol;
	private List<Map<String, Object>> directs, treatmentAnalysis, firstNames;
	private List<Map<String, Object>> complicationListe;
	private List<Map<String, Object>> operationResultListe;

	public List<DiagnosHol> getDiagnosesHol() {
		return diagnosesHol;
	}

	public void setDiagnosesHol(List<DiagnosHol> diagnosesHol) {
		this.diagnosesHol = diagnosesHol;
	}

	public Map<Integer, Integer> getDepartmentsIdPosition() {
		return departmentsIdPosition;
	}

	public void setDepartmentsIdPosition(
			Map<Integer, Integer> departmentsIdPosition) {
		this.departmentsIdPosition = departmentsIdPosition;
	}

	public List<Map<String, Object>> getComplicationListe() {
		return complicationListe;
	}

	public List<Map<String, Object>> getFirstNames() {
		return firstNames;
	}

	public void setFirstNames(List<Map<String, Object>> firstNames) {
		this.firstNames = firstNames;
	}

	public List<CountryHol> getCountries() {
		return countries;
	}

	public void setCountries(List<CountryHol> countries) {
		this.countries = countries;
	}

	public List<DepartmentHol> getDepartments() {
		return departments;
	}

	public void setDepartments(List<DepartmentHol> departments) {
		this.departments = departments;
	}

	public List<Map<String, Object>> getDirects() {
		return directs;
	}

	public void setDirects(List<Map<String, Object>> directs) {
		this.directs = directs;
	}

	public List<Map<String, Object>> getTreatmentAnalysis() {
		return treatmentAnalysis;
	}

	public void setTreatmentAnalysis(List<Map<String, Object>> treatmentAnalysis) {
		this.treatmentAnalysis = treatmentAnalysis;
	}

	public void setComplicationListe(List<Map<String, Object>> complicationListe) {
		this.complicationListe = complicationListe;
	}

	public void setOperationResultListe(
			List<Map<String, Object>> operationResultListe) {
		this.operationResultListe = operationResultListe;
	}

	public List<Map<String, Object>> getOperationResultListe() {
		return operationResultListe;
	}

}
