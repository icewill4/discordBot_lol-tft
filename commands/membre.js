const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { CommandInteraction } = require("discord.js");
const { riotApiKey } = require("../config.json");

const members = require("../members-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membre")
    .setDescription(
      "ajoute, modifie ou supprime un membre à la liste des membres"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ajouter")
        .setDescription("ajoute un membre à la liste des membres")
        .addUserOption((option) =>
          option
            .setName("pseudodiscord")
            .setDescription("Entre le pseudo discord à ajoute")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("pseudolol")
            .setDescription("Entre le pseudo du nouveau membre")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("modifier")
        .setDescription("modifie un membre de la liste des membres")
        .addUserOption((option) =>
          option
            .setName("pseudodiscord")
            .setDescription("Entre le pseudo discord du membre à modifier")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("pseudolol")
            .setDescription("Entre le pseudo lol actuel ")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("nouveaupseudolol")
            .setDescription("Entre le nouveau pseudo lol ")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("supprimer")
        .setDescription("supprime un membre de la liste des membres")
        .addUserOption((option) =>
          option
            .setName("pseudodiscord")
            .setDescription("Entre le pseudo discord à supprimer")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("pseudolol")
            .setDescription("Entre le pseudo du compte à supprimer")
            .setRequired(true)
        )
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const pseudoDiscord = interaction.options.getUser("pseudodiscord").username;

    const pseudoLoL = encodeURIComponent(
      interaction.options.getString("pseudolol").split(" ").join("")
    );

    switch (interaction.options.getSubcommand()) {
      case "ajouter":
        await members.create({
          pseudoDiscord: pseudoDiscord,
          pseudoLoL: pseudoLoL,
          soloqTier: "null",
          soloqRank: "null",
          soloqLP: 0,
          flexTier: "null",
          flexRank: "null",
          flexLP: 0,
        });
        await interaction.reply({
          content: `${pseudoDiscord} a été ajouté avec le pseudo ${pseudoLoL}`,
        });

        break;
      case "modifier":
        const nouveauPseudoLoL = encodeURIComponent(
          interaction.options.getString("nouveaupseudolol").split(" ").join("")
        );
        await members.updateOne(
          { pseudoDiscord: pseudoDiscord },
          { pseudoLoL: nouveauPseudoLoL }
        );
        await interaction.reply({
          content: `le compte ${pseudoLoL} de ${pseudoDiscord} est desormais ${nouveauPseudoLoL}`,
        });

        break;
      case "supprimer":
        await members.deleteOne({
          pseudoDiscord: pseudoDiscord,
          pseudoLoL: pseudoLoL,
        });
        await interaction.reply({
          content: `le compte ${pseudoLoL} de ${pseudoDiscord} a été supprimé`,
        });
        break;
      default:
        console.log("default");
    }
  },
};
