const chalk = require('chalk');

const pkg = require('../../package.json');

/**
 *  Display Validation Errors
 */
const flashError = message => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

/**
 *  Invalid Token Error
 */
const showInvalidTokenError = () => {
	console.log();
	console.log(chalk.bold.red(`✖ Your Personal Access Token does not seem to be valid. Please regenerate the token.`));
};

const showOrgTokenScopeError = () => {
	console.log();
	console.log(
		chalk.bold.red(
			`✖ You need to grant Org Permissions for your Personal Access Token, if you want to create a Repository for an Organization.`
		)
	);
};

const showLocalRepoUpdateError = ({ repoUrl }) => {
	console.log();
	console.log(chalk.bold.red(`✖ Failed to initialize or update the local repository.`));
	console.log();
	console.log(chalk.green(`Try running \`git remote add origin ${repoUrl}.git\``));
};

const showLocalRepoUpdateSuccess = () => {
	console.log();
	console.log(chalk.green(`Success! Initialized local project with new repo remote url.`));
};

module.exports = {
	flashError,
	showInvalidTokenError,
	showOrgTokenScopeError,
	showLocalRepoUpdateError,
	showLocalRepoUpdateSuccess,
};
