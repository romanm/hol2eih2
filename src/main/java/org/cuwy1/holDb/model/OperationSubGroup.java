package org.cuwy1.holDb.model;

import java.util.List;

public class OperationSubGroup {
	private List<Operation> operationChilds;
	private Integer operationSubgroupId ;
	private Integer operationGroupId;
	private Integer operationSubgroupSort;
	private String operationSubgroupName;
	public Integer getOperationGroupId() {
		return operationGroupId;
	}
	public void setOperationGroupId(int operationGroupId) {
		this.operationGroupId = operationGroupId;
	}
	public Integer getOperationSubgroupSort() {
		return operationSubgroupSort;
	}
	public void setOperationSubgroupSort(int operationSubgroupSort) {
		this.operationSubgroupSort = operationSubgroupSort;
	}
	public Integer getOperationSubgroupId() {
		return operationSubgroupId;
	}
	public void setOperationSubgroupId(int operationSubgroupId) {
		this.operationSubgroupId = operationSubgroupId;
	}
	public String getOperationSubgroupName() {
		return operationSubgroupName;
	}
	public void setOperationSubgroupName(String operationSubgroupName) {
		this.operationSubgroupName = operationSubgroupName;
	}
	public List<Operation> getOperationChilds() {
		return operationChilds;
	}
	public void setOperationChilds(List<Operation> operationChilds) {
		this.operationChilds = operationChilds;
	}
}
