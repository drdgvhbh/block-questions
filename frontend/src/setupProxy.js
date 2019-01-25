const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(proxy('/graphql', {
    target: process.env.REACT_APP_API_URL,
  }));
};
