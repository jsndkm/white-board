package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.IdeaReturnData;
import cn.edu.xmu.whiteboard.controller.dto.IdeaDto;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.IdeaService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class IdeaController {

    @Autowired
    private IdeaService ideaService;

    @PostMapping("/new-idea")
    public ResultUtil<Object> newIdea(@RequestHeader("Authorization") String authorization, @RequestBody IdeaDto ideaDto){
        try{
            if(!StringUtils.hasText(ideaDto.getContent())){
                return ResultUtil.error(CodeMsg.CONTENT_NOT_EXIST);
            }
            else if(ideaDto.getProjectId()<=0){
                return ResultUtil.error(CodeMsg.PROJECT_ID_EMPTY);
            }
            //解析token
            String username= JWTUtil.analyzeToken(authorization);
            IdeaReturnData data = ideaService.newIdea(username,ideaDto);
            return ResultUtil.success(data);
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
