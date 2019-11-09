const validateArgsAndInputs = require('./utils/validate');
const { flashError } = require('./utils/error');

const options = {};

module.exports.options = options;

module.exports = (_input, _options) => {
	const err = validateArgsAndInputs(_input, _options);

	if (err) {
		flashError(err);
	}

	console.log(options);
};
