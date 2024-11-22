const { EmbedBuilder } = require('discord.js');
const getColorEmbed = require('../../function/getColorEmbed');

module.exports = {
    name: 'trackrolelist',
    description: 'Lister tous les rôles suivis',
    permissions: 'Aucune',
    options: [],
    async execute(interaction, client) {
        try {
            const trackedRoles = await new Promise((resolve, reject) => {
                client.database.all(
                    `SELECT * FROM trackedRole WHERE guildId = ?`,
                    [interaction.guild.id],
                    (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows);
                    }
                );
            });

            if (trackedRoles.length === 0) {
                return interaction.reply({
                    content: 'Aucun rôle n\'est actuellement suivi dans ce serveur.',
                    ephemeral: true,
                });
            }

            const embedColor = await getColorEmbed(client, interaction.guild.id)

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('Rôles Suivis')
                .setDescription('Voici la liste des rôles actuellement suivis dans ce serveur :')
                .setTimestamp()
                .setFooter({
                    text: `Demandé par ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                });

            trackedRoles.forEach(roleInfo => {
                const role = interaction.guild.roles.cache.get(roleInfo.roleId);
                const roleName = role ? role.name : '`Rôle introuvable`';

                embed.addFields([
                    {
                        name: `${roleName}`,
                        value: `**Nom de base :** ${roleInfo.baseName}\n**Max Membres :** ${roleInfo.maxCount}\n**ID :** \`${roleInfo.roleId}\``,
                        inline: false,
                    },
                ]);
            });

            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles suivis :', error);
            await interaction.reply({
                content: 'Une erreur est survenue lors de la récupération des rôles suivis.',
                ephemeral: true,
            });
        }
    },
};
