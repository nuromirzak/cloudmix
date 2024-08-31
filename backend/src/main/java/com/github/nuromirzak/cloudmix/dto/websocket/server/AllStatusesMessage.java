package com.github.nuromirzak.cloudmix.dto.websocket.server;

import com.github.nuromirzak.cloudmix.dto.response.Status;
import lombok.EqualsAndHashCode;
import lombok.Value;

import java.util.Map;

@Value
@EqualsAndHashCode(callSuper = true)
public class AllStatusesMessage extends ServerMessage {
    Map<String, Status> statuses;

    public AllStatusesMessage(Map<String, Status> statuses) {
        super(ServerMessageType.ALL_STATUSES);
        this.statuses = statuses;
    }
}
