const { EmbedBuilder } = require('discord.js')
const { getColorEmbed } = require('../function/main')

module.exports = {
    name: 'bot',
    description: 'Configure ton bot a tes envies ',
    permissions: 'Aucune',
    dm: true,
    options: [
        {
            name: 'set',
            description: 'Définir les détails du bot',
            type: 'subcommandgroup',
            options:[ 
                {
                    name: 'name',
                    description: 'Définir le nom du bot',
                    type: 'subcommand',
                    options: [
                        {
                            name: '-_-',
                            description: 'Nouveau nom du bot',
                            type: 'string',
                            required: true,
                            autocomplete: false
                        }
                    ]
                },
                {
                    name: 'pic',
                    description: 'Définir l\'image de profil',
                    type:'subcommand',
                    options: [
                        {
                            name: '-_-',
                            description: 'Image à utiliser',
                            type:'string',
                            required: true
                        }
                    ]
                },
                {
                    name: 'color',
                    description: 'Définir la couleur des embeds',
                    type:'subcommand',
                    options: [
                        {
                            name: '-_-',
                            description: 'Nouvelle couleurs des commandes',
                            type:'string',
                            required: true
                        }
                    ]
                },
                {
                    name: 'banner',
                    description: 'Définir la bannière du bot',
                    type:'subcommand',
                    options: [
                        {
                            name: '-_-',
                            description: 'URL de l\'image de la bannière',
                            type:'string',
                            required: true
                        }
                    ]
                },
                {
                    name: 'status',
                    description: 'Définir le statut du bot',
                    type:'subcommand',
                    options: [
                        {
                            name: '-_-',
                            description: 'Nouveau statut du bot',
                            type:'string',
                            required: false,
                        },
                        {
                            name: 'activity',
                            description: 'Définir l\'activité du bot',
                            type:'string',
                            required: false,
                            choices: [
                                { name: 'Joue à', value: '0' },
                                { name: 'Diffuse', value: '1' },
                                { name: 'Écoute', value: '2' },
                                { name: 'Regarde', value: '3' },
                                { name: 'Compétition', value: '5' }
                            ],
                        },
                        {
                            name: 'presence',
                            description: 'Définir la présence du bot',
                            type: 'string',
                            required: false,
                            choices: [
                                { name: 'En ligne', value: 'online' },
                                { name: 'Hors Ligne', value: 'offline' },
                                { name: 'Inactif', value: 'idle' },
                                { name: 'Ne pas Déranger', value: 'dnd'}
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    async execute(interaction, client) {

        const group = interaction.options.getSubcommandGroup(false)
        const subcommand = interaction.options.getSubcommand(false)
        const guild = interaction.guild.id

        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'Tu n\'as pas les droits nécessaires pour exécuter cette commande.',
                ephemeral: true,
            });
        }
        
        if (group === 'set') {
            if (subcommand === 'name') {
                try {
                    const newName = interaction.options.getString('-_-')

                    await client.user.setUsername(newName)
                    interaction.reply(`Le nom du bot a été mis à jour. Je m'appelle maintenant ${newName}`)
                } catch (error) {
                    console.error(error)
                    interaction.reply({
                        content: 'Une erreur est survenue lors de la mise à jour du nom du bot.',
                        ephemeral: true,
                    });
                }
            } else if (subcommand === 'pic') {
                try {
                    const newPic = interaction.options.getString('-_-');

                    await client.user.setAvatar(newPic)

                    const embed = new EmbedBuilder()
                        .setDescription('L\'image de profil du bot a été mise à jour.')
                        .setImage(newPic)
                        .setColor(await getColorEmbed(client, guild))
                        
                    interaction.reply({ embeds: [embed] })
                } catch (error) {
                    console.error(error)
                    interaction.reply({
                        content: 'Une erreur est survenue lors de la mise à jour de l\'image du bot.',
                        ephemeral: true,
                    });
                }
            } else if (subcommand === 'color') {
                try {
                    let newColor = interaction.options.getString('-_-').trim()

                    if (!newColor.startsWith('#')) {
                        newColor = `#${newColor}`
                    }

                    if (!/^#[0-9A-F]{6}/i.test(newColor)) {
                        interaction.reply('Veuillez spécifier une couleur valide en format hexadécimal (ex: \`#FFFFFF\`)')
                        return
                    }

                    const colorAlreadySet = await new Promise((resolve, reject) => {
                        client.database.get(
                            `SELECT * FROM embedColor WHERE guildId =?`,
                            [guild],
                            (err, row) => {
                                if (err) {
                                    reject(err)
                                    return
                                } else {
                                    resolve(row)
                                }
                            }
                        )
                    })

                    if (colorAlreadySet) {
                        await new Promise((resolve, reject) => {
                            client.database.run(
                                `UPDATE embedColor SET color =? WHERE guildId =?`,
                                [newColor, guild],
                                (err) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resolve()
                                    }
                                }
                            )
                        })
                    } else {
                        await new Promise((resolve, reject) => {
                            client.database.run(
                                `INSERT INTO embedColor (guildId, color, owner) VALUES (?,?,?)`,
                                [guild, newColor, interaction.user.username],
                                (err) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resolve()
                                    }
                                }
                            )
                        })
                    }

                    const embed = new EmbedBuilder()
                        .setColor(newColor)
                        .setTitle(`La couleur des embeds a bien été modifier sur \`${newColor}\``)

                    interaction.reply({
                        embeds: [embed]
                    })
                } catch (err) {
                    console.error('Erreur lors de la mise à jour de la couleur des embeds :', err)
                    interaction.reply({
                        content: 'Une erreur est survenue lors de la mise à jour de la couleur des embeds.',
                        ephemeral: true,
                    });
                }
            } else if (subcommand === 'banner') {
                try {
                    const newBanner = interaction.options.getString('-_-')

                    await client.user.setBanner(newBanner)

                    const embed = new EmbedBuilder()
                        .setDescription('La bannière du bot a été mise à jour.')
                        .setImage(newBanner)
                        .setColor(await getColorEmbed(client, guild))
                        
                    interaction.reply({ embeds: [embed] })
                } catch (error) {
                    console.error(error)
                    interaction.reply({
                        content: 'Une erreur est survenue lors de la mise à jour de la bannière du bot.',
                        ephemeral: true,
                    });
                }
            } else if (subcommand === 'status') {
                const newText = interaction.options.getString('status');
                const newType = interaction.options.getString('activity');
                const newPresence = interaction.options.getString('presence');
            
                // Log pour vérifier les valeurs reçues
                console.log('Valeurs reçues :', { newText, newType, newPresence });
            
                // Récupérer les valeurs actuelles si des options ne sont pas fournies
                const currentPresence = client.user.presence;
            
                const currentActivity = currentPresence.activities[0] || { name: '', type: 0 };
                const currentStatus = currentPresence.status || 'online';
            
                // Définir les nouvelles valeurs ou garder celles existantes
                const text = newText || currentActivity.name;
                const type = newType ? parseInt(newType) : currentActivity.type; // Assurez-vous que type est un entier
                const presence = newPresence || currentStatus;
            
                console.log('Paramètres pour setPresence :', { text, type, presence });
            
                try {
                    await client.user.setPresence({
                        activities: [
                            {
                                name: text, // Texte de l'activité
                                type: type // Type de l'activité, doit être un entier
                            }
                        ],
                        status: presence // Statut global (online, idle, etc.)
                    });
            
                    console.log('Statut mis à jour avec succès.');
            
                    const embed = new EmbedBuilder()
                        .setTitle('Mise à jour du statut')
                        .addFields(
                            { name: 'Texte', value: text || 'Aucun texte', inline: true },
                            { name: 'Type', value: type.toString(), inline: true },
                            { name: 'Présence', value: presence, inline: true }
                        )
                        .setColor('Green');
            
                    await interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du statut :', error);
            
                    await interaction.reply({
                        content: `Erreur lors de la mise à jour du statut : \`${error.message}\``,
                        ephemeral: true
                    });
                }
            }            
        }
    }
}