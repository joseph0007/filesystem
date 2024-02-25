const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_PRIVATEKEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendToken = async (
  user,
  statusCode,
  req,
  res,
  message = 'task sucssesful'
) => {
  const token = await createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user,
  });
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email address and password', 400));
  }

  const user = { 
    id: 1,
    name: "Joe" 
  };

  await createSendToken(user, 200, req, res, 'login successful');
};

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  //1.CHECK IF AUTHORIZATION WITH JWT TOKEN HAS BEEN SEND BY THE USER
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  //2.CHECK IF THERE IS A TOKEN
  if (!token) {
    return next(new AppError('You are not logged in.Please log in!', 401));
  }

  //check if token is valid and whether it is expired or not!!
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_PRIVATEKEY
  );

  // write auth code

  req.user = {
    username: "Joseph"
  };
  res.locals.user = {
    username: "Joseph"
  };
  next();
});