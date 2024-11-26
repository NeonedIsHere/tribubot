const { EmbedBuilder } = require('discord.js');
const { getColorEmbed } = require('../function/main');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {

        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setDescription(`J'utilise les commandes / : </help:00>`)
            .setColor(await getColorEmbed(client, message.guild.id));

        if (message.content === `<@${client.user.id}>`) {
            return message.reply({ embeds: [embed] });
        }
    }
};
