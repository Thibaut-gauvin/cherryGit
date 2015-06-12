var express = require('express');
var app = express();
var Twig = require('twig');

/* application variable */
var git_project_path = '/var/www';


/*
app.get('/index/:message', function(req, res) {
    res.render('index.twig', {
        message : req.params.message
    });
});

// redirection si mauvaise url
app.use(function(req, res, next){
    res.redirect('/index/coucou');
});*/


app.get('/repo/:repository', function (req, res, renderView) {
    var repositoryName = req.params.repository;
    goToRepository(repositoryName, res);
});



function goToRepository(repositoryName, res) {
    var path =  git_project_path + '/' + repositoryName;
    renderView(path, res);
}

function checkRepositoryExist() {
}

function checkBranch(branch) {
}

function checkoutBranch(branch) {
}

function CheckStatus() {
    // check si l'on a le droit de faire le merge ou pas
    // return true or false
}

function renderView(message, res) {
    res.render('index.twig', {
        message : message
    });
}



var port = '8080';
app.listen(port);
console.log('application loaded and listen on port:' + port + '\n');