const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
    confession: {type: "string", min: 1, max: 420},
    
    $$strict: true,
};

const checker=v.compile(schema)

module.exports = checker;