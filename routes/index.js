var express = require('express');
var router = express.Router();
const seedrandom = require('seedrandom');

const config = require('../config');
// Square Connect JavaScript SDKを初期化します
const SquareConnect = require('square-connect');
SquareConnect
  .ApiClient
  .instance
  .authentications
  .oauth2
  .accessToken = config.square.accessToken;

// 決済ページです
router.get('/', (req, res, next) => {
  res.render('index', {
    applicationId: config.square.applicationId,
    locationId: config.square.locationId
  });
});

// 決済処理です
router.post('/pay', (req, res, next) => {
  // Square APIから取得した一時的に使えるカードトークン
  const nonce = req.body.nonce;
  // 店舗ID
  const locationId = config.square.locationId;
  
  const api = new SquareConnect.TransactionsApi();
  
  // リクエストパラメータを組み立てます
  // ランダムなキー、金額、カードトークンが最低限必要です
  const body = {
    idempotency_key: `ORDER.${Math.random() * 10000000000000}`,
    amount_money: {
      amount: 1000,
      currency: 'JPY'
    },
    card_nonce: nonce
  }
  // 決済処理を実行します
  api.charge(locationId, body).then(data => {
    // 完了したらリダイレクトします（再読み込み防止のため）
    res.redirect(`/complete?id=${data.transaction.id}`);
  }, (err) => {
    console.error(err);
    res.render('error', {error: err})
  });
});

// 注文完了ページ用です
router.get('/complete', (req, res, next) => {
  res.render('complete', {
    id: req.query.id
  });
});

module.exports = router;
