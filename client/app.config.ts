export default {
  expo: {
    name: 'High-Club',
    extra: {
      apiDomain: process.env.API_DOMAIN || 'localhost',
      apiPort: process.env.API_PORT || '3333',
      apiProtocol: process.env.API_PROTOCOL || 'http',
    },
  },
}; 