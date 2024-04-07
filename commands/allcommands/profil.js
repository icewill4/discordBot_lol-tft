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
        .setDescription("Entre le pseudo")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tag")
        .setDescription("Entre le tag")
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
    const tag = encodeURIComponent(
      interaction.options.getString("tag").replace("#", "").split(" ").join("")
    );

    let accountv1;

    try {
      accountv1 = await axios.get(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${pseudo}/${tag}?api_key=${riotApiKey}`
      );
      console.log(accountv1.data.puuid);
    }catch (error) {
      console.log('error', error);
      return interaction.reply({ content: "Cet invocateur n'existe pas" });
    }

    let summmonerv4;
    let leaguev4;
    try {
        summmonerv4 = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountv1.data.puuid}?api_key=${riotApiKey}`
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
        iconURL: `http://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/${summmonerv4.data.profileIconId}.png`,
      })
      .setThumbnail(
        `http://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/${summmonerv4.data.profileIconId}.png`
      )
      .addFields([
        { name :"Level", value: summmonerv4.data.summonerLevel.toString()},
        { name: "Encrypted summoner ID", value: summmonerv4.data.id.toString()},
        { name: "Rank SoloQ", value: rankSoloQ},
        { name: "Rank Flex", value: rankFlex}])
      .setColor("Red");

    await interaction.reply({ embeds: [profilEmbed] });
  },
};
