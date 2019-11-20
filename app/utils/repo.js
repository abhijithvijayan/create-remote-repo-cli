/* eslint-disable camelcase */
const Octokit = require('@octokit/rest');
const inquirer = require('inquirer');
const execa = require('execa');
const fs = require('fs');

const Spinner = require('./spinner');
const { showInvalidTokenError, showOrgTokenScopeError, showLocalRepoUpdateError } = require('./messages');

/**
 *  Get a list of GitHub orgs user is member of
 */
const getUserOrganisations = async octokit => {
	try {
		const { data } = await octokit.orgs.listForAuthenticatedUser();

		return data;
	} catch (err) {
		showOrgTokenScopeError();
	}

	return [];
};

/**
 *  Verify user authentication
 */
const getUserDetails = async octokit => {
	const authSpinner = new Spinner(`Authenticating with GitHub. Please wait...`);

	try {
		authSpinner.start();
		const { data } = await octokit.users.getAuthenticated();

		authSpinner.stop();
		return data.login;
	} catch (err) {
		authSpinner.stop();

		showInvalidTokenError();
	}

	return null;
};

/**
 *  Find the target account to create repository
 */
const getTargetToInstallRepo = async ({ octokit, user }) => {
	const userAccount = { name: user, id: 0 };
	let targetAccount = userAccount;

	const orgList = await getUserOrganisations(octokit);

	if (orgList.length) {
		let choices = orgList.map(org => {
			return {
				name: `${org.login}: ${org.description}`,
				value: { name: org.login, id: org.id },
			};
		});

		/**
		 * 	inject user account to choice list
		 */
		choices = [{ name: `${user}: Your Personal Account`, value: userAccount }, ...choices];

		// prompt choices to user
		({ targetAccount } = await inquirer.prompt([
			{
				type: 'list',
				name: 'targetAccount',
				message: 'Where do you want to create the Repository?',
				choices,
			},
		]));
	}

	return targetAccount;
};

/**
 *  Handle repository creation
 */
const createRepository = async (
	{ token = '', repoName, description, isPrivate, hasIssues, hasProjects, hasWiki },
	spinner
) => {
	// Handle if token is not valid
	const octokit = new Octokit({
		auth: token,
	});

	// Authenticate to identify user
	const user = await getUserDetails(octokit);

	if (user) {
		const targetAccount = await getTargetToInstallRepo({ octokit, user });

		const repoOptions = {
			name: repoName,
			description,
			private: isPrivate,
			has_issues: hasIssues,
			has_projects: hasProjects,
			has_wiki: hasWiki,
		};

		console.log();
		spinner.start();

		// create in org / user account
		switch (targetAccount.id) {
			case 0: {
				return octokit.repos.createForAuthenticatedUser(repoOptions);
			}

			default: {
				const opts = {
					...repoOptions,
					org: targetAccount.name,
				};

				return octokit.repos.createInOrg(opts);
			}
		}
	}

	process.exit(1);
};

/**
 *  Update Local Repo
 */
const updateLocalRepo = async ({ data: { html_url } }) => {
	try {
		if (fs.existsSync(`.git`)) {
			await execa('git', ['remote', 'remove', 'origin']);
		}

		await execa('git', ['init']);
		await execa('git', ['remote', 'add', 'origin', `${html_url}.git`]);
	} catch (err) {
		showLocalRepoUpdateError();
	}
};

module.exports = { createRepository, updateLocalRepo };
