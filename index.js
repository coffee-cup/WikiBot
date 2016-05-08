'use strict'

var restify = require('restify');
var logger = require('morgan');

var Wiki = require('./wiki/wiki.js');

var slash_command = '/fakt';

var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN;
if (!VERIFY_TOKEN) {
    console.error('SLACK_VERIFY_TOKEN is required');
    process.exit(1);
}
// Use Beep Boop provided PORT - default to 8080 for dev
var PORT = process.env.PORT || 8080;

var server = restify.createServer();
server.use(logger('tiny'));

// Add a `/beepboop` route handler for `/beepboop` slash command
server.post(slash_command, restify.bodyParser(), function(req, res) {
    if (req.params.token !== VERIFY_TOKEN) {
        return res.send(401, 'Unauthorized');
    }

    Wiki.getRandomFact().then(function(fact) {
        var message = fact;

        // Handle any help requests
        if (req.params.text === 'help') {
            message = 'Type ' + slash_command + ' to get a random fact from Wikipedia';
        }

        res.send(200, {
            response_type: 'in_channel',
            text: message
        });
    });
});

// Add a GET handler for slash_command route that Slack expects to be present
server.get(slash_command, function(req, res) {
    res.send(200, 'Ok');
});

// 🔥 it up
server.listen(PORT, function(err) {
    if (err) {
        return console.error('Error starting server: ', err);
    }

    console.log('Server successfully started on port %s', PORT);
});
