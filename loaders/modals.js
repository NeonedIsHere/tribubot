const fs = require("fs")

module.exports = async (client) => {

    const modalFiles = fs
        .readdirSync('./interaction/modals')
        .filter(file => file.endsWith('.js'))

    for (const file of modalFiles) {

        const modal = require(`../interaction/modals/${file}`)

        if (modal.customId) {
            client.modals.set(modal.customId, modal)
            client.int(`[Modals] ${modal.customId} - ${file} ✅`)
        } else {
            client.warn(`[Modals] ${file} - Missing customId ⚠️`)
        }
    }
}