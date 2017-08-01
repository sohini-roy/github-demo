# github-set-pr status

A Command Line Tool to modify a pull request status

## Install

```shell
npm install -g github-set-pr-status
```

## Usage

```shell
github-set-pr-status <token> <PR URL> <state> <description: optional>
```

## How does it work?

1. Authenticate the User
2. Extract the Owner of the repo, repo name, Pull Request Number, Commit sha
3. Modify the status of repo
4. Show the changed Status.
