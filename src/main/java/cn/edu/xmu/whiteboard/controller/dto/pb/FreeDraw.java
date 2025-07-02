package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FreeDraw{
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
    private Object[] pressures;
    private Boolean simulatePressure;
    private Object lastCommittedPoint;

    public FreeDraw() {}
    public FreeDraw(ElementDto elementDto) {
        id=elementDto.getID();
        type=elementDto.getType();
        x=elementDto.getX();
        y=elementDto.getY();
        width=elementDto.getWidth();
        height=elementDto.getHeight();
        angle=elementDto.getAngle();
        strokeColor=elementDto.getStrokeColor();
        backgroundColor=elementDto.getBackgroundColor();
        fillStyle=elementDto.getFillStyle();
        strokeWidth=elementDto.getStrokeWidth();
        strokeStyle=elementDto.getStrokeStyle();
        roughness=elementDto.getRoughness();
        opacity=elementDto.getOpacity();
        groupIDS=elementDto.getGroupIDS();
        frameID=elementDto.getFrameID();
        index=elementDto.getIndex();
        roundness=elementDto.getRoundness();
        seed=elementDto.getSeed();
        version=elementDto.getVersion();
        versionNonce=elementDto.getVersionNonce();
        isDeleted=elementDto.getIsDeleted();
        updated=elementDto.getUpdated();
        link=elementDto.getLink();
        locked=elementDto.getLocked();
        points=elementDto.getPoints();
        pressures=elementDto.getPressures();
        simulatePressure=elementDto.getSimulatePressure();
        lastCommittedPoint=elementDto.getLastCommittedPoint();
    }

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

    @JsonProperty("pressures")
    public Object[] getPressures() { return pressures; }
    @JsonProperty("pressures")
    public void setPressures(Object[] value) { this.pressures = value; }

    @JsonProperty("simulatePressure")
    public Boolean getSimulatePressure() { return simulatePressure; }
    @JsonProperty("simulatePressure")
    public void setSimulatePressure(Boolean value) { this.simulatePressure = value; }

    @JsonProperty("lastCommittedPoint")
    public Object getLastCommittedPoint() { return lastCommittedPoint; }
    @JsonProperty("lastCommittedPoint")
    public void setLastCommittedPoint(Object value) { this.lastCommittedPoint = value; }
}
