const fs = require('fs')

module.exports = async (client) => {

    const ButtonsFile = fs
        .readdirSync('./interaction/buttons')
        .filter((file) => file.endsWith('.js'))

    for (const file of ButtonsFile) {

        const button = require(`../interaction/buttons/${file}`)

        if (button.customId) {
            client.buttons.set(button.customId, button)
            client.int(`[Buttons] ${button.customId} - ${file} ✅`)
        } else {
            client.warn(`[Buttons] ${file} - Missing customId ⚠️`)
        }
    }
}