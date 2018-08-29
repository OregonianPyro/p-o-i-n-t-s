module.exports.run = async (client, message, args) => {
    return message.channel.send(`My ping is: \`${client.ping.toFixed()}ms\``);
};

module.exports.conf = {
    enabled: true,
    reason: null,   //you can provide a reason why the command is disabled, that way if users run the command they see why.
    perms: {
        user: 'SEND_MESSAGES',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'ping',
    description: 'Responds with the bot\'s ping.',
    usage: '{prefix}ping',
};