package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.config.DifyConfig;
import cn.edu.xmu.whiteboard.controller.dto.DifyDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.core.publisher.Flux;

import java.time.Duration;

@Service
public class DifyChatService {

    private final WebClient webClient;
    private final DifyConfig apiProperties;

    public DifyChatService(DifyConfig apiProperties) {
        this.apiProperties = apiProperties;
        this.webClient = WebClient.builder()
                .baseUrl(apiProperties.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.TEXT_EVENT_STREAM_VALUE) // 用于流式响应
                .build();
    }

    public Flux<String> getResponse(DifyDto request) {
        return webClient.post()
                .uri(apiProperties.getEndpoint())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiProperties.getKey())
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(String.class)
                .timeout(Duration.ofSeconds(60)) // 设置超时时间
                .doOnError(WebClientException.class, err -> {
                    // 处理API错误响应
                    System.err.println("API Error: " + err.getMessage());
                });
    }
}
