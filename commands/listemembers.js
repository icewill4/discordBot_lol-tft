const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");

const axios = require("axios");
const { riotApiKey } = require("../config.json");

const members = require("../members-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listemembers")
    .setDescription("Affiche la liste des membres"),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const listeMembers = await members.find({});
    const listeEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Liste des membres")
      .setDescription("Voici la liste des membres du serveur");

    let summonerV4;
    let leagueV4;

    for (let i = 0; i < listeMembers.length; i++) {
      try {
        summonerV4 = await axios.get(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${listeMembers[i].pseudoLoL}?api_key=${riotApiKey}`
        );
      } catch (error) {
        return console.log("Cet invocateur n'existe pas");
      }

      try {
        leagueV4 = await axios.get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerV4.data.id}?api_key=${riotApiKey}`
        );
      } catch (error) {
        return console.log("Cet id n'existe pas");
      }
      rankSoloq = `${leagueV4.data[0].tier} ${leagueV4.data[0].rank} ${leagueV4.data[0].leaguePoints} lp`;
      rankFlex = `${leagueV4.data[1].tier} ${leagueV4.data[1].rank} ${leagueV4.data[1].leaguePoints} lp`;
      listeEmbed.addField(
        `${i + 1} ${listeMembers[i].pseudoLoL}`,
        `soloQ ${rankSoloq} - flex ${rankFlex}`,
        false
      );
    }

    await interaction.channel.send({ embeds: [listeEmbed] });
  },
};
