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
    var pullRequestNumber = repo_url[6];
    var sha = "";
    var options = {
      url: 'https://api.github.com/repos/' + repoOwner + '/' + repository + '/pulls/' + pullRequestNumber,
      headers: {
        'User-Agent': 'sohini-roy'
      }
    };
    var input = {
      'owner': repoOwner,
      'repo' : repository,
      'sha' : '0570f70f4f6d8b98a4b146ae87c528f4369c8efb',
      'state' : 'pending'
    }
    console.log(input);
    var inputRepo = {
      'owner': repoOwner,
      'repo': repository
    }

    githubTokenUser(user_token).then(data => {
        // tokenUser = data.login;
        console.log(data);
        github.authenticate({
          type: "token",
          token: user_token
        });
        console.log("authenticated using User Token");
        request(options, prResponse);
    });

    function prResponse(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.head.sha);
        sha = info.head.sha;
      }
      github.repos.createStatus(
        input,
        function(err, res) {
          if (err) {
            console.log("error");
            console.log(err);
            return ;
          }
          if(res){
            console.log("Response");
            console.log(JSON.parse(res));
            github.repos.get({
              inputRepo,
              function(err, res){
                console.log("inside get_repo");
                if(err){
                  console.log("get_repo error");
                  console.log(err);
                  return ;
                }
                if(res){
                  console.log(res);
                }
              }
            });
          }
        }
      );
    }

  })
  .catch(function(error){
    console.log('eof error \n');
    console.log(error);
  });
}

createStatus();
