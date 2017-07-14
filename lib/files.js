var fs = require('fs');
var path = require('path');

module.exports = {
  getCurrentDirectoryBase : function() {
    // return path.basename(process.cwd());
    try {
      var fullPath = __dirname;
      var path = fullPath.split('/');
      var cwd = path[path.length-1];
      return cwd;
    } catch (error) {
      console.log(error);
    }
  },
};
