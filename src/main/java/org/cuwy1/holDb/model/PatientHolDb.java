package org.cuwy1.holDb.model;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

public class PatientHolDb {
	@Override
	public String toString() {
		return String.format(
				"PatientHolDb {patientId = %d"
				+ ", patientSurname = '%s', patientPersonalName = '%s', patientPatronymic = '%s'"
				+ "\n"
				+ ", patientGender = %d, patientDob = '%s'"
				+ ", countryId = %d, districtId = '%d', regionId = %d, localityId = '%d'"
				+ "\n"
				+ ", patientStreet = '%s', patientHouse = '%s', patientJob = '%s'"
				+ ", patientPhoneHome = '%s' , patientPhoneMobil = '%s' , patientFlat = '%s'"
				+ "\n"
				+ ", patientBlood = '%s' , patientBj = '%s' "
				+ "}",
				patientId, patientSurname, patientPersonalName, patientPatronymic
				, patientGender, patientDob
				, countryId, districtId, regionId, localityId
				, patientStreet, patientHouse, patientJob
				, patientPhoneHome , patientPhoneMobil , patientFlat
				, patientBlood, patientBj
				);
	}
	public PatientHolDb(){}
	private int patientId;
	private String patientSurname;
	private String patientPersonalName;
	private String patientPatronymic;
	private int patientGender;
	private Timestamp patientDob;
	private int countryId;
	private int districtId;
	private int regionId;
	private int localityId;
	private String patientStreet;
	private String patientHouse;
	private String patientJob;

	private String patientPhoneHome;
	private String patientPhoneMobil;
	private String patientBlood;
	private boolean patientRh;
	private int patientRh2;
	private String patientFlat;
	private String patientBj;
	private int patientSc;
	private int patientTbc;
	private int patientHbs;
	private int patientT;
	private int patientHiv;
	private int patientRw;
	private Date patientRwDate;

	public int getPatientId() {
		return patientId;
	}

	public void setPatientId(int patientId) {
		this.patientId = patientId;
	}

	public String getPatientSurname() {
		return patientSurname;
	}

	public void setPatientSurname(String patientSurname) {
		this.patientSurname = patientSurname;
	}

	public String getPatientPersonalName() {
		return patientPersonalName;
	}

	public void setPatientPersonalName(String patientPersonalName) {
		this.patientPersonalName = patientPersonalName;
	}

	public String getPatientPatronymic() {
		return patientPatronymic;
	}

	public void setPatientPatronymic(String patientPatronymic) {
		this.patientPatronymic = patientPatronymic;
	}

	public String getPatientStreet() {
		return patientStreet;
	}

	public void setPatientStreet(String patientStreet) {
		this.patientStreet = patientStreet;
	}

	public String getPatientFlat() {
		return patientFlat;
	}

	public void setPatientFlat(String patientFlat) {
		this.patientFlat = patientFlat;
	}

	public String getPatientJob() {
		return patientJob;
	}

	public void setPatientJob(String patientJob) {
		this.patientJob = patientJob;
	}

	public String getPatientPhoneMobil() {
		return patientPhoneMobil;
	}

	public void setPatientPhoneMobil(String patientPhoneMobil) {
		this.patientPhoneMobil = patientPhoneMobil;
	}

	public String getPatientPhoneHome() {
		return patientPhoneHome;
	}

	public void setPatientPhoneHome(String patientPhoneHome) {
		this.patientPhoneHome = patientPhoneHome;
	}

	public String getPatientHouse() {
		return patientHouse;
	}

	public void setPatientHouse(String patientHouse) {
		this.patientHouse = patientHouse;
	}

	public String getPatientBlood() {
		return patientBlood;
	}

	public void setPatientBlood(String patientBlood) {
		this.patientBlood = patientBlood;
	}

	public boolean isPatientRh() {
		return patientRh;
	}
	public boolean getPatientRh() {
		return patientRh;
	}

	public void setPatientRh(boolean patientRh) {
		this.patientRh = patientRh;
	}

	public int getPatientRh2() {
		return patientRh2;
	}

	public void setPatientRh2FromBoolean(boolean patientRh2) {
		this.patientRh2 = patientRh2?1:0;
	}
	public void setPatientRh2(int patientRh2) {
		this.patientRh2 = patientRh2;
	}

