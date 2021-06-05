## 개발 환경 설정

`.vscode/settings.json` 폴더 및 파일 추가

```javascript
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
}
```

1. `.env` 및 `.env.dev` 파일 생성
2. `.env`, `.env.dev` 파일에 `.env.example`에 맞춰 파일 작성

```javascript
# 서버 포트
PORT=

# 데이터 베이스 타입
DATABASE_TYPE=

# 데이터 베이스 주소
DATABASE_HOST=

# 데이터 베이스 포트
DATABASE_PORT=

# 데이터 베이스 유저
DATABASE_USERNAME=

# 데이터 베이스 비밀번호
DATABASE_PASSWORD=

# 데이터 베이스 entity 위치
DATABASE_ENTITY=

# 데이터 베이스 migration 위치
DATABASE_MIGRATE=

# 데이터베이스 subscribers
DATABASE_SUBSCRIBERS=

# JWT SECRET
JWT_SECRET=
```

## 실행

```javascript
npm run start // prod 서버 실행

npm run start:dev // dev 서버 실행

npm run build // 서버 빌드
```
