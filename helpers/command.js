const { Client, CommandInteraction, Interaction } = require('discord.js');

/**
 * 
 * @param {*} client 
 * @param {*} interaction 
 */
const handleCommand = async (client, interaction) => {
    const command = client.commands.get(interaction.commandName);
    //const args = interaction.data.options;


    if (!command) return;
  /*  if (command.data.name == "fight") {
        console.log("chat");
        
    }*/

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: "Une erreur s'est produite durant l'éxécution de cette commande!", ephemeral: true });
    }
}

module.exports = handleCommand;