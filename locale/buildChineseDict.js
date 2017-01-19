var fs = require("fs");
var text = fs.readFileSync("tw2cn.dic", "utf8");
var lines = text.split(/\r?\n/);
var tw2cn = {}, cn2tw = {}, tw2cnAll = {}, cn2twAll = {};
for (var i=0; i<lines.length; i++) {
  var tokens = lines[i].split("=");
  var tw = tokens[0], cn = tokens[1];
  if (tw === cn) {
    if (typeof tw2cn[tw] !== 'undefined')
      tw2cn[tw] = undefined;
    if (typeof cn2tw[cn] !== 'undefined')
      cn2tw[cn] = undefined;
  } else  { // (tw !== cn)
    if (typeof tw2cnAll[tw] === 'undefined')
      tw2cn[tw] = cn;
    if (typeof cn2twAll[cn] === 'undefined')
      cn2tw[cn] = tw;
  }
  tw2cnAll[tw] = cn;
  cn2twAll[cn] = tw;
}
fs.writeFileSync("tw2cn.json", JSON.stringify(tw2cn, null, 1), "utf8");
fs.writeFileSync("cn2tw.json", JSON.stringify(cn2tw, null, 1), "utf8");

