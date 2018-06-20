package com.example.covfefe.service;

import com.example.covfefe.payload.BookDto;
import com.example.covfefe.payload.BookResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import static com.example.covfefe.util.CovfefeUtils.validatePageNumberAndSize;

@Service
@Slf4j
public class BookService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${kakao.rest.app.key}")
    private String REST_APP_KEY;

    @Value("${kakao.rest.api.host}")
    private String API_HOST;

    @Value("${kakao.rest.api.book.path}")
    private String BOOK_SEARCH_PATH;

    // 카카오 책 검색 API 호출
    public BookDto getBooks(String target, String query, int page, int size) {

        // 페이지, 페이지 크기 유효성 검사
        validatePageNumberAndSize(page, size);

        UriComponents uriComponents = createUriComponents(target, query, page, size);
        HttpEntity<?> entity = new HttpEntity<>(createHeaders());

        ResponseEntity<BookResponse> b = restTemplate.exchange(
            uriComponents.encode().toUri(),
            HttpMethod.GET,
            entity,
            BookResponse.class
        );

        return mapBookResponseToBookDto(b.getBody());

    }

    // 카카오 책 검색 API를 원하는 BookDto로 변환
    private static BookDto mapBookResponseToBookDto(BookResponse bookResponse) {
        BookDto bookDto = new BookDto();

        bookDto.setBooks(bookResponse.getDocuments());

        BookResponse.Meta meta = bookResponse.getMeta();

        bookDto.setTotal_count(meta.getTotal_count());
        bookDto.setPageable_count(meta.getPageable_count());
        bookDto.set_end(meta.is_end());

        return bookDto;

    }

    private UriComponents createUriComponents(String target, String query, int page, int size) {
        return UriComponentsBuilder.newInstance()
            .scheme("https")
            .host(API_HOST)
            .path(BOOK_SEARCH_PATH)
            .queryParam("target", target)
            .queryParam("query", query)
            .queryParam("page", page)
            .queryParam("size", size)
            .build();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + REST_APP_KEY);
        return headers;
    }

}
