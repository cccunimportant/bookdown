# C# 網路程式：HTTP 程式設計 (2) -- Client

## HTTP Client 端程式簡介

在 C# 當中，HTTP Client 端元件的主要物件有 WebClient 與 Browser 元件，其中的 WebClient 物件是一個單純用來下載網頁的程式，這樣的物件可以用來撰寫像 WebCrawler 這樣的搜尋引擎關鍵程式，用來抓取全世界的網頁。

有時我們需要將整個瀏覽器嵌入到視窗程式中，此時就可以使用 Browser 元件。事實上、Visual C# 當中的 Browser 元件就是 Internet Explorer (IE)，因此您可以很容易的用 Visual C# 做出類似 IE 的功能，並且與其他視窗程式進行互動。

## 單一網頁下載

```CS
using System;
using System.IO;
using System.Net;

class PageDwnloader
{
    public static void Main(String[] args)
    {
    	String text = fileToText(args[0]);
    	String[] urls = text.Split('\n');
    	for (int i = 0; i < urls.Length; i++)
    	{
    	 Console.WriteLine(i + ":" + urls[i]);
    	 UrlToFile(urls[i], i+".htm");
    	}
//	 Console.WriteLine(text);
    }

    public static String fileToText(String filePath)
    {
    	StreamReader file = new StreamReader(filePath);
    	String text = file.ReadToEnd();
    	file.Close();
    	return text;
    }

    public static void UrlToFile(String url, String file) {
    	WebClient webclient = new WebClient();
    	webclient.DownloadFile("http://"+url, file);
    }
}

```

## 網路爬蟲 WebCrawler 的設計

搜尋引擎是網際網路興起後最常被使用的工具之一，其主要技術包含前端的全文檢索與後端的網頁蒐集兩類，本文將介紹搜尋引擎後端的網頁蒐集技術 - 并且以 C# 語言實作一個100行左右的網頁蒐集程式 "網路爬蟲 (Crawler)", 然後說明其製作方法與原理。

Google 等搜尋網站的背後，都有一個強大的網頁蒐集程式，可以將全世界的網頁通通抓回去儲存以便提供搜尋之用，這個程式就稱為 "爬行者 (Crawler)"，也有人索性稱為蜘蛛 (Spider)，因為這個就好像在網路上爬來爬去的蜘蛛一樣，到處抓網頁回家放。

Crawler 的設計原理，簡要來說是透過程式去追蹤網頁上的超連結，然後不斷往外擴張，以便將全世界中曾經被連結到的網頁全部都抓回到來，這也是 Google, Baidu, Bing, Yahoo 等網站背後最重要的程式之一。

要啟動 Crawler，首先要給一個起始點，以下的範例是利用台灣的 tw.msn.com 網站作為起始點，然後不斷透過「透過連結抓取網頁、取出連結再抓網頁」的方式擴展出去，以下是 Crawler 的核心程式。

每當抓到新的網頁時，我們繪將其存檔，然後抽取出其中所有的超連結，並將這些超連結放入等待抓取的網址庫中，以便下次可以抓取該網頁。

檔案：WebCrawler.cs

```CS
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;

class WebCrawler
{
//    WebProxy proxy = new WebProxy("http://proxy.internal:3128/", true);
    List<String> urlList = new List<String>();
    // Dictionary<String, String> 

    public static void Main(String[] args)
    {
        WebCrawler crawler = new WebCrawler();
        crawler.urlList.Add("http://tw.msn.com/");
        crawler.craw();
    }

    public void craw()
    {
        int urlIdx = 0;
        while (urlIdx < urlList.Count)
        {
            try
            {
                String url = urlList[urlIdx];
                String fileName = "data/" + toFileName(url);
                Console.WriteLine(urlIdx + ":url=" + url + " file=" + fileName);
                urlToFile(url, fileName);
                String html = fileToText(fileName);
                foreach (String childUrl in matches("\\shref\\s*=\\s*\"(.*?)\"", html, 1))
                {
                    Console.WriteLine(childUrl);
                    urlList.Add(childUrl);
                }
            }
            catch
            {
                Console.WriteLine("Error:" + urlList[urlIdx] + " fail!");
            }
            urlIdx++;
        }
    }

    public static IEnumerable matches(String pPattern, String pText, int pGroupId)
    {
        Regex r = new Regex(pPattern, RegexOptions.IgnoreCase | RegexOptions.Compiled);
        for (Match m = r.Match(pText); m.Success; m = m.NextMatch())
         yield return m.Groups[pGroupId].Value;
    }

    public static String fileToText(String filePath)
    {
        StreamReader file = new StreamReader(filePath);
        String text = file.ReadToEnd();
        file.Close();
        return text;
    }

    public void urlToFile(String url, String file)
    {
        WebClient webclient = new WebClient();
//        webclient.Proxy = proxy;
        webclient.DownloadFile(url, file);
    }

    public static String toFileName(String url)
    {
        String fileName = url.Replace('?', '_');
        fileName = fileName.Replace('/', '_');
        fileName = fileName.Replace('&', '_');
        fileName = fileName.Replace(':', '_');
        fileName = fileName.ToLower();
        if (!fileName.EndsWith(".htm") && !fileName.EndsWith(".html"))
         fileName = fileName + ".htm";
        return fileName;
    }
}
```

以上的 Crawler 是搜尋引擎中的關鍵技術，在本文中我們實作了一個簡單的 Crawler ，這個程式可以用來作為個人抓取網頁個工具程式，作為建立搜尋引擎的基礎。

## Browser 的控制

教學錄影：
* C# 瀏覽器控制 1/3 -- <http://youtu.be/CIwYabPN7qA>
* C# 瀏覽器控制 2/3 -- <http://youtu.be/sJ6cfuL3-ZA>
* C# 瀏覽器控制 3/3 -- <http://youtu.be/YThlDxk-E7U>

專案程式下載：<https://dl.dropbox.com/u/101584453/cs/code/WebBrowser.zip>

在 C# 當中控制 Internet Explorer (IE) 瀏覽器是一件很簡單的事情，因為 .NET framework 當中已經將 IE 的 WebBrowser 內建成一個控制元件，只要利用這個控制元件中的網址 (Url) 欄位，以及瀏覽 Navigate(url)、向前 GoForward()、向後 GoBack() 
等函數，就可以輕鬆的控制瀏覽器元件的行為了。

檔案：WebBrowser.cs

```CS
using System;
using System.ComponentModel;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void buttonPrev_Click(object sender, EventArgs e)
        {
            webBrowser.GoBack();
        }

        private void buttonNext_Click(object sender, EventArgs e)
        {
            webBrowser.GoForward();
        }

        private void updateState()
        {
            buttonPrev.Enabled = webBrowser.CanGoBack;
            buttonNext.Enabled = webBrowser.CanGoForward;
            if (webBrowser.Url != null)
                comboBoxUrl.Text = webBrowser.Url.ToString();
        }

        private void buttonGo_Click(object sender, EventArgs e)
        {
            webBrowser.Navigate(comboBoxUrl.Text);
        }

        private void webBrowser_Navigated(object sender, WebBrowserNavigatedEventArgs e)
        {
            updateState();
        }

        private void comboBoxUrl_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
                webBrowser.Navigate(comboBoxUrl.Text);
        }
    }
}
```

您可以看到在 Visual C# 當中使用瀏覽器元件事非常容易的事情，這樣的功能可以讓您在應用程裏輕易的嵌入瀏覽器以便讓使用者看到某些網頁，讓 Web 程式的開發變得輕鬆且愉快。

