async function getColorEmbed(client, guildId) {
    try {
        const color = await new Promise((resolve, reject) => {
            client.database.get(
                `SELECT color FROM embedColor WHERE guildId =?`,
                [guildId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.color : '#FFFFFF');
                }
            )
        })

        return color;
    } catch (err) {
        console.error(err);
        return '#FFFFFF';
    }
}

module.exports = getColorEmbed