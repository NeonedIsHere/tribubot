const { REST, Routes } = require('discord.js');
const { buildCommand } = require('../function/main')

module.exports = async (client) => {
    const commands = client.commands.map(command => {
        try {
            return buildCommand(command);
        } catch (error) {
            console.error(error);
            return null;
        }
    }).filter(Boolean); 

    const rest = new REST({ version: '10' }).setToken(client.config.token);
    try {
        client.cmd(`Déploiement de ${commands.length} commande(s) à Discord.`);
        await rest.put(Routes.applicationCommands(client.config.clientId), { body: commands });
    } catch (error) {
        console.error(error);
    }
};