package com.example.covfefe.controller;

import com.example.covfefe.model.Book;
import com.example.covfefe.payload.ApiResponse;
import com.example.covfefe.service.BookmarkService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/bookmarks")
@Slf4j
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    /**
     * 북마크 추가
     *
     * @return
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createBookmark(@Valid @RequestBody Book book) {
        bookmarkService.createBookmark(book);
        return ResponseEntity.ok(new ApiResponse(true, "Bookmark Created Successfully"));
    }

}