	public int getPatientSc() {
		return patientSc;
	}

	public void setPatientSc(int patientSc) {
		this.patientSc = patientSc;
	}

	public int getPatientTbc() {
		return patientTbc;
	}

	public void setPatientTbc(int patientTbc) {
		this.patientTbc = patientTbc;
	}

	public int getPatientT() {
		return patientT;
	}

	public void setPatientT(int patientT) {
		this.patientT = patientT;
	}

	public int getPatientRw() {
		return patientRw;
	}

	public void setPatientRwFromBoolean(boolean patientRw) {
		this.patientRw = patientRw?1:0;
	}
	public void setPatientRw(int patientRw) {
		this.patientRw = patientRw;
	}

	public int getPatientHiv() {
		return patientHiv;
	}

	public void setPatientHivFromBoolean(boolean patientHiv) {
		this.patientHiv = patientHiv?1:0;
	}
	public void setPatientHiv(int patientHiv) {
		this.patientHiv = patientHiv;
	}

	public int getPatientHbs() {
		return patientHbs;
	}

	public void setPatientHbsFromBoolean(boolean patientHbs) {
		this.patientHbs = patientHbs?1:0;
	}
	public void setPatientHbs(int patientHbs) {
		this.patientHbs = patientHbs;
	}

	public Date getPatientRwDate() {
		return patientRwDate;
	}

	public void setPatientRwDate(Date patientRwDate) {
		this.patientRwDate = patientRwDate;
	}

	public int getPatientGender() {
		return patientGender;
	}

	public void setPatientGender(int patientGender) {
		this.patientGender = patientGender;
	}

	public String getPatientBj() {
		return patientBj;
	}

	public void setPatientBj(String patientBj) {
		this.patientBj = patientBj;
	}

	public int patientDay() {
		Calendar patientDobCalendar = patientDobCalendar();
		Calendar now = Calendar.getInstance();
		int res = now.get(Calendar.DAY_OF_MONTH) - patientDobCalendar.get(Calendar.DAY_OF_MONTH);
		return res;
	}
	public int patientMonth() {
		Calendar patientDobCalendar = patientDobCalendar();
		Calendar now = Calendar.getInstance();
		int res = now.get(Calendar.MONTH) - patientDobCalendar.get(Calendar.MONTH);
		if (patientDobCalendar.get(Calendar.MONTH) == now.get(Calendar.MONTH)
			&& patientDobCalendar.get(Calendar.DAY_OF_MONTH) > now.get(Calendar.DAY_OF_MONTH)
		) {
			res--;
		}
		return res;
	}
	public int patientAge() {
		Calendar patientDobCalendar = patientDobCalendar();
		Calendar now = Calendar.getInstance();
		int res = now.get(Calendar.YEAR) - patientDobCalendar.get(Calendar.YEAR);
		if ((patientDobCalendar.get(Calendar.MONTH) > now.get(Calendar.MONTH))
				|| (patientDobCalendar.get(Calendar.MONTH) == now.get(Calendar.MONTH)
				&& patientDobCalendar.get(Calendar.DAY_OF_MONTH) > now.get(Calendar.DAY_OF_MONTH))) {
			res--;
		}
		return res;
	}
	public Calendar patientDobCalendar() {
		Calendar dobCalendar = Calendar.getInstance();
		dobCalendar.setTime(patientDob);
		return dobCalendar;
	}
	public Timestamp getPatientDob() {
		return patientDob;
	}

	public void setPatientDob(Timestamp patientDob) {
		this.patientDob = patientDob;
	}
	public int getCountryId() {
		return countryId;
	}
	public void setCountryId(int countryId) {
		this.countryId = countryId;
	}
	public int getDistrictId() {
		return districtId;
	}
	public void setDistrictId(int districtId) {
		this.districtId = districtId;
	}
	public int getRegionId() {
		return regionId;
	}
	public void setRegionId(int regionId) {
		this.regionId = regionId;
	}
	public int getLocalityId() {
		return localityId;
	}
	public void setLocalityId(int localityId) {
		this.localityId = localityId;
	}
}
