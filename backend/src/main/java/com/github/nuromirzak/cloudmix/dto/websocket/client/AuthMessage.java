package com.github.nuromirzak.cloudmix.dto.websocket.client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Value;

import java.util.Base64;

@Value
@EqualsAndHashCode(callSuper = true)
public class AuthMessage extends ClientMessage {
    String basicAuth;

    @JsonCreator
    public AuthMessage(@JsonProperty("basicAuth") String basicAuth) {
        super(ClientMessageType.AUTH);
        this.basicAuth = basicAuth;
    }

    public String getUsername() {
        if (basicAuth != null && basicAuth.startsWith("Basic ")) {
            String decodedAuth = new String(Base64.getDecoder().decode(basicAuth.substring(6)));
            return decodedAuth.split(":")[0];
        }
        return null;
    }

    public String getPassword() {
        if (basicAuth != null && basicAuth.startsWith("Basic ")) {
            String decodedAuth = new String(Base64.getDecoder().decode(basicAuth.substring(6)));
            return decodedAuth.split(":")[1];
        }
        return null;
    }
}
