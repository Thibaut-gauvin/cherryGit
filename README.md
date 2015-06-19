[![Code Climate](https://codeclimate.com/github/Thibaut-gauvin/cherryGit/badges/gpa.svg)](https://codeclimate.com/github/Thibaut-gauvin/cherryGit)
[![Test Coverage](https://codeclimate.com/github/Thibaut-gauvin/cherryGit/badges/coverage.svg)](https://codeclimate.com/github/Thibaut-gauvin/cherryGit/coverage)

A simple Node.js applicaltion make to easily cherry-pick a single commit (given in POST request)
and will merge in given :repository/:branch.

REST API
use the route /repo/{repository}/branches/{branch}/commits

require:

string commit: the commit id like '1b7cc205c2a9f7b56e02b4916cfa3a96fcef41b8'.
