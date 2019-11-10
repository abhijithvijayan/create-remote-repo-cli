const Octokit = require('@octokit/rest');
const inquirer = require('inquirer');

const Spinner = require('./spinner');

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
 *  Verify user authentication
 */
const getUserDetails = async octokit => {
	try {
		const { data } = await octokit.users.getAuthenticated();

		return data.name;
	} catch (err) {
		console.log(`Your Personal Access Token does not seem to be valid. Please regenerate the token.`);
	}

	return null;
};

/**
 *  Find the target to create repository
 */
const getTargetToInstallRepo = async ({ octokit, user }) => {
	let targetAccount = { account: user, id: 0 };

	// ToDo: add spinner
	const orgList = await getUserOrganisations(octokit);

	if (orgList.length) {
		let choices = orgList.map(org => {
			return {
				name: `${org.login}: ${org.description}`,
				value: org.login,
			};
		});

		// inject user account to choice list
		choices = [{ name: `${user}: Your Personal Account`, value: user }, ...choices];

		// prompt choices to user
		targetAccount = await inquirer.prompt([
			{
				type: 'list',
				name: 'account',
				message: 'Where do you want to create the Repository?',
				choices,
			},
		]);

		// ToDo: inject id property to the object
	}

	// ToDo: this doesn't return id property
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

		spinner.start();

		// create in org / user account
		switch (targetAccount.id) {
			case 0: {
				console.log('creating in account');
				return octokit.repos.createForAuthenticatedUser(repoOptions);
			}

			default: {
				const opts = {
					...repoOptions,
					org: targetAccount.account,
				};

				return octokit.repos.createInOrg(opts);
			}
		}
	}

	// ToDo: return with error message | no such user | invalid token
	process.exit(1);
};

module.exports = { createRepository };
