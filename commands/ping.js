const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('get current ping'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({format: 'png'})}` })
            .setDescription(`Your ping is ${interaction.client.ws.ping} ms`)
            .setTimestamp()
            .setFooter({ text: `by ${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })
        await interaction.reply({ embeds: [embed] });
    }
}