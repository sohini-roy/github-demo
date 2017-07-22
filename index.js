var CLI         = require('clui');
var inquirer    = require('inquirer');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var request     = require('request');
var files       = require('./lib/files');
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
    inputString = answers.input.split(' ');
    get_token = inputString[0].split('=');
    user_token = get_token[1];
    state = inputString[1];
    prUrl = inputString[2];
    url = inputString[2].split('/');
    repoOwner = url[2];
    repository = url[3];
    pullRequestNumber = url[5];
    des = inputString[3];

    // Creating a spinner
    var status = new Spinner('Authenticating you, please wait...');
    status.start();

    //  basic authentication prior to trying to obtain an OAuth token
    github.authenticate({
      type: "token",
      token: user_token,
    });

    // attempt to specify scope for our application
    github.authorization.create({
      scopes: ['public_repo', 'repo', 'repo:status', 'user'],
      note: 'git-set-state, the command-line tool to set state for a commit in an issue'
    }, function(err, res) {
      // stop the spinner on success
      status.stop();
      github.users.get({
        function(err, res){
          console.log("enter into get comment");
          console.log(res);
          if(err){
            console.log('access error');
            console.log(err);
          }
        }
      });
      if ( err ) {
        console.log('authorization error');
        console.log(err);
      }
    });

     var prParams = {
       owner: repoOwner,
       repo: repository,
       number: pullRequestNumber
     }

     github.pullRequests.get({
       prParams,
       function(err, res){
         console.log(res);
         if(err){
           console.log(err);
         }
       }
     });

    var statusInPr = new Spinner('Creating status...');
    statusInPr.start();

    var data = {
      // sha : 123,
      owner : repoOwner,
      repo : repository,
      target_url : prUrl,
      description : des,
      state : state
    };

    github.repos.createStatus(
      data,
      function(err, res) {
        statusInPr.stop();
        if (err) {
          console.log(err);
        }
      }
    );
  })
  .catch(function(error){
      // status.stop();
      // statusInPr.stop();
    console.log(error);
  });
}

createStatus();
