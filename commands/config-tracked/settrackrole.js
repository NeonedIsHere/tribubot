module.exports = {
    name: 'settrackrole',
    description: 'Définit un rôle à suivre',
    permissions: 'Aucune',
    dm: false,
    options: [
        {
            name: 'role',
            description: 'Rôle à suivre',
            type: 'role',
            required: true,
        },
        {
            name: 'basename',
            description: 'Nom de base du rôle à suivre',
            type: 'string',
            required: true,
        },
        {
            name: 'max',
            description: 'Nombre maximum de personnes pouvant avoir le rôle',
            type: 'integer',
            required: true,
        }
    ],
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: "Tu n'as pas la permission de faire ça.",
                ephemeral: true,
            });
        }

        const role = interaction.options.getRole('role');
        const baseName = interaction.options.getString('basename');
        const max = interaction.options.getInteger('max');
        const guildId = interaction.guild.id;

        try {
            const existingRole = await new Promise((resolve, reject) => {
                client.database.get(
                    `SELECT * FROM trackedRole WHERE guildId = ? AND roleId = ?`,
                    [guildId, role.id],
                    (err, row) => {
                        if (err) reject(err);
                        resolve(row);
                    }
                );
            });

            if (existingRole) {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `UPDATE trackedRole
                         SET baseName = ?, maxCount = ?, owner = ?
                         WHERE guildId = ? AND roleId = ?`,
                        [baseName, max, interaction.user.username, guildId, role.id],
                        function (err) {
                            if (err) return reject(err);
                            resolve(this.changes);
                        }
                    );
                });

                return interaction.reply({
                    content: `Le rôle ${role} est déjà suivi. Ses paramètres ont été mis à jour : \`${baseName}\` avec un maximum de \`${max}\` membres.`,
                });
            }

            await new Promise((resolve, reject) => {
                client.database.run(
                    `INSERT INTO trackedRole (guildId, roleId, baseName, maxCount, owner)
                     VALUES (?, ?, ?, ?, ?)`,
                    [guildId, role.id, baseName, max, interaction.user.username],
                    function (err) {
                        if (err) return reject(err);
                        resolve(this.lastID);
                    }
                );
            });

            await updateTrackedRoles(interaction.guild, { roleId: role.id, baseName, maxCount: max });


            interaction.reply({
                content: `Le rôle ${role} est maintenant suivi avec un maximum de ${max} membres.`,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: `Une erreur est survenue lors de la configuration du rôle : ${error.message}`,
                ephemeral: true,
            });
        }
    },
};
