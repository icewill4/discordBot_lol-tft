const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  MessageAttachment,
  MessageEmbed,
  Message,
} = require("discord.js");
const axios = require("axios");
const { riotApiKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fight")
    .setDescription("défi un autre utilisateur en 1v1 sur League of legends")
    .addUserOption((option) =>
      option
        .setName("adversaire")
        .setDescription("Entre son pseudo discord")
        .setRequired(true)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const joueur1 = interaction.user;
    const joueur2 = interaction.options.getUser("adversaire");

    /*
        profilEmbed = new MessageEmbed()
        .setAuthor({name: (profil.data.name), iconURL: `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${profil.data.profileIconId}.png})
        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${profil.data.profileIconId}.png`)
        .addField("Level", (profil.data.summonerLevel).toString())
        .addField("ID", (profil.data.id).toString())
        .setColor("RED");

        console.log(pseudo);
        console.log(profil.data);
        await interaction.reply({embeds: [profilEmbed]});        

    }
*/

    console.log("joueur1", joueur1);
    console.log("joueur2", joueur2);
    // console.log(provider);

    await interaction.reply({ content: `${joueur1} défi ${joueur2} en 1v1` });
    await joueur1.send(`code du duel vs${joueur2}`).catch(console.error);
    await joueur2.send(`code du duel vs${joueur1}`).catch(console.error);
  },
};
