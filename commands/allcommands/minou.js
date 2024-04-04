const { SlashCommandBuilder} = require('@discordjs/builders');
const { CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minou')
        .setDescription('le poti chat'),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute (interaction) {
        const chat = await axios.get('https://api.thecatapi.com/v1/images/search');
        const chatEmbed = {
            color: 0x0099ff,
            title: 'Le poti chat',
            image: {
                url: chat.data[0].url,
            },
        };
        
     

        await interaction.reply({ embeds: [chatEmbed]});
    }

}