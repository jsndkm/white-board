package cn.edu.xmu.whiteboard.RabbitMQ;

import cn.edu.xmu.whiteboard.redis.RedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MQSender {

    private static Logger logger = LoggerFactory.getLogger(MQSender.class);

    @Autowired
    AmqpTemplate amqpTemplate;

    public void sendAdviceMessage(AdviceMessage mm) {
        String msg = RedisService.beanToString(mm);
        logger.info("advice send message: " + msg);
        amqpTemplate.convertAndSend(MQConfig.ADVICE_QUEUE, msg);
    }
}
