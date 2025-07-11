module.exports = {
    customId: 'denyBanButton:',
    async execute(interaction, client) {

        if (!interaction.customId.startsWith('denyBanButton:')) return;
        const userId = interaction.customId.split(':')[1];
        
        const juge = await new Promise((resolve, reject) =>{
            client.database.get(
                `SELECT roleId FROM role WHERE guildId = ?`,
                [interaction.guild.id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        })

        if (!interaction.member.roles.cache.has(juge.roleId)) {
            return interaction.reply({
                content: `Seuls les membres ayant les rôles <@&${juge.roleId}> peuvent intéragir avec les boutons`,
                embeds: [],
                components: [],
                ephermal: true
            });
        }

        const { createModal } = require('../modals/denyBanModal');
        const modal = createModal();

        await interaction.showModal(modal);

        try {
            const submitted = await interaction.awaitModalSubmit({
                time: 60000, 
                filter: (i) => i.user.id === interaction.user.id,
            });

            const modalHandler = client.modals.get('denyBanModal');
            if (!modalHandler) {
                return submitted.reply({
                    content: 'Une erreur est survenue : gestionnaire de modal introuvable.',
                    ephemeral: true,
                });
            }

            const reason = await modalHandler.execute(submitted, client);

            const thread = await interaction.channel.threads.create({
                name: `Refus - ${interaction.user.username}`,
                autoArchiveDuration: 1440,
                reason: 'Thread pour la discussion sur le refus de bannissement.',
            });

            const { EmbedBuilder } = require('discord.js');
            const embed = new EmbedBuilder()
                .setTitle('Refus de demande de bannissement')
                .setDescription(`Le refus a été enregistré avec la raison fournie.`)
                .addFields(
                    { name: 'Auteur du refus', value: interaction.user.tag, inline: true },
                    { name: 'Raison', value: reason, inline: false },
                    { name: 'Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                )
                .setColor('#FF0000');

            await thread.send({ embeds: [embed] });

            await submitted.reply({
                content: `Votre réponse a été enregistrée et un thread a été créé : <#${thread.id}>.`,
                ephemeral: true,
            });
        } catch (error) {
            if (error.code === 'InteractionCollectorError') {
                return interaction.followUp({
                    content: '`⏱️` Vous n\'avez pas soumis de réponse à temps.',
                    ephemeral: true,
                });
            }

            console.error(`[ERROR]: ${error.message}`);
            return interaction.followUp({
                content: '`⚠️` Une erreur s\'est produite lors du traitement de votre demande.',
                ephemeral: true,
            });
        }
    },
};
