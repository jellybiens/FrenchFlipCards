
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const authHeader = req.get('Authorization');
  if(!authHeader) {
    req.isLoggedIn = false;
    req.isAdmin = false;
    return next();
  }

  const token = authHeader.split(' ')[1];

  if(!token || token === '') {
    req.isLoggedIn = false;
    req.isAdmin = false;
    return next();
  }

  let decodedNormie, decodedAdmin;

  jwt.verify(token, process.env.NORMIE_TOKEN, (err, decoded) => decodedNormie = decoded ? decoded : false);
  jwt.verify(token, process.env.ADMIN_TOKEN, (err, decoded) => decodedAdmin = decoded ? decoded : false);

  if(!decodedNormie && !decodedAdmin){
    req.isLoggedIn = false;
    req.isAdmin = false;
    return next();
  }

req.isLoggedIn = decodedNormie ? true : false;
req.isAdmin = decodedAdmin ? true : false;
req.userid = decodedNormie ? decodedNormie.userid : decodedAdmin.userid;
next();

}
