package com.github.nuromirzak.cloudmix.dto.websocket.client;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = AuthMessage.class, name = "AUTH"),
        @JsonSubTypes.Type(value = SendMessageMessage.class, name = "SEND_MESSAGE"),
        @JsonSubTypes.Type(value = TypingStatusMessage.class, name = "TYPING_STATUS"),
})
@Data
public abstract class ClientMessage {
    private final ClientMessageType type;
}
