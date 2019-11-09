#!/usr/bin/env node

const meow = require('meow');

const ghRepoCLI = require('./cli');

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
			boolean: ['version'],
			string: [],
			alias: {
				v: 'version',
			},
		},
	}
);

ghRepoCLI(cli.input, cli.flags);
