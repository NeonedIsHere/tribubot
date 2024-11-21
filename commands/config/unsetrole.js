module.exports = {
    name: 'unsetrole',
    description: 'Permet de retirer le role de juge configurer',
    permission: 'Aucune',
    dm: false,
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Vous n\'avez pas les droits nécessaires pour exécuter cette commande.', ephemeral: false })
        }

        const guild = interaction.guild.id

        try {
            const result = await new Promise((resolve, reject) => {
                client.database.run(
                    `DELETE FROM role WHERE guildId = ?`,
                    [guild],
                    function (err) {
                        if (err) return reject(err);
                        resolve(this.changes)
                    }
                )
            })

            if (result === 0) {
                interaction.reply(
                    { 
                        content: 'Aucun salon de demande n\'as été configuré pour ce serveur.', 
                        ephemeral: false 
                    }
                )
            }

            interaction.reply(
                {
                    content: `Le salon de demande a été retiré pour le serveur ${interaction.guild.name}.`,
                    ephemeral: false
                }
            )
        } catch (error) {
            console.error(error)
        }
    }
}