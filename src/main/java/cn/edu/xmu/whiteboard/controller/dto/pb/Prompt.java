package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.util.List;

@JsonDeserialize(using = PromptDeserializer.class) // 添加此注解
public class Prompt {
    @JsonProperty("prompt")
    private List<ElementDto> elements;

    public List<ElementDto> getElements() {
        return elements;
    }

    public void setElements(List<ElementDto> elements) {
        this.elements = elements;
    }
}