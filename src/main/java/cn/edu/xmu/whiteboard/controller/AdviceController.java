package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.controller.dto.DifyDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ElementDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.service.DifyChatService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class AdviceController {

    private final DifyChatService chatService;

    public AdviceController(DifyChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/ai-advice", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChatResponse(@RequestBody ProjectBoardDto projectBoardDto) {
        ElementDto[] elements = projectBoardDto.getElements();
        StringBuilder query = new StringBuilder();
        for(ElementDto element:elements) {
            if(element.getType().equals("text") && element.getText() != null){
                query.append(element.getText());
            }
        }
        DifyDto difyDto = new DifyDto();
        difyDto.setQuery(query.toString());
        difyDto.setUser("white-board");
        return chatService.getResponse(difyDto);
    }
}
