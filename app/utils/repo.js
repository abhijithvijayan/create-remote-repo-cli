const Octokit = require('@octokit/rest');
const inquirer = require('inquirer');

const getUserOrganisations = async octokit => {
	try {
		const { data } = await octokit.orgs.listForAuthenticatedUser();

		return data;
	} catch (err) {
		console.log(
			`You need to grant Org Permissions for your Personal Access Token, if you want to create a Repository for an Organization.`
		);
	}

	return [];
};

/**
 *  Find the target to create repository
 */
const getTargetToInstallRepo = async octokit => {
	let targetAccount = { account: 'username' };

	// ToDo: add spinner
	const orgList = await getUserOrganisations(octokit);

	if (orgList.length) {
		let choices = orgList.map(item => {
			return {
				name: `${item.login}: ${item.description}`,
				value: item.login,
			};
		});

		// ToDo: get username & add user to the list
		choices = [...choices, { name: 'username: Your Personal Account.', value: 'username ' }];

		// give choice to user
		targetAccount = await inquirer.prompt([
			{
				type: 'list',
				name: 'account',
				message: 'Where do you want to create the Repository?',
				choices,
			},
		]);
	}

	// ToDo: return default option to install to user account
	return targetAccount;
};

/**
 *  Create repository
 */
const createRepository = async ({ token = '', repoName, description, isPrivate, hasIssues, hasProjects, hasWiki }) => {
	// Handle if token is not valid
	const octokit = new Octokit({
		auth: token,
	});

	const { account } = await getTargetToInstallRepo(octokit);

	console.log(account);

	/**
	 *  ToDo:
	 *
	 * 	1. Get organisation list (if nothing create user repo)
	 *  2. Authenticate with Octokit api
	 *  3. Show options to user
	 */

	// ToDo: check if token is valid

	const repoOptions = {
		name: repoName,
		description,
		private: isPrivate,
		has_issues: hasIssues,
		has_projects: hasProjects,
		has_wiki: hasWiki,
	};

	return octokit.repos.createForAuthenticatedUser(repoOptions);
};

module.exports = { createRepository };
