package cn.edu.xmu.whiteboard;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WhiteBoardApplication implements CommandLineRunner{
    @Autowired
    private SocketIOServer socketIOServer;

    public static void main(String[] args) {
        SpringApplication.run(WhiteBoardApplication.class, args);
    }

    @Override
    public void run(String... args) {
        socketIOServer.start(); // 启动 Socket.IO 服务器
        System.out.println("Socket.IO server started on port 8081");
        socketIOServer.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });
    }
}
