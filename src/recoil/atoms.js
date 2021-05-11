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

export const usersCache = atom({
    key: 'usersCache',
    default: {}
});

export const photosState = atom({
    key: 'photos',
    default: {}
});