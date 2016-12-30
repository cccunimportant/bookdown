var http    = require('http');
var https   = require('https');
var fs      = require('mz/fs');
var co      = require('co');
var koa     = require('koa');
var serve   = require('koa-static');
var route   = require('koa-route');
var cobody  = require('co-body');
var path    = require('path');
var session = require('koa-session');
var app     = koa();
var U       = require("./lib/lib");
var M       = require("./lib/model");
var V       = require("./lib/view");

var response=function(self, code, msg) {
	var res = self.response;
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
  res.body = msg;
  if (code !== 200) console.log('response error : ', code, msg);
}

var isPass = function(self) {
  return typeof(self.session.user)!=='undefined';
}

var parse = function *(self) {
	var json = yield cobody(self);
	return JSON.parse(json);
}

var view = function *(book, file="README.md") { // view(mdFile):convert *.md to html
  console.log("view:book=%s file=%s", book, file);
  if (file.endsWith(".md") || file.endsWith(".json")) {
    var fileObj, bookObj = yield M.getBook(book);
		try {
			fileObj = yield M.getBookFile(book, file);
		} catch (error) {
			fileObj = { book:book, file:file, text:"File not found.\nYou may edit and save to create a new file !" };
		}
		var page = V.viewRender(bookObj, fileObj);
		this.body = page;
	} else {
		this.type = path.extname(this.path);
		this.body = fs.createReadStream(M.getFilePath(book, file));
	}
}

var save = function *(book, file) { // save markdown file.
  if (!isPass(this)) {
    response(this, 401, 'Please login to save!');
  } else {
		try {
			var post = yield parse(this);
			console.log("save:%s/%s\npost=%j", book, file, post.text);
			yield M.saveBookFile(book, file, post.text);
			response(this, 200, 'Save Success!');
		} catch (e) {
			response(this, 403, 'Save Fail!'); // 403: Forbidden
		}
	}
}

var search = function *() {
	try {
		var key = this.query.key||"", q = JSON.parse(this.query.q||"{}");
		console.log("query=%j", this.query);
		var results = yield M.search(key, q)
		response(this, 200, JSON.stringify(results));
	} catch (e) {
		response(this, 403, e.stack);
	}
}

var login = function *() {
  var post = yield parse(this);
	console.log("login:post=%s", JSON.stringify(post));
	var user = M.users[post.user];
	if (user.password === post.password) {
    response(this, 200, 'Login Success!');
    this.session.user = post.user;
	}
  else
    response(this, 403, 'Login Fail!'); // 403: Forbidden
}

var logout =function *() {
	delete this.session.user;
	response(this, 200, 'Logout Success!');
}

var createBook = function*(book) {
  if (!isPass(this)) {
    response(this, 401, 'Please login to create book!');
  } else {
    yield M.createBook(book);
    response(this, 200, '"Create Book ['+book+'] Success!"');
  }
}

app.keys = ['#*$*#$)_)*&&^^'];

var CONFIG = {
  key: 'koa:sess', // (string) cookie key (default is koa:sess)
  maxAge: 86400000, // (number) maxAge in ms (default is 1 days)
  overwrite: true, // (boolean) can overwrite or not (default true)
  httpOnly: true, // (boolean) httpOnly or not (default true)
  signed: true, // (boolean) signed or not (default true)
};

app.use(session(CONFIG, app));;
app.use(serve('web'));
app.use(serve('user'));

app.use(route.get('/', function*() { this.redirect('/view/home/README.md') }));
app.use(route.get('/search', search));
app.use(route.get('/view/:book/:file?', view));
app.use(route.post('/save/:book/:file', save));
app.use(route.get('/createbook/:book', createBook));
app.use(route.post('/createbook/:book', createBook));
app.use(route.post('/login', login));
app.use(route.post('/logout', logout));

co(function*() {
	yield M.init(__dirname);
	V.init(__dirname);
	var port = M.setting.port || 80;
	http.createServer(app.callback()).listen(port);
  // https version : in self signed certification
  // You can save & modify in SSL mode, no edit allowed in HTTP mode.
	var sslPort = M.setting.portSsl || 443;
  var keyPem  = yield U.File.readFile('setting/key.pem');
  var certPem = yield U.File.readFile('setting/cert.pem');
  var csrPem  = yield U.File.readFile('setting/csr.pem');
	https.createServer({
		key: keyPem,
		cert: certPem, 
		// The folowing is for self signed certification.
		requestCert: true, 
		ca: [ csrPem ]
	}, app.callback()).listen(sslPort);
	console.log('http  server started: http://localhost:'+port);
	console.log('https server started: http://localhost:'+sslPort);
});
