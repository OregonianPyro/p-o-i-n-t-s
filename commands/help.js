const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const { prefix } = client.settings.get(message.guild.id);
    if (message.guild.me.permissions.has('EMBED_LINKS')) {
        if (!args[0]) {
            const embed = new RichEmbed()
                .setColor(message.member.highestRole.hexColor)
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setFooter(`Run ${prefix}help <command> for help on a specific command.`)
                .addField('Clean', '`Removes inactive users from the leaderbaord, and users who are longer in the server.`')
                .addField('Give', '`Gives a user some points, how nice!`')
                .addField('Help', '`View help on the bot\'s commands, or help on a certain command.`')
                .addField('Leaderboard', '`Displays the top 10 users with the highest level in this server.`')
                .addField('Level', '`Displays what level a user has.`')
                .addField('Ping', '`Responds with the bot\'s ping.`')
                .addField('Points', '`Displays how many points a user has.`');
            return message.channel.send(embed);
        } else {
            const cmd = require(`./${args[0].toLowerCase()}`);
            if (!cmd) return;
            const embed = new RichEmbed()
                .setColor(message.member.highestRole.hexColor)
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setDescription('`< >` indicates a __required__ parameter.\n`[ ]` indicates an optional parameter.')
                .addField('Description', cmd.help.description)
                .addField('Usage', cmd.help.usage.replace('{prefix}', prefix));
            return message.channel.send(embed);
        };
    };
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
    name: 'help',
    description: 'View help on the bot\'s commands, or help on a certain command.',
    usage: '{prefix}help [command]',
};