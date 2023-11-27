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
    let summmonerv4;
    let leaguev4;
    try {
        summmonerv4 = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${pseudo}?api_key=${riotApiKey}`
      );

        leaguev4 = await axios.get(
        `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summmonerv4.data.id}?api_key=${riotApiKey}`
      )
    } catch (error) {
      return interaction.reply({ content: "Cet invocateur n'existe pas" });
    }
    if (typeof leaguev4.data[0] !== 'undefined' && leaguev4.data[0].queueType === "RANKED_SOLO_5x5") {
      rankSoloQ =leaguev4.data[0].tier.toString() + " " + leaguev4.data[0].rank.toString() + " " + leaguev4.data[0].leaguePoints.toString() + " LP" ;
      // Your variable is not undefined
    } else {
    rankSoloQ = "Unranked";
      // Your variable is undefined
   }
    if (typeof leaguev4.data[1] !== 'undefined' && leaguev4.data[1].queueType === "RANKED_FLEX_SR") {
      rankFlex = leaguev4.data[1].tier.toString() + " " + leaguev4.data[1].rank.toString() + " " + leaguev4.data[1].leaguePoints.toString() + " LP";
      // Your variable is not undefined
    } else {
    rankFlex = "Unranked";
      // Your variable is undefined
    }
    console.log(leaguev4.data);
    let profilEmbed = new EmbedBuilder()
      .setAuthor({
        name: summmonerv4.data.name,
        iconURL: `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${summmonerv4.data.profileIconId}.png`,
      })
      .setThumbnail(
        `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${summmonerv4.data.profileIconId}.png`
      )
      .addFields([
        { name :"Level", value: summmonerv4.data.summonerLevel.toString()},
        { name: "Encrypted summoner ID", value: summmonerv4.data.id.toString()},
        { name: "Rank SoloQ", value: rankSoloQ},
        { name: "Rank Flex", value: rankFlex}])
      .setColor("Red");

    console.log(pseudo);
    console.log(summmonerv4.data);
    await interaction.reply({ embeds: [profilEmbed] });
  },
};
