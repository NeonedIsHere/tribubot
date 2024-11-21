module.exports = {
    name: 'resetall',
    description: 'Permet de réinitialiser toutes les configurations de tous les serveurs.',
    dm: false,
    permissions: 'Aucune',
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Vous n\'avez pas les droits nécessaires pour exécuter cette commande.', ephemeral: true });
        }

        try {
            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM channel`,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });

            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM role`,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });

            interaction.reply({ content: 'Toutes les configurations ont été réinitialisées avec succès pour tous les serveurs !', ephemeral: false });
            console.log('Toutes les configurations ont été réinitialisées pour tous les serveurs');

        } catch (err) {
            interaction.reply({ content: `Erreur lors de la réinitialisation : ${err.message}`, ephemeral: true });
            console.error('Erreur lors de la réinitialisation :', err);
        }
    },
};
