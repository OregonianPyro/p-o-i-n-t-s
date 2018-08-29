const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    let member;
    if (!args[0]) member = message.member;
    member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (message.guild.me.permissions.has('EMBED_LINKS')) {
        const embed = new RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setDescription(`${member.user.username} is currently level **${client.points.get(`${message.guild.id}-${member.user.id}`, 'level')}**.`)
            .setColor(member.highestRole.hexColor);
        return message.channel.send(embed);
    } else {
        return message.channel.send(`${member.user.username} is currently level **${client.points.get(`${message.guild.id}-${member.user.id}`, 'level')}**.`);
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
    name: 'level',
    description: 'Displays what level a user has.',
    usage: '{prefix}level [@user|user ID]',
};