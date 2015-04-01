package org.cuwy1.holDb.model;

import java.util.List;

public class Operation {
	private int operationId;
	private int operationSubgroupId;
	private String operationCode;
	private String operationName;
	private boolean operationUrgent;
	private List<Operation> operationChilds;
	public boolean isOperationUrgent() {
		return operationUrgent;
	}
	public void setOperationUrgent(boolean operationUrgent) {
		this.operationUrgent = operationUrgent;
	}
	public String getOperationName() {
		return operationName;
	}
	public void setOperationName(String operationName) {
		this.operationName = operationName;
	}
	public String getOperationCode() {
		return operationCode;
	}
	public void setOperationCode(String operationCode) {
		this.operationCode = operationCode;
	}
	public int getOperationSubgroupId() {
		return operationSubgroupId;
	}
	public void setOperationSubgroupId(int operationSubgroupId) {
		this.operationSubgroupId = operationSubgroupId;
	}
	public int getOperationId() {
		return operationId;
	}
	public void setOperationId(int operationId) {
		this.operationId = operationId;
	}
	public List<Operation> getOperationChilds() {
		return operationChilds;
	}
	public void setOperationChilds(List<Operation> operationChilds) {
		this.operationChilds = operationChilds;
	}
}
