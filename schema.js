const Joi = require('joi');

const listingJoiSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('', null),
    image: Joi.object({
      filename: Joi.string().allow('', null),
      url: Joi.string().allow('', null)
    }).allow('', null),
    price: Joi.number().min(0).required(),
    location: Joi.string(),
    country: Joi.string()
  }).required()
});

module.exports = { listingJoiSchema };

module.exports.reviewSchema= Joi.object({
  review: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
  }).required()
})