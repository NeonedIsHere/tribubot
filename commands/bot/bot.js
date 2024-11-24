const { EmbedBuilder } = require('discord.js')
const { getColorEmbed } = require('../../function/main')

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
            }
        }
    }
}