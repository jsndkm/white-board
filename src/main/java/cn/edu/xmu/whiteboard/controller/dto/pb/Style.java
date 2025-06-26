package cn.edu.xmu.whiteboard.controller.dto.pb;

import java.io.IOException;
import com.fasterxml.jackson.annotation.*;

public enum Style {
    SOLID;

    @JsonValue
    public String toValue() {
        switch (this) {
            case SOLID: return "solid";
        }
        return null;
    }

    @JsonCreator
    public static Style forValue(String value) throws IOException {
        if (value.equals("solid")) return SOLID;
        throw new IOException("Cannot deserialize Style");
    }
}
