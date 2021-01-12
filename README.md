# github-commit-crawler

Github commit crawler with Nodejs, Slack API, Kakaowork Bot API

---

## 프론트엔드

- https://github.com/bengHak/garden_frontend
- http://dsc-hufs.ga

### 기능

- 매 시간마다 슬랙에 연동된 깃헙의 커밋 기록을 읽어서 Postgresql에 저장
- 커밋기록들을 REST API 제공
- 10시, 22시에 멤버들의 커밋상태를 카카오워크 Bot으로 알림 주기

### Slack Github 봇 연동

- https://slack.github.com/

### Slack API

- https://api.slack.com/ (이곳에서 Slack API 토큰을 받아옵니다)

### 카카오워크 Bot

- https://docs.kakaoi.ai/kakao_work/botdevguide/

### 서버 켜는 법

```
docker-compose up -d
```

### 환경변수 파일(.env)

```
- KAKAOWORK_API
- KAKAOWORK_CONVERSATION_ID
- SLACK_API_TOKEN
- SLACK_CHANNEL_ID
- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_PORT
- DB_HOST
- MEMBER_LIST=고병학,고병학 (띄어쓰기 없이 쉼표로 구분)
- MEMBER_LIST_GITHUB=bengHak,bengHak (띄어쓰기 없이 쉼표로 구분)
- TZ=Asia/Seoul
```

## 참고 깃허브

- https://github.com/junho85/garden5
