import validateName from 'validate-npm-package-name';

type OptionsProps = {
  repoName?: string;
};

// cli options
export const options: OptionsProps = {};

type CliFlagsProps = {
  version: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isString(name: any): boolean {
  return typeof name === 'string';
}

export const validate = (
  _input: string[],
  _flags: CliFlagsProps
): TypeError | null => {
  // Throw error if no argument / input entered
  if (!_input.length || !Object.entries(_flags).length) {
    return new TypeError(
      `invalid input. Must supply atleast a valid argument or some option.`
    );
  }

  // Throw error if the name is not valid
  if (_input.length) {
    const [appName] = _input;
    const validation = validateName(appName);

    if (!validation.validForOldPackages || !isString(appName)) {
      return new TypeError(
        `invalid input argument. The repo name is not valid. Value: \`${appName}\`.`
      );
    }

    // push to object
    options.repoName = appName;
  }

  return null;
};
