package org.cuwy1.holDb.model;

import java.util.ArrayList;

public class RegionHol {
	private int regionId;
	private int districtId;
	private String regionName;
	private ArrayList<LocalityHol> arrayList;
	public int getDistrictId() {
		return districtId;
	}

	public void setDistrictId(int destrictId) {
		this.districtId = destrictId;
	}

	public int getRegionId() {
		return regionId;
	}

	public void setRegionId(int regionId) {
		this.regionId = regionId;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public ArrayList<LocalityHol> getLocalitysHol() {
		return arrayList;
	}

	public void setLocalitysHol(ArrayList<LocalityHol> arrayList) {
		this.arrayList = arrayList;
	}
}
