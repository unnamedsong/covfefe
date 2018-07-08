package com.example.covfefe.controller;

import com.example.covfefe.payload.BookDto;
import com.example.covfefe.service.BookService;
import com.example.covfefe.service.SearchHistoryService;
import com.example.covfefe.util.AppConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@Slf4j
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private SearchHistoryService searchHistoryService;

    @GetMapping
    public ResponseEntity<BookDto> retrieveBooks(
        @RequestParam(value = "username") String username,
        @RequestParam(value = "target", defaultValue = "all", required = false) String target,
        @RequestParam(value = "query") String query,
        @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
        @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        searchHistoryService.save(username, query);

        BookDto bookDto = bookService.getBooks(target, query, page, size);

        return ResponseEntity.ok(bookDto);
    }

}
