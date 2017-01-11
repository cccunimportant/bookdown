var M = module.exports = require("mdo");

// 1. md 分解出 parts
// 2. 取得 Markdown Object (mdo) 的 json
// 3. 取得表格的 json
M.parse = function(md) {
  var lines = md.split(/\r?\n/), partLines = [], codeHeader, codeLines;
  var partList = [], jsonList = [], mdoLines = [];
  for (var i=0, len = lines.length; i<len; i++) {
    var line = lines[i];
		// 取得 partList 
    if (line.startsWith("#") || i===len-1) {
      var partMd = partLines.join("\n");
      partLines = [ line ];
      var m = partMd.match(/^#{0,6}/);
			if (partMd.trim().length > 0)
				partList.push({part:partList.length, level:m[0].length, md:partMd, type:"md" });
    } else {
      partLines.push(line);
    }
    if (line.startsWith("```")) { // 處理 code
      if (typeof codeHeader === 'undefined') { // code start
        codeHeader = line; 
        codeLines  = [];
      } else { // code end
        if (codeHeader.toLowerCase().startsWith("```mdo")) {
          jsonList.push(M.parseMdo(codeLines.join("\n")));
        }
        codeHeader = undefined;
      }
    } else if (typeof codeHeader === 'undefined' && line.indexOf("|")>=0) {
      if (i<len-1 && lines[i+1].match(/^[\-|]+$/) && !lines[i-1].startsWith("```")) {
        var table=[], head=lines[i];
        for (;i<len && lines[i].trim() !== ""; i++) {
          table.push(lines[i]);
        }
        jsonList.push(M.tableToJson(table.join("\n")));
      }
    }
    else if (typeof codeHeader !== 'undefined') {
      codeLines.push(line);      
    }
  }
	// parts: 分解段落, jsons:所有物件列表, formal:正規化的 markdown 字串
  return {parts:partList, jsons:jsonList};
}
/*
MD.parseValue = function(value) {
  var json;
  try {
    if (value.match(/\n\-+|[|\-]+/)) {
      json = MD.tableToJson(value);
    } else 
      json = U.parseJson(value); // JSON.parse(value);
  } catch (e) {
    json = value;
  }
  return json;
}

MD.mdoToJson = function(mdo) {
  var obj={}, field, valueLines = [], lines = mdo.split(/\r?\n/);
  for (var i=0, len = lines.length; i<len; i++) {
    var line = lines[i]; // [^\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/;<=>?@\[\]^_`{|}~]
    var m = line.match(/^([^\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/;<=>?@\[\]^_`{|}~]+)\s*:\s*(.*)$/);
//    console.log("m=%j", m);
    if (m) {
      if (typeof field !== 'undefined')
        obj[field] = MD.parseValue(valueLines.join('\n').trim());
      field = m[1]; valueLines = [ m[2] ];
    } else {
      valueLines.push(line);
    }
//    console.log("obj=%j line=%s", obj, line);
  }
  if (valueLines.length > 0 && typeof field !== 'undefined')
    obj[field] = MD.parseValue(valueLines.join('\n').trim());
  return obj;
}

MD.tableToJson = function(table) {
  var lines = table.split(/\r?\n/), len = lines.length;
  var jsonTable = [], types=[], fields=lines[0].split(/\s*\|\s* /);
  for (var i=0; i<fields.length; i++) {
    var tokens = fields[i].split(":");
    fields[i] = tokens[0].trim();
    types[i] = (tokens.length>=2)?tokens[1].trim():"string";
  }
//  console.log("fields=%j types=%j", fields, types);
  for (var i=2; i<len; i++) {
    var values=lines[i].split("|"), vlen = values.length, json={};
    for (var vi=0; vi<vlen; vi++) {
      var value = values[vi].trim();
//      console.log("%d value=%s", vi, value);
      switch (types[vi]) {
        case "json"  : value = U.parseJson(value); break;
        case "number": value = parseFloat(value); break;
        case "boolean":value = JSON.parse(value); break;
        case "date"  : value = (new Date(value)).toJSON(); break; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
      }
      json[fields[vi]] = value;
    }
    jsonTable.push(json);
  }
  return jsonTable;
}

MD.index=function(jsons, field) {
  var map = {};
  for (var i in jsons) {
    var json = jsons[i];
    var key = json[field];
    map[key] = json;
  }
  return map;
}
*/