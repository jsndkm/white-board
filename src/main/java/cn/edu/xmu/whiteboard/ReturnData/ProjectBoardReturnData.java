package cn.edu.xmu.whiteboard.ReturnData;

import cn.edu.xmu.whiteboard.controller.dto.pb.AppStateDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.FileDto;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class ProjectBoardReturnData {
    private ArrayList<Object> elements=new ArrayList<>();
    private AppStateDto appState;
    private FileDto files;

    public ProjectBoardReturnData() {}

    @JsonProperty("elements")
    public ArrayList<Object> getElements() { return elements; }
    @JsonProperty("elements")
    public void setElements(ArrayList<Object> value) { this.elements=value; }

    @JsonProperty("appState")
    public AppStateDto getAppState() { return appState; }
    @JsonProperty("appState")
    public void setAppState(AppStateDto value) { this.appState = value; }

    @JsonProperty("files")
    public FileDto getFiles() { return files; }
    @JsonProperty("files")
    public void setFiles(FileDto value) { this.files = value; }
}
