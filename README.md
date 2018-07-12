# API automation

This repository includes all the assets that are needed to automate the API Process: 

# Scope

1. Create Github Repository with the name of the API 
2. Create the content for the repository
  1. Nodejs template including the swagger-ui files
  2. Add the "uploaded" swagger specification
  3. then commit
3. Deploy a mock / sandbox api (use aws fargate / https://www.learnaws.org/2018/02/06/Introduction-AWS-Fargate/ )
  1. build and deploy the api automatically based on the swagger spec (can that be done in nodejs otherwise use python) 
  2. create a apigee proxy for the api (sandard slas, ...)
4. Create automatic documentation for the api with widashins
  1. Create a new "api-name-docs" repository
  2. Create add the specification to the repository
  3. Generate the specification and check it in
  4. Genrate a docker container with a static page for the api
  5. Deploy the docker container for the api


Next steps:
1. Developer clone the repository and create a pull request with an implementation
2. This then updates the mock api
3. When to release to production?
4. When and how to request security approval? How to check this in github? How to notify security that something needs to be done? Ticket like @Amazon (Create a github issue with them as responsible person? / gruppen postkorb?)


Feedback Schleifen zwischen Kunden & Anforderer

# Sequence

![Alt text](./assets/sequence.svg)


# Prerequesit for running the service
1. node installed
2. swagger-node installed
3. git installed
4. access token for github in env variable
5. aws cli + access token in env variable

# Calls

1. Use [Github API](https://developer.github.com/v3/):
```bash
# https://developer.github.com/v3/repos/#create
POST https://api.github.com/orgs/:org/repos
{
  "name": "api-name",
  "description": "This is our api description",
  "homepage": "http://api-portal.link.com",
  "private": false,
  "has_issues": true,
  "has_projects": true,
  "has_wiki": true
}
```
1. ...

```
git clone https://github.com/:org/api-name.git
cd api-name
# get swagger file from s3
# aws-cli: https://docs.aws.amazon.com/cli/latest/userguide/using-s3-commands.html
# curl: https://gist.github.com/drfill/c18308b6d71ee8032efda870b9be348e
https://stackoverflow.com/questions/30876123/script-to-download-file-from-amazon-s3-bucket
# but cli is prefered

#get node-cli
# https://github.com/swagger-api/swagger-node
npm init #?
npm install -g swagger
swagger project create api-name
# https://github.com/swagger-api/swagger-node/blob/master/docs/mock-mode.md

```



start in swagger mock mode
```
swagger project start -m
```


? hosted version of swagger-node? for our customers


could we let them provide the mock controllers?


or use http://www.mock-server.com/ or some other tool used by (e.g. thoughtworks?)

https://medium.com/@subeeshcbabu/swagmock-the-mock-data-generator-for-swagger-aka-openapi-f20e7e9e1b82


deploy a swagger ui available externally (e.g. like our frontend)

check if I can autogenerate a postman project... postman better then swagger ui? 
https://github.com/swagger-api/swagger-node/issues/524

upload swagger spec to an s3 bucket
-> at runtime do it from the client in the browser
for testing now use the cli
aws s3 ls
aws s3 ls s3://apispecs
aws s3 cp api/swagger/swagger.yaml s3://apispecs/apilifecycle.yaml
```
download swagger spec from an s3 bucket
```
aws s3 cp s3://apispecs/apilifecycle.yaml swagger.yaml
```


docker build

docker build -t api-name:1.0.0 .


## Future Features 

better mock options?
http://stoplight.io/platform/prism/
https://github.com/stoplightio/prism
https://stackoverflow.com/questions/38344711/swagger-mock-server
https://github.com/outofcoffee/imposter
auto generate mock data?
https://medium.com/@subeeshcbabu/swagmock-the-mock-data-generator-for-swagger-aka-openapi-f20e7e9e1b82