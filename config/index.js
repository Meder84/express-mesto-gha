const SALT_ROUNDS = 10;
const JWT_SECRET = 'JWT_SECRET';
const { PORT = 3000 } = process.env;

module.exports = {
  SALT_ROUNDS,
  JWT_SECRET,
  PORT,
};
