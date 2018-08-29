const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply('incorrect usage: You must mention a user to give them points.');
    if (!args[1]) return message.reply('incorrect usage: You must provide a number of points to give them.');
    if (isNaN(parseInt(args[1]))) return message.reply('incorrect usage: You must provide a number of points to give them.');
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (member.user.id === message.author.id) return message.reply('nice try!');
    const points = parseInt(args[1]);
    client.points.ensure(`${message.guild.id}-${member.user.id}`, {
        user: member.user.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        lastSeen: new Date()
    });
    client.points.math(`${message.guild.id}-${member.user.id}`, '+', points, 'points');
    if (message.guild.me.permissions.has('EMBED_LINKS')) {
        const embed = new RichEmbed()
            .setColor(member.highestRole.hexColor)
            .setDescription(`${member.user.tag} has been given **${points}** points, and now has \`${client.points.get(`${message.guild.id}-${member.user.id}`, 'points')}\` points.`)
            .setAuthor(member.user.username, member.user.displayAvatarURL);
        return message.channel.send(embed);
    } else {
        return message.channel.send(`${member.user.tag} has been given **${points}** points, and now has \`${client.points.get(`${message.guild.id}-${member.user.id}`, 'points')}\` points.`)  
    };
};

module.exports.conf = {
    enabled: true,
    reason: null,   //you can provide a reason why the command is disabled, that way if users run the command they see why.
    perms: {
        user: 'ADMINISTRATOR',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'give',
    description: 'Gives a user some points, how nice!',
    usage: '{prefix}give <@user|user ID> <points>',
};