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
      message: 'Syntax: github_token=yourToken <state> <url_of_pr> <description:optional>',
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
    var prUrl = inputString[2];
    var url = inputString[2].split('/');
    var repoOwner = url[3];
    console.log(repoOwner);
    var repository = url[4];
    var pullRequestNumber = url[6];
    var des = inputString[3];
    var sha = '';
    var data = {};

    // githubTokenUser(user_token).then(data => {
        // console.log(data);
        //=> {login: johndoe, id: '1', ...}
    // });

    // Creating a spinner
    var status = new Spinner('Authenticating you, please wait...');
    status.start();

    //  basic authentication prior to trying to obtain an OAuth token
    github.authenticate({
      type: "token",
      token: user_token
    });

    var options = {
      url: 'https://api.github.com/repos/' + repoOwner + '/' + repository + '/pulls/' + pullRequestNumber,
      headers: {
        'User-Agent': 'sohini-roy'
      }
    };

    function prResponse(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        sha = info.head.sha;
      }
        github.repos.createStatus(
          repoOwner,
          repository,
          sha,
          state,
          function(err, res) {
            statusInPr.stop();
            if (err) {
              console.log(err);
            }
          }
        );
      }

    request(options, prResponse);

    var statusInPr = new Spinner('Creating status...');
    statusInPr.start();
  })
  .catch(function(error){
    console.log('eof error \n');
    console.log(error);
  });
}

createStatus();
