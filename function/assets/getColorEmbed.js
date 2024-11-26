async function getColorEmbed(client, guildId) {
    if (!client.database || typeof client.database.get !== 'function') {
        console.error('Base de données non initialisée ou mal configurée.');
        return '#FFFFFF';
    }

    console.log(`Recherche de la couleur pour le guildId : ${guildId}`);

    try {
        const color = await new Promise((resolve, reject) => {
            client.database.get(
                `SELECT color FROM embedColor WHERE guildId =?`,
                [guildId],
                (err, row) => {
                    if (err) {
                        console.error('Erreur SQL :', err.message);
                        reject(err);
                    } else {
                        console.log('Résultat de la base de données :', row);
                        resolve(row ? row.color : '#FFFFFF');
                    }
                }
            );
        });

        return color;
    } catch (err) {
        console.error('Erreur dans getColorEmbed :', err.stack);
        return '#FFFFFF';
    }
}

module.exports = getColorEmbed;