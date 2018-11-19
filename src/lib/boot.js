const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = parent => {
  const dir = path.join(__dirname, '..', 'controllers');

  // loop through the files in the controllers folder and create routes for our methods
  fs.readdirSync(dir).forEach(filename => {
    const file = path.join(dir, filename);
    const obj = require(file);

    const name = obj.name || filename;
    const prefix = obj.prefix || '';
    const app = express();

    let handler, method, url;

    for (let key in obj) {
      // reserved exports
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // route exports
      switch (key) {
        case 'show':
          method = 'get';
          url = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          url = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          url = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'put';
          url = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          url = '/' + name;
          break;
        case 'index':
          method = 'get';
          url = '/';
          break;
        default:
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      handler = obj[key];
      url = prefix + url;

      // if a before method is set on the controller, execute this before the method being called.
      if (obj.before) {
        app[method](url, obj.before, handler);
      } else {
        app[method](url, handler);
      }

      parent.use(app);
    }
  })
}