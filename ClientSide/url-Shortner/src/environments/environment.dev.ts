export const environment = {
    production: false,
    scheme: typeof window !== 'undefined' ? window.location.protocol + '//' : 'http://',
    apiUrl: typeof window !== 'undefined' ? window.location.hostname + ':3000' : 'localhost:3000'
};
