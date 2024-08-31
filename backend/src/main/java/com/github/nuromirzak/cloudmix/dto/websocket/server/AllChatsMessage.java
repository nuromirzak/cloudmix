package com.github.nuromirzak.cloudmix.dto.websocket.server;

import com.github.nuromirzak.cloudmix.dto.response.ChatResponse;
import lombok.EqualsAndHashCode;
import lombok.Value;

import java.util.List;

@Value
@EqualsAndHashCode(callSuper = true)
public class AllChatsMessage extends ServerMessage {
    List<ChatResponse> chats;

    public AllChatsMessage(List<ChatResponse> chats) {
        super(ServerMessageType.ALL_CHATS);
        this.chats = chats;
    }
}
