require('dotenv').config();
const express = require('express');
const { Products } = require('../models');
const { tokenMiddleware } = require('../middlewares/auth');
const router = express.Router();

// 상품 생성 API
router.post('/products', tokenMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const createProduct = await Products.create({ title, content, userId: res.locals.user });

    res.json({ success: true, message: '판매 상품을 등록하였습니다' });
  } catch (err) {
    res.status(400).json({ success: false, message: '상품 등록에 실패했습니다', err });
  }
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  try {
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

    res.json({ success: true, message: '상품 목록 조회했습니다', products });
  } catch (err) {
    res.status(400).json({ success: false, message: '상품 조회에 실패했습니다', err });
  }
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  try {
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

      return res.json({ success: true, message: '상품 상세 조회 성공했습니다', result });
    } else {
      return res.status(404).json({ success: false, errorMessage: '상품이 존재하지 않습니다' });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: '상품 조회에 실패했습니다' });
  }
});

// 상품 정보 수정 API
router.put('/products/:productId', tokenMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { title, content, status } = req.body;

  try {
    const findProduct = await Products.findOne({ where: { id: productId } });
    if (findProduct) {
      if (findProduct.userId === res.locals.user) {
        await findProduct.update({ title, content, status });
        return res.json({
          success: true,
          message: '상품 정보를 수정하였습니다',
          data: { title, content, userId: res.locals.user, status },
        });
      } else {
        return res.status(403).json({ success: false, errorMessage: '수정 권한이 존재하지 않습니다' });
      }
    } else {
      return res.status(400).json({ success: false, errorMessage: '상품을 찾을 수 없습니다' });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: '상품 수정 실패했습니다', err });
  }
});

// 상품 삭제 API
router.delete('/products/:productId', tokenMiddleware, async (req, res) => {
  const { productId } = req.params;

  try {
    const deleteProduct = await Products.findOne({ where: { id: productId } });
    if (deleteProduct) {
      if (deleteProduct.userId !== res.locals.user) {
        return res.status(403).json({ success: false, errorMessage: '삭제 권한이 존재하지 않습니다' });
      }
      await deleteProduct.destroy();
    } else {
      return res.status(400).json({ success: false, errorMessage: '상품을 찾을 수 없습니다' });
    }

    res.json({ success: true, message: '상품을 삭제하였습니다' });
  } catch (err) {
    res.status(400).json({ success: false, message: '상품 삭제에 실패했습니다', err });
  }
});

module.exports = router;
