#!/usr/bin/env node

const meow = require('meow');

const ghRepoCLI = require('./cli');

const cli = meow(
	`
	Usage
	  $ cli-name [input]

	Options
	  --token  Lorem ipsum  [Default: nothing]

	Examples
	  $ cli-name create --message "hello"
`,
	{
		flags: {
			boolean: ['version'],
			string: ['create'],
			alias: {
				v: 'version',
			},
		},
	}
);

ghRepoCLI(cli.input, cli.flags);
