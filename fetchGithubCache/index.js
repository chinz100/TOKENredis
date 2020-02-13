
const express = require('express');
const axios = require('axios');
const redis = require('redis');
const app = express();

const redisClient = redis.createClient(6379, '192.168.99.100') //6379 : 


redisClient.set('visits', '{ "block": "1", "ms": "2000"}' )
redisClient.get("visits", function(err, reply) {
  const  resPayload = JSON.parse(reply.toString())
  console.log(resPayload.ms); // Will print `OK`
});

app.get('/', async (req, res) => {
 
    const username = req.query.username || 'devahoy';
    const url = `https://api.github.com/users/${username}`;

    redisClient.get(username, async (err, reply) =>{
        if(reply){
        return res.json(JSON.parse(reply));
    }  
  
    const response = await axios.get(url);
  
    //redisClient.hset("hash key", "hashtest 1", "some value");
    redisClient.setex(username, 1, JSON.stringify(response.data));
    //redisClient.set(username, JSON.stringify(response.data), redis.print);
    res.json(response.data);
    }) 
});
app.listen(9000, () => {
  console.log('App is running on port 9000');
});
