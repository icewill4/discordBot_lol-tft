const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { riotApiKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("histo")
    .setDescription("affiche l'historique des 24 dernières heures d'un joueur")
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
    let matchv5;
    const queueId = 420;
        summmonerv4 = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${pseudo}?api_key=${riotApiKey}`
        );
        console.log('ioh');
    //add the ranked parameter to the url to get the ranked queue
        matchv5 = await axios.get(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${summmonerv4.data.puuid}/ids?startTime=${Math.floor((Date.now() - 86400000)/1000)}&endTime=${Math.floor(Date.now()/1000)}&queue=420&start=0&count=20&api_key=${riotApiKey}`
      )
      matchToRemove = 20 - matchv5.data.length;
  //add a field for each match
    let profilEmbed = new EmbedBuilder()
      .setAuthor({
        name: summmonerv4.data.name,
        iconURL: `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${summmonerv4.data.profileIconId}.png`,
      })
      .addFields(
        {
            name: "match 20",
            value: `${summmonerv4.data.name} est ${matchv5.data[19]}`,
            inline: false,
        },
        {
            name: "match 19",
            value: `${summmonerv4.data.name} est ${matchv5.data[18]}`,
            inline: false,
        },
        {
            name: "match 18",
            value: `${summmonerv4.data.name} est ${matchv5.data[17]}`,
            inline: false,
        },
        {
            name: "match 17",
            value: `${summmonerv4.data.name} est ${matchv5.data[16]}`,
            inline: false,
        },
        {
            name: "match 16",
            value: `${summmonerv4.data.name} est ${matchv5.data[15]}`,
            inline: false,
        },
        {
            name: "match 15",
            value: `${summmonerv4.data.name} est ${matchv5.data[14]}`,
            inline: false,
        },
        {
            name: "match 14",
            value: `${summmonerv4.data.name} est ${matchv5.data[13]}`,
            inline: false,
        },
        {
            name: "match 13",
            value: `${summmonerv4.data.name} est ${matchv5.data[12]}`,
            inline: false,
        },
        {
            name: "match 12",
            value: `${summmonerv4.data.name} est ${matchv5.data[11]}`,
            inline: false,
        },
        {
            name: "match 11",
            value: `${summmonerv4.data.name} est ${matchv5.data[10]}`,
            inline: false,
        },
        {
            name: "match 10",
            value: `${summmonerv4.data.name} est ${matchv5.data[9]}`,
            inline: false,
        },
        {
            name: "match 9",
            value: `${summmonerv4.data.name} est ${matchv5.data[8]}`,
            inline: false,
        },
        {
            name: "match 8",
            value: `${summmonerv4.data.name} est ${matchv5.data[7]}`,
            inline: false,
        },
        {
            name: "match 7",
            value: `${summmonerv4.data.name} est ${matchv5.data[6]}`,
            inline: false,
        },
        {
            name: "match 6",
            value: `${summmonerv4.data.name} est ${matchv5.data[5]}`,
            inline: false,
        },
        {
            name: "match 5",
            value: `${summmonerv4.data.name} est ${matchv5.data[4]}`,
            inline: false,
        },
        {
            name: "match 4",
            value: `${summmonerv4.data.name} est ${matchv5.data[3]}`,
            inline: false,
        },
        {
            name: "match 3",
            value: `${summmonerv4.data.name} est ${matchv5.data[2]}`,
            inline: false,
        },
        {
            name: "match 2",
            value: `${summmonerv4.data.name} est ${matchv5.data[1]}`,
            inline: false,
        },
        {
            name: "match 1",
            value: `${summmonerv4.data.name} est ${matchv5.data[0]}`,
            inline: false,
        },


      )
      .spliceFields(0, matchToRemove)
      .setColor("Red");

    console.log(pseudo);
    console.log(summmonerv4.data);
    await interaction.reply({ embeds: [profilEmbed] });
  },
};
