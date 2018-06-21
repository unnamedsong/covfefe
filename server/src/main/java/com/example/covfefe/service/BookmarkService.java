package com.example.covfefe.service;

import com.example.covfefe.exception.ResourceNotFoundException;
import com.example.covfefe.model.Book;
import com.example.covfefe.model.User;
import com.example.covfefe.payload.BookmarkResponse;
import com.example.covfefe.payload.PagedResponse;
import com.example.covfefe.payload.UserSummary;
import com.example.covfefe.repository.BookRepository;
import com.example.covfefe.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import static com.example.covfefe.util.CovfefeUtils.validatePageNumberAndSize;

@Service
@Slf4j
public class BookmarkService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    public Book createBookmark(Book book) {
        return bookRepository.save(book);
    }

    public PagedResponse<BookmarkResponse> getBookmarksCreatedBy(String username, Pageable pageable) {

        validatePageNumberAndSize(pageable.getPageNumber(), pageable.getPageSize());

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Page<Book> bookmarks = bookRepository.findByCreatedBy(user.getId(), pageable);

        if (bookmarks.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), bookmarks.getNumber(), bookmarks.getSize(), bookmarks.getTotalElements(), bookmarks.getTotalPages(), bookmarks.isLast());
        }

        List<BookmarkResponse> bookmarkResponses = bookmarks.map(
            bookmark -> mapBookmarkToBookmarkResponse(bookmark, user)
        ).getContent();

        return new PagedResponse<>(bookmarkResponses, bookmarks.getNumber(), bookmarks.getSize(), bookmarks.getTotalElements(), bookmarks.getTotalPages(), bookmarks.isLast());

    }

    public void deleteBookmark(String username, long id) {
        bookRepository.deleteById(id);
    }

    private static BookmarkResponse mapBookmarkToBookmarkResponse(Book book, User creator) {
        BookmarkResponse bookmarkResponse = new BookmarkResponse();
        bookmarkResponse.setId(book.getId());
        bookmarkResponse.setBook(book);
        bookmarkResponse.setCreationDateTime(book.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        bookmarkResponse.setCreatedBy(creatorSummary);

        return bookmarkResponse;
    }

}
