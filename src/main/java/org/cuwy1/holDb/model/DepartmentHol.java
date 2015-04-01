package org.cuwy1.holDb.model;

import java.security.Principal;
import java.util.List;

public class DepartmentHol {
	private List<DepartmentHol> departmentsHol;
	private List<PatientDiagnosisHol> patientesDiagnosisHol;
	
	private int department_id,department_profile_id;
	private String department_name;
	private boolean department_active;
	private Principal user;

	public DepartmentHol(int department_id, String department_name, boolean department_active, int department_profile_id) {
		this.department_id = department_id;
		this.department_name = department_name;
		this.department_active = department_active;
		this.department_profile_id = department_profile_id;
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
