const { InteractionType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            if (interaction.type === InteractionType.ApplicationCommand) {
                const command = client.commands.get(interaction.commandName);

                if (!command) {
                    client.error(`[Commands] Commande "${interaction.commandName}" non trouvée.`);
                    return interaction.reply({
                        content: `Cette commande est introuvable.`,
                        ephemeral: true,
                    });
                }

                await command.execute(interaction, client);

            } else if (interaction.type === InteractionType.MessageComponent) {
                const buttonHandler = client.buttons?.get(interaction.customId);

                if (!buttonHandler) {
                    console.warn(`[Buttons] Aucun gestionnaire trouvé pour "${interaction.customId}".`);
                    return interaction.reply({
                        content: `Ce bouton n'est pas pris en charge.`,
                        ephemeral: true,
                    });
                }

                await buttonHandler.execute(interaction, client);

            } else if (interaction.type === InteractionType.ModalSubmit) {
                const modalHandler = client.modals?.get(interaction.customId);

                if (!modalHandler) {
                    console.warn(`[Modals] Aucun gestionnaire trouvé pour "${interaction.customId}".`);
                    return interaction.reply({
                        content: `Ce formulaire n'est pas pris en charge.`,
                        ephemeral: true,
                    });
                }

                await modalHandler.execute(interaction, client);

            } else {
                client.error(`[Interactions] Type d'interaction "${interaction.type}" non géré.`);
            }
        } catch (error) {
            client.error(`[Interactions] Erreur lors du traitement de l'interaction : ${error}`);

            if (interaction.deferred || interaction.replied) {
                return;
            }

            await interaction.reply({
                content: `Une erreur est survenue lors du traitement de votre interaction.`,
                ephemeral: true,
            });
        }
    },
};
