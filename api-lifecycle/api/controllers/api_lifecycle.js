'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var axios = require('axios');
var cmd=require('node-cmd');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  startApilifecycles
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function startApilifecycles(req, res) {
  const githubtoken = process.env.GITHUB_TOKEN;
  const apiname = req.body.apiname;

  // create github project for api
  const request = {
    "name": apiname,
    "description": "d10l Identities Service documentation",
    "homepage": `https://d10l.github.io/${apiname}/`,
    "private": false,
    "has_issues": true,
    "has_projects": false,
    "has_wiki": false
  }
  axios.post('https://api.github.com/orgs/d10l/repos', request, {
    headers: { Authorization: "token " +  githubtoken }
  }).then(
    (response) => {
      // Clone the git repository and install swagger-node, add the spec, validate(?) and upload to repo
      const repourl = response.data.clone_url;
      cmd.run(`
        git clone https://github.com/d10l/api-template.git
        cd api-template 
        git remote set-url origin ${repourl} 
        aws s3 cp s3://apispecs/apilifecycle.yaml src/api/swagger/swagger.yaml
        git commit -a -m "add: api spec"
        git push
      `)
      // create documentation and upload this to github page (alternative use widdershins to create markdown from swagger and 
      // shins to transform this markdown to index.html (also styling possible))
      cmd.run(`
        mkdir api-template/docs
        cd api-template/docs
        ../../node_modules/.bin/api2html -o index.html -l shell,javascript--nodejs,java ../src/api/swagger/swagger.yaml
        echo "theme: jekyll-theme-cayman" > _config.yml
        git add .
        git commit -am "docs: update api docs"
        git push
      `)
      // create docker container and upload mock, besser trigger circleci pipeline
      /* cmd.run(`
        cd api-template/src
        docker login -u ${env.DOCKER_USER} -p ${env.DOCKER_PW}
        docker docker build -t ${apiname}-mock:1.0.0 .
        aws ecr create-repository --repository-name ${apiname}
        docker push 631047718510.dkr.ecr.eu-west-1.amazonaws.com/${apiname}-mock:1.0.0
        # follow project in circleci https://circleci.com/docs/api/v1-reference/
        curl -X POST https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/follow?circle-token=:token
      `) */
      res.status(201).json(
        {
          "apiname": apiname,
          "owner": req.body.owner,
          "git_repo": repourl,
          "doc_url": `https://d10l.github.io/${apiname}/`
        }
      )
    }
  ).catch(
    (error) => {
      console.log(error);
      res.status(400).json({
        message: "An error occured."
      })
    }
  )
  
  // this sends back a JSON response which is a single string
}
