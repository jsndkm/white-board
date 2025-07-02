package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Roundness {
    private double type;

    public Roundness() {}

    @JsonProperty("type")
    public double getType() { return type; }
    @JsonProperty("type")
    public void setType(double value) { this.type = value; }
}
