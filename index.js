var fs = require('fs');
var path = require('path');
var mime = require('mime');

function parse(dir, options) {

  var paths = fs.readdirSync(dir);

  var finalPaths = paths.map(function (_path) {
    if (_path === '.' || _path === '..') {
      return null;
    }
    if (!options || !options.hidden) {
      if (_path.indexOf('.') === 0) {
        return null;
      }
    }
    var normalized = path.normalize(dir + '/' + _path);
    if (fs.lstatSync(normalized).isDirectory()) {
      return {
        name: _path,
        path: path.resolve(normalized),
        type: 'DIR',
        children: parse(normalized)
      };
    } else if (fs.lstatSync(normalized).isFile()) {
      return {
        name: _path,
        path: path.resolve(normalized),
        type: 'FILE',
        mime: mime.lookup(_path),
        extension: path.extname(_path)
      };
    }
  });

  finalPaths = finalPaths.filter(function (path) {
    if (path) {
      return path;
    }
  });

  return finalPaths;
}

function flatten(obj) {
  var files = [];

  function recurse(items, fileList) {
    if (items.length > 0) {
      items.forEach(function (item) {
        if (item.type === 'FILE') {
          fileList.push(item);
        } else if (item.type === 'DIR') {
          recurse(item.children, fileList);
        }
      });
    }
  };

  recurse(obj, files);
  return files;
}

exports.open = function (dir) {
  var parsed = parse(path.normalize(dir), false);
  return parsed;
};

exports.flatten = flatten;