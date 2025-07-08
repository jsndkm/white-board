package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.controller.dto.DifyDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ElementDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.service.DifyChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class AdviceController {

    private final DifyChatService chatService;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public AdviceController(DifyChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/ai-advice", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChatResponse(@RequestBody ProjectBoardDto projectBoardDto) {
        // 提取所有文本元素的内容
        StringBuilder query = new StringBuilder();
        for (ElementDto element : projectBoardDto.getElements()) {
            if ("text".equals(element.getType()) && element.getText() != null) {
                query.append(element.getText());
            }
        }

        // 构建Dify请求DTO
        DifyDto difyDto = new DifyDto();
        difyDto.setQuery(query.toString());
        difyDto.setUser("white-board");

        // 创建输出Sink用于控制数据流
        Sinks.Many<String> outputSink = Sinks.many().unicast().onBackpressureBuffer();
        // 创建句子缓冲区
        AtomicReference<StringBuilder> sentenceBuffer = new AtomicReference<>(new StringBuilder());

        // 订阅原始事件流
        chatService.getResponse(difyDto)
                .subscribe(
                        event -> processDifyEvent(event, outputSink, sentenceBuffer),
                        outputSink::tryEmitError,
                        () -> {
                            // 流结束时发送缓冲区剩余内容
                            String remaining = sentenceBuffer.get().toString();
                            if (!remaining.isEmpty()) {
                                outputSink.tryEmitNext(remaining);
                            }
                            outputSink.tryEmitComplete();
                        }
                );

        return outputSink.asFlux();
    }

    private void processDifyEvent(String rawEvent, Sinks.Many<String> outputSink,
                                  AtomicReference<StringBuilder> sentenceBuffer) {
        try {
            // 解析JSON事件
            JsonNode eventNode = objectMapper.readTree(rawEvent);

            // 只处理message事件
            if (!"message".equals(eventNode.path("event").asText())) {
                return;
            }

            // 提取answer内容
            String answer = eventNode.path("answer").asText();
            if (answer == null || answer.isEmpty()) {
                return;
            }

            // 将新数据添加到缓冲区
            StringBuilder buffer = sentenceBuffer.get();
            buffer.append(answer);

            // 处理缓冲区中的文本，分割句子
            processTextBuffer(buffer, outputSink);

        } catch (JsonProcessingException e) {
            // JSON解析错误，跳过此事件
            System.err.println("Error parsing Dify event: " + e.getMessage());
        }
    }

    private void processTextBuffer(StringBuilder buffer, Sinks.Many<String> outputSink) {
        String text = buffer.toString();
        int lastIndex = 0;
        boolean foundSentence = false;

        // 遍历文本，查找句子结束符
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);

            // 检查是否遇到句子结束符
            if (c == '。' || c == '\n') {
                // 提取完整句子（从上一个结束点到当前结束点）
                String sentence = text.substring(lastIndex, i + 1);
                outputSink.tryEmitNext(sentence);

                // 更新最后结束位置
                lastIndex = i + 1;
                foundSentence = true;
            }
        }

        // 处理剩余文本
        if (foundSentence) {
            // 如果有找到句子，保留剩余文本
            String remaining = text.substring(lastIndex);
            buffer.setLength(0);
            buffer.append(remaining);
        }
        // 如果没有找到句子，整个文本保留在缓冲区中
    }
}