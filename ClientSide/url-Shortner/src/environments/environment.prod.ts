export const environment = {
    production: true,
    scheme: typeof window !== 'undefined' ? window.location.protocol + '//' : 'https://',
    apiUrl: typeof window !== 'undefined' ? window.location.hostname + ':3000' : 'localhost:3000'
};