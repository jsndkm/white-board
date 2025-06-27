package cn.edu.xmu.whiteboard.controller.dto.pb;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "project_board")
public class ProjectBoardMongo {
    @Id
    private Integer id;
    private ProjectBoardDto projectBoard;

    public ProjectBoardMongo(Integer id, ProjectBoardDto projectBoard) {
        this.id = id;
        this.projectBoard = projectBoard;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public ProjectBoardDto getProjectBoard() {
        return projectBoard;
    }
    public void setProjectBoard(ProjectBoardDto projectBoard) {
        this.projectBoard = projectBoard;
    }
}
