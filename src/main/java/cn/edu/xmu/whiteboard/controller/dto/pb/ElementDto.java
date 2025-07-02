package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ElementDto {
    private String id;
    private String type;
    private double x;
    private double y;
    private double width;
    private double height;
    private long angle;
    private String strokeColor;
    private String backgroundColor;
    private Style fillStyle;
    private long strokeWidth;
    private Style strokeStyle;
    private long roughness;
    private long opacity;
    private Object[] groupIDS;
    private Object frameID;
    private String index;
    private Roundness roundness;
    private long seed;
    private long version;
    private long versionNonce;
    private boolean isDeleted;
    private Object[] boundElements;
    private long updated;
    private String link;
    private boolean locked;
    private double[][] points;
    private Object lastCommittedPoint;
    private Object startBinding;
    private Object endBinding;
    private Object startArrowhead;
    private String endArrowhead;
    private Boolean elbowed;
    private Boolean polygon;
    private Object[] pressures;
    private Boolean simulatePressure;
    private String text;
    private Long fontSize;
    private Long fontFamily;
    private String textAlign;
    private String verticalAlign;
    private Object containerID;
    private String originalText;
    private Boolean autoResize;
    private Double lineHeight;
    private String status;
    private String fileID;
    private long[] scale;
    private Object crop;
    private String name;
    private Integer baseline;

    public ElementDto() {}

    @JsonProperty("id")
    public String getID() { return id; }
    @JsonProperty("id")
    public void setID(String value) { this.id = value; }

    @JsonProperty("type")
    public String getType() { return type; }
    @JsonProperty("type")
    public void setType(String value) { this.type = value; }

    @JsonProperty("x")
    public double getX() { return x; }
    @JsonProperty("x")
    public void setX(double value) { this.x = value; }

    @JsonProperty("y")
    public double getY() { return y; }
    @JsonProperty("y")
    public void setY(double value) { this.y = value; }

    @JsonProperty("width")
    public double getWidth() { return width; }
    @JsonProperty("width")
    public void setWidth(double value) { this.width = value; }

    @JsonProperty("height")
    public double getHeight() { return height; }
    @JsonProperty("height")
    public void setHeight(double value) { this.height = value; }

    @JsonProperty("angle")
    public long getAngle() { return angle; }
    @JsonProperty("angle")
    public void setAngle(long value) { this.angle = value; }

    @JsonProperty("strokeColor")
    public String getStrokeColor() { return strokeColor; }
    @JsonProperty("strokeColor")
    public void setStrokeColor(String value) { this.strokeColor = value; }

    @JsonProperty("backgroundColor")
    public String getBackgroundColor() { return backgroundColor; }
    @JsonProperty("backgroundColor")
    public void setBackgroundColor(String value) { this.backgroundColor = value; }

    @JsonProperty("fillStyle")
    public Style getFillStyle() { return fillStyle; }
    @JsonProperty("fillStyle")
    public void setFillStyle(Style value) { this.fillStyle = value; }

    @JsonProperty("strokeWidth")
    public long getStrokeWidth() { return strokeWidth; }
    @JsonProperty("strokeWidth")
    public void setStrokeWidth(long value) { this.strokeWidth = value; }

    @JsonProperty("strokeStyle")
    public Style getStrokeStyle() { return strokeStyle; }
    @JsonProperty("strokeStyle")
    public void setStrokeStyle(Style value) { this.strokeStyle = value; }

    @JsonProperty("roughness")
    public long getRoughness() { return roughness; }
    @JsonProperty("roughness")
    public void setRoughness(long value) { this.roughness = value; }

    @JsonProperty("opacity")
    public long getOpacity() { return opacity; }
    @JsonProperty("opacity")
    public void setOpacity(long value) { this.opacity = value; }

    @JsonProperty("groupIds")
    public Object[] getGroupIDS() { return groupIDS; }
    @JsonProperty("groupIds")
    public void setGroupIDS(Object[] value) { this.groupIDS = value; }

    @JsonProperty("frameId")
    public Object getFrameID() { return frameID; }
    @JsonProperty("frameId")
    public void setFrameID(Object value) { this.frameID = value; }

    @JsonProperty("index")
    public String getIndex() { return index; }
    @JsonProperty("index")
    public void setIndex(String value) { this.index = value; }

    @JsonProperty("roundness")
    public Roundness getRoundness() { return roundness; }
    @JsonProperty("roundness")
    public void setRoundness(Roundness value) { this.roundness = value; }

    @JsonProperty("seed")
    public long getSeed() { return seed; }
    @JsonProperty("seed")
    public void setSeed(long value) { this.seed = value; }

    @JsonProperty("version")
    public long getVersion() { return version; }
    @JsonProperty("version")
    public void setVersion(long value) { this.version = value; }

    @JsonProperty("versionNonce")
    public long getVersionNonce() { return versionNonce; }
    @JsonProperty("versionNonce")
    public void setVersionNonce(long value) { this.versionNonce = value; }

    @JsonProperty("isDeleted")
    public boolean getIsDeleted() { return isDeleted; }
    @JsonProperty("isDeleted")
    public void setIsDeleted(boolean value) { this.isDeleted = value; }

    @JsonProperty("boundElements")
    public Object[] getBoundElements() { return boundElements; }
    @JsonProperty("boundElements")
    public void setBoundElements(Object[] value) { this.boundElements = value; }

    @JsonProperty("updated")
    public long getUpdated() { return updated; }
    @JsonProperty("updated")
    public void setUpdated(long value) { this.updated = value; }

    @JsonProperty("link")
    public String getLink() { return link; }
    @JsonProperty("link")
    public void setLink(String value) { this.link = value; }

    @JsonProperty("locked")
    public boolean getLocked() { return locked; }
    @JsonProperty("locked")
    public void setLocked(boolean value) { this.locked = value; }

    @JsonProperty("points")
    public double[][] getPoints() { return points; }
    @JsonProperty("points")
    public void setPoints(double[][] value) { this.points = value; }

    @JsonProperty("lastCommittedPoint")
    public Object getLastCommittedPoint() { return lastCommittedPoint; }
    @JsonProperty("lastCommittedPoint")
    public void setLastCommittedPoint(Object value) { this.lastCommittedPoint = value; }

    @JsonProperty("startBinding")
    public Object getStartBinding() { return startBinding; }
    @JsonProperty("startBinding")
    public void setStartBinding(Object value) { this.startBinding = value; }

    @JsonProperty("endBinding")
    public Object getEndBinding() { return endBinding; }
    @JsonProperty("endBinding")
    public void setEndBinding(Object value) { this.endBinding = value; }

    @JsonProperty("startArrowhead")
    public Object getStartArrowhead() { return startArrowhead; }
    @JsonProperty("startArrowhead")
    public void setStartArrowhead(Object value) { this.startArrowhead = value; }

    @JsonProperty("endArrowhead")
    public String getEndArrowhead() { return endArrowhead; }
    @JsonProperty("endArrowhead")
    public void setEndArrowhead(String value) { this.endArrowhead = value; }

    @JsonProperty("elbowed")
    public Boolean getElbowed() { return elbowed; }
    @JsonProperty("elbowed")
    public void setElbowed(Boolean value) { this.elbowed = value; }

    @JsonProperty("polygon")
    public Boolean getPolygon() { return polygon; }
    @JsonProperty("polygon")
    public void setPolygon(Boolean value) { this.polygon = value; }

    @JsonProperty("pressures")
    public Object[] getPressures() { return pressures; }
    @JsonProperty("pressures")
    public void setPressures(Object[] value) { this.pressures = value; }

    @JsonProperty("simulatePressure")
    public Boolean getSimulatePressure() { return simulatePressure; }
    @JsonProperty("simulatePressure")
    public void setSimulatePressure(Boolean value) { this.simulatePressure = value; }

    @JsonProperty("text")
    public String getText() { return text; }
    @JsonProperty("text")
    public void setText(String value) { this.text = value; }

    @JsonProperty("fontSize")
    public Long getFontSize() { return fontSize; }
    @JsonProperty("fontSize")
    public void setFontSize(Long value) { this.fontSize = value; }

    @JsonProperty("fontFamily")
    public Long getFontFamily() { return fontFamily; }
    @JsonProperty("fontFamily")
    public void setFontFamily(Long value) { this.fontFamily = value; }

    @JsonProperty("textAlign")
    public String getTextAlign() { return textAlign; }
    @JsonProperty("textAlign")
    public void setTextAlign(String value) { this.textAlign = value; }

    @JsonProperty("verticalAlign")
    public String getVerticalAlign() { return verticalAlign; }
    @JsonProperty("verticalAlign")
    public void setVerticalAlign(String value) { this.verticalAlign = value; }

    @JsonProperty("containerId")
    public Object getContainerID() { return containerID; }
    @JsonProperty("containerId")
    public void setContainerID(Object value) { this.containerID = value; }

    @JsonProperty("originalText")
    public String getOriginalText() { return originalText; }
    @JsonProperty("originalText")
    public void setOriginalText(String value) { this.originalText = value; }

    @JsonProperty("autoResize")
    public Boolean getAutoResize() { return autoResize; }
    @JsonProperty("autoResize")
    public void setAutoResize(Boolean value) { this.autoResize = value; }

    @JsonProperty("lineHeight")
    public Double getLineHeight() { return lineHeight; }
    @JsonProperty("lineHeight")
    public void setLineHeight(Double value) { this.lineHeight = value; }

    @JsonProperty("status")
    public String getStatus() { return status; }
    @JsonProperty("status")
    public void setStatus(String value) { this.status = value; }

    @JsonProperty("fileId")
    public String getFileID() { return fileID; }
    @JsonProperty("fileId")
    public void setFileID(String value) { this.fileID = value; }

    @JsonProperty("scale")
    public long[] getScale() { return scale; }
    @JsonProperty("scale")
    public void setScale(long[] value) { this.scale = value; }

    @JsonProperty("crop")
    public Object getCrop() { return crop; }
    @JsonProperty("crop")
    public void setCrop(Object value) { this.crop = value; }

    @JsonProperty("name")
    public String getName() { return name; }
    @JsonProperty("name")
    public void setName(String value) { this.name = value; }

    @JsonProperty("baseline")
    public Integer getBaseline() { return baseline; }
    @JsonProperty("baseline")
    public void setBaseline(Integer value) { this.baseline = value; }
}
