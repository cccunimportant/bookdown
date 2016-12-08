var fs = require('mz/fs');
var showdown = require('showdown');
var handlebars = require('handlebars');
var koa = require('koa');
var serve = require('koa-static');
var route = require('koa-route');
var path = require('path');

var userPath = path.join(__dirname, 'user');

var render = { 
  view:handlebars.compile(fs.readFileSync("render/view.html", "utf8")),
}

function *view(book, file) { // view(mdFile):convert *.md to html
  var bookPath = path.join(userPath, "/book/"+book);
	var filePath = path.join(userPath, "/book/"+book+"/"+file);
	var fstat = yield fs.stat(filePath);
	if (fstat.isFile()) {
		if (this.path.endsWith(".md")) {
			this.type = "html";
			var md = yield fs.readFile(filePath, "utf8");
			var bookJson = yield fs.readFile(bookPath+"/book.json", "utf8");
			var book = JSON.parse(bookJson);
			book.html = converter.makeHtml(md);
			var page = render.view(book);
			this.body = page;
		} else {
			this.type = path.extname(this.path);
			this.body = fs.createReadStream(filePath);
		}
	}
}

var app = koa();
var converter = new showdown.Converter();
converter.setOption('tables', true);

app.use(serve(path.join(__dirname, 'web')));
app.use(serve(userPath));

app.use(route.get('/', function*() { this.redirect('/view/markdown/README.md') }));
app.use(route.get('/view/:book/:file', view));


if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
