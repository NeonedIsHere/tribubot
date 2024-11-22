const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'setcolor',
    description: 'Définie la couleur des embed du bot',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'couleur',
            description: 'Couleur à utiliser',
            type: 'string',
            required: true,
            autocomplete: false,
        }
    ],
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("Tu n'as pas la permissions de faire ça")

        let color = interaction.options.getString('couleur').trim()

        if (!color.startsWith('#')) {
            color = `#${color}`;
        }

        if (!/^#[0-9A-F]{6}/i.test(color)) {
            await interaction.reply("Veuillez spécifier une couleur valide en format hexadécimal (ex: #FFFFFF)")
            return
        }

        try {
            
            const colorAlreadySet = await new Promise((resolve, reject) => {
                client.database.run(
                    `SELECT * FROM embedColor WHERE guildId =?`,
                    [interaction.guild.id],
                    (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    }
                )
            })
            
            if (colorAlreadySet) {

                await new Promise((resolve, reject) => {
                    client.database.run(
                        `UPDATE embedColor SET color =?, owner =? WHERE guildId =?`,
                        [color, interaction.user.username, interaction.guild.id],
                        (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(this.changes)
                            }
                        }
                    )
                })

            } else {

                await new Promise((resolve, reject) => {
                    client.database.run(
                        `INSERT OR REPLACE INTO embedColor (guildId, color, owner) VALUES (?, ?, ?)`,
                        [interaction.guild.id, color, interaction.user.username],
                        (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(this.changes)
                            }
                        }
                    )
                })

            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription(`La couleur des embeds a bien été modifier sur ${color}`)

            interaction.reply(
                { embeds: [embed] }
            )
        } catch (error) {
            console.error(error)
            await interaction.reply("Une erreur est survenue lors de la modification de la couleur des embeds")
        }
    }
}