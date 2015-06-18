require('shelljs/global');
var express = require('express');
var app = express();
var Twig = require('twig');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use('/static', express.static('public'));

/* application variable */
var git_project_path = '/var/www';
var listenPort = '8080';
var mergeStatus = 'available';

if (!which('git')) {
    var response = {'status' : 'ko', 'message' : 'Sorry, this script requires git'};
    renderJson(res, response);
}

/* ROUTES */

app.post('/repo/:repository/branch/:branch/commit', function (req, res) {
    var pathRepository =  git_project_path + '/' + req.params.repository;
    var branchName = req.params.branch;
    var commitHAsh = req.body.commit;
    var params = [pathRepository, branchName, commitHAsh];

    // console.log(params);

    if(checkStatus()) {
        goToRepository(params, res);
    } else {
        renderJson(res, '/!\\ You cannot merge now, because somebody is currently using CherryGit to merge in the same file than you.');
    }
});

app.get('/postApi', function (req, res) {
    renderView(res, 'form');
});

app.post('/postApi', function (req, res) {
    var pathRepository =  git_project_path + '/' + req.body.repository;
    var branchName = req.body.branch;
    var commitHAsh = req.body.commit;
    var params = [pathRepository, branchName, commitHAsh];

    if(checkStatus()) {
        goToRepository(params, res);
    } else {
        renderJson(res, '/!\\ You cannot merge now, because somebody is currently using CherryGit to merge in the same file than you.');
    }

});

app.get('/status/:status', function (req, res) {
    if (req.params.status == 1) {
        mergeStatus = 'available';
        renderJson(res, 'ok, mergeStatus is now: available');
    }
});

// bad url
app.use(function(req, res) {
    renderJson(res, 'Bad Request');
});


/* Function */

function checkStatus() {
    if (mergeStatus == 'available') {
        return true;
    } else {
        return false;
    }
}

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
        mergeStatus = 'mergeInProgress';
        renderJson(res, 'It works, Merge in progress');
    }
}

function renderView(res, view, message) {
    res.render(view + '.twig', {
        message : message
    });
}

function renderJson(res, data) {
    var apiResponse = {'data' : data};
    console.log(mergeStatus);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(apiResponse) + '\n');
    res.end();
}


/* Start application */

app.listen(listenPort);
console.log('application loaded and listen on port:' + listenPort + '\n');