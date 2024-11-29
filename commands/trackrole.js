const { updateTrackedRoles, getColorEmbed } = require("../function/main")
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'trackrole',
    description: 'Permet de suivre un rôle.',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'add',
            description: 'Ajoute un rôle à suivre',
            type: 'subcommand',
            options: [
                {
                    name: 'role',
                    description: 'Le rôle à suivre',
                    type: 'role',
                    required: true,
                },
                {
                    name: 'nom',
                    description: 'Nom de base du rôle à suivre',
                    type:'string',
                    required: true,
                },
                {
                    name: 'max',
                    description: 'Nombre maximum de personnes pouvant avoir le rôle' ,
                    type: 'integer',
                    required: true,
                }
            ],
        },
        {
            name: 'remove',
            description: 'Retire un rôle à suivre',
            type:'subcommand',
            options: [
                {
                    name: 'role',
                    description: 'Le rôle à retirer',
                    type: 'role',
                    required: true,
                }
            ],
        },
        {
            name:'list',
            description: 'Affiche la liste de rôle suivi',
            type:'subcommand'
        }
    ],
    async execute(interaction, client) {

        const subcommand = interaction.options.getSubcommand(false)

        if (subcommand === 'add') {

            const role = interaction.options.getRole('role')
            const basename = interaction.options.getString('nom')
            const max = interaction.options.getInteger('max')
            const guildId = interaction.guild.id
            try {
                const existingRole = await new Promise((resolve, reject) => {
                    client.database.get(
                        `SELECT * FROM trackedRole WHERE guildId =? AND roleId =?`,
                        [guildId, role.id],
                        (err, row) => {
                            if (err) reject(err);
                            resolve(row);
                        }
                    )
                })

                if (existingRole) {
                    await new Promise((resolve, reject) => {
                        client.database.run(
                            `UPDATE trackedRole 
                            SET baseName = ?, newCount = ?, owner = ? 
                            WHERE guildId = ? AND roleId = ?`,
                            [basename, max, interaction.user.username, guildId, role.id],
                            (err) => {
                                if (err) reject(err);
                                resolve(this.changes);
                            }
                        )
                    })

                    await updateTrackedRoles(interaction.guild, { role: role.id, basename, maxCount: max })
                    interaction.reply({
                        content: `Le rôle ${role} est déjà suivi. Ses paramètres ont été mis à jour : \`${basename}\` avec un maximum de \`${max}\` membres.`,
                    });
                }

                await new Promise((resolve, reject) => {
                    client.database.run(
                        `INSERT INTO trackedRole (guildId, roleId, baseName, maxCount, owner)
                         VALUES (?, ?, ?, ?, ?)`,
                        [guildId, role.id, basename, max, interaction.user.username],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    )
                })

                await updateTrackedRoles(interaction.guild, { roleId: role.id, basename, maxCount: max })
                interaction.reply(`Le rôle ${role} a été ajouté à la liste des rôles suivis.`);

            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: `Une erreur est survenue lors de la configuration du rôle : ${error.message}`,
                });
            }

        } else if (subcommand === 'remove') {
            const role = interaction.options.get('role')
            const guildId = interaction.guild.id

            

            try {
                const isTracked = await new Promise((resolve, reject) => {
                    client.database.get(
                        `SELECT * FROM trackedRole WHERE guildId =? AND roleId =?`,
                        [guildId, role.id],
                        (err, row) => {
                            if (err) reject(err);
                            resolve(!!row);
                        }
                    )
                })

                if (!isTracked) {
                    interaction.reply(`Le rôle ${role} n'est pas suivi.`);
                    return;
                }

                await new Promise((resolve, reject) => {
                    client.database.run(
                        `DELETE FROM trackedRole WHERE guildId =? AND roleId =?`,
                        [guildId, role.id],
                        (err) => {
                            if (err) reject(err);
                            else resolve(this.changes);
                        }
                    )
                })

                interaction.reply(`Le rôle ${role} a été supprimé de la liste des rôles suivis.`);
                
            } catch (err) {
                console.error(err);
                interaction.reply({
                    content: `Une erreur est survenue lors de la suppression du rôle : ${err.message}`,
                });
            }
        } else if (subcommand === 'list') {
            try {
                const trackedRoles = await new Promise((resolve, reject) => {
                    client.database.all(
                        `SELECT * FROM trackedRole WHERE guildId = ?`,
                        [interaction.guild.id],
                        (err, rows) => {
                            if (err) return reject(err);
                            resolve(rows);
                        }
                    );
                });
    
                if (trackedRoles.length === 0) {
                    return interaction.reply({
                        content: 'Aucun rôle n\'est actuellement suivi dans ce serveur.',
                        ephemeral: true,
                    });
                }
    
                const embedColor = await getColorEmbed(client, interaction.guild.id)
    
                const embed = new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle('Rôles Suivis')
                    .setDescription('Voici la liste des rôles actuellement suivis dans ce serveur :')
                    .setTimestamp()
                    .setFooter({
                        text: `Demandé par ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    });
    
                trackedRoles.forEach(roleInfo => {
                    const role = interaction.guild.roles.cache.get(roleInfo.roleId);
                    const roleName = role ? role.name : '`Rôle introuvable`';
    
                    embed.addFields([
                        {
                            name: `${roleName}`,
                            value: `**Nom de base :** ${roleInfo.baseName}\n**Max Membres :** ${roleInfo.maxCount}\n**ID :** \`${roleInfo.roleId}\``,
                            inline: false,
                        },
                    ]);
                });
    
                await interaction.reply({ embeds: [embed], ephemeral: false });
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles suivis :', error);
                await interaction.reply({
                    content: 'Une erreur est survenue lors de la récupération des rôles suivis.',
                    ephemeral: true,
                });
            }
        }

    }
}