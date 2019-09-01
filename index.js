const fetch = require('node-fetch');
const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB_MONGO_URL, {useNewUrlParser: true});
const List = mongoose.model('List', { date: Date, users: [Object] });

async function getToken () {
  let response = await fetch("https://api.twitter.com/oauth2/token", {
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${process.env.TWITTER_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  let data = await response.json();
  return data;
}

async function getList(token) {
  return await fetch(`https://api.twitter.com/1.1/followers/list.json?cursor=-1&count=200&screen_name=${process.env.TWITTER_HANDLE}&skip_status=true&include_user_entities=false`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => response.json())
}

async function writeUsers() {
  const token = await getToken();
  const list = await getList(token.access_token);
  const kitty = new List({ date: new Date, users: list.users });
  return kitty.save();
}

async function checkList() {
  const list = await List.find({}).sort({date:1}).limit(2);
  if(list.length > 1){
    //if(list[1].users.length - list[0].users.length > 0){
      await fetch("https://api.pushbullet.com/v2/pushes", {
        body: `{\"body\":\"${list[1].users.length - list[0].users.length} followers en moins\",\"title\":\"Unfollowing\",\"type\":\"note\"}`,
        headers: {
          "Access-Token": process.env.PUSHBULLET,
          "Content-Type": "application/json"
        },
        method: "POST"
      })
    //}     
  }
}

async function main() {
  try{
    console.log('step 1')
    await writeUsers();
    console.log('step 2')
    await checkList();
    console.log('the end')
    process.exit()
  } catch(err ){
    console.error(err)
  }
}

main();