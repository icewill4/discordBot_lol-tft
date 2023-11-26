const { SlashCommandBuilder} = require('@discordjs/builders');
const { CommandInteraction, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('langage')
        .setDescription('choisis ton langage'),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute (interaction) {
        const row = new MessageActionRow()
        .addComponents(new MessageSelectMenu()
            .setCustomId('select-language')
            .setPlaceholder('selectionne ton langage favoris')
            .addOptions([
                {
                    label: 'C#',
                    description:'développeur .NET',
                    value:'CSHARP'
                },
                {
                    label: 'JS',
                    description:'développeur Javascript',
                    value:'javascript'
                },
                {
                    label: 'html',
                    description:'développeur web',
                    value:'HTML'
                }
            ])
        );
       
        return interaction.reply({content: 'quel est ton langage de programation favoris?', components: [row] })
    }

}