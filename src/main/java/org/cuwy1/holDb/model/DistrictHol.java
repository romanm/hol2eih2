package org.cuwy1.holDb.model;

import java.util.List;

public class DistrictHol {
	private int countryId, districtId;
	private String districtName;
	private List <RegionHol> regionsHol;
	public String getDistrictName() {
		return districtName;
	}
	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}
	public int getDistrictId() {
		return districtId;
	}
	public void setDistrictId(int districtId) {
		this.districtId = districtId;
	}
	public int getCountryId() {
		return countryId;
	}
	public void setCountryId(int countryId) {
		this.countryId = countryId;
	}
	public List <RegionHol> getRegionsHol() {
		return regionsHol;
	}
	public void setRegionsHol(List <RegionHol> regionsHol) {
		this.regionsHol = regionsHol;
	}
}
