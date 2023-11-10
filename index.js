// Deployments API example
// See: https://developer.github.com/v3/repos/deployments/ to learn more

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

 // Global Init 
const util = require('util');
const { Octokit } = require("@octokit/core");
const { createProbotAuth, authStrategy } = require("octokit-auth-probot");
const { config, composeConfigGet } = require("@probot/octokit-plugin-config");

var hasInvalidTypesBool = false;
var invalidfileTypesFound = [];

module.exports = (app) => {
  app.log.info("file-exension-file app was loaded!");
  app.on(
    ["pull_request.opened", "pull_request.synchronize"],
    async (context) => {

      // Init global vars
      hasInvalidTypesBool = false;
      invalidfileTypesFound = [];

      // Get the owner, repo, and pull number from the context
      const owner = context.payload.repository.owner.login;
      const repo = context.payload.repository.name;
      const pull_number = context.payload.pull_request.number;
      
      // Load config file from github app repository
      // Could also keep file extension array 
      // in the .env file and load from 
      // there to prevent using a token and a separate repo
      try {
        configResult  = await context.octokit.config.get({
          owner: process.env.LOAD_CONFIG_OWNER,
          repo: process.env.LOAD_CONFIG_REPO,
          path: process.env.LOAD_CONFIG_PATH
      });
      } catch (error) {
        console.log(`Error loading config file: ${error.message}`);
      }
      
      // Get the files modified by the commits in the pull request
      let res = {};
      try {
        res = await context.octokit.pulls.listFiles({
          owner,
          repo,
          pull_number
      });
      } catch (error) {
        console.log(`Error listing files: ${error.message}`);
      }


      // Loop through the files and check for invalid file types
      res.data.forEach(file => {


        var laststring = getLastString(file.filename, '.');
        var invalidfileTypes = new Array();


        // Load the invalidfileTypes from the .env file or the config file
        if (process.env.invalidfileTypes) {
            invalidfileTypes = process.env.invalidfileTypes.split(','); 
        } else {
            invalidfileTypes = configResult.config.invalidfileTypes;
        }

        var invalidExtensionType = matchesInvalidString(laststring, invalidfileTypes);

        // Set the global bool to true if an invalid file type is found
        if (invalidExtensionType) {
          hasInvalidTypesBool = true;
          invalidfileTypesFound.push(laststring);
        }
      });
      
      // Set the commit status to success or failure based on the bool
      var commitStatusState = getStatusString(hasInvalidTypesBool);

      // Set the commit status description
      var commitStatusDescription = getStatusDescription(hasInvalidTypesBool);


      // Create the commit status
      const commitStatus = await context.octokit.repos.createCommitStatus({
        owner,
        repo,
        sha: context.payload.pull_request.head.sha,
        state: commitStatusState,
        description: commitStatusDescription,
        context: "Trying to merge invalid file types with extension:"
      });
    }
  ); 
};

// Helper functions

// Check if the file extension matches an invalid string
function matchesInvalidString(str, invalidfileTypes) {
  const invalidStrings = invalidfileTypes;
  return invalidStrings.includes(str);
}

// Get the last string in a string separated by a separator
function getLastString(str, separator) {
  const parts = str.split(separator);
  return parts[parts.length - 1];
}

// Get the commit status string based on the bool
function getStatusString(bool) {
  return bool ? "failure" : "success";
}

// Get the commit status description
function getStatusDescription(bool) {
  return bool ? JSON.stringify(invalidfileTypesFound) : "All file types are valid"; 
}
