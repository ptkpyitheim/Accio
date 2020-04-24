const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require("path");
const app = express();
var bodyParser = require('body-parser')

const DB_NAME = 'goLive';

app.use("/profilePictures", express.static(path.join(__dirname, "../profilePictures")));
app.use("/groupPictures", express.static(path.join(__dirname, "../groupPictures")));


morgan.token('authtoken', (req, res) => {
  return req.body.token || req.query.token;
});
app.use(morgan(':method :url :status :authtoken :response-time ms - :res[content-length]'));

app.use(bodyParser.json({
  type: "application/json"
}));
app.use(bodyParser.text({
  type: "application/base64",
  limit: 5000000 // 5Mb or 625KB
}));

app.use(require('./controllers'));

mongoose.connect('mongodb://localhost:27017/' + DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  
  app.listen(8080, function () {
    console.log('Listening on port 8080...');
  });
}).catch(err => {
  console.error(err);
});

