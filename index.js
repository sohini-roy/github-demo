var CLI         = require('clui');
var inquirer    = require('inquirer');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var request     = require('request');
var files       = require('./lib/files');
var githubTokenUser = require('github-token-user');
var github      = new GitHubApi({
  version: '3.0.0'
});

// function trying to set state for the Pull Request
function createStatus() {
  var argv = require('minimist')(process.argv.slice(4));

  var questions = [
    {
      name: 'input',
      type: 'input',
      message: 'Syntax: github_token=yourToken <state> <pr_url> <description:optional>',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return ;
        }
      }
    }
  ];

  inquirer.prompt(questions).then(function(answers) {
    var inputString = [];
    var inputString = answers.input.split(' ');
    var get_token = inputString[0].split('=');
    var user_token = get_token[1];
    var state = inputString[1];
    var repo_url = inputString[2].split('/');
    var repoOwner = repo_url[3];
    var repository = repo_url[4];
    console.log(repo_url);
    var tokenUser = "";
    var sha = "";

    function prResponse(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.head.sha);
        sha = info.head.sha;
      }
        github.repos.createStatus(
          repoOwner,
          repository,
          sha,
          state,
          function(err, res) {
            if(res){
              console.log(res);
              github.repos.get({
                repoOwner,
                repository,
                function(err, res){
                  console.log("inside get_repo");
                  if(res){
                    console.log(res);
                  }
                  if(err){
                    console.log("get_repo error");
                    console.log(err);
                  }
                }
              });
            }
            if (err) {
              console.log("create status error");
              console.log(err);
            }
          }
        );
      }

    githubTokenUser(user_token).then(data => {
        tokenUser = data.login;

        github.authenticate({
          type: "token",
          token: user_token
        },function(){
          console.log("authenticate callback function");
          request(options, prResponse);
        });
    });

  })
  .catch(function(error){
    console.log('eof error \n');
    console.log(error);
  });
}

createStatus();
