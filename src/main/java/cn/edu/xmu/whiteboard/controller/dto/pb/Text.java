package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Text{
    private String id;
    private String type;
    private double x;
    private double y;
    private double width;
    private double height;
    private double angle;
    private String strokeColor;
    private String backgroundColor;
    private String fillStyle;
    private double strokeWidth;
    private String strokeStyle;
    private double roughness;
    private double opacity;
    private Object[] groupIDS;
    private Object frameID;
    private String index;
    private Roundness roundness;
    private long seed;
    private long version;
    private long versionNonce;
    private boolean isDeleted;
    private BoundElement[] boundElements;
    private long updated;
    private String link;
    private boolean locked;
    private String text;
    private double fontSize;
    private double fontFamily;
    private String textAlign;
    private String verticalAlign;
    private Object containerID;
    private String originalText;
    private Boolean autoResize;
    private Double lineHeight;
    private Integer baseline;

    public Text() {}
    public Text(ElementDto elementDto) {
        id=elementDto.getId();
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
        groupIDS=elementDto.getGroupIds();
        frameID=elementDto.getFrameId();
        index=elementDto.getIndex();
        roundness=elementDto.getRoundness();
        seed=elementDto.getSeed();
        version=elementDto.getVersion();
        versionNonce=elementDto.getVersionNonce();
        isDeleted=elementDto.getIsDeleted();
        boundElements=elementDto.getBoundElements();
        updated=elementDto.getUpdated();
        link=elementDto.getLink();
        locked=elementDto.getLocked();
        text=elementDto.getText();
        fontSize=elementDto.getFontSize();
        fontFamily=elementDto.getFontFamily();
        textAlign=elementDto.getTextAlign();
        verticalAlign=elementDto.getVerticalAlign();
        containerID=elementDto.getContainerId();
        originalText=elementDto.getOriginalText();
        autoResize=elementDto.getAutoResize();
        lineHeight=elementDto.getLineHeight();
        if(elementDto.getBaseline()!=null)
            baseline=elementDto.getBaseline();
    }

    @JsonProperty("id")
    public String getId() { return id; }
    @JsonProperty("id")
    public void setId(String value) { this.id = value; }

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
    public double getAngle() { return angle; }
    @JsonProperty("angle")
    public void setAngle(double value) { this.angle = value; }

    @JsonProperty("strokeColor")
    public String getStrokeColor() { return strokeColor; }
    @JsonProperty("strokeColor")
    public void setStrokeColor(String value) { this.strokeColor = value; }

    @JsonProperty("backgroundColor")
    public String getBackgroundColor() { return backgroundColor; }
    @JsonProperty("backgroundColor")
    public void setBackgroundColor(String value) { this.backgroundColor = value; }

    @JsonProperty("fillStyle")
    public String getFillStyle() { return fillStyle; }
    @JsonProperty("fillStyle")
    public void setFillStyle(String value) { this.fillStyle = value; }

    @JsonProperty("strokeWidth")
    public double getStrokeWidth() { return strokeWidth; }
    @JsonProperty("strokeWidth")
    public void setStrokeWidth(double value) { this.strokeWidth = value; }

    @JsonProperty("strokeStyle")
    public String getStrokeStyle() { return strokeStyle; }
    @JsonProperty("strokeStyle")
    public void setStrokeStyle(String value) { this.strokeStyle = value; }

    @JsonProperty("roughness")
    public double getRoughness() { return roughness; }
    @JsonProperty("roughness")
    public void setRoughness(double value) { this.roughness = value; }

    @JsonProperty("opacity")
    public double getOpacity() { return opacity; }
    @JsonProperty("opacity")
    public void setOpacity(double value) { this.opacity = value; }

    @JsonProperty("groupIds")
    public Object[] getGroupIds() { return groupIDS; }
    @JsonProperty("groupIds")
    public void setGroupIds(Object[] value) { this.groupIDS = value; }

    @JsonProperty("frameId")
    public Object getFrameId() { return frameID; }
    @JsonProperty("frameId")
    public void setFrameId(Object value) { this.frameID = value; }

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
    public BoundElement[] getBoundElements() { return boundElements; }
    @JsonProperty("boundElements")
    public void setBoundElements(BoundElement[] value) { this.boundElements = value; }

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

    @JsonProperty("text")
    public String getText() { return text; }
    @JsonProperty("text")
    public void setText(String value) { this.text = value; }

    @JsonProperty("fontSize")
    public double getFontSize() { return fontSize; }
    @JsonProperty("fontSize")
    public void setFontSize(double value) { this.fontSize = value; }

    @JsonProperty("fontFamily")
    public double getFontFamily() { return fontFamily; }
    @JsonProperty("fontFamily")
    public void setFontFamily(double value) { this.fontFamily = value; }

    @JsonProperty("textAlign")
    public String getTextAlign() { return textAlign; }
    @JsonProperty("textAlign")
    public void setTextAlign(String value) { this.textAlign = value; }

    @JsonProperty("verticalAlign")
    public String getVerticalAlign() { return verticalAlign; }
    @JsonProperty("verticalAlign")
    public void setVerticalAlign(String value) { this.verticalAlign = value; }

    @JsonProperty("containerId")
    public Object getContainerId() { return containerID; }
    @JsonProperty("containerId")
    public void setContainerId(Object value) { this.containerID = value; }

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

    @JsonProperty("baseline")
    public Integer getBaseline() { return baseline; }
    @JsonProperty("baseline")
    public void setBaseline(Integer value) { this.baseline = value; }
}
