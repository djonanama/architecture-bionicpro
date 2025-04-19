// компонент-обёртка для автообновления токена
import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const TokenUpdater: React.FC = () => {
    const { keycloak } = useKeycloak();

    useEffect(() => {
        const interval = setInterval(() => {
            keycloak
                .updateToken(60)
                .then((refreshed) => {
                    if (refreshed) {
                        console.log("Token refreshed");
                    }
                })
                .catch(() => {
                    console.error("Failed to refresh token");
                });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default TokenUpdater;
