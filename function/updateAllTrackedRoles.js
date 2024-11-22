const uptdateTrackedRoles = require("./uptdateTrackedRoles");

async function updateAllTrackedRoles(guild, client) {
    try {
        const trackedRoles = await new Promise((resolve, reject) => {
            client.database.all(
                `SELECT * FROM trackedRole WHERE guildId = ?`,
                [guild.id],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        if (trackedRoles.length === 0) {
            console.log(`Aucun rôle suivi trouvé pour le serveur ${guild.id}`);
            return;
        }

        for (const roleInfo of trackedRoles) {
            await uptdateTrackedRoles(guild, roleInfo)
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour des rôles suivis:', error);
    }
}

module.exports = updateAllTrackedRoles