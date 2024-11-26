module.exports = {
    customId: 'acceptBanButton',
    async execute(interaction, client) {

        if (!interaction.customId.startsWith('acceptBanButton')) return
        const userId = interaction.customId.split(':')[1]

        const banRequest = client.embeds?.get(interaction.message.id);

        /* if (!banRequest) {
            console.error(`[ERROR] Demande de bannissement introuvable pour le message ID : ${interaction.message.id}`);
            return interaction.reply({
                content: '`⚠️` Impossible de trouver les détails de la demande de bannissement. Elle pourrait avoir expiré ou être corrompue.',
                ephemeral: true,
            });
        } */

        console.log('Interaction Message ID:', interaction.message.id);
        console.log('Ban Embed Collection:', client.embeds);


        const { embed, user, message } = banRequest;
        const utilisateur = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!utilisateur) {
            return interaction.reply({
                content: '`⚠️` Utilisateur introuvable ou déjà supprimé.',
                ephemeral: true,
            });
        }


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

        if (!interaction.member.roles.cache.has(juge.roleId) || !client.config.owner.includes(interaction.user.id)) {
            return interaction.reply({
                content: `Seuls les membres ayant les rôles <@&${juge.roleId}> peuvent intéragir avec les boutons`,
                embeds: [],
                components: [],
                ephermal: true
            });
        }

        if (!utilisateur) {
            return interaction.reply({
                content: '⚠️ Utilisateur introuvable ou déjà supprimé.',
                embeds: [],
                components: [],
                ephermal: true
            });

        }

        try {
            await utilisateur.ban({ reason: `Banni par ${interaction.user.tag}` });
            
            embed.setDescription(`Demande bannisement accepter par ${interaction.user}`)
            embed.setColor('#00ff00')

            await message.edit({ embeds: [embed] });
            client.embeds.delete(interaction.message.id);

            return interaction.reply({ content: '✅ Utilisateur banni avec succès.', ephermal: true });
        } catch (error) {
            client.error(error);
            await interaction.reply({
                content: `❌ Impossible de bannir **${utilisateur.user.tag}**.`,
                embeds: [],
                components: [],
            });
        }
    }
}