/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import fs from 'fs';
import execa from 'execa';
import inquirer from 'inquirer';
import {Octokit} from '@octokit/rest';

import Spinner from './spinner';
import {
  showInvalidTokenError,
  showOrgTokenScopeError,
  showLocalRepoUpdateError,
  showLocalRepoUpdateSuccess,
} from './messages';

/**
 *  Get a list of GitHub orgs user is member of
 */
const getUserOrganisations = async (
  octokit: Octokit
): Promise<Octokit.OrgsListForAuthenticatedUserResponse> => {
  let data: Octokit.OrgsListForAuthenticatedUserResponse = [];

  try {
    ({data} = await octokit.orgs.listForAuthenticatedUser());
  } catch (_err) {
    showOrgTokenScopeError();
  }

  return data;
};

/**
 *  Verify user authentication
 */
const getUserDetails = async (octokit: Octokit): Promise<string | null> => {
  const authSpinner = new Spinner(`Authenticating with GitHub. Please wait...`);

  try {
    authSpinner.start();

    const {
      data: {login},
    }: {
      data: Octokit.UsersGetAuthenticatedResponse;
    } = await octokit.users.getAuthenticated();

    authSpinner.stop();

    return login;
  } catch (_err) {
    authSpinner.stop();

    showInvalidTokenError();
  }

  return null;
};

type ChoicesProps = {
  name: string;
  value: {
    id: number;
    name: string;
  };
};

type TargetAccountProps = {
  id: number;
  name: string;
};

/**
 *  Find the target account to create repository
 */
const getTargetToInstallRepo = async (
  octokit: Octokit,
  user: string
): TargetAccountProps => {
  const userAccount = {
    id: 0,
    name: user,
  };
  // returns user account if there is no organisation
  let targetAccount = userAccount;

  const orgList: Octokit.OrgsListForAuthenticatedUserResponse = await getUserOrganisations(
    octokit
  );

  if (orgList.length) {
    let choices: ChoicesProps[] = orgList.map((org) => {
      return {
        name: `${org.login}: ${org.description}`,
        value: {
          id: org.id,
          name: org.login,
        },
      };
    });

    /**
     * 	inject user account to choice list
     */
    choices = [
      {name: `${user}: Your Personal Account`, value: userAccount},
      ...choices,
    ];

    // prompt choices to user
    ({targetAccount} = await inquirer.prompt([
      {
        type: 'list',
        name: 'targetAccount',
        message: 'Where do you want to create the Repository?',
        choices,
      },
    ]));
  }

  return targetAccount;
};

type RepoProps = {
  repoName: string;
  description: string;
  isPrivate: boolean;
  hasIssues: boolean;
  hasProjects: boolean;
  hasWiki: boolean;
  token: string;
};

/**
 *  Handle repository creation
 */
export const createRepository = async (
  repo: RepoProps,
  spinner: Spinner
): Promise<
  Octokit.Response<Octokit.ReposCreateForAuthenticatedUserResponse>
> => {
  const {
    token,
    repoName,
    description,
    isPrivate,
    hasIssues,
    hasProjects,
    hasWiki,
  } = repo;
  // Handle if token is not valid
  const octokit = new Octokit({
    auth: token,
  });

  // Authenticate to identify user
  const user: string | null = await getUserDetails(octokit);

  if (user) {
    const {id, name}: TargetAccountProps = await getTargetToInstallRepo(
      octokit,
      user
    );

    const repoOptions = {
      name: repoName,
      description,
      private: isPrivate,
      has_issues: hasIssues,
      has_projects: hasProjects,
      has_wiki: hasWiki,
    };

    console.log();
    spinner.start();

    // create in org / user account
    switch (id) {
      case 0: {
        return octokit.repos.createForAuthenticatedUser(repoOptions);
      }

      default: {
        const opts = {
          ...repoOptions,
          org: name,
        };

        return octokit.repos.createInOrg(opts);
      }
    }
  }

  process.exit(1);
};

/**
 *  Update Local Repo
 */
export const updateLocalRepo = async ({data: {html_url}}) => {
  try {
    if (fs.existsSync(`.git`)) {
      try {
        await execa('git', ['remote', 'remove', 'origin']);
      } catch (err) {
        // No such remote: origin
      }
    }
    await execa('git', ['init']);
    await execa('git', ['remote', 'add', 'origin', `${html_url}.git`]);

    showLocalRepoUpdateSuccess();
  } catch (err) {
    showLocalRepoUpdateError(html_url);
  }
};
