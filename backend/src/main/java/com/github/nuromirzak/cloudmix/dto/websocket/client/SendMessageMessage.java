package com.github.nuromirzak.cloudmix.dto.websocket.client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = true)
public class SendMessageMessage extends ClientMessage {
    String chatId;
    String content;

    @JsonCreator
    public SendMessageMessage(@JsonProperty("chatId") String chatId, @JsonProperty("content") String content) {
        super(ClientMessageType.SEND_MESSAGE);
        this.chatId = chatId;
        this.content = content;
    }
}
