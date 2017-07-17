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

// function trying to set state for the Pull Request
function createStatus() {
  var argv = require('minimist')(process.argv.slice(4));

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
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter name of your repository:',
      default: argv._[0] || files.getCurrentDirectoryBase(),
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter name of your repository';
        }
      }
    },
    {
      type: 'input',
      name: 'pull_request_number',
      default: argv._[1],
      message: 'Enter the Pull Request Number'
    },
    {
      type: 'input',
      name: 'state',
      message: 'Set the state - Success/Error/Pending/Failure:',
      choices: [ 'success', 'error', 'pending', 'failure' ],
      default: 'pending'
    },
    {
      type: 'input',
      name: 'description',
      default: argv._[2] || null,
      message: 'Optionally enter a description for the Pull Request:'
    }
  ];

  inquirer.prompt(questions).then(function(answers) {
    // Creating a spinner
    var status = new Spinner('Authenticating you, please wait...');
    status.start();
    //  basic authentication prior to trying to obtain an OAuth token
    // github.authenticate(
    //   _.extend(
    //     {
    //       type: 'basic',
    //     },
    //     // credentials
    //   )
    // );
    // attempt to specify scope for our application
    github.authorization.create({
      scopes: ['public_repo', 'repo', 'repo:status'],
      note: 'git-set-state, the command-line tool to set state for a commit in an issue'
    }, function(err, res) {
      // stop the spinner on success
      status.stop();
      if ( err ) {
        console.log(err);
      }
      if (res.token) {
        prefs.github = {
          token : res.token
        };
        // return callback(null, res.token);
      }
      // return callback();
    });
    var statusInPr = new Spinner('Creating status...');
    statusInPr.start();

    var data = {
      sha : 123,
      owner : answers.username,
      repo : answers.name,
      target_url : "github.com/" + answers.username + "/" + answers.name + "/pull/" + answers.pull_request_number,
      description : answers.description,
      state : answers.state
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
