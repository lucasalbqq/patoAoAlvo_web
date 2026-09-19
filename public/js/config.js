const rawConfig = window.__GAME_CONFIG__;

if (!rawConfig || typeof rawConfig !== 'object') {
    throw new Error('Configuração do jogo não foi carregada.');
}

export const GAME_CONFIG = deepFreeze(rawConfig);

function deepFreeze(value) {
    Object.values(value).forEach((item) => {
        if (item && typeof item === 'object' && !Object.isFrozen(item)) {
            deepFreeze(item);
        }
    });

    return Object.freeze(value);
}

