import { atom } from 'recoil';

const userState = atom({
    key: 'userState', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});

const socialState = atom({
    key: 'socialState',
    default: undefined,
});

export {
    userState,
    socialState,
};