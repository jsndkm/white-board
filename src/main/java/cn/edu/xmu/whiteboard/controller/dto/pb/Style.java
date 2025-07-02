package cn.edu.xmu.whiteboard.controller.dto.pb;

import java.io.IOException;
import com.fasterxml.jackson.annotation.*;

public enum Style {
    SOLID("solid"),
    DASHED("dashed"),
    DOTTED("dotted"),
    HACHURE("hachure"),
    CROSS_HATCH("cross-hatch");

    private final String value;

    // 枚举构造函数必须是 private 的
    Style(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Style forValue(String value) {
        if (value == null) {
            return null; // 或抛出异常
        }
        for (Style style : Style.values()) {
            if (style.value.equalsIgnoreCase(value.trim())) {
                return style;
            }
        }
        throw new IllegalArgumentException("Unknown style: " + value);
    }
}
