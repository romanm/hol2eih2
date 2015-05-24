package org.cuwy1.holDb.model;

import java.security.Principal;
import java.util.List;
import java.util.Map;

public class DepartmentHol {
	private List<Map<String, Object>> jornalMovePatient;
	private List<DepartmentHol> departmentsHol;
	private List<PatientDiagnosisHol> patientesDiagnosisHol;
	
	private int department_id, department_profile_id;
	private String department_name, zaviduvach;
	private boolean department_active;
	private Principal user;

	public String getZaviduvach() {
		return zaviduvach;
	}
	
	public void setZaviduvach(String zaviduvach) {
		this.zaviduvach = zaviduvach;
	}
	public List<Map<String, Object>> getJornalMovePatient() {
		return jornalMovePatient;
	}

	public void setJornalMovePatient(List<Map<String, Object>> jornalMovePatient) {
		this.jornalMovePatient = jornalMovePatient;
	}

	public DepartmentHol(int department_id, String department_name, boolean department_active, int department_profile_id, String zaviduvach) {
		this.department_id = department_id;
		this.department_name = department_name;
		this.department_active = department_active;
		this.department_profile_id = department_profile_id;
		this.zaviduvach = zaviduvach;
	}

	public DepartmentHol() {
	}

	public int getDepartment_id() {
		return department_id;
	}

	public void setDepartment_id(int department_id) {
		this.department_id = department_id;
	}

	public String getDepartment_name() {
		return department_name;
	}

	public void setDepartment_name(String department_name) {
		this.department_name = department_name;
	}

	public boolean isDepartment_active() {
		return department_active;
	}

	public void setDepartment_active(boolean department_active) {
		this.department_active = department_active;
	}

	public int getDepartment_profile_id() {
		return department_profile_id;
	}

	public void setDepartment_profile_id(int department_profile_id) {
		this.department_profile_id = department_profile_id;
	}

	public List<DepartmentHol> getDepartmentsHol() {
		return departmentsHol;
	}

	public void setDepartmentsHol(List<DepartmentHol> departmentsHol) {
		this.departmentsHol = departmentsHol;
	}

	public List<PatientDiagnosisHol> getPatientesDiagnosisHol() {
		return patientesDiagnosisHol;
	}

	public void setPatientesDiagnosisHol(List<PatientDiagnosisHol> patientesDiagnosisHol) {
		this.patientesDiagnosisHol = patientesDiagnosisHol;
	}
	public Principal getUser() {
		return user;
	}
	public void setUser(Principal userPrincipal) {
		this.user=userPrincipal;
	}
}
