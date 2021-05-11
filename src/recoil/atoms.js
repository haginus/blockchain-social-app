import { atom } from 'recoil';

export const appState = atom({
    key: 'appState',
    default: {
        isInitializing: true,
        accounts: [],
        selectedAccount: null,
        currentUser: null
    }
})

export const socialState = atom({
    key: 'socialState',
    default: undefined,
});

export const usersCache = atom({
    key: 'usersCache',
    default: {}
})