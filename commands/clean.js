const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const filter = client.points.array().filter(i => i.guild === message.guild.id);
    const now = new Date();
    const inactive = filter.filter(index => {
        return !message.guild.members.get(index.user) || now - 2592000000 > index.last_seen;
    });
    inactive.forEach(index => {
        client.points.delete(`${message.guild.id}-${index.user}`);
    });
    return message.channel.send(`Successfully cleaned \`${inactive.length}\` inactive users from the leaderboard.`);
};

module.exports.conf = {
    enabled: true,
    reason: null,   //you can provide a reason why the command is disabled, that way if users run the command they see why.
    perms: {
        user: 'MANAGE_GUILD',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'clean',
    description: 'Removes inactive users from the leaderbaord, and users who are longer in the server.',
    usage: '{prefix}clean',
};