# 異動紀錄 14-tableServer

修改 /user/book/... 為 /data/book/...
加入 /data/user/...
加入 /data/system/...

在 /data/system/ 中放入下列《系統表格》

user | book | relation
----------------------------------
ccc  | markdown | editor
snoopy | history | editor
ccc | bajiu | editor
snoopy | markdown | coeditor
ccc | history | coeditor

每個 user 都有一本 profile 的書，在 /data/user/ 裡面

data/user/ccc/README.md
data/user/ccc/profile.md
data/user/ccc/system.md

# 異動紀錄 13-searchServer

加入全文檢索介面

# 異動紀錄 13-file2mongodb

```
D:\Dropbox\github\road_to_bookdown\13-files2mongodb>node files2mongo.js
path=/ file=bajiu
path=/ file=markdown
path=/bajiu/ file=book.json
path=/bajiu/ file=README.md
path=/markdown/ file=book.json
path=/markdown/ file=CC-BY-SA_icon.svg
path=/markdown/ file=markdown.md
path=/markdown/ file=math.md
path=/markdown/ file=README.md
path=/markdown/ file=table.md
fileList=["bajiu/book.json","bajiu/README.md","markdown/book.json","markdown/CC-
BY-SA_icon.svg","markdown/markdown.md","markdown/math.md","markdown/README.md","
markdown/table.md"]
[誠] 轉碼後全文檢索=[{"_id":"584f597e5dc67e9a9a53b0e2","path":"markdown/table.md
","md":"# 表格\n\n| 姓名   | email               |\n|--------|------------------
---|\n| 陳鍾誠 | <ccckmit@gmail.com> |\n| Snoopy | <snoopy@gmail.com>  |\n\n","k
eywords":"8868 683c 59d3 540d 9673 937e 8aa0"}]
```

# 異動紀錄 12-mvcServer

```
model : lib/model.js
view  : lib/view.js   + view/*.html
controller  : server.js
```

# 異動紀錄 11-loginServer

```
user : ccc
password: 1234
```

# 異動紀錄 10-editServer

考慮使用 Fetch API : https://github.com/camsong/blog/issues/2


# 異動紀錄 09-katexRendering

## 異動檔案： user/book/markdown/math.md

加入最後那個會大字體置中的數學式。

```
\int_0^{\infty} f(x) dx
```

$$\int_0^{\infty} f(x) dx$$


$$
\int_0^{\infty} f(x) dx
$$

## 異動檔案 : render/view.html


修改加入下列段落，於是可以在前端呈現 tex 數學式

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.css">

...

<script>
var htmlBox = document.getElementById("htmlBox");

function texRender(text) {
  var tex1 = text.replace(/\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$/gi, function(flag,match,end){
		return katex.renderToString(match, { displayMode: true });
  });
	var tex2 = tex1.replace(/\$\$([^$]+)\$\$/gi, function(flag,match,end){
		return katex.renderToString(match);
  });
	return tex2;
}

function load() {
	htmlBox.innerHTML = texRender(htmlBox.innerHTML);
}
</script>

...
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.js"></script>

...

```