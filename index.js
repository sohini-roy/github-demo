#!/usr/bin/env node

"use strict";

var GitHubApi   = require('github');
var request     = require('request');
var githubTokenUser = require('github-token-user');
var github      = new GitHubApi({
  version: '3.0.0'
});

function createStatus() {
  var argv = require('minimist')(process.argv.slice(2));

  var inputString = argv;
  var user_token = inputString._[0];
  var state = inputString._[2];
  var repo_url = inputString._[1].split('/');
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
    'sha' : '',
    'state' : state
  }

  var inputRepo = {
    'owner': repoOwner,
    'repo': repository
  }

  githubTokenUser(user_token).then(data => {
      console.log(data);
      github.authenticate({
        type: "token",
        token: user_token
      });
      // console.log("authenticated using User Token");
      request(options, prResponse);
  });

  function prResponse(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      input.sha = info.head.sha;
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
          console.log(res);
          github.repos.get(
            inputRepo,
            function(err, res){
              console.log(inputRepo);
              if(err){
                console.log("get_repo error");
                console.log(inputRepo);
                console.log(err);
                return ;
              }
              if(res){
                console.log("get_repo response");
                console.log(res);
              }
            }
          );
        }
      }
    );
  }
}

createStatus();
