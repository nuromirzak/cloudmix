package com.github.nuromirzak.cloudmix.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    @Id
    @Column(updatable = false, nullable = false)
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Instant sentAt = Instant.now();

    @ManyToOne
    @JoinColumn(nullable = false)
    @ToString.Exclude
    private Chat chat;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User sender;
}
