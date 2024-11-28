const { ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Collection } = require('discord.js')
const { getColorEmbed } = require('../function/main')

module.exports = {
    name: 'ban',
    description: 'Permet de gérer les configurations du bot.',
    options: [
        {
            name: 'config',
            description: 'Définit une configuration.',
            type: 'subcommandgroup',
            options: [
                {
                    name: 'channel',
                    description: 'Définit le salon de demande de bannissement.',
                    type:'subcommand',
                    options: [
                        {
                            name: 'channel',
                            description: '-_-',
                            type:'channel',
                            required: true
                        }
                    ]
                },
                {
                    name: 'juge',
                    description: 'Définit le rôle de juge',
                    type: 'subcommand',
                    options: [
                        {
                            name: 'role',
                            description: '-_-',
                            type: 'role',
                            required: true
                        }
                    ]
                },
                {
                    name: 'show',
                    description: 'Affiche les configurations actuelles.',
                    type:'subcommand',
                }
            ]
        },
        {
            name: 'ask',
            description: 'Demander le ban d\'un utilisateur',
            type: 'subcommand',
            options: [
                {
                    name: 'user',
                    description: 'Utilisateur à bannir',
                    type: 'user',
                    required: true
                },
                {
                    name: 'raison',
                    description: 'Raison du ban',
                    type:'string',
                    required: true
                },
                {
                    name: 'preuve',
                    description: "Prouver l'infraction",
                    type: 'attachment',
                    required: true,
                }
            ]
        }
    ],
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false)
        const group = interaction.options.getSubcommandGroup(false)
        const guild = interaction.guild.id

        if (group === 'config') {
            if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("Tu n'as pas la permissions de faire ça")

            if (subcommand === 'channel') {
                const channel = interaction.options.getChannel('channel')
    
                if (channel.type!== ChannelType.GuildText) {
                    await interaction.reply("Veuillez spécifier un salon textuel valide")
                    return
                }
                    
                const channelAlreadySet = await new Promise((resolve, reject) => {
                    client.database.get(
                        `SELECT * FROM channel WHERE guildId =?`,
                        [guild],
                        (err, row) => {
                            if (err) return reject(err);
                            else resolve(row);
                        }
                    );
                })

                if (channelAlreadySet) {
                    await new Promise((resolve, reject) => {
                        client.database.run(
                            `UPDATE channel SET channelId =? WHERE guildId =?`,
                            [channel.id, guild],
                            (err) => {
                                if (err) return reject(err);
                                else resolve();
                            }
                        );
                    })
                } else {
                    await new Promise((resolve, reject) => {
                        client.database.run(
                            `INSERT INTO channel (guildId, channelId, owner) VALUES (?,?, ?)`,
                            [guild, channel.id, interaction.user.username],
                            (err) => {
                                if (err) return reject(err);
                                else resolve();
                             }
                        );
                    })
                }

                await interaction.reply(`Le salon de demande de bannissement a été mis à jour à <#${channel.id}>`)
            } else if (subcommand === 'juge') {
                const juge = interaction.options.getRole('role')

                try {
                    const roleAlreadyExists = await new Promise((resolve, reject) => {
                        client.database.get(
                            `SELECT * FROM trackedRole WHERE guildId =? AND roleId =?`,
                            [guild, juge.id],
                            (err, row) => {
                                if (err) return reject(err);
                                else resolve(row);
                            }
                        );
                    })

                    if (roleAlreadyExists) {
                        await new Promise((resolve, reject) => {
                            client.database.run(
                                `UPDATE role SET roleId =? WHERE guildId =?`,
                                [juge.id, guild],
                                (err) => {
                                    if (err) return reject(err);
                                    else resolve();
                                }
                            );
                        })

                        return interaction.reply(`Le rôle de juge a été modifier et est maintenant défini sur ${juge}`);
                    } else {
                        await new Promise((resolve, reject) => {
                            client.database.run(
                                `INSERT INTO role (guildId, roleId, owner) VALUES (?,?,?)`,
                                [guild, juge.id, interaction.user.username],
                                (err) => {
                                    if (err) return reject(err);
                                    else resolve();
                                }
                            );
                        })

                        return interaction.reply(`Le rôle de juge a été défini sur ${juge}`);
                    }
                } catch (error) {
                    console.error(error);
                    interaction.reply(
                        {
                            content: 'Une erreur est survenue lors de la configuration du rôle de juge',
                            ephemeral: true,
                        }
                    )
                }
            } else if (subcommand === 'show') {
                const guild = interaction.guild.id

                try {

                    const embedColor = await getColorEmbed(client, guild)

                    const trackedRole = await new Promise((resolve, reject) => {
                        client.database.all(
                            `SELECT * FROM trackedRole WHERE guildId = ?`,
                            [guild],
                            (err, rows) => {
                                if (err) reject(err);
                                else resolve(rows || []);
                            }
                        )
                    })

                    const channelBanConfig = await new Promise((resolve, reject) => {
                        client.database.get(
                            `SELECT channelId FROM channel WHERE guildId =?`,
                            [guild],
                            (err, row) => {
                                if (err) reject(err);
                                else resolve(row || {});
                            }
                        )
                    })

                    const roleBanConfig = await new Promise((resolve, reject) => {
                        client.database.get(
                            `SELECT roleId FROM role WHERE guildId =?`,
                            [guild],
                            (err, row) => {
                                if (err) reject(err);
                                else resolve(row || {});
                            }
                        )
                    })

                    const embed = new EmbedBuilder()
                        .setTitle(`Configuration du serveur: ${interaction.guild.name}`)
                        .setColor(embedColor || "#ffffff")


                    embed.addFields(
                        { name: 'Couleur des embeds', value: embedColor ? `\`${embedColor}\`` : `#FFFFFF (défaut)`, inline: false }
                    )

                    if (trackedRole.length > 0) {
                        embed.addFields(
                            { name: 'Rôle suivi', value: 'Utilisez la commande </trackrole list:1310670191411068949> pour avoir la liste des rôles suivie sur le serveur' }
                        )
                    } else {
                        embed.addFields(
                            { name: 'Rôle suivi', value: 'Aucun rôle suivi sur le serveur' }
                        )
                    }

                    if (roleBanConfig.roleId || channelBanConfig.channelId) {
                        embed.addFields(
                            { name: 'Rôle de juge', value: roleBanConfig.roleId ? `<@&${roleBanConfig.roleId}>` : 'Non défini', inline: true },
                            { name: 'Salon de bannissement', value: channelBanConfig.channelId ? `<#${channelBanConfig.channelId}>` : 'Non défini', inline: true }
                        );
                    } else {
                        embed.addFields({
                            name: 'Demandes de ban',
                            value: 'Aucune configuration disponible.',
                            inline: false,
                        });
                    }

                    if (trackedRole.length > 0) {
                        embed.addFields(
                            { name: 'Rôle suivi', value: 'Utilisez la commande </trackrole list:1310670191411068949> pour avoir la liste des rôles suivie sur le serveur' }
                        )
                    } else {
                        embed.addFields(
                            { name: 'Rôle suivi', value: 'Aucun rôle suivi sur le serveur' }
                        )
                    }

                    await interaction.reply({ embeds: [embed] })

                } catch (error) {
                    console.error(error)
                    interaction.reply({
                        content: 'Une erreur est survenue lors de la récupération de la configuration',
                        ephemeral: true,
                    })
                }
            }
        } else if (subcommand === 'ask') {

            const user = interaction.options.getUser('user')
            const raison = interaction.options.getString('raison')
            const preuve = interaction.options.getAttachment('preuve')
            const guild = interaction.guild


            const channel = await new Promise((resolve, reject) => {
                client.database.get(
                    `SELECT channelId FROM channel WHERE guildId =?`,
                    [guild.id],
                    (err, row) => {
                        if (err) return reject(err);
                        else resolve(row);
                    }
                );
            })

            if (!channel || !channel.channelId) {
                await interaction.reply('`⚠️` Le salon de demande de bannissement n\'est pas configuré. Utilisez </setchannel> pour en définir un')
                return
            }

            const channels = interaction.guild.channels.cache.get(channel.channelId)

            if (!channels) {
                return interaction.reply({
                     content: '`⚠️` Le salon configuré n\'a pas été trouvé. Utilisez </setchannel> pour en définir un nouveau.',
                    ephemeral: true,
                });
            }
            
            const embed = new EmbedBuilder()
                .setTitle('Demande de bannissement')
                .addFields(
                    { name: 'Utilisateur', value: `${user.tag} (${user.id})` },
                    { name: 'Raison', value: raison },
                    { name: 'Auteur de la demande', value: `${interaction.user.tag} (${interaction.user.id})` }
                )
                .setImage(preuve.url)
                .setColor(await getColorEmbed(client, guild.id))
                .setTimestamp();

            const AcceptButton = new ButtonBuilder()
                .setCustomId(`acceptBanButton:${user.id}`)
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success)
                .setLabel('Accepter');
            const DenyButton = new ButtonBuilder()
                .setCustomId(`denyBanButton:${user.id}`)
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Refuser');
            
            const row = new ActionRowBuilder().addComponents(AcceptButton, DenyButton)

            const message = await channels.send({ embeds: [embed], components: [row] });

            await interaction.reply({
                content: 'Demande de bannissement envoyée avec succès',
                ephemeral: true,
            });

            client.embeds.set(message.id, { embed, user, message });
        }
    }
}