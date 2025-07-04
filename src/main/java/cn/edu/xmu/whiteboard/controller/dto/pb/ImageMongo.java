package cn.edu.xmu.whiteboard.controller.dto.pb;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "project_image")
public class ImageMongo {
    @Id
    private Integer id;
    private String image;

    public ImageMongo(Integer id, String image) {
        this.id = id;
        this.image = image;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
}
