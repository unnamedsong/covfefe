package com.example.covfefe.service;

import com.example.covfefe.model.SearchHistory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static com.example.covfefe.util.AppConstants.MAX_HISTORY_SIZE;

@Service
@Slf4j
public class SearchHistoryService {

    @Autowired
    private RedisTemplate redisTemplate;

    private static final String SEARCH_HISTORY_REDIS_KEY_PREFIX = "user:";

    public void save(String username, String query) {
        String key = SEARCH_HISTORY_REDIS_KEY_PREFIX + username;

        ListOperations<String, SearchHistory> listOperations = redisTemplate.opsForList();

        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setKeyword(query);
        searchHistory.setCreatedAt(Instant.now());

        listOperations.leftPush(key, searchHistory);
    }

    public List<SearchHistory> getHistoryCreatedBy(String username) {

        String key = SEARCH_HISTORY_REDIS_KEY_PREFIX + username;

        ListOperations<String, SearchHistory> listOperations = redisTemplate.opsForList();

        // 최근 50개 까지만..
        return listOperations.range(key, 0, MAX_HISTORY_SIZE - 1);
    }
}
