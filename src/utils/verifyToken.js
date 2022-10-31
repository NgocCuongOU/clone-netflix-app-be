const jwt = require("jsonwebtoken");

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.accesstoken;

  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, process.env.SECRET_KEY, (error, user) => {
      if (error)
        res.status(403).json({
          statusCode: 403,
          message: "Access Token is invalid!!!",
        });

      req.user = user;

      next();
    });
  } else {
    return res.status(401).json({
      statusCode: 401,
      message: "You are not authenticated!!!",
    });
  }
}

module.exports = verifyAccessToken;
