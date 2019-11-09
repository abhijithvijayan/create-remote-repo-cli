const inquirer = require('inquirer');

const Spinner = require('./utils/spinner');
const questions = require('./utils/questions');
const { createRepository } = require('./utils/repo');
const validateArgsAndInputs = require('./utils/validate');
const { flashError, showCLIVersion, displayRepoCreationFailure } = require('./utils/error');

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
		// get user options
		const repoOptions = await inquirer.prompt(questions);

		const { isPrivate } = repoOptions;
		console.log();
		const spinner = new Spinner(`Creating ${isPrivate ? 'private' : 'public'} Repository ${repoName} on GitHub...`);
		spinner.start();

		/**
		 * ToDo:
		 * 	1. get orgs with octokit auth
		 *  2. Inquire where to create repo
		 *  3. create in org/user account
		 */

		// create remote repo
		const repo = await createRepository({ repoName, ...repoOptions });

		if (!repo) {
			spinner.stop();
			displayRepoCreationFailure();
		}

		spinner.succeed(`Successfully initialized ${isPrivate ? 'private' : 'public'} Repository \`${repoName}\``);
		spinner.stop();
	}
};
