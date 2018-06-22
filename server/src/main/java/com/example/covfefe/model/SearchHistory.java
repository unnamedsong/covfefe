package com.example.covfefe.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class SearchHistory {

    private String keyword;
    private Instant createdAt;

    @JsonIgnore
    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @JsonGetter
    private long getEpochTime() {
        return this.createdAt.toEpochMilli();
    }

    @JsonSetter
    private void setEpochTime(long time) {
        this.createdAt = Instant.ofEpochMilli(time);
    }

}
