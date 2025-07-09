package cn.edu.xmu.whiteboard.controller.dto.pb;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PromptDeserializer extends JsonDeserializer<Prompt> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Prompt deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
        JsonNode rootNode = p.getCodec().readTree(p);
        JsonNode promptNode = rootNode.get("prompt");

        List<ElementDto> elements = new ArrayList<>();

        if (promptNode != null) {
            if (promptNode.isTextual()) {
                // 处理字符串格式的数组
                String jsonString = promptNode.asText();
                try {
                    elements = objectMapper.readValue(jsonString, new TypeReference<List<ElementDto>>(){});
                } catch (IOException e) {
                    System.err.println("Error parsing prompt string: " + jsonString);
                    throw new IllegalArgumentException("Invalid JSON format in 'prompt' string", e);
                }
            } else if (promptNode.isArray()) {
                // 处理标准数组格式
                for (JsonNode elementNode : promptNode) {
                    try {
                        ElementDto element = objectMapper.treeToValue(elementNode, ElementDto.class);
                        elements.add(element);
                    } catch (IOException e) {
                        System.err.println("Error parsing element: " + elementNode.toString());
                        // 跳过无法解析的元素而不是中断整个请求
                    }
                }
            } else {
                throw new IllegalArgumentException(
                        "Expected array or string for 'prompt', got " + promptNode.getNodeType());
            }
        }

        Prompt prompt = new Prompt();
        prompt.setElements(elements);
        return prompt;
    }
}