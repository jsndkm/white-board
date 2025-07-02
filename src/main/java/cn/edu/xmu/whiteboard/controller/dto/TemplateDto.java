package cn.edu.xmu.whiteboard.controller.dto;

public class TemplateDto {
    String name;
    String description;
    String image;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }

    public void setInformation(String name) {
        this.name = name;
        switch (name){
            case "Ansoff模型": this.description="Ansoff模型梳理增长路径并直观评估风险，助企业找到清晰的前进方向。";break;
            case "BCG模型": this.description="BCG模型助企业优化资源配置，适用于多业务组合的战略分析与决策。";break;
            case "merits-drawbacks模型": this.description="Merits-drawbacks模型用于权衡利弊，辅助决策优选方案。";break;
            case "PEST模型": this.description="PEST模型分析宏观环境，助企业洞察趋势以制定适配战略。";break;
            case "Potter模型": this.description="Potter模型分析竞争五力，助企业制定差异化竞争战略。";break;
            case "SMART模型": this.description="SMART模型助设定清晰目标，适用于战略规划与执行监控场景。";break;
            case "STP模型": this.description="STP模型助精准定位市场，适用于企业战略细分与目标选择场景。";break;
            case "SWOT模型": this.description="SWOT模型评估内外部环境，助企业制定扬长避短战略。";break;
            case "空白模板": this.description="从空白模板开始，发挥你的想象力吧!";break;
            default: this.description="";break;
        }
    }
}
