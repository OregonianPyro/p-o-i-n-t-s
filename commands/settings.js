const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
   const pass = (key, val) => {
       if (message.guild.me.permissions.has('EMBED_LINKS')) {
           const embed = new RichEmbed()
                .setColor('GREEN')
                .setDescription(`:white_check_mark: Successfully set your \`${key}\` to \`${val}\``);
            return message.channel.send(embed);
       } else {
           return message.channel.send(`:white_check_mark: Successfully set your \`${key}\` to \`${val}\``);
       };
   };
    const fail = (key, err) => {
        if (message.guild.me.permissions.has('EMBED_LINKS')) {
            const embed = new RichEmbed()
                .setColor('RED')
                .setDescription(`:no_entry: **Failed to edit your ${key}** | \`${err}\``);
            return message.channel.send(embed);
        } else {
            return message.channel.send(`:no_entry: **Failed to edit your ${key}** | \`${err}\``);
        };
    };
    if (!args[0]) return message.reply('you must provide a key to edit.');
    if (!args[1]) return message.reply('you must provide a new value for the key.');
    const key = args[0].toLowerCase();
    if (key === 'prefix') {
        if (args[1].length >= 10) return fail('prefix', `${args[1]} is too long of a prefix, try a shorter one.`);
        client.settings.get(message.guild.id).prefix = args[1];
        client.settings.set(message.guild.id, client.settings.get(message.guild.id));
        return pass('prefix', args[1]);
    } else if (['level_up', 'level-up', 'message', 'level-up-message', 'level_up_message'].includes(key)) {
        client.settings.get(message.guild.id).level_up_message = args.slice(1).join(' ');
        client.settings.set(message.guild.id, client.settings.get(message.guild.id));
        return pass('level up message', args.slice(1).join(' '));
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