const tencentcloud = require("tencentcloud-sdk-nodejs");
const secret = require("./_secret");
const FtClient = tencentcloud.ft.v20200304.Client;
async function getImageTransform(Url){
  const clientConfig = {
    credential: 
      // Secret,
      secret.getSecret(),
    // {
      // secretId: "AKIDsa4KNBM39zZu0rnntkOp34pKZXFgKlPo",
      // secretKey: "HIEwNYShxxiCPL1QZR2MRGo55pJXUJuH",
    // },
    region: "ap-beijing",
    profile: {
      httpProfile: {
        endpoint: "ft.tencentcloudapi.com",
      },
    },
  };

  console.log('clientConfig',clientConfig)

  const client = new FtClient(clientConfig);
  const params = {
      "Url": Url, // "https://7463-tcbc-dev-1gin1f3b2d4d3015-1305897839.tcb.qcloud.la/my-image.jpg",
      "RspImgType": "url"
  };
  return new Promise((resolve) => {
    client.FaceCartoonPic(params).then(
      (data) => {
        console.log('Promise data',data);
        resolve({'data':data, 'params':params})
      },
      (err) => {
        console.error("error", err);
        resolve({'error':err, 'params':params})
      }
    );
  });
}

module.exports = {
  getImageTransform
}