module.exports = {
    customId: 'acceptBanButton',
    async execute(interaction, client) {
        const userId = interaction.customId[2]
        const utilisateur = await interaction.guild.members.fetch(userId).catch(() => null)

        if (interaction.user.id === userId) {
            return interaction.reply({
                content: 'Vous ne pouvez pas toucher vous même a votre demande bannissement',
                embeds: [],
                components: [],
                ephermal: true
            });
        }
        if (!utilisateur) {
            return interaction.update({
                content: '⚠️ Utilisateur introuvable ou déjà supprimé.',
                embeds: [],
                components: [],
            });
        }

        try {
            await utilisateur.ban({ reason: `Banni par ${interaction.user.tag}` });
            await interaction.update({
                content: `✅ L'utilisateur **${utilisateur.user.username}** a été banni avec succès.`,
                embeds: [],
                components: [],
            });
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