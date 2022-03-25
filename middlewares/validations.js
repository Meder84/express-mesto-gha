const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { regexLink } = require('../config/constants');

const registerValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть больше 8и символов',
    }),
  }),
});

const userValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
  }),
});

const userValidId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const cardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexLink),
  }),
});

const cardIdValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

const avatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexLink),
  }),
});

module.exports = {
  registerValid,
  userValid,
  userValidId,
  cardValid,
  cardIdValid,
  avatarValid,
};