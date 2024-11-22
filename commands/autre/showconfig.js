const { EmbedBuilder } = require('discord.js')
const getColorEmbed = require('../../function/getColorEmbed')

module.exports = {
    name: 'showconfig',
    description: 'Voir la configuration actuelle du serveur',
    dm: false,
    permissions: 'Aucune',
    options: [],
    async execute(interaction, client) {

        const guild = interaction.guild.id

        try {
            
            const embedColor = await getColorEmbed(client, guild)

            const trackedRole = await new Promise((resolve, reject) => {
                client.database.all(
                    `SELECT * FROM trackedRole WHERE guildId = ?`,
                    [guild],
                    (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows || []);
                    }
                )
            })

            const channelBanConfig = await new Promise((resolve, reject) => {
                client.database.get(
                    `SELECT channelId FROM channel WHERE guildId =?`,
                    [guild],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row || {});
                    }
                )
            })

            const roleBanConfig = await new Promise((resolve, reject) => {
                client.database.get(
                    `SELECT roleId FROM role WHERE guildId =?`,
                    [guild],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row || {});
                    }
                )
            })

            const embed = new EmbedBuilder()
                .setTitle(`Configuration du serveur: ${interaction.guild.name}`)
                .setColor(embedColor || "#ffffff")


            embed.addFields(
                { name: 'Couleur des embeds', value: embedColor ? `\`${embedColor}\`` : `#FFFFFF (défaut)`, inline: false }
            )

            if (trackedRole.length > 0) {
                embed.addFields(
                    { name: 'Rôle suivi', value: 'Utilisez la commande </trackrolelist:00> pour avoir la liste des rôles suivie sur le serveur' }
                )
            } else {
                embed.addFields(
                    { name: 'Rôle suivi', value: 'Aucun rôle suivi sur le serveur' }
                )
            }

            if (roleBanConfig.roleId || channelBanConfig.channelId) {
                embed.addFields(
                    { name: 'Rôle de juge', value: roleBanConfig.roleId ? `<@&${roleBanConfig.roleId}>` : 'Non défini', inline: true },
                    { name: 'Salon de bannissement', value: channelBanConfig.channelId ? `<#${channelBanConfig.channelId}>` : 'Non défini', inline: true }
                );
            } else {
                embed.addFields({
                    name: 'Demandes de ban',
                    value: 'Aucune configuration disponible.',
                    inline: false,
                });
            }

            await interaction.reply({ embeds: [embed] })

        } catch (error) {
            console.error(error)
            interaction.reply({
                content: 'Une erreur est survenue lors de la récupération de la configuration',
                ephemeral: true,
            })
        }
    }
}