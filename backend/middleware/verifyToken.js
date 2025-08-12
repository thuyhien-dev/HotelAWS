const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

const REGION = 'ap-southeast-1'; 
const USER_POOL_ID = 'ap-southeast-1_Yp10no146';

let pems;

async function getPems() {
  if (pems) return pems;

  const url = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
  const { data } = await axios.get(url);

  pems = {};
  data.keys.forEach(key => {
    pems[key.kid] = jwkToPem(key);
  });

  return pems;
}

module.exports = async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Thiếu token' });

  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) throw new Error('Không giải mã được token');

    const pems = await getPems();
    const pem = pems[decoded.header.kid];
    if (!pem) throw new Error('Không tìm thấy PEM phù hợp');

    jwt.verify(token, pem, (err, payload) => {
      if (err) return res.status(401).json({ message: 'Token không hợp lệ' });
      req.user = payload;
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Xác thực thất bại', error: err.message });
  }
};
