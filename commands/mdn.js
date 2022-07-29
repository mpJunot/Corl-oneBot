const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, time } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mdn')
        .setDescription('Searches the official MDN documentation')
        .addStringOption(option => option.setName('search-query').setDescription('Put something to search').setRequired(true)),
    async execute(interaction) {
        if (interaction.commandName == 'mdn') {
            const text = interaction.options.getString('search-query')
            const base = 'https://developer.mozilla.org'
            const uri = `${base}/api/v1/search?q=${encodeURIComponent(
                text
            )}&locale-en-US`
            const documents = (await axios(uri)).data.documents

            if (documents) {
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: 'MDN Web Documentation',
                        iconURL: 'https://avatars.githubusercontent.com/u/7565578?s=200&v=4'
                    })
                    .setColor('BLUE')
                    .setTimestamp()
                    .setFooter({ text: `by ${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })

                let truncated = false
                if (documents.length > 3) {
                    documents.length = 3
                    truncated = true
                }
                for (let { mdn_url, title, summary }
                    of documents) {
                    summary = summary.replace(/(\r\n|\n|\r)/gm, '')
                    embed.addField(title, `${summary}\n[link](${base}${mdn_url})`)
                }
                if (truncated) {
                    embed.addField(
                        'Too many results',
                        `View more results [more here](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(
                            text
                        )}).`
                    )
                }
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
}