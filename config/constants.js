const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const regexLink = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+#*/;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  regexLink,
};
