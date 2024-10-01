require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const {URLModel} = require("./models")
const bodyParser = require("body-parser");
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// end point to save the url
app.post('/api/shorturl',async(req,res)=>{
  const {url} = req.body
  const reg = new RegExp(`https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}\/?`)

  if(!reg.test(url)) return res.json({ error: 'invalid url' })
  const newUrl = new URLModel({
    original_url:url
  })
  await newUrl.save()
  const newUrlObj = newUrl.toObject();
  return res.json({original_url:newUrlObj.original_url,short_url:newUrl.short_url})
})


//endpoint to redirect to the original url
app.get('/api/shorturl/:short_url',async(req,res)=>{
  const {short_url} = req.params
  const retrievedUrl = await URLModel.findOne({short_url})
  if(!retrievedUrl) return res.json({success:false,error:"Short_url not registered"})
  return res.redirect(retrievedUrl.original_url)
})


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
