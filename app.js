require('shelljs/global');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Twig = require('twig');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

/* application variable */
var git_project_path = '/var/www';
var listenPort = '8080';

if (!which('git')) {
    var response = {'status' : 'ko', 'message' : 'Sorry, this script requires git'};
    renderJson(res, response);
}

/* ROUTES */

app.post('/repo/:repository/branch/:branch/commit', function (req, res) {
    var pathRepository =  git_project_path + '/' + req.params.repository;
    var branchName = req.params.branch;
    var commitHAsh = req.body.commit;

    console.log('commitHAsh: ' + commitHAsh);

    var params = [pathRepository, branchName, commitHAsh];

    goToRepository(params, res);
});

// bad url
app.use(function(req, res) {
    renderJson(res, 'Bad Request');
});


/* Function */

function goToRepository(params, res) {
    console.log('cd to ' + params[0]);
    if (exec('cd ' + params[0]).code !== 0) {
        var response = {'status' : 'ko', 'message' : 'cd to directory ' + params[0] + ' failed'};
        renderJson(res, response);
    } else {
        checkoutBranch(params, res);
    }
}

function checkoutBranch(params, res) {
    console.log('git checkout ' + params[1]);
    if (exec('cd ' + params[0] + ' && git checkout ' + params[1]).code !== 0) {
        var response = {'status' : 'ko', 'message' : 'checkout branch ' + params[1] + ' failed'};
        renderJson(res, response);
    } else {
        gitCherryPick(params, res);
    }
}

function gitCherryPick(params, res) {
    console.log('git cherry-pick ' + params[2]);
    if (exec('cd ' + params[0] + ' && git checkout ' + params[1] + ' && git cherry-pick ' + params[2]).code !== 0) {
        var response = {'status' : 'ko', 'message' : 'git cherry-pick \'' + params[2] + '\' failed'};
        renderJson(res, response);
    } else {
        renderJson(res, 'tous va bien mec');
    }
}

function renderView(res, view, message) {
    res.render(view + '.twig', {
        message : message
    });
}

function renderJson(res, data) {
    var apiResponse = {'data' : data};

    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(apiResponse));
    res.end();
}


/* Start application */

app.listen(listenPort);
console.log('application loaded and listen on port:' + listenPort + '\n');