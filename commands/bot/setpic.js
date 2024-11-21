module.exports = {
    name: 'setpic',
    description: 'Définir l\'image de profil',
    dm: true,
    permissions: 'Aucune',
    options: [
        {
            name: 'image',
            description: 'Image à utiliser',
            type: 'string',
            required: true,
        }
    ],
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("Tu n'as pas la permissions de faire ça")
        
        const image = interaction.options.getString('image')

        await client.user.setAvatar(image)
        interaction.reply("L'image de profil a été mise à jour avec succès!")
    }
}