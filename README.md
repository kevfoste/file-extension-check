# file-extension-check
## Overview:
 File-extension-check is a GitHub app based off of  to check check filetypes on PR merges. This nodejs app creates a GitHub status called file-extension-check with a status of success or failure. The workflow for using this app is for users to have Branch protections rules configured  with status checks enabled. The file types can be managed in a yml config file in a managaged repository or in the .env file associated with this GitHub app. This GitHub app is based off of [probot.github.io](https://probot.github.io/)

 ## Configuration
 As a GitHub created from probot.io the configuration of the .env file is inhterited from [probot.github.io/docs/configuration](probot.github.io/docs/configuration). In addition to the standard configuration the invalidfileTypes field has to be defined. The invalidfileTypes field can be added as a .env field with comma delimeted types.
 
 ```
example: 
invalidfileTypes=gz,bin,tar
```

