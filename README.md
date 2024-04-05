# file-extension-check
## Overview:
 File-extension-check is a GitHub app used to check filetypes during a PR merge. This nodejs app creates a GitHub status called file-extension-check with a status of success or failure. The workflow for using this app is for users to have Branch protections rules configured  with status checks enabled. The status check is `invalidfileTypes`. The file types can be configured in a yml config file within this repository or added to the .env file associated with this GitHub app. This GitHub app uses [probot.github.io](https://probot.github.io/) This app serves as a alternative to GHES pre-receive hooks for GHES users moving to GHEC. It blocks user commits to the main branch if the file type is listed.

 ## Configuration
 As a GitHub app created from probot.io, the configuration of the .env file is inhterited from [probot.github.io/docs/configuration](probot.github.io/docs/configuration). In addition to the standard configuration the invalidfileTypes field has to be defined. The invalidfileTypes field can be added as a .env field with comma delimeted types.
 
 ```
example entry in .env: 
invalidfileTypes=gz,bin,tar,exe
```

or configured in a yml config file
```
example entry in yml config file
invalidfileTypes:
  - gz
  - bin
  - tar
  - exe

```

The yml config file configuration requires three variables LOAD_CONFIG_OWNER, LOAD_CONFIG_REPO, LOAD_CONFIG_PATH be added to the .env file that points to the location of the config file.

```

example:
LOAD_CONFIG_OWNER=kevfoste
LOAD_CONFIG_REPO=file-extension-check
LOAD_CONFIG_PATH=.github/config.yml

```
