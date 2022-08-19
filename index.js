const fs = require("fs");
const {
  Client,
  Collection,
  Intents,
  Interaction,
  Attachement,
  MessageEmbed,
} = require("discord.js");

const { token, mongodbUrl, guildId, clientId } = require("./config.json");
const mongoose = require("mongoose");

const handleCommand = require("./helpers/command");
const handleSelectMenu = require("./helpers/select-menu");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
});
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

//demarre le bot et connecte a la base de données
client.once("ready", async () => {
  console.log("bot démarré");
  await mongoose
    .connect(mongodbUrl, {
      keepAlive: true,
    })
    .then(() => console.log("connexion à la base de données réussie"))
    .catch((err) => console.log(err));
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) handleCommand(client, interaction);
  if (interaction.isSelectMenu()) handleSelectMenu(interaction);
});

client.login(token);
