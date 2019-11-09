const Octokit = require('@octokit/rest');

const createRepository = ({ token = '', repoName, description, isPrivate, hasIssues, hasProjects, hasWiki }) => {
	// Handle if token is not valid
	const octokit = new Octokit({
		auth: token,
	});

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
