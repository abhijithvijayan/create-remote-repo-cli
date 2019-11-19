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
 *  Display CLI Version
 */
const showCLIVersion = () => {
	console.log(chalk(pkg.version));
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

module.exports = { flashError, showCLIVersion, showInvalidTokenError, showOrgTokenScopeError };
