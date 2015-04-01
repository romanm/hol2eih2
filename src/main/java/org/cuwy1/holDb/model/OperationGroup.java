package org.cuwy1.holDb.model;

import java.util.List;

public class OperationGroup {
	private List<OperationSubGroup> operationSubGroupChilds ;
	private String operationGroupName;
	private Integer operationGroupId;
	private Integer operationGroupSort;
	public Integer getOperationGroupSort() {
		return operationGroupSort;
	}
	public void setOperationGroupSort(int operationGroupSort) {
		this.operationGroupSort = operationGroupSort;
	}
	public String getOperationGroupName() {
		return operationGroupName;
	}
	public void setOperationGroupName(String operationGroupName) {
		this.operationGroupName = operationGroupName;
	}
	public Integer getOperationGroupId() {
		return operationGroupId;
	}
	public void setOperationGroupId(int operationGroupId) {
		this.operationGroupId = operationGroupId;
	}
	public List<OperationSubGroup> getOperationSubGroupChilds() {
		return operationSubGroupChilds;
	}
	public void setOperationSubGroupChilds(List<OperationSubGroup> operationSubGroupChilds) {
		this.operationSubGroupChilds = operationSubGroupChilds;
	}
}
