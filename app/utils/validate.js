const isArray = require('validate.io-array');
const isObject = require('validate.io-object');
const isString = require('validate.io-string-primitive');
const validateName = require('validate-npm-package-name');
const isBoolean = require('validate.io-boolean-primitive');

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
	if (!_input.length && !Object.entries(_options).length) {
		return new TypeError(`invalid input. Must supply atleast an argument or some option.`);
	}

	/**
	 *  Throw error if the name is not valid
	 */
	if (_input.length) {
		const appName = _input[0];
		const validationResult = validateName(appName);

		if (!validationResult.validForNewPackages) {
			return new TypeError(`invalid input argument. The repo name is not valid. Value: \`${appName}\`.`);
		}
		// push to object
		options.repoName = appName;
	}

	/**
	 *  Map `v` to `--version`
	 */
	if (
		Object.prototype.hasOwnProperty.call(_options, 'version') ||
		Object.prototype.hasOwnProperty.call(_options, 'v')
	) {
		options.version = _options.version || _options.v;

		if (!isBoolean(options.version)) {
			return new TypeError(`invalid option. Version option must be a boolean primitive.`);
		}
	}

	return null;
};

module.exports = validateArgsAndInputs;