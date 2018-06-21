package com.example.covfefe.payload;

import com.example.covfefe.model.Book;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class BookmarkResponse {

    private Long id;
    private Book book;

    private UserSummary createdBy;
    private Instant creationDateTime;

}
