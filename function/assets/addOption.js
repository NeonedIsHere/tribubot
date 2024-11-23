function addOptions(builder, options) {
    options.forEach(option => {
        switch (option.type.toLowerCase()) {
            case 'string':
                builder.addStringOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                        .setAutocomplete(option.autocomplete ?? false)
                        .addChoices(option.choices?.map(choice => ({
                            name: choice.name,
                            value: choice.value
                        })) ?? [])
                );
                break;
            case 'integer':
                builder.addIntegerOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'boolean':
                builder.addBooleanOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'user':
                builder.addUserOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'channel':
                builder.addChannelOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'role':
                builder.addRoleOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'mentionable':
                builder.addMentionableOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'attachment':
                builder.addAttachmentOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'number':
                builder.addNumberOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            default:
                throw new Error(`Type d'option "${option.type}" non supporté pour l'option "${option.name}".`);
        }
    });
}

module.exports = addOptions