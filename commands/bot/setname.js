module.exports = {
    name: 'setname',
    description: 'Définir le nom du bot',
    dm: false,
    permissions: 'Aucune',
    options: [
        {
            name: 'nom',
            description: 'Nouveau nom du bot',
            type: 'string',
            required: true,
            autocomplete: false
        }
    ],
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("Tu n'as pas la permissions de faire ça")
            
        const newName = interaction.options.getString('nom')
        await client.user.setUsername(newName)
        interaction.reply(`Le nom du bot a été mis à jour à ${newName}`)
    }
}