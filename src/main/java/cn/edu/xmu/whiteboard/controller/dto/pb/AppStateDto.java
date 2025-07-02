package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AppStateDto {
    private double gridSize;
    private double gridStep;
    private boolean gridModeEnabled;
    private String viewBackgroundColor;
    private Object lockedMultiSelections;

    public AppStateDto(){}

    @JsonProperty("gridSize")
    public double getGridSize() { return gridSize; }
    @JsonProperty("gridSize")
    public void setGridSize(double value) { this.gridSize = value; }

    @JsonProperty("gridStep")
    public double getGridStep() { return gridStep; }
    @JsonProperty("gridStep")
    public void setGridStep(double value) { this.gridStep = value; }

    @JsonProperty("gridModeEnabled")
    public boolean getGridModeEnabled() { return gridModeEnabled; }
    @JsonProperty("gridModeEnabled")
    public void setGridModeEnabled(boolean value) { this.gridModeEnabled = value; }

    @JsonProperty("viewBackgroundColor")
    public String getViewBackgroundColor() { return viewBackgroundColor; }
    @JsonProperty("viewBackgroundColor")
    public void setViewBackgroundColor(String value) { this.viewBackgroundColor = value; }

    @JsonProperty("lockedMultiSelections")
    public Object getLockedMultiSelections() { return lockedMultiSelections; }
    @JsonProperty("lockedMultiSelections")
    public void setLockedMultiSelections(Object value) { this.lockedMultiSelections = value; }
}
