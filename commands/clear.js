const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, MessageActionRow } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('delete somes messages')
        .addIntegerOption(option => option.setName('number').setDescription('Number of message to delete').setRequired(true))
        .addUserOption(user => user.setName('user').setDescription('User to whom we want to delete messages').setRequired(false)),

    async execute(interaction) {
        if (interaction.commandName == 'clear') {
            const toDelete = interaction.options.getInteger("number");
            if (toDelete > 100 || toDelete < 1) return interaction.reply('Invalid Syntax: [NUMBER] between 1 and 100')
            const user = interaction.options.getUser("user");
            //const msgToDel = await interaction.channel.message.fetch();
            if (user) {
                let cpt = 0;
                const UserMsg = [];
                (await msgToDel.filter(msg => {
                    user
                    UserMsg.push(msg);
                    cpt++;
                }));
                interaction.channel.bulkDelete(msgToDel);
                interaction.reply(`${msgToDel} messages from ${user} were cleared`);
            } else {
                interaction.channel.bulkDelete(toDelete);
                interaction.reply({ content: `${toDelete} messages were cleared from this channel`, ephemeral: true });
            };
        }
    }
}

const clear = (message, args, client) => {
    const amount = parseInt(args[0])
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription("You do not have permissions to execute this command.")
            .setFooter({ text: `by ${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        return message.channel.send({ embeds: [embed] })
    }
    if (!amount) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription("Please specify the amount of messages you want to delete")
            .setFooter({ text: `by ${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        return message.channel.send({ embeds: [embed] });
    }
    if (amount > 100 || amount < 1 || isNaN(amount)) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription("Please select a number **between** **100** and **1**.")
            .setFooter({ text: `by ${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        return message.channel.send({ embeds: [embed] });
    }

    message.channel.bulkDelete(amount).catch(err => {
        if (err) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription("Due to discord limitations, I cannot delete messages older than 14 days!")
                .setFooter({ text: `by ${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
            message.channel.send({ embeds: [embed] })
        }
    });
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTimestamp()
        .setDescription(`:white_check_mark: **${amount}** message(s) was(were) deleted from this channel!`)
        .setFooter({ text: `by ${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
    message.channel.send({ embeds: [embed], ephemeral: true })
}

module.exports.clear = clear;