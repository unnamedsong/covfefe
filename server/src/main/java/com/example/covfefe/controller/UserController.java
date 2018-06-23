package com.example.covfefe.controller;

import com.example.covfefe.exception.ResourceNotFoundException;
import com.example.covfefe.model.SearchHistory;
import com.example.covfefe.model.User;
import com.example.covfefe.payload.*;
import com.example.covfefe.repository.UserRepository;
import com.example.covfefe.security.CurrentUser;
import com.example.covfefe.security.UserPrincipal;
import com.example.covfefe.service.BookmarkService;
import com.example.covfefe.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private SearchHistoryService searchHistoryService;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return userSummary;
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt());

        return userProfile;
    }

    /**
     * username 으로 북마크 조회
     *
     * @param username
     * @param pageable
     * @return
     */
    @GetMapping("/users/{username}/bookmarks")
    public PagedResponse<BookmarkResponse> getBookmarksCreatedBy(@PathVariable(value = "username") String username, Pageable pageable) {
        return bookmarkService.getBookmarksCreatedBy(username, pageable);
    }

    /**
     * 북마크 삭제
     *
     * @param username
     * @param id
     * @return
     */
    @DeleteMapping("/users/{username}/bookmarks/{id}")
    public ResponseEntity deleteBookmark(@PathVariable(value = "username") String username,
                                         @PathVariable(value = "id") long id) {
        bookmarkService.deleteBookmark(username, id);
        return ResponseEntity.ok(new ApiResponse(true, "Bookmark Deleted Successfully"));
    }

    @GetMapping("users/{username}/history")
    public List<SearchHistory> getHistoryCreatedBy(@PathVariable(value = "username") String username) {
        return searchHistoryService.getHistoryCreatedBy(username);
    }

}
