module.exports = {
    name: 'setrole',
    description: 'Définir le rôle de juge',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'role',
            description: 'Nom/ID du rôle',
            type: 'role',
            required: true
        }
    ],
    async execute(interaction, client) {

        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("Tu n'as pas la permissions de faire ça")

        const role = interaction.options.getRole('role')
        const guildId = interaction.guild.id

        try {
            client.database.run(
                `INSERT OR REPLACE INTO role (guildId, roleId, owner) VALUES (?, ?, ?)`,
                [guildId, role.id, interaction.user.username]
            );
        
            return interaction.reply(`Le rôle de juge a été défini sur ${role}`);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'Une erreur est survenue lors de la configuration du rôle',
                ephemeral: true,
            });
        }
    }
}

