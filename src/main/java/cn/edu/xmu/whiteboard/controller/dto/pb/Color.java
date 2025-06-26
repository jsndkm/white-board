package cn.edu.xmu.whiteboard.controller.dto.pb;

import java.io.IOException;
import com.fasterxml.jackson.annotation.*;

public enum Color {
    BBB, THE_1_E1_E1_E, TRANSPARENT;

    @JsonValue
    public String toValue() {
        switch (this) {
            case BBB: return "#bbb";
            case THE_1_E1_E1_E: return "#1e1e1e";
            case TRANSPARENT: return "transparent";
        }
        return null;
    }

    @JsonCreator
    public static Color forValue(String value) throws IOException {
        if (value.equals("#bbb")) return BBB;
        if (value.equals("#1e1e1e")) return THE_1_E1_E1_E;
        if (value.equals("transparent")) return TRANSPARENT;
        throw new IOException("Cannot deserialize Color");
    }
}
