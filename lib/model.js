var path  = require('path');
var io    = require("./io");
var mongo = require('./mongo');
var MD    = require('./markdown');
var M     = module.exports = {}

M.init = function*(root) {
  M.bookRoot = path.join(root, 'data/book');
  M.userListFile = path.join(M.bookRoot, 'system/userlist.md');
  M.bookListFile = path.join(M.bookRoot, 'system/booklist.md');
  M.settingFile = path.join(root, 'setting/setting.mdo');
  var settingMdo = yield io.readFile(M.settingFile);
  M.setting  = MD.parseMdo(settingMdo);
  M.setting.users = MD.index(M.setting.users, 'user');
//  console.log("M.setting=%j", M.setting);
  M.users    = M.setting.users;
  try {
    M.db       = yield mongo.open('bookdown', M.setting.db);
    M.docTable = M.db.collection('doc');
    M.fileTable = M.db.collection('file');
  } catch (e) {
    console.log("Mongodb connect fail : no database supported !");
  }
}

M.close = function*() {
  yield mongo.close(M.db);
}

M.getBookPath = function(book) {
//  console.log("M.bookRoot=%s book=%s", M.bookRoot, book);
  return path.join(M.bookRoot, book);
}

M.getFilePath = function(book, file) {
  return path.join(M.getBookPath(book), file);
}

M.getBook = function*(book) {
  var bookFile = path.join(M.getBookPath(book), "book.mdo");
  var bookMdo  = yield io.readFile(bookFile);
  var bookObj  = MD.parseMdo(bookMdo);
  bookObj.book = book;
  return bookObj;    
}

M.getBookFile = function*(book, file) {
  var filePath = M.getFilePath(book, file);
  var hasFile = yield io.fileExists(filePath);
  if (hasFile) {
    fileObj = { book:book, file:file };
    fileObj.text = yield io.readFile(filePath);
    return fileObj;
  }
}

M.saveBookFile = function*(book, file, text) {
  console.log("save:%s/%s", book, file);
  var path = book+"/"+file;
  var filePath = M.getFilePath(book, file);
  yield io.writeFile(filePath, text);
  if (typeof M.db === 'undefined') return;
  if (file.endsWith(".md"))
    yield mongo.saveMd(M.docTable, text, path);
  else if (file.endsWith(".json"))
    yield mongo.saveJson(M.docTable, io.parseJson(text), path);
  else
    yield mongo.saveText(M.docTable, text, path);
}

M.createBook = function*(book, user) {
  console.log("createBook:%s", book);
  var isMkdir = yield io.mkdir(M.getBookPath(book));
  yield io.writeFile(M.getBookPath(book)+'/book.mdo', 
    'title:Book Title\neditor:'+user+'\nchapters:\ntitle        | link\n-------------|---------\nREADME       | README.md\nChapter1     | chapter1.md');
  yield io.appendFile(M.bookListFile, '\n['+book+'](../'+book+'/) | ['+user+'](../'+user+'/)');
}

M.createUser = function*(user) {
  console.log("createUser:%s", user);
  var isMkdir = yield io.mkdir(M.getBookPath(user));
  yield io.appendFile(M.userListFile, '\n['+user+'](/view/'+user+'/) | '+user);
  yield io.writeFile(M.getBookPath(user)+'/book.mdo', +
    'title:'+user+'\neditor:'+user+'\nchapters:\ntitle        | link\n'+
    '-------------|---------\n'+user+' | README.md');
  yield io.writeFile(M.getBookPath(user)+'/README.md', 
    '## About Me\n* name:'+user+'\n* email: ???\n\n## My Book\n\n* [MyBook1](../'+user+'/)\n');
}

M.addUser = function*(user, password) {
  var userObj = M.setting.users[user];
  if (typeof userObj === 'undefined') {
    var userObj = {user:user, password:password};
    M.setting.users[user] = userObj;
    var msg = '\n'+user+' | '+password;
    console.log("appendFile:M.settingFile=%s text=%s", M.settingFile, msg);
    yield io.appendFile(M.settingFile, msg);
    yield M.createUser(user);
    return true;
  } else {
    return false;
  }
}

M.search = function*(keywords, q={}) {
  var results = yield mongo.search(M.docTable, keywords, q);
//  console.log("==========================================");
//  console.log("search(%s,%j)=%j", keywords, q, results);
  return results;
}

M.query = function*(q) {
  var results = yield mongo.query(M.docTable, q);
  console.log("==========================================");
  console.log("query(%j)=%j", q, results);
  return results;
}

M.uploadToDb = function*() {
  var fileList = yield io.recursiveList(M.bookRoot);
  yield mongo.importFiles(M.docTable, M.bookRoot, fileList);  
}
