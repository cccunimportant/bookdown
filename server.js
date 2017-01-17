var http    = require("http");
var https   = require("https");
var fs      = require("mz/fs");
var co      = require("co");
var koa     = require("koa");
var serve   = require("koa-static");
var route   = require("koa-route");
var cobody  = require("co-body");
var path    = require("path");
var session = require("koa-session");
var app     = koa();
var io      = require("./lib/io");
var M       = require("./lib/model");
var V       = require("./lib/view");
// var MT      = require("./lib/mt");

/*
var mt = function(self, msg) {
  console.log("this.session=%j", self.session);
  return MT.mt(msg, self.session.locale);
}
*/

var response=function(self, code, msg) {
//  console.log("this.session=%j", self.session);
//  var msgMt = mt(self, msg);
  var msgMt = msg;
	var res = self.response;
  res.status = code;
  res.set({"Content-Length":""+msgMt.length,"Content-Type":"text/plain"});
  res.body = msgMt;
  console.log("response:msg=%s", msgMt);
//  if (code !== 200) console.log("response error : ", code, msgMt);
}

var isPass = function(self) {
  return typeof(self.session.user)!=="undefined";
}

var parse = function *(self) {
	var json = yield cobody(self);
	return JSON.parse(json);
}
/*
var setLocale = function*(locale) {
  this.session.locale = locale;
  console.log("this.session.locale=%j", this.session.locale);
}
*/
var view = function *(book, file="README.md") { // view(mdFile):convert *.md to html
  console.log("view:book=%s file=%s", book, file);
	var type = path.extname(file);
  if ([".md", ".json", ".mdo", ".html"].indexOf(type)>=0) {
    var bookObj, fileObj, isError=false;
    try {
      bookObj = yield M.getBook(book);
    } catch (error) {
      isError = true;
      bookObj = { book:book };
			fileObj = { book:book, file:file, text:"# Error\nBook not found.\nYou may [Create New Book](/view/system/createBook.html) ?" };
    }
    if (!isError) {
      try {
        fileObj = yield M.getBookFile(book, file);
      } catch (error) {
        fileObj = { book:book, file:file, text:"# Error\nFile not found.\nYou may edit and save to create a new file !" };
      }      
    }
		var page = V.viewRender(bookObj, fileObj, M.setting.useLocal, this.session.user);
		this.body = page;
	} else {
		this.type = path.extname(this.path);
		this.body = fs.createReadStream(M.getFilePath(book, file));
	}
}

var save = function *(book, file) { // save markdown file.
  if (!isPass(this)) {
    response(this, 401, "Please login to save!");
    return;
  }
  var bookObj = yield M.getBook(book);
  if (bookObj.editor !== this.session.user) {
    response(this, 403, "Save fail: You are not editor of the book !");
    return;
  }  
  try {
    var post = yield parse(this);
//    console.log("save:%s/%s\npost=%j", book, file, post.text);
    yield M.saveBookFile(book, file, post.text);
    response(this, 200, "Save Success!");
  } catch (e) {
    response(this, 403, "Save Fail!"); // 403: Forbidden
  }
}

var signup = function *() {
  if (!M.setting.signup) {
    response(this, 403, "Error: Signup=false in Setting.mdo !");
    return;
  }
  var post = yield parse(this);
  var user = post.user, password = post.password;
  console.log("post=%j", post);
  var isSuccess = yield M.addUser(user, password);
  if (isSuccess) {
    response(this, 200, "Signup success!");
  } else {
    response(this, 403, "Signup Fail: User name already taken by some others!");
  }
}

var search = function *() {
	try {
		var key = this.query.key||"", q = JSON.parse(this.query.q||"{}");
		console.log("query=%j", this.query);
		var results = yield M.search(key, q);
		response(this, 200, JSON.stringify(results));
	} catch (e) {
		response(this, 403, e.stack);
	}
}

var userList = function *() {
  var lines = ["<ol>"];
  for (var user in M.users) {
    lines.push(" <li><a href=\"/view/book/"+user+"/README.md\">"+user+"</a></li>");
  }
  lines.push("</ol>");
  response(this, 200, lines.join("\n"));
}

var login = function *() {
  var post = yield parse(this);
	console.log("login:user=%s", post.user);
	var user = M.users[post.user];
  console.log("this.session=%j", this.session);
	if (user.password === post.password) {
    response(this, 200, "Login Success!");
    this.session.user = post.user;
	}
  else
    response(this, 403, "Login Fail!"); // 403: Forbidden
  console.log("this.session=%j", this.session);
}

var logout =function *() {
	delete this.session.user;
	response(this, 200, "Logout Success!");
}

var createBook = function*(book) {
  if (!isPass(this)) {
    response(this, 401, "Please login at first !");
  } else {
    try {
      yield M.createBook(book, this.session.user);
      response(this, 200, "Create Book Success!");
    } catch (err) {
      response(this, 403, "Fail: Book already exist!");
    }
  }
}

app.keys = ["#*$*#$)_)*&&^^"];

var CONFIG = {
  key: "koa:sess", // (string) cookie key (default is koa:sess)
  maxAge: 86400000, // (number) maxAge in ms (default is 1 days)
  overwrite: true, // (boolean) can overwrite or not (default true)
  httpOnly: true, // (boolean) httpOnly or not (default true)
  signed: true, // (boolean) signed or not (default true)
};

app.use(session(CONFIG, app));;
app.use(serve("web"));
app.use(serve("user"));

app.use(route.get("/", function*() { this.redirect(M.setting.home) }));
app.use(route.get("/view/:book/:file?", view));
// app.use(route.get("/locale/:locale", setLocale));
app.use(route.post("/save/:book/:file", save));
app.use(route.post("/signup", signup));
app.use(route.get("/createbook/:book", createBook));
app.use(route.post("/createbook/:book", createBook));
app.use(route.post("/login", login));
app.use(route.post("/logout", logout));
app.use(route.get("/search", search));
app.use(route.get("/myarea", function*() { 
  if (typeof this.session.user !== 'undefined')
    this.redirect("/view/"+this.session.user+"/");
  else
    this.redirect("/view/system/error.html");
}));
app.use(route.get("/userlist", userList));

co(function*() {
	yield M.init(__dirname);
	V.init(__dirname);
//  MT.init();
	var port = M.setting.port || 80;
	http.createServer(app.callback()).listen(port);
  // https version : in self signed certification
  // You can save & modify in SSL mode, no edit allowed in HTTP mode.
	var sslPort = M.setting.portSsl || 443;
  var keyPem  = yield io.readFile("setting/key.pem");
  var certPem = yield io.readFile("setting/cert.pem");
  var csrPem  = yield io.readFile("setting/csr.pem");
	https.createServer({
		key: keyPem,
		cert: certPem, 
		// The folowing is for self signed certification.
		requestCert: true, 
		ca: [ csrPem ]
	}, app.callback()).listen(sslPort);
	console.log("http  server started: http://localhost:"+port);
	console.log("https server started: http://localhost:"+sslPort);
});
