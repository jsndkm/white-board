package cn.edu.xmu.whiteboard.ReturnData;

public class IdeaReturnData {
    private int id;
    private String content;

    public IdeaReturnData() {
        this.id = -1;
        this.content = null;
    }

    public IdeaReturnData(int id, String content) {
        this.id = id;
        this.content = content;
    }

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}
}
