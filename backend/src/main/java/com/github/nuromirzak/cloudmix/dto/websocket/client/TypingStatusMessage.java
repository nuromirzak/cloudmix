package com.github.nuromirzak.cloudmix.dto.websocket.client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = true)
public class TypingStatusMessage extends ClientMessage {
    String chatId;

    @JsonCreator
    public TypingStatusMessage(@JsonProperty("chatId") String chatId) {
        super(ClientMessageType.TYPING_STATUS);
        this.chatId = chatId;
    }
}
