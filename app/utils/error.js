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
	console.log(chalk.default(pkg.version));
	process.exit(1);
};

module.exports = { flashError, showCLIVersion };
