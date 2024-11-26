const {} = require('discord.js')
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
            options: []
        }
    ],
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false)

        if (subcommand === 'ping') {
            const ping = await interaction.reply('Pong!')
            ping.edit(`Ping: ${ping.createdTimestamp - interaction.createdTimestamp}ms`)
        } else if (subcommand === 'help') {
        const id = {
            ban: "1310629042453483551",
            bot: "1310629042453483552",
            reset: "1310629042453483556",
            track: "1310670191411068949",
        }
    
        // let jsp = "-# ┖"
    
            
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