// Deployments API example
// See: https://developer.github.com/v3/repos/deployments/ to learn more

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
 var hasInvalidTypesBool = false;

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");
  app.on(
    ["pull_request.opened", "pull_request.synchronize"],
    async (context) => {
      app.log.info(context.payload);

      // Init 
      // var hasInvalidTypesBool = false;

      // Get the owner, repo, and pull number from the context
      const owner = context.payload.repository.owner.login;
      const repo = context.payload.repository.name;
      const pull_number = context.payload.pull_request.number;
      
      // Get the files modified by the pull request
      const res = await context.octokit.pulls.listFiles({
        owner,
        repo,
        pull_number
      });


      res.data.forEach(file => {
        console.log( `File updated or added: ${file.filename}`);
        var laststring = getLastString(file.filename, '.');
        console.log(`laststring is: ${laststring}`);
        var invalidExtensionType = matchesInvalidString(laststring);
        console.log(`invalidExtensionType is: ${invalidExtensionType}`);

        if (invalidExtensionType) {
          hasInvalidTypesBool = true;
          console.log(`Invalid file type: ${laststring}`);
          console.log(`File name: ${file.filename}`);
          console.log('owner: ' + owner + ' repo: ' + repo + ' pull_number: ' + pull_number);
        }
      });
      
      var commitStatusState = getStatusString(hasInvalidTypesBool);
      console.log(`commitStatusState is: ${commitStatusState}`);
      var commitStatusDescription = getStatusDescription(hasInvalidTypesBool);
      console.log(`commitStatusDescription is: ${commitStatusDescription}`);  


      const commitStatus = await context.octokit.repos.createCommitStatus({
        owner,
        repo,
        sha: context.payload.pull_request.head.sha,
        state: commitStatusState,
        description: commitStatusDescription,
        context: "Invalid file types"
      });

    }
    
  );
};

function matchesInvalidString(str) {
  const invalidStrings = ['gz', 'bin', 'exe'];
  return invalidStrings.includes(str);
}

function getLastString(str, separator) {
  const parts = str.split(separator);
  return parts[parts.length - 1];
}

function getStatusString(bool) {
  return bool ? "failure" : "success";
}

function getStatusDescription(bool) {
  return bool ? "Invalid file types found" : "All file types are valid";
}
