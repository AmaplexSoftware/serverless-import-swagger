'use strict';

var path = require('path');
var fs = require('graceful-fs');
var yaml = require('js-yaml');
var openapiParser = require('oai-ts-core');
var appRoot = require('app-root-path');

var parser = new openapiParser.OasLibraryUtils();

module.exports = function (options) {
  return Promise.resolve().then(function () {
    var inputs = options.input.filter(function (path) {
      return path.length > 0;
    });

    if (inputs.length > 0) {
      return inputs;
    }

    return new Promise(function (resolve, reject) {
      fs.readdir(appRoot.path, function (error, results) {
        if (error) {
          reject(error);
          return;
        }

        var filtered = results.filter(function (r) {
          return (/^swagger.ya?ml$/.test(r)
          );
        });

        if (filtered.length === 0) {
          reject('Cannot found swagger file.');
          return;
        }

        resolve([path.resolve(appRoot.path, filtered[0])]);
      });
    });
  }).then(function (filePaths) {
    return filePaths.map(function (filePath) {
      var yamlContent = yaml.safeLoad(fs.readFileSync(filePath));
      return parser.createDocument(yamlContent);
    });
  });
};