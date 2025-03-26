const { success, error } = require('../shared/response');

const Joi = require('joi');
const schema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().max(500),
  userId: Joi.string().required()
});



exports.handler = async (event) => {
  return { 
    statusCode: 200, 
    body: JSON.stringify({ message: 'Working!' }) 
  }
}
