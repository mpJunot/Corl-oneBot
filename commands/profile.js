const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { MessageEmbed, } = require('discord.js');

const avatar = async(user, interaction) => {
    const embed = new MessageEmbed()
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({format: 'png'})}` })
        .setColor('RANDOM')
        .setTimestamp()
        .setTitle('Avatar')
        .setImage(`${user.displayAvatarURL({format: 'png', dynamic: true, size: 4096})}`)
        .setFooter({ text: `by ${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })
    await interaction.reply({ embeds: [embed] })
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('show user avatar!')
        .addUserOption(option => option.setName('target').setDescription('avatar')),

    async execute(interaction) {
        if (interaction.commandName == 'avatar') {
            const user = interaction.options.getUser('target')
            if (user) avatar(user, interaction);

            else avatar(interaction.user, interaction);
        }
    }
}