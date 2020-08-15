import chalk from 'chalk';

/**
 *  Display Validation Errors
 */
export const flashError = (message: string | TypeError): never => {
  console.error(chalk.bold.red(`✖ ${message}`));
  process.exit(1);
};

/**
 *  Invalid Token Error
 */
export const showInvalidTokenError = (): void => {
  console.log();
  console.log(
    chalk.bold.red(
      `✖ Your Personal Access Token does not seem to be valid. Please regenerate the token.`
    )
  );
};

export const showOrgTokenScopeError = (): void => {
  console.log();
  console.log(
    chalk.bold.red(
      `✖ You need to grant Org Permissions for your Personal Access Token, if you want to create a Repository for an Organization.`
    )
  );
};

export const showLocalRepoUpdateError = (repoUrl: string): void => {
  console.log();
  console.log(
    chalk.bold.red(`✖ Failed to initialize or update the local repository.`)
  );
  console.log();
  console.log(
    chalk.green(`Try running \`git remote add origin ${repoUrl}.git\``)
  );
};

export const showLocalRepoUpdateSuccess = (): void => {
  console.log();
  console.log(
    chalk.green(`Success! Initialized local project with new repo remote url.`)
  );
};
