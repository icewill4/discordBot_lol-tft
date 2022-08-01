const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

const members = require("../members-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmember")
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

    await members.create({
      pseudoDiscord: pseudoDiscord,
      pseudoLoL: pseudoLoL,
    });

    console.log(pseudoDiscord);
    console.log(pseudoLoL);
    await interaction.reply({ content: "Membre ajouté" });
  },
};
