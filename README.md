# github-demo
It is an integration which  could modify the status of a repo given the url of pr and User Token.
<!-- todo: complete this -->
#SYNTAX:
github-set-pr-status <yourGithubUserTokenHere> <pr_URL> <state> <description: optional>

#How it works?

1. Authenticate the User
2. Extract the Owner of the repo, repo name, Pull Request Number, Commit sha
3. Modify the status of repo
4. Show the changed Status.
