# C# 網路程式：HTTP 程式設計 (1) -- Server

## HTTP 協定簡介

HTTP 協定是 Web 的基礎，Web 是一個典型的 Client-Server 架構，主要由 HTTP+URL+HTML 所組成。

Web Server (網站伺服器) 是 WWW 網路的基礎， 1991 年 Tim Burner Lee 發明 HTML 與 URL 後，就自己寫了第一個
Web Server，導至後來 Web 網路的興起，因此、Tim Burner Lee被尊稱為 WWW 之父，然而、對於一般程式設計人員而言，
Web Server 的設計方法卻是個難解的謎，本篇文章將以一個簡單而完整的 Java 程式，讓大家了解 Web Server 的設計原理。

一個最簡單的 Web Server 之功能包含下列三個步驟:

* 步驟一 : 接收瀏覽器所傳來的網址。
* 步驟二 : 取出相對應的檔案。
* 步驟三 : 將檔案內容傳回給瀏覽器。


然而、在這個接收與傳回的過程中，所有的資訊都必須遵照固定的格式，規範這個接收/傳送格式的協定，稱為超文字傳送協定 
(Hyper Text Transfer Protocol)，簡稱為 HTTP 協定。

HTTP 協定格式的基礎，乃是建構在網址 URL 上的傳輸方式，早期只能用來傳送簡單的 HTML 檔案，後來經擴充後也可以傳送
其他類型的檔案，包含 影像、動畫、簡報、Word 文件等。

在本文中，我們將先簡介 HTTP 協定的訊息內容，然後在介紹如何以 Java 語言實作 HTTP 協定，以建立一個簡單的 Web Server。

HTTP 表頭：

當你在瀏覽器上打上網址(URL)後，瀏覽器會傳出一個HTTP訊息給對應的 Web Server，Web Server 再接收到這個訊息後，
根據網址取出對應的檔案，並將該檔案以 HTTP 格式的訊息傳回給瀏覽器，以下是這個過程的一個範例。


豬小弟上網，在瀏覽器中打上 http://ccc.kmit.edu.tw/index.htm，於是、瀏覽器傳送下列訊息給 ccc.kmit.edu.tw 這台電腦。

```
GET /index.htm HTTP/1.0
Accept: image/gif, image/jpeg, application/msword, */*
Accept-Language: zh-tw
User-Agent: Mozilla/4.0
Content-Length: 
Host: ccc.kmit.edu.tw
Cache-Control: max-age=259200
Connection: keep-alive

```

當 ccc.kmit.edu.tw 電腦上的 Web Server 程式收到上述訊息後，會取出指定的路徑 /index.htm ，然後根據預設的網頁根目錄 
(假設為 c:\web\)，合成一個 c:\web\index.htm 的絕對路徑，接著從磁碟機中取出該檔案，並傳回下列訊息給豬小弟的瀏覽器。

```
HTTP/1.0 200 OK
Content-Type: text/html
Content-Length: 438

<html>
  ....
</html>
```

其中第一行 HTTP/1.0 200 OK 代表該網頁被成功傳回，第二行 Content-Type: text/html 代表傳回文件為 HTML 檔案，
Content-Length: 438 代表該 HTML 檔案的大小為 438 位元組。


## HelloServer: 永遠傳回 Hello 的 WebServer

檔案 HelloServer.cs

