package com.github.nuromirzak.cloudmix.dto.websocket.server;

import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = true)
public class ErrorMessage extends ServerMessage {
    String error;

    public ErrorMessage(String error) {
        super(ServerMessageType.ERROR);
        this.error = error;
    }
}
