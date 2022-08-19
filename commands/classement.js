const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");

const axios = require("axios");
const { riotApiKey } = require("../config.json");

const members = require("../members-schema");

const tiers = {
  IRON: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  DIAMOND: 5,
  MASTER: 6,
  GRANDMASTER: 7,
  CHALLENGER: 8,
};

const ranks = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
};

const execute = async (interaction) => {
  const listeMembers = await members.find({});

  const promises = listeMembers.map((member) =>
    axios
      .get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${member.pseudoLoL}?api_key=${riotApiKey}`
      )
      .then((summonerV4) =>
        axios.get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerV4.data.id}?api_key=${riotApiKey}`
        )
      )
      .then((leagueV4) =>
        members.updateOne(
          { pseudoLoL: `${member.pseudoLoL}` },
          {
            soloqTier: `${leagueV4.data[0].tier}`,
            soloqRank: `${leagueV4.data[0].rank}`,
            soloqLP: `${leagueV4.data[0].leaguePoints}`,
            flexTier: `${leagueV4.data[1].tier}`,
            flexRank: `${leagueV4.data[1].rank}`,
            flexLP: `${leagueV4.data[1].leaguePoints}`,
          }
        )
      )
  );

  await Promise.all(promises).catch((err) => console.log(err.message));

  const type = interaction.options.getSubcommand();

  const classement = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Classement ${type}`);

  const sortedList = listeMembers.sort((a, b) => {
    const tierDiff = tiers[a[`${type}Tier`]] - tiers[b[`${type}Tier`]];
    const rankDiff = ranks[b[`${type}Rank`]] - ranks[a[`${type}Rank`]];
    const LPDiff = a[`${type}LP`] - b[`${type}LP`];
    return tierDiff ? tierDiff : rankDiff ? rankDiff : LPDiff;
  });

  if (type !== "tft")
    sortedList.forEach((member, i) => {
      classement.addField(
        `${i + 1} ${member.pseudoLoL}`,
        `soloQ ${member[`${type}Tier`]} ${member[`${type}Rank`]} ${
          member[`${type}LP`]
        } lp`,
        false
      );
    });

  await interaction.reply({ embeds: [classement] });
};

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
  execute,
};
