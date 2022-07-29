const { Client, CommandInteraction } = require('discord.js');

/**
 * 
 * @param {Client} Client 
 * @param {CommandInteraction} interaction 
 */
const handleCommand = async(client, interaction) => {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Error command", ephemeral: true })
    }
}

module.exports = handleCommand;