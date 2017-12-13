// 注文するボタンが押された時の処理
function requestCardNonce(event) {
  event.preventDefault();
  paymentForm.requestCardNonce();
}

// Squareの決済フォーム周りの処理を行うオブジェクト
var paymentForm = new SqPaymentForm({
  // 個人の設定
  applicationId: applicationId,
  locationId: locationId,
  // Bootstrap用に変更
  inputClass: 'form-control',
  
  inputStyles: [{
      fontSize: '.9em'
  }],
  // プレイスホルダーを日本語に変更しています
  cardNumber: {
    elementId: 'sq-card-number',
    placeholder: 'カード番号'
  },
  cvv: {
    elementId: 'sq-cvv',
    placeholder: 'CVV'
  },
  expirationDate: {
    elementId: 'sq-expiration-date',
    placeholder: 'MM/YY'
  },
  postalCode: {
    elementId: 'sq-postal-code'
  },
  callbacks: {
    methodsSupported: function (methods) {},
    createPaymentRequest: function () {
      var paymentRequestJson ;
      return paymentRequestJson ;
    },
    // カードの一時トークンを受け取った時の処理
    cardNonceResponseReceived: function(errors, nonce, cardData) {
      if (errors) {
        console.log("Encountered errors:");
        errors.forEach(function(error) {
          console.log('  ' + error.message);
        });
        return;
      }
      // 一時トークンを保存
      document.getElementById('card-nonce').value = nonce;
      // フォームを送信
      document.getElementById('nonce-form').submit();
    },

    unsupportedBrowserDetected: function() {
    },

    inputEventReceived: function(inputEvent) {
    },

    paymentFormLoaded: function() {
    }
  }
});
