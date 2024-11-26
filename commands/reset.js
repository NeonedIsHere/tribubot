module.exports = {
    name: 'reset',
    description: 'Permet de réinitialiser certaines configurations.',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'all',
            description: 'Réinitialise toutes les configurations.',
            type: 'subcommandgroup',
            options: [
                {
                    name: 'serveur',
                    description: 'Réinitialise le rôle de juge pour ce serveur.',
                    type: 'subcommand'
                },
                {
                    name: 'bot',
                    description: 'Réinitialise les rôles de juge gérés par le bot.',
                    type: 'subcommand'
                }
            ]
        },
        {
            name: 'track',
            description: 'Gestion des rôles suivis.',
            type: 'subcommandgroup',
            options: [
                {
                    name: 'serveur',
                    description: 'Réinitialise les rôles suivis dans le serveur.',
                    type: 'subcommand'
                },
                {
                    name: 'bot',
                    description: 'Réinitialise les rôles suivis par le bot (inter-serveur).',
                    type: 'subcommand'
                }
            ]
        },
        {
            name: 'channel',
            description: 'Gestion des salons.',
            type: 'subcommandgroup',
            options: [
                {
                    name: 'serveur',
                    description: 'Réinitialise le salon de demande de bannissement du serveur.',
                    type: 'subcommand'
                },
                {
                    name: 'bot',
                    description: 'Réinitialise les salons de demande de bannissement du bot.',
                    type: 'subcommand'
                }
            ]
        },
        {
            name: 'juge',
            description: 'Gestion des rôles de juge.',
            type: 'subcommandgroup',
            options: [
                {
                    name: 'serveur',
                    description: 'Réinitialise le rôle de juge pour ce serveur.',
                    type: 'subcommand'
                },
                {
                    name: 'bot',
                    description: 'Réinitialise les rôles de juge gérés par le bot.',
                    type: 'subcommand'
                }
            ]
        }
    ],
    async execute(interaction, client) {

        const subcommand = interaction.options.getSubcommand(false)
        const group = interaction.options.getSubcommandGroup(false)
        const guildId = interaction.guild.id

        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Vous n\'avez pas les droits nécessaires pour exécuter cette commande.', ephemeral: false })
        }

        if (group === 'all') {
            if (subcommand ==='serverall') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM trackedRole WHERE guildId =?`,
                        [guildId],
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );

                    client.database.run(
                        `DELETE FROM role WHERE guildId =?`,
                        [guildId],
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );

                    client.database.run(
                        `DELETE FROM channel WHERE guildId =?`,
                        [guildId],
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })

                interaction.reply(`La confguration de tout les modules on êtais réinisialiser sur le serveur`)
            } else if (subcommand === 'botall') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM trackedRole`,
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );

                    client.database.run(
                        `DELETE FROM role`,
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );

                    client.database.run(
                        `DELETE FROM channel`,
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })

                await interaction.reply(`La configuration de tout les modules ont été réinitialiser sur tout les serveurs`)
            }
        } else if (group === `channel`) {
            if (subcommand ==='serverchannel') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM channel WHERE guildId =?`,
                        [guildId],
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })

                await interaction.reply(`La configuration du salon de demande de bannissement pour ce serveur a été réinitialiser`)
            } else if (subcommand === 'botchannel') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM channel `,
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })

                await interaction.reply(`La configuration du salon de demande de bannissement pour tout les serveurs a été réinitialiser`)
            }
        } else if (group === 'juge') {
            if (subcommand === 'serverjuge') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM role WHERE guildId =?`,
                        [guildId],
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })
                await interaction.reply(`La configuration du rôle de juge pour ce serveur a été réinitialiser`)
            } else if (subcommand === 'botjuge') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM role`,
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })

                await interaction.reply(`La configuration du rôle de juge pour tout les serveurs a été réinitialiser`)
            } 
        } else if (group === 'trackedrole') {
            if (subcommand ==='servertrackrole') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM trackedRole WHERE guildId =?`,
                        [guildId],
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })
                await interaction.reply(`La configuration des rôles suivis pour ce serveur a été réinitialiser`)
            } else if (subcommand === 'bottrackedrole') {
                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM trackedRole`,
                        (err) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                })

                await interaction.reply(`La configuration des rôles suivis pour tout les serveurs a été réinitialiser`)
            }
        }
    }
};