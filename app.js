require('shelljs/global');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());
var Twig = require('twig');


/* application variable */
var git_project_path = '/var/www';
var listenPort = '8080';

if (!which('git')) {
    echo('Sorry, this script requires git');
    exit(1);
}

/* ROUTES */

/*app.get('/index', function (req, res) {
    var view = 'index';
    renderView(res, view);
});

app.get('/postApi', function (req, res) {
    var view = 'form';
    renderView(res, view);
});

app.post('/postApi', function (req, res) {
    var repositoryName = req.body.repository;
    var branchName = req.body.branch;
    var commitHAsh = req.body.commit;
    var params = [repositoryName, branchName, commitHAsh];
    goToRepository(params, res);
});

// bad Url
app.use(function(req, res){
    res.redirect('/index');
});*/

app.get('/repo/:repository/branch/:branch/commit', function (req, res) {
    var repositoryName = req.params.repository;
    var branchName = req.params.branch;
    var commitHAsh = 'ea72eaa1a6a9208ba8d3a1cfbed4f2dc5b9bda94';
    var params = [repositoryName, branchName, commitHAsh];
    goToRepository(params, res);
});

/* Function */

function goToRepository(params, res) {
    var path =  git_project_path + '/' + params[0];
    console.log('cd ' + path + '\n');

    exec('cd ' + path, function(status, output) {
        if (status != 0) {
            var view = 'error';
            renderView(res, view, output);
        } else {
            exec('git checkout ' + params[1], function(status, output) {
                if (status != 0) {
                    var view = 'error';
                    renderView(res, view, output);
                } else {
                    console.log(status);
                    console.log(output);
                }
            });
        }
    });
}

function CheckStatus() {
    // check si l'on a le droit de faire le merge ou pas
    // return true or false
}

function renderView(res, view, message) {
    console.log(message);
    res.render(view + '.twig', {
        message : message
    });
}













app.listen(listenPort);
console.log('application loaded and listen on port:' + listenPort + '\n');