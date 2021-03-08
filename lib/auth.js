const jwt = require("jsonwebtoken");
var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
//f@i#n%tne#ckfhlafkd0102test!@#%

// request->response로 갈때 중간에서 auth 검사 (미들웨어)
const authMiddleware = (req, res, next) => {
  const token = req.headers["ourtoken"] || req.query.token;
  console.error(token);
  if (!token) {
    return res.status(403).json({
      server: "우리서버",
      success: false,
      message: "not logged in",
    });
  }

  //Promiss : 순서대로 처리하기 위해 사용
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, tokenKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error) => {
    console.log(error);
    res.status(403).json({
      server: "우리서버",
      success: false,
      message: error.message,
    });
  };

  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
