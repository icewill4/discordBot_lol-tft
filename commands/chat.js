const { SlashCommandBuilder} = require('@discordjs/builders');
const { CommandInteraction , MessageAttachment, MessageEmbed, Message} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatlol')
        .setDescription('Envoie un chat random'),



    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute (interaction) {
        const url ='https://some-random-api.ml/img/cat'

        let data, response;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (error) {
            return Message.channel.send('une erreur est survenue, veuillez réessayer')
        }

        let embed = new MessageEmbed().setImage(data.link);


        await interaction.reply({content:`Le poti chat :blush:`,embeds: [embed]});

        
    }

}
// `le nom des chats de ${laPersonne} sont ${nomChat1} et ${nomChat2} UwU`