var fs = require('mz/fs');
var hash = require('object-hash');
var U  = module.exports = {}

var fileWalk = function(dir, path, done) {
  var results = [];
	var dir = (dir.endsWith("/"))?dir:dir+"/";
	var path = (path.endsWith("/"))?path:path+"/";
  fs.readdir(dir+path, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      fs.stat(dir+path+file, function(err, stat) {
//				console.log("path=%s file=%s", path, file);
        if (stat && stat.isDirectory()) {
          fileWalk(dir, path+file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(path.substring(1)+file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

U.File={
	readJsonSync:function(file) {
    var json = fs.readFileSync(file, "utf8");
    return U.parseJson(json);
	},
	readFile:function *(file) {
		return yield fs.readFile(file, "utf8");		
	},
	writeFile:function *(file, text) {
		return yield fs.writeFile(file, text);
	},
  mkdir:function *(path) {
    return yield fs.mkdir(path);
  },
	readJson:function *readJson(file) {
		var json = yield fs.readFile(file, "utf8");
		return U.parseJson(json);
	},
	fileExists:function *(file) {
	  var fstat = yield fs.stat(file);
    return fstat.isFile();
	},
	recursiveList:function(dir) {
		return function(done) {
			fileWalk(dir, "", done);
		}
	},	
};

U.clone=function(o) {
	return JSON.parse(JSON.stringify(o));
}

U.hash = function(o) {
	return hash(o);
}

U.parseJson = function(json) {
	json = json.replace(/(\W)(\w+):/gm, '$1"$2":') // id: => "id":
             .replace(/:(\w+)/gm, ':"$1"')     // :v  => :"v"
  					 .replace(/([\{\[])\s*,/gm, '$1')  // {, => {
             .replace(/,\s*([\}\]])/gm, '$1'); // ,] => ]
//  console.log("json=%s", json);
	return JSON.parse(json);
}
