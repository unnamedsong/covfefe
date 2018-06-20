package com.example.covfefe.payload;

import com.example.covfefe.model.Book;
import lombok.Data;

import java.util.List;


/**
 * client 에 내려줄 DTO (검색 결과 리스트)
 */
@Data
public class BookDto {
    List<Book> books;
    private int total_count;
    private int pageable_count;
    private boolean is_end;
}

