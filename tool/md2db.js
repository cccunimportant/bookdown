var co   = require('co');
var M    = require('../lib/model');

co(function*() {
  yield M.init("../");
  yield M.uploadToDb();
//  yield M.query({type:"json"});
//  yield M.search("陳鍾誠 email");
//  yield M.search("八極語 grammar");
//  yield M.search("Africa");
  var results = yield M.search("十分鐘小論文", {type:"md"});
  console.log("results=%j", results);
  var results = yield M.search("十分鐘小論文");
  console.log("results=%j", results);
  yield M.close();
});

