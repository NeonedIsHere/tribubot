const { getColorEmbed } = require("../function/main")
const { EmbedBuilder } = require('discord.js')
const ban = require("./ban")

module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes et leur utilité',
    dm: false,
    permissions: 'Aucune',
    /*options: [
        {
            name: 'command',
            description: 'Commande pour afficher l\'aide d\'une commande spécifique',
            type: 'string',
            required: false,
            autocomplete: false,
            choices: [
                { name: 'ban', value: 'ban' },
                { name: 'bot', value: 'bot' },
                { name: 'reset', value: 'rst' },
                { name: 'track', value: 'trk' },
            ]
        }
    ],*/ 
    async execute(interaction, client) {

        const choices = await interaction.options.getString('command')

        const id = {
            ban: "1310629042453483551",
            bot: "1310629042453483552",
            reset: "1310629042453483556",
            track: "1310670191411068949",
        }

        var jsp = "-# ┖"

        if (!choices) {
            const embed = new EmbedBuilder()
                .setTitle('Aide')
                .setDescription('***Voici la liste des commande disponible :***')
                .addFields(
                    { name: 'Ban', value: `</ban ask:${id.ban}>\n</ban config channel:${id.ban}>\n</ban config juge:${id.ban}>`, inline: true},
                    { name: 'Bot', value: `</bot set banner:${id.bot}>\n</bot set color:${id.bot}>\n</bot set name:${id.bot}>\n</bot set pic:${id.bot}>`, inline: true },
                    { name: 'Reset', value: `</reset all bot:${id.reset}>\n</reset all serveur:${id.reset}>\n</reset channel bot:${id.reset}>\n</reset channel serveur:${id.reset}>\n</reset juge bot:${id.reset}>\n</reset juge serveur:${id.reset}>\n</reset track bot:${id.reset}>\n</reset track serveur:${id.reset}>`, inline: true },
                    { name: 'Track', value: `</trackrole add:${id.track}>\n</trackrole list:${id.track}>\n</trackrole remove:${id.track}>`, inline: true }
                )
                .setColor(await getColorEmbed(client, interaction.guild.id))
            
            await interaction.reply({ embeds: [embed] })
        }
    }
}