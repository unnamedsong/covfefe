package com.example.covfefe.controller;

import com.example.covfefe.exception.ResourceNotFoundException;
import com.example.covfefe.model.User;
import com.example.covfefe.payload.*;
import com.example.covfefe.repository.UserRepository;
import com.example.covfefe.security.CurrentUser;
import com.example.covfefe.security.UserPrincipal;
import com.example.covfefe.service.BookmarkService;
import com.example.covfefe.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookmarkService bookmarkService;

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
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/users/{username}/bookmarks")
    public PagedResponse<BookmarkResponse> getBookmarksCreatedBy(@PathVariable(value = "username") String username,
                                                             @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                             @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return bookmarkService.getBookmarksCreatedBy(username, page, size);
    }

}
