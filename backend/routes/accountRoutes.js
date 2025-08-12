const express = require('express');
const router = express.Router();
const accountModel = require('../models/Account');
const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'ap-southeast-1',
});
const USER_POOL_ID = 'ap-southeast-1_Yp10no146';

// Lấy danh sách tài khoản
router.get('/', async (req, res) => {
  try {
    const accounts = await accountModel.getAll();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản', error: err.message });
  }
});

// Đếm tài khoản
router.get('/count', async (req, res) => {
  try {
    const count = await accountModel.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đếm tài khoản', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, password, name, ...rest } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và password là bắt buộc' });
    }

    await cognito.adminCreateUser({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: name || '' }
      ],
      MessageAction: 'SUPPRESS' 
    }).promise();

    await cognito.adminSetUserPassword({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    }).promise();

    const newAccount = await accountModel.create({ email, name, ...rest });

    res.status(201).json(newAccount);

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Tạo tài khoản thất bại', error: err.message });
  }
});

router.get('/:accountId', async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);
    const account = await accountModel.getByAccountId(accountId);
    if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy tài khoản', error: err.message });
  }
});

router.put('/:accountId', async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);
    const updatedAccount = await accountModel.update(accountId, req.body);
    res.json({ message: 'Cập nhật thành công', updatedAccount });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

router.delete('/:accountId', async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);
    const account = await accountModel.getByAccountId(accountId);

    if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    if (account.email) {
      try {
        await cognito.adminDeleteUser({
          UserPoolId: USER_POOL_ID,
          Username: account.email,
        }).promise();
      } catch (cognitoErr) {
        console.warn('Không xóa được user Cognito:', cognitoErr.message);
      }
    }

    await accountModel.delete(accountId);
    res.json({ message: 'Xóa thành công (Cognito + DynamoDB)' });
  } catch (err) {
    res.status(500).json({ message: 'Xóa thất bại', error: err.message });
  }
});

module.exports = router;
