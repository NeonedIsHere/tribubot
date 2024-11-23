const { SlashCommandBuilder } = require('discord.js')
const addOptions = require('./addOption')

function buildCommand(command) {
    const slashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm ?? false)
        .setDefaultMemberPermissions(command.permissions === 'Aucune' ? null : command.permissions);

    if (command.options?.length > 0) {
        command.options.forEach(option => {
            if (option.type.toLowerCase() === 'subcommand') {
                slashCommand.addSubcommand(sub => {
                    sub.setName(option.name).setDescription(option.description ?? 'Aucune description.');
                    if (option.options?.length) {
                        addOptions(sub, option.options);
                    }
                    return sub; 
                });
            } else if (option.type.toLowerCase() === 'subcommandgroup') {
                slashCommand.addSubcommandGroup(group => {
                    group.setName(option.name).setDescription(option.description ?? 'Aucune description.');
                    if (option.options?.length) {
                        option.options.forEach(subcommand => {
                            group.addSubcommand(sub => {
                                sub.setName(subcommand.name).setDescription(subcommand.description ?? 'Aucune description.');
                                if (subcommand.options?.length) {
                                    addOptions(sub, subcommand.options);
                                }
                                return sub; 
                            });
                        });
                    }
                    return group;
                });
            } else {
                addOptions(slashCommand, [option]);
            }
        });
    }

    return slashCommand.toJSON();
}

module.exports = buildCommand