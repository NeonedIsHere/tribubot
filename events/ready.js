module.exports = {
    name: 'ready',
    async execute(client) {

        const loaders = [
            { name: 'anticrash', path: '../loaders/anticrash' },
            { name: 'commands', path: '../loaders/commands' },
            { name: 'slashcommand', path: '../loaders/slashcommands' },
            { name: 'database', path: '../loaders/database' },
            { name: 'modals', path: '../loaders/modals' },
            { name: 'buttons', path: '../loaders/buttons' },
        ];

        for (const loader of loaders) {
            client.info(`Chargement du module "${loader.name}"...`);

            try {
                require(loader.path)(client); 
                client.success(`[Loaders] Le module "${loader.name}" a été chargé avec succès`);
            } catch (error) {
                client.error(`[Loaders] Erreur lors du chargement du module "${loader.name}"`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 999))
        }

        client.online(`Le bot a démarré sous ${client.user.username} (${client.user.id})`);
    },
};
