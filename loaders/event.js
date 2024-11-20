const fs = require('fs')

module.exports = async (client) => {
    const eventFile = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'))

    for (const file of eventFile) {
        const event = require(`../events/${file}`)
        const eventName = event.name
        const eventHandler = event.execute

        if (event.once) {
            client.once(eventName, (...args) => eventHandler(...args, client))
        } else (
            client.on(eventName, (...args) => eventHandler(...args, client))
        )

        client.event(`Event chargé: ${eventName} - ${file} ✅`)
    }
}