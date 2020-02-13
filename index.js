
require('./config/passsport-setup');
const express = require('express');
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');
const authRouters = require('./routes/auth-routes');
const bodyParser = require('body-parser');

const redisClient = redis.createClient({
  host: '192.168.99.101',
  port: 6379,
  password: "123456"
})
const app = express();
  
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});  
 

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
     
//app.use(app.oauth.authorize());

const asyncGet = promisify(redisClient.get).bind(redisClient);


/*
app.get('/public', function(req, res) {
  // Does not require an access_token.
  res.send('Public area');
});
*/ 
redisClient.on("error", function(error) {
  console.error(error);
});

/*
const reply1 = redisClient.get("visits");
//const  resPayload = JSON.parse(reply1);
console.log(reply1)
*/

app.get('/fetch', async (req, res) => {
  const username = req.query.username || 'devahoy';
  const url = `https://api.github.com/users/${username}`;
  const reply = await asyncGet(username);

  if(reply){  
    const  resPayload = JSON.parse(reply);
    return res.json(resPayload.login); }  
  const response = await axios.get(url);
  redisClient.setex(username, 10, JSON.stringify(response.data));
  return res.json(response.data);

}); 

app.set('view engine', 'ejs');
app.use('/auth', authRouters)

app.get('/', (req, res) => {
  res.render('home.ejs'); 
});
 
////cache fetch