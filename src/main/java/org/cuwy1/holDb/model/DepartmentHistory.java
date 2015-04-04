package org.cuwy1.holDb.model;

import java.sql.Timestamp;

public class DepartmentHistory {
	private int historyId, departmentId, departmentHistoryId
	, personalDepartmentIdIn, personalDepartmentIdOut
	, departmentHistoryBedDay
	, personalId;
	private Timestamp departmentHistoryIn, departmentHistoryOut;
	@Override
	public String toString() {
		return String.format(
				"\n DepartmentHistory: {"
						+ "historyId = '%s', departmentId = '%s', departmentHistoryId = '%s'"
						+ "\n, personalDepartmentIdIn = '%s', personalDepartmentIdOut = '%s'"
						+ "\n, departmentHistoryBedDay = '%s', departmentHistoryIn = '%s'"
						+ ", departmentHistoryOut = '%s'"
						+ ", personalId = '%s'"
						+ "}",
						historyId, departmentId, departmentHistoryId, personalDepartmentIdIn, personalDepartmentIdOut
						, departmentHistoryBedDay, departmentHistoryIn, departmentHistoryOut, personalId
				);
	}
	public int getPersonalId() {
		return personalId;
	}
	public void setPersonalId(int personalId) {
		this.personalId = personalId;
	}
	public int getHistoryId() {
		return historyId;
	}
	public void setHistoryId(int historyId) {
		this.historyId = historyId;
	}
	public int getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(int departmentId) {
		this.departmentId = departmentId;
	}
	public int getDepartmentHistoryId() {
		return departmentHistoryId;
	}
	public void setDepartmentHistoryId(int departmentHistoryId) {
		this.departmentHistoryId = departmentHistoryId;
	}
	public int getPersonalDepartmentIdIn() {
		return personalDepartmentIdIn;
	}
	public void setPersonalDepartmentIdIn(int personalDepartmentIdIn) {
		this.personalDepartmentIdIn = personalDepartmentIdIn;
	}
	public int getPersonalDepartmentIdOut() {
		return personalDepartmentIdOut;
	}
	public void setPersonalDepartmentIdOut(int personalDepartmentIdOut) {
		this.personalDepartmentIdOut = personalDepartmentIdOut;
	}
	public int getDepartmentHistoryBedDay() {
		return departmentHistoryBedDay;
	}
	public void setDepartmentHistoryBedDay(int departmentHistoryBedDay) {
		this.departmentHistoryBedDay = departmentHistoryBedDay;
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
	
}
