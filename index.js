var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var _           = require('lodash');
var git         = require('simple-git')();
var touch       = require('touch');
var fs          = require('fs');
var files = require('./lib/files');
var prefs = new Preferences('git-set-state');
var github = new GitHubApi({
  version: '3.0.0'
});
// console.log(
//   chalk.yellow(
//     figlet.textSync('Ginit', { horizontalLayout: 'full' })
//   )
// );

// function to get credentials
function getGithubCredentials(callback) {
  var questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or e-mail address:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or e-mail address';
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}

// returns credentials
getGithubCredentials(function(){
  console.log(arguments);
});

// func to check if we already have an access token
function getGithubToken(callback) {
  var prefs = new Preferences('git-set-state');

  if (prefs.github &amp;&amp; prefs.github.token) {
    return callback(null, prefs.github.token);
  }

  // Fetch token
    getGithubCredentials(function(credentials) {
      ...
    });
  }

  // authenticate with Github
  getGithubCredentials(function(credentials) {
    // Creating a spinner
    var status = new Spinner('Authenticating you, please wait...');
    status.start();
    //  basic authentication prior to trying to obtain an OAuth token
    github.authenticate(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    );
    // attempt to create an access token for our application
    github.authorization.create({
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'git-set-state, the command-line tool to set state for a commit in an issue'
    }, function(err, res) {
      // stop the spinner on success
      status.stop();
      if ( err ) {
        return callback( err );
      }
      if (res.token) {
        prefs.github = {
          token : res.token
        };
        return callback(null, res.token);
      }
      return callback();
    });
  });
