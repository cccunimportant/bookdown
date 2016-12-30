var path  = require('path');
var U     = require("./lib");
var File  = U.File;
var mongo = require('./mongo');
var M     = module.exports = {}

M.init = function*(root) {
  M.bookRoot = path.join(root, 'data/book');
  M.setting  = yield File.readJson(path.join(root, 'setting', 'setting.json'));
//  console.log("M.setting=%j", M.setting);
  M.users    = M.setting.users;
  try {
    M.db       = yield mongo.open('bookdown');
    M.docTable = M.db.collection('doc');    
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
  var bookJsonPath = path.join(M.getBookPath(book), "book.json");
  var bookObj = yield File.readJson(bookJsonPath);
//  console.log("book=%s bookJsonPath=%s", bookJsonPath);
  bookObj.book = book;
  return bookObj;
}

M.getBookFile = function*(book, file) {
  var filePath = M.getFilePath(book, file);
  var hasFile = yield File.fileExists(filePath);
  if (hasFile) {
    fileObj = { book:book, file:file };
    fileObj.text = yield File.readFile(filePath);
    return fileObj;
  }
}

M.saveBookFile = function*(book, file, text) {
  console.log("save:%s/%s\npost=%j", book, file, text);
  var filePath = M.getFilePath(book, file);
  yield File.writeFile(filePath, text);
  if (typeof M.db === 'undefined') return;
  if (file.endsWith(".md"))
    yield mongo.saveMd(M.docTable, text, filePath);
  else
    yield mongo.saveJson(M.docTable, U.parseJson(text), filePath);
}

M.createBook = function*(book) {
  console.log("createBook:%s", book);
  yield File.mkdir(M.getBookPath(book));
  yield File.writeFile(M.getBookPath(book)+'/book.json', 
    '{"title":"Book Title", \n "parts":[\n  {"title":"README", "link":"README.md"}\n]}');
}

M.search = function*(keywords, q={}) {
  var results = yield mongo.search(M.docTable, keywords, q);
  console.log("==========================================");
  console.log("search(%s,%j)=%j", keywords, q, results);
  return results;
}

M.query = function*(q) {
  var results = yield mongo.query(M.docTable, q);
  console.log("==========================================");
  console.log("query(%j)=%j", q, results);
  return results;
}

M.uploadToDb = function*() {
  var fileList = yield File.recursiveList(M.bookRoot);
  yield mongo.importFiles(M.docTable, M.bookRoot, fileList);  
}
