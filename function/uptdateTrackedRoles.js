async function updateTrackedRoles(guild, roleInfo) {
    try {
        // Récupérer le rôle à partir de son ID
        const role = await guild.roles.fetch(roleInfo.roleId);

        if (!role) {
            console.error(`Le rôle avec l'ID ${roleInfo.roleId} n'existe pas dans le serveur ${guild.id}.`);
            return;
        }

        // Nombre actuel de membres ayant ce rôle
        const memberCount = role.members.size;

        // Créer le nouveau nom du rôle
        const newName = `${roleInfo.baseName} (${memberCount}/${roleInfo.maxCount})`;

        // Vérifier si le nom est déjà correct avant de modifier
        if (role.name !== newName) {
            await role.setName(newName);
            console.log(`Nom du rôle mis à jour : ${role.name} → ${newName}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du rôle ${roleInfo.roleId} :`, error);
    }
};

module.exports = updateTrackedRoles