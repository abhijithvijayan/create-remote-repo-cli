const meow = require('meow');

const cli = meow(
	`
	Usage
	  $ create-remote-repo [input] [options]

	Input
		[REPO_NAME]	           Repository Name

	Options
		-v, --version          Show the version and exit with code 0

	Examples
		$ create-remote-repo test-repo
`,
	{
		flags: {
			version: {
				type: 'boolean',
				alias: 'v',
			},
		},
	}
);

module.exports = cli;
