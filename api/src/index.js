const express = require('express');
const cors = require('cors');
const router = require('./routes/index.route.js')

const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  };
app.use(cors());
app.use('/',router)
app.use((req, res, next) => {
    res.status(404).send({error: 'not found'});
  });

app.listen(8080, (err) => {
    if (err) {
        console.error(err);
    }
    console.log('listening on port 8080');
})
module.exports = app;