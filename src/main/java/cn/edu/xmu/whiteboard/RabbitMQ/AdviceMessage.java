package cn.edu.xmu.whiteboard.RabbitMQ;


import reactor.core.publisher.Flux;

public class AdviceMessage {
    private String Id;
    private Flux<String> messages;

    public String getId() {
        return Id;
    }

    public void setId(String id) {
        this.Id = id;
    }

    public Flux<String> getMessages() {
        return messages;
    }
    public void setMessages(Flux<String> messages) {
        this.messages = messages;
    }
}
