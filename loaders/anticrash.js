module.exports = async (client) => {
    try {

        process.on('unhandledRejection', (error) => {
            client.ac('[antiCrash] :: Unhandled Rejection/Catch');
            client.error(error);
        });
        
        process.on('uncaughtException', (error, origin) => {
            client.ac('[antiCrash] :: Uncaught Exception/Catch');
            client.error(error);
            client.ac('Information supplémentaire:', origin); 
        
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        });
        
        process.on('uncaughtExceptionMonitor', (error, origin) => {
            client.ac('[antiCrash] :: Uncaught Exception Monitor/Catch');
            client.error(error);
            client.ac('Information supplémentaire:', origin);
        });
        
        process.on('beforeExit', (code) => {
            client.ac('[antiCrash] :: Before Exit');
            client.ac('Code de sortie:', code);
            
        
            database.close().then(() => {
                client.ac('Connexion à la base de données fermée');
            }).catch(err => {
                client.error('Erreur lors de la fermeture de la base de données:', err);
            });
        
        });
        
        process.on('exit', (code) => {
            client.ac('[antiCrash] :: Exit');
            client.ac('Code de sortie:', code);
        
        });

        client.ac('AntiCrash connecter avec succès')
    } catch (error) {
        client.ac('Une erreur est servenue lors de la tentative de connection avec l\'anticrash', error)
    }
}