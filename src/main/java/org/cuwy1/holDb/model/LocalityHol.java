package org.cuwy1.holDb.model;

public class LocalityHol {
	private int regionId;
	private int localityId;
	private int localityType;
	private String localityName;

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
	public int getLocalityType() {
		return localityType;
	}
	public void setLocalityType(int localityType) {
		this.localityType = localityType;
	}
	public String getLocalityName() {
		return localityName;
	}
	public void setLocalityName(String localityName) {
		this.localityName = localityName;
	}

}
