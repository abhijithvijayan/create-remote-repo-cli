#!/usr/bin/env node

/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const inquirer = require('inquirer');

const cli = require('./cli');
const Spinner = require('./utils/spinner');
const validator = require('./utils/validate');
const questions = require('./utils/questions');
const { flashError } = require('./utils/messages');
const { createRepository, updateLocalRepo } = require('./utils/repo');

(async () => {
	const { validate } = validator;
	// validate cli args & input
	const err = validate(cli.input, cli.flags);

	if (err) {
		flashError(err);
		return;
	}

	const {
		options: { repoName },
	} = validator;

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
})();
