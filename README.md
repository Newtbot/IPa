## Website
[(https://whatismyip.ipa.wtf/)](https://whatismyip.ipa.wtf/)

## IPA folder Structure
* app.js which is the express application file that runs all express functions.
* bin folder
  * contains the www file which would run the express http server. 
* database folder 
  The folder would contain database related files / models
  * model folder 
    * contains the sequalize model files that would be used by the codebase.
    * Database files
* function folder 
  * contains various function files tht can be called by the web app.
* middleware folder
  * contains the middleware files that is used by the express application.
* module folder
  * contains the moduler logic of package.
* public folder 
  * contains the files / folders that would be in used by the frontend files like css / images / javascript files.
* routes folder
  * contains express route files. 
* views
  * contains the frontend files of the web application.


## Endpoints available.
* "/json" returns json output of client ip.
* "/fulljson" returns full json of client ip with language support.
* "/yaml" returns yaml output of client ip.
* "/text" returns text output of client ip.
* "/useragent" returns text output of client useragent.
* "/domain/:domain" returns json output of provided domain.
* "/:ip" returns json output of provided client ip. 

## To do list:
* caching
* middleware to capture stastics 
* view page for users to input csv / excel / text of ips and look it up
* sqlite support



