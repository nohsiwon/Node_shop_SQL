require('dotenv').config();
const express = require('express');
const { Products } = require('../models');
const { tokenMiddleware } = require('../middlewares/auth');
const router = express.Router();

// 상품 생성 API
router.post('/products', tokenMiddleware, async (req, res) => {
  const { title, content } = req.body;

  const createProduct = await Products.create({ title, content, userId: res.locals.user });

  res.json({ message: '판매 상품을 등록하였습니다' });
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  const { sort } = req.query;

  const products = await Products.findAll({
    attributes: ['id', 'title', 'content', 'userId', 'status', 'createdAt'],
  });
  products.sort((a, b) => {
    if (sort === 'asc') {
      return a.id > b.id ? 1 : -1;
    } else if (sort === 'desc') {
      return a.id < b.id ? 1 : -1;
    } else {
      return a.id < b.id ? 1 : -1;
    }
  });

  res.json({ products });
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  const findProduct = await Products.findOne({ where: { id: productId } });
  if (findProduct) {
    const result = {
      id: findProduct.id,
      title: findProduct.title,
      content: findProduct.content,
      userId: findProduct.userId,
      status: findProduct.status,
      createdAt: findProduct.createdAt,
    };

    return res.json({ result });
  } else {
    return res.status(404).json({ success: false, errorMessage: '상품이 존재하지 않습니다' });
  }
});

// 상품 정보 수정 API
router.put('/products/:productId', tokenMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { title, content, status } = req.body;

  const findProduct = await Products.findOne({ where: { id: productId } });
  if (findProduct) {
    if (findProduct.userId === res.locals.user) {
      await findProduct.update({ title, content, status });
      return res.json({ message: '상품 정보를 수정하였습니다' });
    } else {
      return res.status(400).json({ success: false, errorMessage: '다른 사용자의 상품입니다' });
    }
  } else {
    return res.status(400).json({ success: false, errorMessage: '상품 조회에 실패하였습니다.' });
  }
});

// 상품 삭제 API
router.delete('/products/:productId', tokenMiddleware, async (req, res) => {
  const { productId } = req.params;

  const deleteProduct = await Products.findOne({ where: { id: productId } });
  if (deleteProduct) {
    if (deleteProduct.userId !== res.locals.user) {
      return res.status(400).json({ success: false, errorMessage: '다른 사용자의 상품입니다' });
    }
    await deleteProduct.destroy();
  } else {
    return res.status(400).json({ success: false, errorMessage: '상품 조회에 실패하였습니다' });
  }

  res.json({ message: '상품을 삭제하였습니다' });
});

module.exports = router;
