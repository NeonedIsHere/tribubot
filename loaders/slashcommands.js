const { SlashCommandBuilder, Routes, REST } = require('discord.js');
const config = require('../config.json');

module.exports = async (client) => {
    let commands = [];

    client.commands.forEach((command) => {
        if (!command.name || !command.description) {
            client.error(`La commande ${command.name} est manquante de propriétés requises.`);
            return;
        }

        let slashcommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm ?? false)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission);

        if (command.options?.length >= 1) {
            command.options.forEach(option => {
                if (!option.type || !option.name) {
                    client.error(`L'option ${option.name} est manquante de propriétés requises.`);
                    return;
                }

                switch (option.type.toLowerCase()) {
                    case 'string':
                        slashcommand.addStringOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                                .setAutocomplete(option.autocomplete ?? false)
                                .addChoices(option.choices ? option.choices.map(choice => ({
                                    name: choice.name,
                                    value: choice.value
                                })) : [])
                        );
                        break;
                    case 'integer':
                        slashcommand.addIntegerOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                                .setAutocomplete(option.autocomplete ?? false)
                        );
                        break;
                    case 'boolean':
                        slashcommand.addBooleanOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'user':
                        slashcommand.addUserOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'channel':
                        slashcommand.addChannelOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'role':
                        slashcommand.addRoleOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'mentionable':
                        slashcommand.addMentionableOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'attachment':
                        slashcommand.addAttachmentOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'number':
                        slashcommand.addNumberOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description ?? '')
                                .setRequired(option.required ?? false)
                        );
                        break;
                    case 'subcommand':
                        const subcommand = slashcommand.addSubcommand(sub =>
                            sub.setName(option.name)
                                .setDescription(option.description ?? '')
                        );
                        if (option.options?.length >= 1) {
                            option.options.forEach(subcommandOption => {
                                if (!subcommandOption.type || !subcommandOption.name) {
                                    client.error(`L'option ${subcommandOption.name} de la sous-commande ${option.name} est manquante de propriétés requises.`);
                                    return;
                                }

                                switch (subcommandOption.type.toLowerCase()) {
                                    case 'string':
                                        subcommand.addStringOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                                .setAutocomplete(subcommandOption.autocomplete ?? false)
                                                .addChoices(subcommandOption.choices ? subcommandOption.choices.map(choice => ({
                                                    name: choice.name,
                                                    value: choice.value
                                                })) : [])
                                        );
                                        break;
                                    case 'integer':
                                        subcommand.addIntegerOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'boolean':
                                        subcommand.addBooleanOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'user':
                                        subcommand.addUserOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'channel':
                                        subcommand.addChannelOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'role':
                                        subcommand.addRoleOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'mentionable':
                                        subcommand.addMentionableOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'attachment':
                                        subcommand.addAttachmentOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    case 'number':
                                        subcommand.addNumberOption(opt =>
                                            opt.setName(subcommandOption.name)
                                                .setDescription(subcommandOption.description ?? '')
                                                .setRequired(subcommandOption.required ?? false)
                                        );
                                        break;
                                    default:
                                        client.error(`Option type ${subcommandOption.type} non supporté pour la sous-commande ${option.name} de la commande ${command.name}`);
                                }
                            });
                        }
                        break;
                    case 'subcommandgroup':
                        const group = slashcommand.addSubcommandGroup(group =>
                            group.setName(option.name)
                                .setDescription(option.description ?? '')
                        );
                        if (option.options?.length >= 1) {
                            option.options.forEach(subcommand => {
                                const sub = group.addSubcommand(sub =>
                                    sub.setName(subcommand.name)
                                        .setDescription(subcommand.description ?? '')
                                );
                                if (subcommand.options?.length >= 1) {
                                    subcommand.options.forEach(subcommandOption => {
                                        if (!subcommandOption.type || !subcommandOption.name) {
                                            client.error(`L'option ${subcommandOption.name} de la sous-commande ${subcommand.name} est manquante de propriétés requises.`);
                                            return;
                                        }

                                        switch (subcommandOption.type.toLowerCase()) {
                                            case 'string':
                                                sub.addStringOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                        .setAutocomplete(subcommandOption.autocomplete ?? false)
                                                        .addChoices(subcommandOption.choices ? subcommandOption.choices.map(choice => ({
                                                            name: choice.name,
                                                            value: choice.value
                                                        })) : [])
                                                );
                                                break;
                                            case 'integer':
                                                sub.addIntegerOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'boolean':
                                                sub.addBooleanOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'user':
                                                sub.addUserOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'channel':
                                                sub.addChannelOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'role':
                                                sub.addRoleOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'mentionable':
                                                sub.addMentionableOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'attachment':
                                                sub.addAttachmentOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            case 'number':
                                                sub.addNumberOption(opt =>
                                                    opt.setName(subcommandOption.name)
                                                        .setDescription(subcommandOption.description ?? '')
                                                        .setRequired(subcommandOption.required ?? false)
                                                );
                                                break;
                                            default:
                                                client.error(`Option type ${subcommandOption.type} non supporté pour la sous-commande ${subcommand.name} de la sous-commande ${option.name}`);
                                        }
                                    });
                                }
                            });
                        }
                        break;
                    default:
                        client.error(`Option type ${option.type} non supporté pour la commande ${command.name}`);
                }
            });
        }

        commands.push(slashcommand.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(client.config.token);

    try {
        await rest.put(Routes.applicationCommands('1244291764777386125'), { body: commands });
        client.cmd(`Un total de ${commands.length} commande(s) ont été chargées avec succès`);
    } catch (error) {
        client.error(`Erreur lors du chargement des commandes : ${error.message}`);
    }
};