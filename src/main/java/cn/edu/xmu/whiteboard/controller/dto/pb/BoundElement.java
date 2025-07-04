package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BoundElement {
    private String type;
    private String id;

    BoundElement(){}

    @JsonProperty("type")
    public String getType() {
        return type;
    }
    @JsonProperty("type")
    public void setType(String type) {
        this.type = type;
    }

    @JsonProperty("id")
    public String getId() { return id; }
    @JsonProperty("id")
    public void setId(String value) { this.id = value; }
}
