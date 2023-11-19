require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../models');
const { tokenMiddleware } = require('../middlewares/auth');
const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, userPw, comparePw, userId } = req.body;
  const hashedPw = await bcrypt.hash(userPw, 10);
  const user = await Users.findOne({ where: { email } });

  try {
    // 정보가 없는 경우
    if (!(email && userPw && comparePw && userId)) {
      res.status(400).json({ success: 'false', message: '전부 입력이 필요합니다' });
      return;
    }

    // 중복된 이메일인 경우
    if (user) {
      res.status(409).json({ success: false, message: '이미 가입된 회원입니다' });
      return;
    }

    // 형식이 비정상적인 경우
    if (userId === (undefined || !String) || email === (undefined || !String) || userPw === (undefined || !String)) {
      res.status(412).json({ success: false, message: '형식이 일치하지 않습니다' });
      return;
    }

    // 패스워드6자가 넘지 않을 경우
    if (userPw <= 6) {
      res.status(412).json({ success: false, message: '패스워드는 6자를 넘어주세요' });
      return;
    }

    // 확인패스워드가 정확하지 않는경우
    if (userPw !== comparePw) {
      res.status(412).json({ success: false, message: '패스워드가 정확하지 않습니다.' });
      return;
    }

    const createUser = await Users.create({ userId, email, userPw: hashedPw });

    res.status(200).json({ success: true, message: '회원가입에 성공했습니다', data: { userId, email } });
  } catch (err) {
    console.error('회원 가입 오류', err);
    return res.status(500).json({ success: false, message: '서버 오류 발생' });
  }
});

// 로그인
router.post('/signin', async (req, res) => {
  try {
    const { email, userPw } = req.body;
    const user = await Users.findOne({ where: { email } });

    const userId = user.userId;

    // 회원 정보가 없는 경우
    if (!user) {
      res.status(400).json({ success: false, message: '가입 정보가 없습니다.' });
      return;
    }

    const pwMatch = await bcrypt.compare(userPw, user.userPw);

    // 정보가 없는 경우
    if (!(email && userPw)) {
      res.status(400).json({ success: false, message: '전부 입력이 필요합니다' });
      return;
    }

    // 형식이 비정상적인 경우
    if (email === (undefined || !String) || userPw === (undefined || !String)) {
      res.status(412).json({ success: false, message: '형식이 일치하지 않습니다' });
      return;
    }

    // 비밀번호가 일치하지 않을 경우
    if (!pwMatch) {
      res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '12h' });
    res.header('Authorization', `Bearer ${token}`);
    res.status(200).json({ success: true, message: '로그인에 성공했습니다' });
  } catch (err) {
    console.error('회원 가입 오류', err);
    return res.status(500).json({ success: false, message: '서버 오류 발생' });
  }
});

// 정보 조회
router.get('/myinfo', tokenMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user;
    const user = await Users.findOne({ where: { userId } });

    console.log(user);
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const userInfo = {
      userId: user.userId,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(200).json({ userInfo });
  } catch (err) {
    console.error('사용자 정보 조회 오류', err);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

module.exports = router;
