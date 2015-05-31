package org.cuwy1.holDb.model;

import java.sql.Timestamp;

public class HistoryTreatmentAnalysis {
private String historyTreatmentAnalysisText, historyTreatmentAnalysisName;
private Timestamp historyTreatmentAnalysisDatetime;
private int historyTreatmentAnalysisId, treatmentAnalysisId;


public int getTreatmentAnalysisId() {
	return treatmentAnalysisId;
}

public void setTreatmentAnalysisId(int treatmentAnalysisId) {
	this.treatmentAnalysisId = treatmentAnalysisId;
}

public String getHistoryTreatmentAnalysisText() {
	return historyTreatmentAnalysisText;
}

public void setHistoryTreatmentAnalysisText(String historyTreatmentAnalysisText) {
	this.historyTreatmentAnalysisText = historyTreatmentAnalysisText;
}

public Timestamp getHistoryTreatmentAnalysisDatetime() {
	return historyTreatmentAnalysisDatetime;
}

public void setHistoryTreatmentAnalysisDatetime(
		Timestamp historyTreatmentAnalysisDatetime) {
	this.historyTreatmentAnalysisDatetime = historyTreatmentAnalysisDatetime;
}

public String getHistoryTreatmentAnalysisName() {
	return historyTreatmentAnalysisName;
}

public void setHistoryTreatmentAnalysisName(String historyTreatmentAnalysisName) {
	this.historyTreatmentAnalysisName = historyTreatmentAnalysisName;
}
public int getHistoryTreatmentAnalysisId() {
	return historyTreatmentAnalysisId;
}
public void setHistoryTreatmentAnalysisId(int historyTreatmentAnalysisId) {
	this.historyTreatmentAnalysisId = historyTreatmentAnalysisId;
	
}
}
