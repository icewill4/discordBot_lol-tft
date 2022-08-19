const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");

const axios = require("axios");
const { riotApiKey } = require("../config.json");

const members = require("../members-schema");

const ranks = {
  IRON4: 0,
  IRON3: 1,
  IRON2: 2,
  IRON1: 3,
  BRONZE4: 4,
  BRONZE3: 5,
  BRONZE2: 6,
  BRONZE1: 7,
  SILVER4: 8,
  SILVER3: 9,
  SILVER2: 10,
  SILVER1: 11,
  GOLD4: 12,
  GOLD3: 13,
  GOLD2: 14,
  GOLD1: 15,
  PLATINUM4: 16,
  PLATINUM3: 17,
  PLATINUM2: 18,
  PLATINUM1: 19,
  DIAMOND4: 20,
  DIAMOND3: 21,
  DIAMOND2: 22,
  DIAMOND1: 23,
  MASTER1: 24,
  GRANDMASTER1: 25,
  CHALLENGER1: 26,
};

function compareRank(left, right) {
  return ranks[left.rank] - ranks[right.rank];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("classement")
    .setDescription("Affiche le classement des membres")
    .addSubcommand((subcommand) =>
      subcommand.setName("soloq").setDescription("classement soloQ")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("flex").setDescription("classement flex")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("tft").setDescription("classement tft")
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const listeMembers = await members.find({});
    const classementSoloQ = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Classement soloQ");

    const classementFlex = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Classement flex");

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

      await members.updateOne(
        { pseudoLoL: `${listeMembers[i].pseudoLoL}` },
        {
          soloqTier: `${leagueV4.data[0].tier}`,
          soloqRank: `${leagueV4.data[0].rank}`,
          soloqLP: `${leagueV4.data[0].leaguePoints}`,
          flexTier: `${leagueV4.data[1].tier}`,
          flexRank: `${leagueV4.data[1].rank}`,
          flexLP: `${leagueV4.data[1].leaguePoints}`,
        }
      );

      switch (interaction.options.getSubcommand()) {
        case "soloq":
          classementSoloQ.addField(
            `${i + 1} ${listeMembers[i].pseudoLoL}`,
            `soloQ ${listeMembers[i].soloqTier} ${listeMembers[i].soloqRank} ${listeMembers[i].soloqLP} lp`,
            false
          );

          break;
        case "flex":
          classementFlex.addField(
            `${i + 1} ${listeMembers[i].pseudoLoL}`,
            `flex ${listeMembers[i].flexTier} ${listeMembers[i].flexRank} ${listeMembers[i].flexLP} lp`,
            false
          );

          break;
        case "tft":
          break;
      }
    }
    switch (interaction.options.getSubcommand()) {
      case "soloq":
        await interaction.reply({ embeds: [classementSoloQ] });
        break;
      case "flex":
        await interaction.reply({ embeds: [classementFlex] });
        break;

      case "tft":
        await interaction.reply({
          content: "Cette commande n'est pas encore disponible",
        });
        break;
    }
  },
};
