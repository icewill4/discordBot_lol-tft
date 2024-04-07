const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { CommandInteraction } = require("discord.js");
const { riotApiKey } = require("../../config.json");

const members = require("../../members-schema");

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
            .setDescription("Entre le pseudo discord à ajouter")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("pseudolol")
            .setDescription("Entre le pseudo du nouveau membre")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("tag")
            .setDescription("Entre le # du compte")
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
            .setName("tag")
            .setDescription("Entre # du compte")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("nouveaupseudolol")
            .setDescription("Entre le nouveau pseudo lol ")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("nouveautag")
            .setDescription("Entre le nouveau tag ")
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
        .addStringOption((option) =>
          option
            .setName("tag")
            .setDescription("Entre le # du compte à supprimer")
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

    const tag = encodeURIComponent(
      interaction.options.getString("tag").replace("#", "").split(" ").join("")
    );

    switch (interaction.options.getSubcommand()) {
      case "ajouter":
        await members.create({
          pseudoDiscord: pseudoDiscord,
          pseudoLoL: pseudoLoL,
          tag: tag,
          soloqTier: "null",
          soloqRank: "null",
          soloqLP: 0,
          flexTier: "null",
          flexRank: "null",
          flexLP: 0,
        });
        await interaction.reply({
          content: `${pseudoDiscord} a été ajouté avec le pseudo ${pseudoLoL}#${tag}`,
        });

        break;
      case "modifier":
        const nouveauPseudoLoL = encodeURIComponent(
          interaction.options.getString("nouveaupseudolol").split(" ").join("")
        );
        const nouveauTag = encodeURIComponent(
          interaction.options.getString("nouveautag").replace("#", "").split(" ").join("")
        );
        await members.updateOne(
          { pseudoDiscord: pseudoDiscord },
          { pseudoLoL: nouveauPseudoLoL },
          { tag: nouveauTag}

        );
        await interaction.reply({
          content: `le compte ${pseudoLoL}#${tag} de ${pseudoDiscord} est desormais ${nouveauPseudoLoL}#${nouveauTag}`,
        });

        break;
      case "supprimer":
        await members.deleteOne({
          pseudoDiscord: pseudoDiscord,
          pseudoLoL: pseudoLoL,
          tag: tag,
        });
        await interaction.reply({
          content: `le compte ${pseudoLoL}#${tag} de ${pseudoDiscord} a été supprimé`,
        });
        break;
      default:
        console.log("default");
    }
  },
};
