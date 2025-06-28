package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProjectBoardDto {
    private ElementDto[] elements;
    private AppStateDto appState;
    private FileDto files;

    public ProjectBoardDto() {
        elements = null;
        appState=new AppStateDto();
        appState.setGridSize(20);
        appState.setGridStep(5);
        appState.setGridModeEnabled(false);
        appState.setViewBackgroundColor("#ffffff");
        appState.setLockedMultiSelections(null);
        files = null;
    }

    @JsonProperty("elements")
    public ElementDto[] getElements() { return elements; }
    @JsonProperty("elements")
    public void setElements(ElementDto[] value) { this.elements = value; }

    @JsonProperty("appState")
    public AppStateDto getAppState() { return appState; }
    @JsonProperty("appState")
    public void setAppState(AppStateDto value) { this.appState = value; }

    @JsonProperty("files")
    public FileDto getFiles() { return files; }
    @JsonProperty("files")
    public void setFiles(FileDto value) { this.files = value; }
}
