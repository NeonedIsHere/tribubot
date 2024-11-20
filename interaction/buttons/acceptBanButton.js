const {} = require('discord.js')

module.exports = {
    customId: 'acceptBanButton',
    async execute(interaction, client) {
        const userId = interaction.customId[2]
        const utilisateur = await interaction.guild.members.fetch(userId).catch(() => null)

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
            await interaction.update({
                content: `❌ Impossible de bannir **${utilisateur.user.tag}**.`,
                embeds: [embed.setColor('Green')],
                components: [],
            });
        }
    }
}