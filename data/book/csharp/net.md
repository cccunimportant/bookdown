# C# 網路程式：簡介、IP 與 URL

## 簡介
最常被使用的網路函式庫稱為 [Socket](http://en.wikipedia.org/wiki/Internet_socket)，這個名詞起源於柏克萊大學於 1983 年所釋放出來的 [Berkeley Sockets](http://en.wikipedia.org/wiki/Berkeley_sockets) 函式庫，該函式庫將網路視為串流。因而使存取網路的動作，與存取檔案一樣，都可以透過串流機制運行。

雖然 Socket 函式庫將網路抽像化為串流，但是理解網路的架構對程式的學習仍有很大的幫助，目前我們所使用的 Internet 網路是基於 TCP/IP 的網路架構，要能理解目前的網路程式架構，首先要從 TCP/IP 的架構下手。

### TCP/IP 網路架構
網路的 OSI 參考模型將網路的層次分為七層，但是 TCP/IP 架構所依據的 ARPANET DoD 模型則只有四層，兩者之間存在某種對應關係，這個對應關係顯示於下圖當中，能正確的理解該圖，將有助於程式設計師理解網路程式的原理。

層次     OSI         TCP/IP    協定範例
----     -------     --------  ----------------------------------------------------------------------
7        應用層      HTTP      HTTP、SMTP、SNMP、FTP、Telnet、<BR/> SIP、SSH、NFS、RTSP、XMPP、Whois、ENRP
6        表示層                XDR、ASN.1、SMB、AFP、NCP
5        會話層                ASAP、SSH、ISO 8327 / CCITT X.225、<BR/>RPC、NetBIOS、ASP、Winsock、BSD sockets
4        傳輸層      TCP/UDP   TCP、UDP、TLS、RTP、SCTP、SPX、ATP、IL
3        網路層      IP        IP、ICMP、IGMP、IPX、BGP、OSPF、RIP、<BR/>IGRP、EIGRP、ARP、RARP、 X.25
2        鏈結層                乙太網、令牌環、HDLC、幀中繼、ISDN、<BR/>ATM、IEEE 802.11、FDDI、PPP
1        實體層                線路、無線電、光纖

舉例而言，當我們使用 TCP 的方式傳輸訊息時，由於 TCP 傳輸層會自動維持封包排列的順序，因此先傳送的封包一定會先到達，這讓程式設計師不需要擔心封包的先後順序問題。但在使用 UDP 傳輸的時候，先傳送的封包可能反而會後到達，因此訊息的順序將無法確保，這種 UDP 傳送方式雖然較快，但是卻較不方便，通常只被使用在強調速度的領域，像是立即影音傳輸的應用上。

![圖、OSI 與 TCP/IP 的層次對應圖](1000px-IP_stack_connections.svg.png)

![圖、UDP 的封包](UDP_encapsulation.svg.png)

### 基於 HTTP 的 Web
HTTP 是 Web 全球資訊網 (萬維網) 的基礎協定，該協定架構在 TCP/IP 架構之上，屬於應用層的協定。構成 HTTP 的主要兩個應用程式是瀏覽器 (Browser) 與網站 (Web Server)。HTTP 是一個典型的 Client-Server (客戶端-伺服端) 架構的協定，使用者透過 Client 端的瀏覽器連結到 Server 的伺服器，然後由伺服端將結果以 HTML 的網頁格式傳回。 HTML 的網頁當中包含了許多超連結 (Hyperlink)，這些超連結連接到某些網址 (URL)，於是使用者可以透過瀏覽器中的超連結，進一步點選其他的網頁，進行網路瀏覽 (衝浪) 的行為。

### Socket 函式庫
目前大部分的程式語言與平台 (像是 Java, C#, .NET, UNIX, Linux, ....) 都已經支援了 Socket 函式庫。但是由於語言與設計者的不同，這些 Socket 函式庫的使用方式都略有差異。在 C# 最常使用的是微軟 .NET 平台當中 的 Socket 函式庫，這個函式庫相當的成熟，除了將 TCP/IP 封裝成 Socket 函式庫之外，微軟甚至進一步將 HTTP 、加解密、甚至是高階的 Web  服務等機制，都包含在 .NET 平台當中，因此 C# 的程式設計師可以很輕易的寫出網路應用程式。

Socket 函式庫與 TCP/IP/HTTP 等層級的協定，是學習網路程式的基礎，接下來，我們將會進一步以範例說明網路程式的架構。

## IP 層的程式設計

IP 是 TCP/IP 架構當中代表網址的層次，在撰寫 C# 網路程式時，幾乎每個程式都會用到 IP 層的物件，像是 IPAddress，IPEndPoint 等。我們將在本文當中介紹這些物件的使用方式。

IPAddress 物件代表一個 IP 網址，像是 210.59.154.30 就是一個 IP。在一個大機構當中，由於有自身的內部網路，因此 IP 通常也分為對內與對外兩種。舉例而言，筆者在金門技術學院電腦的內部 IP 是 192.168.60.155，外部 IP 是 210.59.154.30。學校內部的電腦可以透過內部 IP 192.168.60.155 連接到該電腦，但是校外的電腦就只能透過外部 IP 210.59.154.30 連結到該電腦。

但是，IP 畢竟是不好記的數字，因此就發展出了 DNS (Domain Name Server, 網域名稱伺服器) 機制，用來將文字型的網址對應到數字型的 IP，這個文字型的網址稱為 URL (Universial Resource Locator)。

### 操作實驗

```
C:\Documents and Settings\ccc.CCC-KMIT2>ipconfig /all

Windows IP Configuration

        Host Name . . . . . . . . . . . . : ccc-kmit3
        Primary Dns Suffix  . . . . . . . :
        Node Type . . . . . . . . . . . . : Mixed
        IP Routing Enabled. . . . . . . . : No
        WINS Proxy Enabled. . . . . . . . : No
        DNS Suffix Search List. . . . . . : internal

Ethernet adapter 區域連線:

        Connection-specific DNS Suffix  . : internal
        Description . . . . . . . . . . . : Broadcom NetLink (TM) Gigabit Ethernet
        Physical Address. . . . . . . . . : 00-01-6C-95-20-52
        Dhcp Enabled. . . . . . . . . . . : Yes
        Autoconfiguration Enabled . . . . : Yes
        IP Address. . . . . . . . . . . . : 192.168.60.155
        Subnet Mask . . . . . . . . . . . : 255.255.255.0
        Default Gateway . . . . . . . . . : 192.168.60.254
        DHCP Server . . . . . . . . . . . : 192.168.1.252
        DNS Servers . . . . . . . . . . . : 10.10.10.3
                                            10.10.10.10
        Primary WINS Server . . . . . . . : 10.10.10.20
        Lease Obtained. . . . . . . . . . : 2010年3月8日 上午 09:45:01
        Lease Expires . . . . . . . . . . : 2012年2月6日 上午 09:45:01

C:\Documents and Settings\ccc.CCC-KMIT2>nslookup ccc.kmit.edu.tw
Server:  ns1.kmit.edu.tw
Address:  10.10.10.3

Name:    ccc.kmit.edu.tw
Address:  192.168.60.155

C:\Documents and Settings\ccc.CCC-KMIT2>nslookup tw.yahoo.com
Server:  ns1.kmit.edu.tw
Address:  10.10.10.3

Non-authoritative answer:
Name:    tw-tpe-fo.fyap.b.yahoo.com
Address:  119.160.246.241
Aliases:  tw.yahoo.com, tw-cidr.fyap.b.yahoo.com

C:\ccc>nslookup
Default Server:  ns1.kmit.edu.tw
Address:  10.10.10.3

> server dns.hinet.net
Default Server:  dns.hinet.net
Address:  168.95.1.1

> ccc.kmit.edu.tw
Server:  dns.hinet.net
Address:  168.95.1.1

Non-authoritative answer:
Name:    ccc.kmit.edu.tw
Address:  203.72.226.32
```

### IP 層程式範例 1

範例：建立 IPAddress 與 IPEndPoint。

檔案： IPAddressTest.cs

```CS
using System;
using System.Net;

class IPAddressTest {
    static void Main() {
        // 建立一個 IP 位址 (IPAddress)。
        IPAddress ipAddr = IPAddress.Parse("210.59.154.30");
        Console.WriteLine("ipAddr="+ipAddr);

        // 建立一個 IP 終端 (IPEndPoint = ipAddress + port)。
        IPEndPoint ipEndPoint = new IPEndPoint(ipAddr, 80);
        Console.WriteLine("ipEndPoint=" + ipEndPoint);

        // 將IPEndPoint序列化為SocketAddress
        SocketAddress socketAddr = ipEndPoint.Serialize();
        Console.WriteLine("socketAddr=" + socketAddr);
    }
}
```

執行結果：

```
D:\CSharp>csc IPAddressTest.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.

D:\CSharp>IPAddressTest
ipAddr=210.59.154.30
ipEndPoint=210.59.154.30:80
socketAddr=InterNetwork:16:{0,80,210,59,154,30,0,0,0,0,0,0,0,0}
```

範例：取得主機名稱

檔案：IpToHost.cs

```CS
using System;
using System.Net;
using System.Net.Sockets;

class IpToHost
{
    static void Main(String[] args)
    {
        IPAddress ipAddr = IPAddress.Parse(args[0]);

        // 透過DNS找尋IP位址相對應之主機名稱 
        IPHostEntry remoteHostEntry = Dns.GetHostEntry(ipAddr);

        Console.WriteLine("host of ip " + ipAddr + " is " + remoteHostEntry.HostName);
    }
}
```

執行結果：

```
D:\CSharp>csc IpToHost.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.

D:\CSharp>IpToHost 210.59.154.30
host of ip 210.59.154.30 is 210.59.154.30

D:\CSharp>IpToHost 119.160.246.241
host of ip 119.160.246.241 is w1.www.vip.tw1.yahoo.com
```

## URL 、DNS 與網址剖析

範例：使用 DNS 查詢 IP

檔案：DnsTest.cs

```CS
using System;
using System.Net;

class DnsTest
{
    static void Main(String[] args)
    {
        IPHostEntry hostEntry = Dns.GetHostEntry(args[0]);

        // 由於主機有可能有一個以上的 Alias
        // 因此程式中以迴圈方式判斷 Aliases 
        string[] aliasList = hostEntry.Aliases;

        for (int i = 0; i <= aliasList.Length - 1; i++)
        {
         Console.WriteLine("Alias "+i+" : "+aliasList[i]);
        }

        // 由於主機有可能有一個以上的 IP Address
        // 因此程式中以迴圈方式判斷 AddressList 
        IPAddress[] addrList = hostEntry.AddressList;

        for (int i = 0; i <= addrList.Length - 1; i++)
        {
         Console.WriteLine("Address " + i + " : " + addrList[i]);
        }
    }
}
```

執行結果

```
D:\CSharp>DnsTest tw.yahoo.com
Address 0 : 119.160.246.241
```

範例：剖析網址 URL

檔案：UrlParseTest.cs

```CS
using System;
using System.Net;

class UrlParseTest
{
    static void Main(String[] args)
    {
        // 由於 DOS 的命令列會以 & 符號做命令分隔字元，因此、若以指令模式下，網址中的 & 之後會被視為是下一個指令
        System.Uri URL = new System.Uri("http://findbook.tw/search?keyword_type=keyword&t=xxx");
//        System.Uri URL = new System.Uri(args[0]);
        // System.Uri類別之屬性
        Console.WriteLine("AbsolutePath: " + URL.AbsolutePath);
        Console.WriteLine("AbsoluteUri: " + URL.AbsoluteUri);
        Console.WriteLine("Authority: " + URL.Authority);
        Console.WriteLine("Host: " + URL.Host);
        Console.WriteLine("Port: " + URL.Port);
        Console.WriteLine("LocalPath: " + URL.LocalPath);
        Console.WriteLine("IsDefaultPort: " + URL.IsDefaultPort);
        Console.WriteLine("IsFile: " + URL.IsFile);
        Console.WriteLine("PathAndQuery: " + URL.PathAndQuery);
        Console.WriteLine("Query: " + URL.Query);
        Console.WriteLine("Scheme: " + URL.Scheme);
        Console.WriteLine("UserEscaped: " + URL.UserEscaped);
//        Console.WriteLine("UserInfo: " + URL.UserInfo);
    }
}
```

執行結果

```
C:\ccc>csc UrlParseTest.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.

C:\ccc>UrlParseTest
AbsolutePath: /search
AbsoluteUri: http://findbook.tw/search?keyword_type=keyword&t=xxx
Authority: findbook.tw
Host: findbook.tw
Port: 80
LocalPath: /search
IsDefaultPort: True
IsFile: False
PathAndQuery: /search?keyword_type=keyword&t=xxx
Query: ?keyword_type=keyword&t=xxx
Scheme: http
UserEscaped: False
```

## 結語

微軟 C# 的 IP 層物件主要是 IPAddress 與 IPEndPoint，另外 IPHostEntry可以用來代表 URL，也可以用 Dns.GetHostEntry() 查詢主機名稱。這些是 C# 較常使用的 IP 層物件。

