const Jio = require("joi");

function validate(schema) {
  return function (req, res, next) {
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    } else {
      next();
    }
  };
}

module.exports = validate;

// const validate = (schema) => {
//     return (req, res, next) => {
//       const validationResult = schema.validate(req.body);
//       if (validationResult.error) {
//         res.status(400).json({ error: validationResult.error.details[0].message });
//       } else {
//         next();
//       }
//     };
//   };
