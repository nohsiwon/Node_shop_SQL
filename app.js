const express = require('express');
const app = express();
const port = 3000;

const productRouter = require('./routes/products.router.js');
const connect = require('./schemas');
connect();

app.use(express.json());
app.use('/api', [productRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다');
});
