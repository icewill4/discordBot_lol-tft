const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { riotApiKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profil")
    .setDescription("affiche le profil d'un utilisateur")
    .addStringOption((option) =>
      option
        .setName("pseudo")
        .setDescription("Entre ton pseudo")
        .setRequired(true)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const pseudo = encodeURIComponent(
      interaction.options.getString("pseudo").split(" ").join("")
    );

    let profil;
    try {
      profil = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${pseudo}?api_key=${riotApiKey}`
      );
    } catch (error) {
      return interaction.reply({ content: "Cet invocateur n'existe pas" });
    }

    let profilEmbed = new EmbedBuilder()
      .setAuthor({
        name: profil.data.name,
        iconURL: `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${profil.data.profileIconId}.png`,
      })
      .setThumbnail(
        `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${profil.data.profileIconId}.png`
      )
      .addFields([
        { name :"Level", value: profil.data.summonerLevel.toString()},
        { name: "ID", value: profil.data.id.toString()}])
      .setColor("Red");

    console.log(pseudo);
    console.log(profil.data);
    await interaction.reply({ embeds: [profilEmbed] });
  },
};
