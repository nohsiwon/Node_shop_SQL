const express = require('express');
const router = express.Router();

const Products = require('../schemas/products.schema.js');

// 상품 작성 API
router.post('/products', async (req, res) => {
  const { title, content, author, password, status, createdAt } = req.body;

  const createProduct = await Products.create({ title, content, author, password, status, createdAt });

  res.json({ message: '판매 상품을 등록하였습니다' });
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  const products = await Products.find().sort({ createdAt: -1 });
  if (products) {
    const result = products.map((product) => {
      return {
        _id: product._id,
        title: product.title,
        author: product.author,
        status: product.status,
        createdAt: product.createdAt,
      };
    });

    return res.json({ result });
  } else {
    return res.status(404).json({ success: false, errorMessage: '아무 상품도 존재하지 않습니다' });
  }
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  const findProduct = await Products.findOne({ _id: productId });
  if (findProduct) {
    const result = {
      _id: findProduct._id,
      title: findProduct.title,
      content: findProduct.content,
      author: findProduct.author,
      status: findProduct.status,
      createdAt: findProduct.createdAt,
    };

    return res.json({ result });
  } else {
    return res.status(404).json({ success: false, errorMessage: '상품이 존재하지 않습니다' });
  }
});

// 상품 정보 수정 API
router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { title, content, status, password } = req.body;

  const findProduct = await Products.findOne({ _id: productId });

  if (findProduct) {
    if (findProduct.password !== password) {
      return res.status(400).json({ success: false, errorMessage: '비밀번호가 일치하지 않습니다' });
    }
    await Products.updateOne({ _id: productId }, { $set: { title, content, status } });
    return res.json({ message: '상품 정보를 수정하였습니다' });
  } else {
    return res.status(400).json({ success: false, errorMessage: '상품 조회에 실패하였습니다.' });
  }
});

// 상품 삭제 API
router.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;

  const deleteProduct = await Products.findOne({ _id: productId });
  if (deleteProduct) {
    if (deleteProduct.password !== password) {
      return res.status(400).json({ success: false, errorMessage: '비밀번호가 일치하지 않습니다' });
    }
    await Products.deleteOne({ _id: productId, password });
  } else {
    return res.status(400).json({ success: false, errorMessage: '상품 조회에 실패하였습니다' });
  }

  res.json({ message: '상품을 삭제하였습니다' });
});

module.exports = router;