```CS
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.IO;

public class HttpServer
{
    public static void Main()
    {
    	IPEndPoint ipep = new IPEndPoint(IPAddress.Any, 80);

    	Socket newsock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

    	newsock.Bind(ipep);
    	newsock.Listen(10);
    
    	while(true)
    	{
    	 Socket client = newsock.Accept();
    	 IPEndPoint clientep = (IPEndPoint) client.RemoteEndPoint;
    	
    	 // create a new thread and then receive message.
    	 HttpListener listener = new HttpListener(client);
    	 Thread thread = new Thread(new ThreadStart(listener.run));
    	 thread.Start();
    	}
//	  newsock.Close();
   }
}

public class HttpListener {
    Socket socket;

    public HttpListener(Socket s)
    {
    	socket = s;
    }

    public void run() 
    {
    	String msg = "Hello!";
    	String helloMsg = @"HTTP/1.0 200 OK\nContent-Type: text/plain\nContgent-Length: "+msg.Length+"\n\n"+msg;

    	NetworkStream stream = new NetworkStream(socket);
    	StreamReader reader = new StreamReader(stream);
    	String header = "";
    	while (true) 
    	{
    	 String line = reader.ReadLine();
    	 Console.WriteLine(line);
    	 if (line.Trim().Length==0)
    	 break;
    	 header += line+"\n";
    	}
    	socket.Send(Encoding.UTF8.GetBytes(helloMsg));
    	socket.Close();
    }
}
```

## 完整的 Web Server

專案程式下載：<https://dl.dropbox.com/u/101584453/cs/code/WebServer.zip>

請注意：此範例必須在專案中加入 System.Web 套件引用。

根據 HTTP 協定，我們以 C# 實作了一個 Web Server 程式 (WebServer.cs)，該程式是利用一個稱為 Socket 的物件來實作的，這個物件位於 C# 的網路函式庫 System.Net 中。

Socket 是根據博克萊 (U.C.Berkley) 大學早期發展的 Socket 概念寫成的，其設計理念是是將網路傳輸類比成檔案讀取與寫入 (傳送的動作被視為是寫入/接收的動作被視為是讀取)，如此、傳送與接收就簡化為程式人員比較容易懂的
讀取與寫入，降低了網路程式的學習困難度。

要使用 Socket 的方式寫網路程式，首先要登記網路的埠號 (port)，將該 port 占領下來，以防止其他程式使用該 port 而互相干擾，HTTP 協定所預設使用的是 port 80。

一但完成登記，就可以開始接受瀏覽器的請求，並根據請求回傳檔案訊息，以下程式為其 (接收/傳送) 程序的核心程式。

這個最簡單版以 Socket 的方式，不斷讀取資料直到發現有一空白行即結束，然而、這樣的程式是過度簡化的結果，無法處理有 POST 訊息的狀況，然而、何謂 POST 訊息呢 ?


所謂 POST 訊息、乃是 HTML 為了傳遞較大量的填表資料，所發展出來的一種訊息格式，以下是POST訊息的一個範例：

```
POST /getMsg.asp HTTP/1.0
Accept: image/gif, image/jpeg, application/msword, */*
Accept-Language: zh-tw
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/4.0
Content-Length: 66
Host: ccc.kmit.edu.tw
Cache-Control: max-age=259200
Connection: keep-alive

user=ccc&password=1234&msg=Hello+%21+%0D%0AHow+are+you+%21%0D%0A++
```

其中的HTTP的訊息開頭以 POST 取代原來的 GET ，並且多了一個 Content-Length:66 的欄位，該欄位指示了訊息結尾會有 66 個位元組的填表資料，這些資料會被編碼成特輸的格式以利在網路上傳遞。


一但取得了瀏覽器傳來的 GET 或 POST 訊息後，我們就可以根據其訊息，決定回應的方式，在 WebServer.java 中，我們只是單純的將對應的檔案取出，並附在回應的訊息表頭後傳回，其程式碼如下。

以上就是 Web Server 的簡單設計方式，若想了解更多細節，請直接閱讀 WebServer.java 檔並執行之，執行時請安裝好 Visual Studio  後，並於 WebServer.cs 的存檔路徑上打 csc WebServer.cs, 之後再打 WebServer 即可啟動，其執行畫面如下：

檔案： WebServer.cs

