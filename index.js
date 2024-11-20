(async () => {
    
    const { Client, IntentsBitField, Collection } = require('discord.js');
    const client = new Client({
        intents: new IntentsBitField(3276799),
    });

    const chalk = await import('chalk');

    const online = chalk.default.hex('#ff00e1')
    const info = chalk.default.hex('#00ffff');
    const success = chalk.default.hex('#00ff00');
    const event = chalk.default.hex('#9e00ff');
    const warn = chalk.default.hex('#FFA500');
    const error = chalk.default.hex('#ff0000');
    const cmd = chalk.default.hex('#2664f5')
    const data = chalk.default.hex('#835e1c')
    const ac = chalk.default.hex('#ff7a7a')
    const int = chalk.default.hex('#CCCCCC')

    
    client.buttons = new Collection()
    client.commands = new Collection()
    client.modals = new Collection()

    console.clear()
    client.online = (message) => console.log(online(`[BOT]: ${message}`));
    client.info = (message) => console.log(info(`[INFO]: ${message}`));
    client.success = (message) => console.log(success(`[SUCCESS]: ${message}`));
    client.event = (message) => console.log(event(`[EVENT]: ${message}`));
    client.warn = (message) => console.log(warn(`[WARN]: ${message}`));
    client.error = (message) => console.log(error(`[ERROR]: ${message}`));
    client.cmd = (message) => console.log(cmd(`[CMD]: ${message}`));
    client.data = (message) => console.log(data(`[DATA]: ${message}`));
    client.ac = (message) => console.log(ac(`[ACH]: ${message}`));
    client.int = (message) => console.log(int(`[INT]: ${message}`));

    client.online(`Démarrage du bot..`);

    client.info('Chargement des events')

    const config = require('./config.json');
    client.config = config;

    require('./loaders/event')(client);

    client.login(client.config.token).catch((e) => {
        client.error(e);
        process.exit(1);
    });
})();
