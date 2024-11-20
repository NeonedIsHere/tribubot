const { ChannelFlags, ChannelType } = require('discord.js')

module.exports = {
    name: 'setchannel',
    description: 'Salon où sont envoyés les demandes banissements',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'channel',
            description: 'Nom/ID du salon',
            type: 'channel',
            required: true
        }
    ],
    async execute(interaction, client) {

        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("Tu n'as pas la permissions de faire ça")

        const channel = interaction.options.getChannel('channel')
        const guildId = interaction.guild.id

        if (channel.type !== ChannelType.GuildText) {
            await interaction.reply("Veuillez spécifier un salon textuel valide")
            return
        }

        try {
            client.database.run(
                `INSERT OR REPLACE INTO channel (guildId, channelId, owner) VALUES (?, ?, ?)`,
                [guildId, channel.id, interaction.user.username]
            );
        
            return interaction.reply(`Le salon de demande de bannissement a été défini sur ${channel}`);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'Une erreur est survenue lors de la configuration du salon',
                ephemeral: true,
            });
        }
    }
}

