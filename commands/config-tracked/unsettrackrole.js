module.exports = {
    name: 'unsettrackedrole',
    description: 'Retire un rôle des rôles suivis',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'role',
            description: 'Le rôle à retirer',
            type: 'role',
            required: true,
        }
    ],
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'Tu ne peux pas faire ça.',
                ephemeral: true,
            });
        }

        try {
            const role = interaction.options.getRole('role');
            const guildId = interaction.guild.id;

            const isTracked = await new Promise((resolve, reject) => {
                client.database.get(
                    `SELECT * FROM trackedRole WHERE guildId = ? AND roleId = ?`,
                    [guildId, role.id],
                    (err, row) => {
                        if (err) return reject(err);
                        resolve(!!row);
                    }
                );
            });

            if (!isTracked) {
                return interaction.reply({
                    content: `Le rôle ${role} n'est pas suivi, aucune suppression effectuée.`,
                    ephemeral: true,
                });
            }

            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM trackedRole WHERE guildId = ? AND roleId = ?`,
                    [guildId, role.id],
                    function (err) {
                        if (err) return reject(err);
                        resolve(this.changes);
                    }
                );
            });

            const baseName = isTracked.baseName
            if (role.id !== baseName) {
                await role.setName(baseName)
                console.log(`Rôle ${role.name} renommé en ${baseName}`);
            }

            interaction.reply({
                content: `Le rôle ${role} n'est maintenant plus suivi.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: `Une erreur est survenue lors de la suppression du rôle suivi.`,
                ephemeral: true,
            });
        }
    },
};
