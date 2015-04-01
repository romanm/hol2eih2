package org.cuwy1.holDb.model;

import java.util.List;

public class CountryHol {
	private int countryId;
	private String countryName;
	private List<DistrictHol> districtsHol;
	public CountryHol(){

	}
	public String getCountryName() {
		return countryName;
	}
	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}
	public int getCountryId() {
		return countryId;
	}
	public void setCountryId(int countryId) {
		this.countryId = countryId;
	}
	public List<DistrictHol> getDistrictsHol() {
		return districtsHol;
	}
	public void setDistrictsHol(List<DistrictHol> districtsHol) {
		this.districtsHol = districtsHol;
	}
}
