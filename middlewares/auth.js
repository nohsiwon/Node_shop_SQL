require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const verify = async (token) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      try {
        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          message: err.message,
        };
      }
    } else {
      return {
        ok: false,
        message: err.message,
      };
    }
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

module.exports = {
  async tokenMiddleware(req, res, next) {
    try {
      if (req.headers['authorization']) {
        const auth = req.headers.authorization;
        const [Bearer, token] = auth.split(' ');
        const authResult = verify(token);
        if (Bearer !== 'Bearer') {
          res.status(401).json({ success: false, message: '올바른 형태의 token이 아닙니다.' });
          return;
        }

        if (authResult.ok === false && authResult.message === 'jwt expired') {
          res.status(401).json({
            success: false,
            message: '토큰이 만료되었습니다',
          });
          return;
        }
        const decodedUserId = jwt.decode(token);
        console.log(decodedUserId);

        res.locals.user = decodedUserId.userId;

        next();
      } else {
        res.status(400).json({ success: false, message: '로그인 후 이용바랍니다' });
      }
    } catch (err) {
      res.status(400).json({ success: false, message: '인증 실패했습니다', err });
    }
  },
};
