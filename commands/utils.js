const { EmbedBuilder } = require('discord.js')
const { getColorEmbed } = require('../function/main')

module.exports = {
    name: 'utils',
    description: 'Commandes utilitaires pour le bot',
    permissions: 'Aucune',
    dm: false,
    options: [
        {
            name: 'ping',
            description: 'Renvoie le ping du bot',
            type: 'subcommand',
            options: []
        },
        {
            name: 'help',
            description: 'Affiche la liste des commandes et leur utilité',
            type: 'subcommand',
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
            ]*/ 
        }
    ],
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false)

        if (subcommand === 'ping') {

            let m = await interaction.reply({ content: 'Envois de requête a l\'API...'})

            const pong = new EmbedBuilder()
                .setDescription(`**Ping \`${Math.round(client.ws.ping)}\` ms**`)
                .setColor(await getColorEmbed(client, interaction.guild.id))

            m.edit({ content: "", embeds: [pong] })

        } else if (subcommand === 'help') {

            const id = {
                ban: "1310629042453483551",
                bot: "1310629042453483552",
                reset: "1310629042453483556",
                track: "1310670191411068949",
                utils: "1311052062334648460"
            }
    
        // let jsp = "-# ┖"
            
            const embed = new EmbedBuilder()
                .setTitle('Aide')
                .setDescription('***Voici la liste des commande disponible :***')
                .addFields(
                    { name: 'Ban', value: `</ban ask:${id.ban}>\n</ban config channel:${id.ban}>\n</ban config juge:${id.ban}>\n</ban config show:${id.ban}>`, inline: true},
                    { name: 'Bot', value: `</bot set banner:${id.bot}>\n</bot set color:${id.bot}>\n</bot set name:${id.bot}>\n</bot set pic:${id.bot}>`, inline: true },
                    { name: 'Reset', value: `</reset all bot:${id.reset}>\n</reset all serveur:${id.reset}>\n</reset channel bot:${id.reset}>\n</reset channel serveur:${id.reset}>\n</reset juge bot:${id.reset}>\n</reset juge serveur:${id.reset}>\n</reset track bot:${id.reset}>\n</reset track serveur:${id.reset}>`, inline: true },
                    { name: 'Track', value: `</trackrole add:${id.track}>\n</trackrole list:${id.track}>\n</trackrole remove:${id.track}>`, inline: true },
                    { name: 'Utils', value: `</utils help:${id.utils}>\n</utils ping:${id.utils}>`, inline: true }
                )
                .setColor(await getColorEmbed(client, interaction.guild.id))
                
            await interaction.reply({ embeds: [embed] })
            
        }
    }
}