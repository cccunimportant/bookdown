var io = require("./io");
var path = require("path");

var MT = module.exports = {
  dictionary:{}
}

MT.loadDictionary = function(locale) {
  MT.dictionary[locale] = io.readJsonSync(path.join(__dirname, "../locale/"+locale+".json"));
}

MT.init = function() {
  MT.loadDictionary("zh");
}

MT.mt = function(msg, locale) {
  if (typeof locale === 'undefined')
    return msg;
  var d = MT.dictionary[locale];
  if (typeof d === 'undefined')
    return msg;
  return d[msg];
}

