module.exports = {
    name: 'resetserveur',
    description: 'Permet de réinitalisé la configuration',
    dm: false,
    permissions: 'Aucune',
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Vous n\'avez pas les droits nécessaires pour exécuter cette commande.', ephemeral: false })
        }

        const guild = interaction.guild.id

        try {
            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM channel WHERE guildId =?`,
                    [guild],
                    (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    }
                )
            })

            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM channel WHERE guildId =?`,
                    [guild],
                    (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    }
                )
            })

            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM trackedRole WHERE guildId =?`,
                    [guild],
                    (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    }
                )
            })

            await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM embedColor WHERE guildId =?`,
                    [guild],
                    (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    }
                )
            })

            interaction.reply({ content: 'Configuration réinitialisée avec succès!', ephemeral: false })
            console.log(`Configuration réinitialisée pour le serveur ${guild}`)

        } catch (err) {
            interaction.reply({ content: `Erreur lors de la réinitialisation : ${err.message}`, ephemeral: false })
            return console.error(err)
        }
    } 
}