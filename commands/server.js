const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const moment = require('moment');

const info = async(user, interaction) => {
    const embuser = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({format: 'png'})}` })
        .setThumbnail(`${user.displayAvatarURL({dynamic: false})}`)
        .setTimestamp()
        .addFields([{
            name: "General",
            value: `
                ¤ Name: ${user.username}
                ¤ UserId: ${user.id}
                ¤ Joined at: ${moment(user.joinedAt).format('DD/MM/YY')}
                ¤ Created at: ${moment(user.createdAt).format('DD/MM/YY')}
                `,
            inline: false
        }])
        .setFooter({ text: `by ${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })
    await interaction.reply({ embeds: [embuser] });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user or a server!')
        .addSubcommand(subcommand =>
            subcommand
            .setName('user')
            .setDescription('Info about a user')
            .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
            .setName('server')
            .setDescription('Info about the server')),
    async execute(interaction) {
        if (interaction.commandName === 'info') {
            if (interaction.options.getSubcommand() === 'user') {
                const user = interaction.options.getUser('target');
                if (user) {
                    info(user, interaction)
                } else {
                    info(interaction.user, interaction)
                }
            } else if (interaction.options.getSubcommand() === 'server') {
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                    .setColor('RANDOM')
                    .setThumbnail(`${interaction.guild.iconURL()}`)
                    .setTimestamp()
                    .addFields([{
                            name: ":crown: | General",
                            value: `
                            Name: **${interaction.guild.name}**
                            Region: ${interaction.guild.region}
                            Created: ${moment(interaction.guild.createdAt).format('DD/MM/YY')}
                            owner: <@${interaction.guild.ownerId}>

                            Description: ${interaction.guild.description}

                            `,
                            inline: false
                        },
                        {
                            name: ":sparkles: | Community",
                            value: `
                            Total: ${interaction.guild.memberCount}
                            - Members: ${interaction.guild.members.cache.filter((m) => !m.user.bot).size}
                            - Bots: ${interaction.guild.members.cache.filter((m) => m.user.bot).size}
                            - Roles: ${interaction.guild.roles.cache.size}

                            `,
                            inline: false
                        },
                        {
                            name: ":clipboard: | Channels",
                            value: `
                            Total: ${interaction.guild.channels.cache.size - interaction.guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                            - Text: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                            - Voice: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                            - Categories: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                            - News: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_NEWS").size}


                            `,
                            inline: false
                        },
                        {
                            name: ":smirk: | Emojis && Stickers",
                            value: `
                            Total: ${interaction.guild.emojis.cache.size + interaction.guild.stickers.cache.size}
                            - Animated: ${interaction.guild.emojis.cache.filter((e) => e.animated).size}
                            - Regular: ${interaction.guild.emojis.cache.filter((e) => !e.animated).size}
                            - Stickers: ${interaction.guild.stickers.cache.size}

                            `,
                            inline: false
                        }
                    ])
                    .setFooter({ text: `by ${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
}