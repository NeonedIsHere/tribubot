const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'denyBanModal',
    createModal() {
        return new ModalBuilder()
            .setCustomId('denyBanModal')
            .setTitle('Raison du refus')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('denyReason')
                        .setLabel('Motif du refus')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Expliquez pourquoi la demande a été refusée.')
                        .setRequired(true)
                )
            );
    },
    async execute(interaction) {
        const reason = interaction.fields.getTextInputValue('denyReason');
        return reason;
    },
};
