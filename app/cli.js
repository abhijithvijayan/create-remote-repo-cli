const inquirer = require('inquirer');

const validateArgsAndInputs = require('./utils/validate');
const { flashError, showCLIVersion } = require('./utils/error');
const questions = require('./utils/questions');

const options = {};

module.exports.options = options;

module.exports = async (_input, _options) => {
	const err = validateArgsAndInputs(_input, _options);

	if (err) {
		flashError(err);
	}

	const { version, repoName } = options;

	if (version) {
		showCLIVersion();
	}

	if (repoName) {
		const answers = await inquirer.prompt(questions);
		console.log(answers);
	}
};
