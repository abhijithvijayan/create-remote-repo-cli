/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const inquirer = require('inquirer');

const Spinner = require('./utils/spinner');
const questions = require('./utils/questions');
const validateArgsAndInputs = require('./utils/validate');
const { flashError } = require('./utils/messages');
const { createRepository, updateLocalRepo } = require('./utils/repo');

const options = {};

const createRemoteRepoCLI = async (_input, _options) => {
	const err = validateArgsAndInputs(_input, _options);

	if (err) {
		flashError(err);

		return;
	}

	const { repoName } = options;

	if (repoName) {
		console.log();
		// prompt & get user options
		const repoOptions = await inquirer.prompt(questions);

		const { isPrivate } = repoOptions;

		// Refactor when https://github.com/sindresorhus/ora/issues/134 is resolved
		const spinner = new Spinner({
			text: `Creating ${isPrivate ? 'private' : 'public'} Repository \`${repoName}\` on GitHub...`,
			discardStdin: false,
		});

		let repo = null;
		let errMessage = null;

		try {
			// create remote repo
			repo = await createRepository({ repoName, ...repoOptions }, spinner);

			spinner.succeed(`Successfully initialized ${isPrivate ? 'private' : 'public'} repository \`${repoName}\``);
		} catch (err) {
			errMessage = err && err.errors && err.errors[0].message;

			spinner.fail(`Failed to create ${isPrivate ? 'private' : 'public'} repository \`${repoName}\``);
		} finally {
			spinner.stop();
		}

		if (!repo && errMessage) {
			flashError(`Error: ${errMessage}`);
			return;
		}
		console.log();

		const { initRepo } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'initRepo',
				message: 'Do you want to initialize a local project or update existing?',
			},
		]);

		// Update or create a git directory
		if (initRepo) {
			await updateLocalRepo(repo);
		}
	}
};

module.exports.options = options;
module.exports = createRemoteRepoCLI;
