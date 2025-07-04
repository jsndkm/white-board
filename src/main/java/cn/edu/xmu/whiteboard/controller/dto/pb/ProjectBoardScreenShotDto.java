package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProjectBoardScreenShotDto {
    private ElementDto[] elements;
    private AppStateDto appState;
    private FileDto files;
    private String image;

    public ProjectBoardScreenShotDto() {
        elements = null;
        appState=new AppStateDto();
        appState.setGridSize(20);
        appState.setGridStep(5);
        appState.setGridModeEnabled(false);
        appState.setViewBackgroundColor("#ffffff");
        appState.setLockedMultiSelections(null);
        files = null;
        image=null;
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

    @JsonProperty("image")
    public String getImage() { return image; }
    @JsonProperty("image")
    public void setImage(String value) { this.image = value; }
}
