const questions = [
	{
		name: 'description',
		type: 'input',
		message: 'Enter a short description of the repository:',
	},
	{
		name: 'isPrivate',
		type: 'confirm',
		message: 'Do you want to create a private repository?',
	},
	{
		name: 'hasIssues',
		type: 'confirm',
		message: 'Do you want to enable issues for this repository?',
	},
	{
		name: 'hasProjects',
		type: 'confirm',
		message: 'Do you want to enable projects for this repository?',
	},
	{
		name: 'hasWiki',
		type: 'confirm',
		message: 'Do you want to enable the wiki for this repository?',
	},
	{
		name: 'token',
		type: 'password',
		message: 'Enter GitHub token:',
	},
];

module.exports = questions;
