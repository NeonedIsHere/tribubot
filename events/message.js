const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {

        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setDescription(`J'utilise les commandes / : </help:00>`)
            .setColor('#000001');

        if (message.content === `<@${client.user.id}>`) {
            return message.reply({ embeds: [embed] });
        }
    }
};
