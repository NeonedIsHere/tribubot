const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Demander le bannissement d\'un membre (abus = derank)',
    dm: true,
    permissions: 'Aucune',
    options: [
        {
            name: 'cible',
            description: 'Membre à bannir',
            type: 'user',
            required: true,
            autocomplete: true,
        },
        {
            name: 'raison',
            description: 'Raison du ban',
            type: 'string',
            required: true,
        },
        {
            name: 'preuve',
            description: "Prouver l'infraction",
            type: 'attachment',
            required: true,
        },
    ],
    async execute(interaction, client) {
        try {
            const target = interaction.options.getUser('cible');
            const reason = interaction.options.getString('raison');
            const proof = interaction.options.getAttachment('preuve');

            const guildId = interaction.guild.id;

            // Récupération du salon depuis la base de données
            const chnl = await new Promise((resolve, reject) => {
                client.database.get(
                    `SELECT channelId FROM channel WHERE guildId = ?`,
                    [guildId],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    }
                );
            });

            if (!chnl || !chnl.channelId) {
                return interaction.reply({
                    content: '`⚠️` Le salon de demande de bannissement n\'est pas configuré. Utilisez </setchannel> pour en définir un.',
                    ephemeral: true,
                });
            }

            const channel = interaction.guild.channels.cache.get(chnl.channelId);

            if (!channel) {
                return interaction.reply({
                    content: '`⚠️` Le salon configuré n\'a pas été trouvé. Utilisez </setchannel> pour en définir un nouveau.',
                    ephemeral: true,
                });
            }

            // Création de l'embed
            const embed = new EmbedBuilder()
                .setTitle('Demande de bannissement')
                .addFields(
                    { name: 'Utilisateur', value: `${target.tag} (${target.id})` },
                    { name: 'Raison', value: reason },
                    { name: 'Auteur de la demande', value: `${interaction.user.tag} (${interaction.user.id})` }
                )
                .setImage(proof.url)
                .setColor('Orange')
                .setTimestamp();

            // Création des boutons
            const AcceptButton = new ButtonBuilder()
                .setCustomId('acceptBanButton')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success)
                .setLabel('Accepter la demande');
            const DenyButton = new ButtonBuilder()
                .setCustomId('denyBanButton')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Refuser la demande');

            const row = new ActionRowBuilder().addComponents(AcceptButton, DenyButton);

            // Envoi dans le salon configuré
            await channel.send({ embeds: [embed], components: [row] });

            await interaction.reply({
                content: `Votre demande de bannissement a bien été soumise et est disponible dans ${channel}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('[ERROR]: Une erreur est survenue lors de l\'exécution de la commande `ban` :', error);
            return interaction.reply({
                content: '`⚠️` Une erreur est survenue lors du traitement de votre demande.',
                ephemeral: true,
            });
        }
    },
};
