const { updateTrackedRoles } = require("../function/main");

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute(oldMember, newMember, client) {
        try {
            const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
            const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

            const trackedRoles = await new Promise((resolve, reject) => {
                client.database.all(
                    `SELECT * FROM trackedRole WHERE guildId = ?`,
                    [newMember.guild.id],
                    (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    }
                );
            });

            for (const roleInfo of trackedRoles) {
                if (addedRoles.has(roleInfo.roleId) || removedRoles.has(roleInfo.roleId)) {
                    await updateTrackedRoles(newMember.guild, roleInfo);
                }
            }
        } catch (error) {
            console.error(`Erreur lors de la gestion des rôles suivis :`, error);
        }
    }
};
