package org.cuwy1.holDb.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Icd10UaClass implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private boolean collapse ;
	private String icdCode, icdName;
	private List<Icd10UaClass> icd10Childs;
//	private Icd10UaClass parent;
	private Integer icdId=0, icdStart=0, icdEnd=Integer.MAX_VALUE
		, icdLeftKey=0, icdRightKey=Integer.MAX_VALUE;

	@Override
	public String toString() {
		return String.format(
				"Icd10UaClass{icd_id=%d, icd_start=%d, icd_end=%d, icd_code='%s', icd_name='%s', icd10Childs:['%s']}",
				getIcdId(), getIcdStart(), getIcdEnd(), icdCode, icdName, icd10Childs);
	}

	public Icd10UaClass() {
	}

	public long getIcdLeftKey() {
		return icdLeftKey;
	}

	public void setIcdLeftKey(Integer icdLeftKey) {
		this.icdLeftKey = icdLeftKey;
	}


	public long getIcdRightKey() {
		return icdRightKey;
	}


	public void setIcdRightKey(Integer icdRightKey) {
		this.icdRightKey = icdRightKey;
	}


	public long getIcdEnd() {
		return icdEnd;
	}


	public void setIcdEnd(Integer icdEnd) {
		this.icdEnd = icdEnd;
	}


	public long getIcdStart() {
		return icdStart;
	}


	public void setIcdStart(Integer icdStart) {
		this.icdStart = icdStart;
	}


	public long getIcdId() {
		return icdId;
	}


	public void setIcdId(Integer icdId) {
		this.icdId = icdId;
	}


	public String getIcdName() {
		return icdName;
	}


	public void setIcdName(String icdName) {
		this.icdName = icdName;
	}


	public String getIcdCode() {
		return icdCode;
	}


	public void setIcdCode(String icdCode) {
		this.icdCode = icdCode;
	}

	public void addChild(Icd10UaClass icd10UaClass) {
		if(null == icd10Childs)
			icd10Childs = new ArrayList<Icd10UaClass>();
		icd10Childs.add(icd10UaClass);
	}

	public List<Icd10UaClass> getIcd10Childs() {
		return icd10Childs;
	}

	public void setIcd10Childs(List<Icd10UaClass> icd10Childs) {
		this.icd10Childs = icd10Childs;
	}

	public boolean isCollapse() {
		return collapse;
	}

	public void setCollapse(boolean collapse) {
		this.collapse = collapse;
	}

}
