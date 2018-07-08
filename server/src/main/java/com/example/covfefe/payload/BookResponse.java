package com.example.covfefe.payload;

import com.example.covfefe.model.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


/**
 * 카카오 책 검색 API 로부터 오는 응답
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Meta meta;
    private List<Book> documents;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Meta {
        private int total_count;
        private int pageable_count;
        private boolean is_end;
    }

}


