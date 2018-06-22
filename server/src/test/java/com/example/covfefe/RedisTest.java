package com.example.covfefe;

import com.example.covfefe.model.SearchHistory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RedisTest {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void testRedis() {
        String key = "redis_test";
        redisTemplate.opsForValue().set(key, "Hello Redis");
        String value = (String) redisTemplate.opsForValue().get(key);

        assertEquals("Hello Redis", value);

    }

    @Test
    public void testListOperations() {

        String KEY_NAME = "user:foo";

        ListOperations<String, SearchHistory> listOps = redisTemplate.opsForList();

        SearchHistory searchHistory1 = new SearchHistory();
        searchHistory1.setKeyword("goooooooogle");
        searchHistory1.setCreatedAt(Instant.now());

        listOps.leftPush(KEY_NAME, searchHistory1);

        SearchHistory searchHistory2 = new SearchHistory();
        searchHistory2.setKeyword("aviaaaaato");
        searchHistory2.setCreatedAt(Instant.now());

        listOps.leftPush(KEY_NAME, searchHistory2);

        List<SearchHistory> searchHistories = listOps.range(KEY_NAME, 0, -1);

        for (SearchHistory searchHistory : searchHistories) {
            System.out.println(searchHistory.getKeyword());
            System.out.println(searchHistory.getCreatedAt());
        }

    }
}
