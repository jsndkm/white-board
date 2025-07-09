package cn.edu.xmu.whiteboard.RabbitMQ;

import cn.edu.xmu.whiteboard.redis.RedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class MQReceiver {

    private static Logger logger = LoggerFactory.getLogger(MQReceiver.class);

    @RabbitListener(queues = MQConfig.ADVICE_QUEUE)
    public void receive(String message) {
        logger.info("advice receive message: " + message);
        AdviceMessage mm = RedisService.stringToBean(message, AdviceMessage.class);
        String goodsId = mm.getId();
    }
}
