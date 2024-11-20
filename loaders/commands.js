const fs = require('fs')
const path = require('path')

const loadCommands = (dir, client) => {
    const files = fs
        .readdirSync(dir)

        for (const file of files) {
            const fullPath = path.join(dir, file)
            const stat = fs.lstatSync(fullPath)

            if (stat.isDirectory()) {
                loadCommands(fullPath, client)
            } else if (file.endsWith('.js')) {
                try {
                    const command = require(fullPath)

                    if (!command.name || typeof command.name !== 'string') {
                        client.warn(`La commande ${file} n'as pas de nom valide et sera ignoré`)
                        continue
                    }

                    client.commands.set(command.name, command)
                    client.cmd(`Commande chargé: ${command.name} - ${file} ✅`)
                } catch (err) {
                    client.error(`Erreurs lors du chargement de la commande ${file}:`, err)
                }
            }
        }
}

module.exports = (client) => {
    const commandsDir = path.join(__dirname, '../commands')
    loadCommands(commandsDir, client)
}