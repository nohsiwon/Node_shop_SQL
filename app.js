const express = require('express');
const app = express();
const port = 3000;

const productRouter = require('./routes/products.router');
const userRouter = require('./routes/users.router');

app.use(express.json());
app.use('/api', [productRouter, userRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다');
});
