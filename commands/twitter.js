const { SlashCommandBuilder} = require('@discordjs/builders');
const { CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('twitterlol')
        .setDescription('donne le lien de mon twitter'),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute (interaction) {
        const row = new MessageActionRow()
        .addComponents(new MessageButton()
            .setLabel('Twitter')
            .setStyle('LINK')
            .setURL('https://twitter.com/icewill')
        );

        await interaction.reply({content: 'Clique sur le bouton pour voir mon profil twitter', components: [row]});
    }

}