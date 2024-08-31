package com.github.nuromirzak.cloudmix.dto.websocket.server;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = ErrorMessage.class, name = "ERROR"),
        @JsonSubTypes.Type(value = NewMessageMessage.class, name = "NEW_MESSAGE"),
        @JsonSubTypes.Type(value = AllChatsMessage.class, name = "ALL_CHATS"),
        @JsonSubTypes.Type(value = AllStatusesMessage.class, name = "ALL_STATUSES"),
})
@Data
public abstract class ServerMessage {
    private final ServerMessageType type;
}
