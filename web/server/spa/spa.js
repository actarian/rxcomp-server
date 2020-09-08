const { Server } = require('../../../dist/cjs/rxcomp-server');
const { renderRequest$ } = require('../../dist/development/server/main.js');

function spaMiddleware(vars) {
  if (!vars) {
    throw new Error('missing Vars!');
  }
  return (request, response, next) => {
    Server.render$({ url: request.url, vars }, renderRequest$).subscribe(
      success => {
        // console.log('success', success);
        console.log('NodeJs.spaMiddleware.serving', request.url);
        response.send(success.body);
      },
      error => {
        // console.log('error', error);
        console.log('NodeJs.spaMiddleware.error', request.url, error);
        response.send(JSON.stringify(error, null, 2));
      },
    );
  };
};

module.exports = {
  spaMiddleware: spaMiddleware,
};
