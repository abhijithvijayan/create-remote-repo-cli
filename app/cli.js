/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const inquirer = require('inquirer');

const Spinner = require('./utils/spinner');
const questions = require('./utils/questions');
const { createRepository } = require('./utils/repo');
const validateArgsAndInputs = require('./utils/validate');
const { flashError, showCLIVersion, displayRepoCreationFailure } = require('./utils/error');

const options = {};

const createRemoteRepoCLI = async (_input, _options) => {
	const err = validateArgsAndInputs(_input, _options);

	if (err) {
		flashError(err);

		return;
	}

	const { version, repoName } = options;

	if (version) {
		showCLIVersion();

		return;
	}

	if (repoName) {
		// get user options
		const repoOptions = await inquirer.prompt(questions);

		const { isPrivate } = repoOptions;

		// Refactor when https://github.com/sindresorhus/ora/issues/134 is resolved
		console.log();
		const spinner = new Spinner({
			text: `Creating ${isPrivate ? 'private' : 'public'} Repository \`${repoName}\` on GitHub...`,
			discardStdin: false,
		});
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

			return;
		}

		spinner.succeed(`Successfully initialized ${isPrivate ? 'private' : 'public'} repository \`${repoName}\``);
		spinner.stop();
	}
};

module.exports.options = options;
module.exports = createRemoteRepoCLI;
