const isArray = require('validate.io-array');
const isObject = require('validate.io-object');
const isString = require('validate.io-string-primitive');
const validateName = require('validate-npm-package-name');

const cli = require('../cli');

const validateArgsAndInputs = (_input, _options) => {
	const { options } = cli;

	/**
	 *  Throw error if received input is not an Array
	 */
	if (!isArray(_input)) {
		return new TypeError(`invalid input argument. Input arguments must be an array. Value: \`${_input}\`.`);
	}

	/**
	 *  Throw error if received options is not an Object
	 */
	if (!isObject(_options)) {
		return new TypeError(`invalid input argument. Options argument must be an object. Value: \`${_options}\`.`);
	}

	/**
	 *  Throw error if no argument / input entered
	 */
	if (!_input.length || !Object.entries(_options).length) {
		return new TypeError(`invalid input. Must supply atleast a valid argument or some option.`);
	}

	/**
	 *  Throw error if the name is not valid
	 */
	if (_input.length) {
		const appName = _input[0];
		const validationResult = validateName(appName);

		if (!validationResult.validForOldPackages || !isString(appName)) {
			return new TypeError(`invalid input argument. The repo name is not valid. Value: \`${appName}\`.`);
		}
		// push to object
		options.repoName = appName;
	}

	return null;
};

module.exports = validateArgsAndInputs;
