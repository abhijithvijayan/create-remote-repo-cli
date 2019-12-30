# create-remote-repo [![npm version](https://img.shields.io/npm/v/create-remote-repo)](https://www.npmjs.com/package/create-remote-repo) [![Build Status](https://travis-ci.com/abhijithvijayan/create-remote-repo-cli.svg?token=bJxrXYoNqDthzrKNTKiz&branch=master)](https://travis-ci.com/abhijithvijayan/create-remote-repo-cli)

> Create GitHub repo from Command-line

### 🙋‍♂️ Made by [@abhijithvijayan](https://twitter.com/_abhijithv)

<img src="demo.gif" width="752">

## Install

Ensure you have [Node.js](https://nodejs.org) 8 or later installed. Then run the following:

```
$ npm install --global create-remote-repo
```

If you don't want to install the CLI globally, you can use `npx` to run the CLI:

```
$ npx create-remote-repo --help
```

## Usage

```
$ create-remote-repo --help

  Create GitHub repo from Command-line

	Usage
	  $ create-remote-repo [input] [options]

	Input
		[REPO_NAME]	           Repository Name
	Options
		-v, --version          Show the version and exit with code 0

  Examples
		$ create-remote-repo test-repo
```

## FAQ

### Generate new token

Goto [Personal access tokens](https://github.com/settings/tokens)

### Why do I need a token?

- For unauthenticated requests, the rate limit is 60 requests per
  hour.
  see [Rate Limiting](https://developer.github.com/v3/#rate-limiting)
- The token must be passed together when you want to automatically
  create the repository.

## Show your support

Give a ⭐️ if this project helped you!

## License

MIT © [Abhijith Vijayan](https://abhijithvijayan.in)
