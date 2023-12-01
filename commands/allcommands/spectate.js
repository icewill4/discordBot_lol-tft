const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { riotApiKey } = require("../../config.json");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spectate")
    .setDescription("generate a script to spectate a player")
    .addStringOption((option) =>
      option
        .setName("pseudo")
        .setDescription("Enter the name of the player to spectate")
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
    let spectatorv4;
    
    try {
        summmonerv4 = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${pseudo}?api_key=${riotApiKey}`
      );

      spectatorv4 = await axios.get(
        `https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summmonerv4.data.id}?api_key=${riotApiKey}`
      )
    } catch (error) {
      return interaction.reply({ content: "Cet invocateur n'existe pas ou n'es pas en game" });
    }
    
    const gameId = spectatorv4.data.gameId.toString();
    const encryptionKey = spectatorv4.data.observers.encryptionKey.toString();
    
    const command = `
    REM Copy the command below into CMD or download and execute the file, it's not a virus dw :) \n
    cd /d "C:\\Riot Games\\League of Legends\\Game" & start "" "League of Legends.exe" "spectator spectator-consumer.euw1.lol.pvp.net:80 ${encryptionKey} ${gameId} EUW1" "-UseRads"`
    
    const batFile = `./assets/spectate_${pseudo}.bat`    ;
    
    fs.writeFileSync(batFile, command); 
   
    await interaction.reply({ files: [`./assets/spectate_${pseudo}.bat`] });
   
    fs.unlinkSync(batFile);
  },
};
