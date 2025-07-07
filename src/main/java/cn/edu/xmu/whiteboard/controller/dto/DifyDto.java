package cn.edu.xmu.whiteboard.controller.dto;

import java.util.List;
import java.util.Map;

public class DifyDto {
    private Map<String, Object> inputs;
    private String query;
    private String response_mode = "streaming";
    private String conversation_id = "";
    private String user;
    private List<FileInfo> files;

    // 静态内部类表示文件信息
    public static class FileInfo {
        private String type;
        private String transfer_method;
        private String url;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTransfer_method() { return transfer_method; }
        public void setTransfer_method(String transfer_method) { this.transfer_method = transfer_method; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    public Map<String, Object> getInputs() { return inputs; }
    public void setInputs(Map<String, Object> inputs) { this.inputs = inputs; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public String getResponse_mode() { return response_mode; }
    public void setResponse_mode(String response_mode) { this.response_mode = response_mode; }
    public String getConversation_id() { return conversation_id; }
    public void setConversation_id(String conversation_id) { this.conversation_id = conversation_id; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public List<FileInfo> getFiles() { return files; }
    public void setFiles(List<FileInfo> files) { this.files = files; }
}
