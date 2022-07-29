const fs = require('fs');
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { token, prefix } = require('./config.json');
const welcome = require('./member/welcome');
const { clear } = require('./commands/clear');
const addio = require('./member/arrivederci');
const handleCommand = require('./helpers/command');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGES] });
module.exports.client = client;
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.username} created the ${client.user.createdAt}`);
    client.user.setPresence({ activities: [{ name: 'Sa te regarde pas | ?help', type: 'PLAYING' }], status: 'online' });
});

client.on('guildMemberAdd', async member => {
    welcome.welcome(member);
    member.roles.add('982228281719947319');
});

client.on('guildMemberRemove', async member => {
    addio.addio(member);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command == 'corleone') {
        message.delete();
        return message.channel.send("I'm the King");
    }
    if (command == 'rm')
        return message.channel.delete();
    if (command == 'clear') {
        message.delete();
        return clear(message, args, client);
    }
    message.delete();
    const embed = new MessageEmbed()
        .setColor('RED')
        .setTimestamp()
        .setDescription(`**${command}** Invalid command try **${prefix}help**`)
        .setFooter({ text: `by ${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
    message.channel.send({ embeds: [embed], ephemeral: true })
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) handleCommand(client, interaction);
    console.log(interaction.commandName);
});

client.login(token);