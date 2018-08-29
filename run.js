const { Client } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config();
const client = new Client();
client.login(process.env.TOKEN);
client.points = new Enmap({ name: 'points' });
client.settings = new Enmap({ name: 'settings' });
client.on('ready', () => {
    console.log(chalk.bgGreen(`Logged in as ${client.user.tag} with ${client.guilds.size} guilds.`));
});

client.on('error', (error) => {
    console.log(chalk.bgRed(error));
});

client.on('guildCreate', (guild) => {
    client.settings.set(guild.id, require('./default_settings.js'));
});

client.on('guildDelete', (guild) => {
    client.settings.delete(guild.id);
});

client.on('message', async (message) => {
    if (message.channel.type !== 'text') return;
    if (message.author.bot) return;
    const settings = client.settings.get(message.guild.id) || require('./default_settings.js');
    const key = `${message.guild.id}-${message.author.id}`;
    client.points.ensure(key, {
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        last_seen: new Date()
    });
    if (settings.ignored.users.includes(message.author.id)) return;
    if (settings.ignored.channels.includes(message.channel.id)) return;
    if (message.member.roles.some(r => settings.ignored.roles.includes(r.id))) return;
    client.points.inc(key, 'points');
    const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));
    if (client.points.get(key, 'level') < curLevel) {
        let lvl_msg = settings.level_up_message;
        if (!lvl_msg) {
            lvl_msg = `${message.author}, you leveled up to level **${curLevel}**!`;
        } else {
            lvl_msg = lvl_msg.replace('{user}', message.author);
            lvl_msg = lvl_msg.replace('{points}', client.points.get(key, 'points'));
            lvl_msg = lvl_msg.replace('{level}', curLevel);
        };
        message.channel.send(lvl_msg);
        client.points.set(key, curLevel, 'level');
    };
    if (message.content === '<@484166057284861972> prefix') return message.reply(`the prefix is \`${settings.prefix}\``);
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(settings.prefix.length).toLowerCase();
    /**
     * extremely shitty and dangerous command 'handler' right here. But it'll do for this.
     */
    let cmdFile = require(`./commands/${command}.js`);
    if (!cmdFile) return;
    if (!message.member.permissions.has(cmdFile.conf.perms.user)) {
        return message.channel.send(`:no_entry: **You require the permission \`${cmdFile.conf.perms.user}\` to run this command.**`);
    };
    try {
        await cmdFile.run(client, message, args);
    } catch (e) {
        console.error(e.stack);
        return message.channel.send(`:no_entry: **ERROR** | \`${e.message}\``);
    };
});