```CS
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.IO;
using System.Web;

public class WebServer
{
   public static void Main()
   {
      IPEndPoint ipep = new IPEndPoint(IPAddress.Any, 8085);

      Socket newsock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

      newsock.Bind(ipep);
      newsock.Listen(10);

      while(true)
      {
         Socket client = newsock.Accept();
         IPEndPoint clientep = (IPEndPoint) client.RemoteEndPoint;

         // create a new thread and then receive message.
         HttpListener listener = new HttpListener(client);
         Thread thread = new Thread(new ThreadStart(listener.run));
         thread.Start();
      }
   }
}

class HttpListener 
{
    String[] map ={"mpeg=video/mpeg", "mpg=video/mpeg", "wav=audio/x-wav", "jpg=image/jpeg", 
"gif=image/gif", "zip=application/zip", "pdf=application/pdf", "xls=application/vnd.ms-excel", 
"ppt=application/vnd.ms-powerpoint", "doc=application/msword", "htm=text/html", 
"html=text/html", "css=text/plain", "vbs=text/plain", "js=text/plain", "txt=text/plain", 
"java=text/plain"};
    Socket socket;
    NetworkStream stream;
    String header;
    String root = ".";

    public HttpListener(Socket s)
    {
        socket = s;
    }

    public void run() 
    {
        stream = new NetworkStream(socket);
        request();
        response();
        stream.Close();
    }

    public void send(String str) {
        socket.Send(Encoding.UTF8.GetBytes(str));
    }

    public static String innerText(String pText, String beginMark, String endMark)
    {
        int beginStart = pText.IndexOf(beginMark);
        if (beginStart < 0) return null;
        int beginEnd = beginStart + beginMark.Length;
        int endStart = pText.IndexOf(endMark, beginEnd);
        if (endStart < 0) return null;
        return pText.Substring(beginEnd, endStart - beginEnd);
    }

    public void request()
    {
    	try {
    	 StreamReader reader = new StreamReader(stream);
    	 header = "";
    	 while (true)
    	 {
    	 String line = reader.ReadLine();
    	 Console.WriteLine(line);
    	 if (line.Trim().Length == 0)
    	 break;
    	 header += line + "\n";
    	 }
    	} catch {
    	 Console.WriteLine("request error!");
    	}
    }

    void response() 
    {
      try 
      {
        Console.WriteLine("========response()==========");
        String path = innerText(header, "GET ", "HTTP/").Trim(); // 取得檔案路徑 : GET 版。
        HttpUtility.UrlDecode(path);
        String fullPath = root+path;
        FileInfo info = new FileInfo(fullPath);
        if (!info.Exists) 
            throw new Exception("File not found !");
        send("HTTP/1.0 200 OK\n");
        send("Content-Type: "+type(fullPath)+"\n");
        send("Content-Length: "+info.Length+"\n");
        send("\n");
        byte[] buffer = new byte[4096];
        FileStream fileStream = File.OpenRead(fullPath);
        while (true) 
        {
            int len = fileStream.Read(buffer, 0, buffer.Length);
            socket.Send(buffer, 0, len, SocketFlags.None);
            if (len < buffer.Length) break;
        }
        fileStream.Close();
      } catch {
    	try {
    	 send("HTTP/1.0 404 Error\n");
    	 send("\n");
    	} catch {
    	 Console.WriteLine("Send Error Msg fail!");
    	}
      }
    }

    String type(String path)
    {
        String type = "*/*";
        path = path.ToLower();
        for (int i = 0; i < map.Length; i++)
        {
            String[] tokens = map[i].Split('=');
            String ext = tokens[0], mime = tokens[1];
            if (path.EndsWith("." + ext)) type = mime;
        }
        return type;
    }
}
```

## 參考文獻
* How Java Web Servers Work - <http://www.onjava.com/pub/a/onjava/2003/04/23/java_webserver.html>
* JDK API : java.net.ServerSocket - <http://java.sun.com/j2se/1.4.2/docs/api/java/net/ServerSocket.html>
* Hypertext Transfer Protocol:HTTP/1.0 - <http://www.w3.org/Protocols/HTTP/1.0/draft-ietf-http-spec.html>
