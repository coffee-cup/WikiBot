'use strict'

var botkit = require('botkit');
var logger = require('morgan');

// Beep Boop specifies the port you should listen on default to 8080 for local dev
var PORT = process.env.PORT || 8080

var controller = botkit.slackbot()

require('beepboop-botkit').start(controller, {
    debug: true
})

controller.setupWebserver(PORT, function(err, webserver) {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    webserver.use(logger('tiny'))
        // Setup our slash command webhook endpoints
    controller.createWebhookEndpoints(webserver)
})

controller.on('slash_command', function(bot, message) {
    switch (message.command) {
        case '/fakt':
            bot.reply(message, 'lkhlkhklh')
            break
        default:
            bot.replyPrivate(message, "Sorry, I'm not sure what that command is")
    }
})

var Wiki = require('./wiki/wiki.js');

// Wiki.getRandomFact().then(function(fact) {
//     console.log(fact);
/// });
