# Covfefe

## 카카오 책 검색 API를 이용한 애플리케이션

### 시작하기 

1. **Mysql database 생성**

    ```bash
    create database covfefe
    ```

2. **src/main/resources/application.yml 의 db 접속 정보 수정**

    `spring.datasource.username` 과 `spring.datasource.password` 수정

3. **서버 실행**

    ```bash
    ./gradlew bootRun
    ```
    
4. **spring security 에 사용할 기본 Role 추가**

    ```sql
    INSERT INTO roles(name) VALUES('ROLE_USER')
    INSERT INTO roles(name) VALUES('ROLE_ADMIN');
    ```

### Front end app (client)

`client` 폴더로 이동 -

```bash
cd client
```

```bash
npm install && npm start
```

`3000` 포트에서 front-end server 동작 확인

### 사용 라이브러리 

- Java 1.8
- Spring Boot
- Spring Security
- JPA
- MySql
- Redis
- jackson
- JWT

