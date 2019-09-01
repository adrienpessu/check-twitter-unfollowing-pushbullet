# check-twitter-unfollowing-pushbullet
Check if you get twitter unfollowers store it in a mongo database and send you a notification with pushbullet if there is unfollowers

## installation 
```npm install```

Create .env file or create environment variables with the followings : 
- DB_MONGO_URL : Mongo URL
- TWITTER_KEY : Twitter key and secret separated by two dots (:)
- TWITTER_HANDLE : Twitter Handle
- PUSHBULLET : Pushbullet key
