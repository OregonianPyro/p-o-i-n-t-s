const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const filter = client.points.array().filter(i => i.guild === message.guild.id);
    const sort = filter.sort((a, b) => a.points < b.points);
    const top = sort.splice(0, 10);
    if (message.guild.me.permissions.has('EMBED_LINKS')) {
        const embed = new RichEmbed()
            .setColor(message.guild.me.highestRole.hexColor)
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`Displaying the Top 10 Highest Ranking Users for ${message.guild.name}`);
        top.forEach(index => {
            embed.addField(client.users.get(index.user).tag, `Level: ${index.level} | Points: ${index.points}`);

        }); 
        return message.channel.send(embed);
    } else {
        const sandbox = [];
        for (let index in top) {
            sandbox.push(`${client.users.get(index.user).tag} (Level: ${index.level} | Points: ${index.points})`);
        };
        return message.channel.send(sandbox.join('\n\n'));
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
    name: 'leaderboard',
    description: 'Displays the top 10 users with the highest level in this server.',
    usage: '{prefix}leaderboard',
};