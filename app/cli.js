/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const inquirer = require('inquirer');

const Spinner = require('./utils/spinner');
const questions = require('./utils/questions');
const { createRepository } = require('./utils/repo');
const validateArgsAndInputs = require('./utils/validate');
const { flashError, showCLIVersion } = require('./utils/error');

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
		console.log();
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

		let repo = null;
		let errMessage = null;

		try {
			// create remote repo
			repo = await createRepository({ repoName, ...repoOptions });

			spinner.succeed(`Successfully initialized ${isPrivate ? 'private' : 'public'} repository \`${repoName}\``);
		} catch (err) {
			errMessage = err && err.errors && err.errors[0].message;

			spinner.fail(`Failed to create ${isPrivate ? 'private' : 'public'} repository \`${repoName}\``);
		} finally {
			spinner.stop();
		}

		if (!repo && errMessage) {
			flashError(`Error: ${errMessage}`);
			// return;
		}
	}
};

module.exports.options = options;
module.exports = createRemoteRepoCLI;
