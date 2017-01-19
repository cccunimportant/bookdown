# C# 程式基礎：簡介與開發環境

C# 是微軟所設計的一種物件導向語言，其設計理念受到 C 與 Java 語言的影響，採用類似 C 語言的語法，並使用類似 Java 語言的虛擬機架構，具備物件導向的能力，是微軟在其主力平台 .NET 上最重要的開發語言。

## Visual Studio 安裝

要使用 C# 開發程式，必須安裝 Visual C# Express 或是 Visual Studio，其中 Visual C# Express 是免費的，您可以下列網址當中下載其安裝程式。

* Visual C# express 中文版 -- <http://www.microsoft.com/visualstudio/cht/downloads>

Visual C# Express 的安裝相當簡單，筆者在此不加以說明，但若您希望能在安裝前先預習一遍，可以參考下列網頁的安裝過程。

* 佳新的部落格 - 下載並安裝Visual C# 2008 Express中文版 -- <http://jarsing.blogspot.com/2009/01/visual-c-2008-express.html>

Visual Studio 是一個功能很強大的整合開發環境，包含視覺化設計模式、整合除錯環境、方便的程式編輯環境等等。因此，大部分人都會使用 Visual Studio 作為 C# 的開發工具。

目前 Visual Studio 可分為三個版本，企業版 (Enterprise Edition)、專業版 (Professional Edition) 以及簡潔版 (Express Edition)，其中企業版與專業版是需要付費購買的，而簡潔版則是免費的。通常一般的學習者使用簡潔版就綽綽有餘了，簡潔版的功能其實已經相當強大，除了缺少一些系統分析、團隊合作、以及企業報表等工具之外，其他的部分，像是視覺化設計模式、整合除錯環境、方便的程式編輯環境等，都已經包括在內，因此相當適合學生學習使用。

* Visual Studio 2012 Express for Windows Desktop -- <http://www.microsoft.com/visualstudio/cht/downloads>

當您下載並安裝完畢後，可以直接從微軟視窗系統中的「開始/所有程式/Microsoft Visual 2010 Express」這個路徑啟動簡潔版的開發環境。在這個環境中，使用編輯程式、除錯或使用視覺化設計模式，這是相當方便的一個工具。

## 命令列工具

微軟的 C# 語言的編譯器是 csc.exe 這個執行檔，這個檔案通常被安裝在 \WINDOWS\Microsoft.NET\Framework 的路徑下。舉例而言，在我的電腦中，就可以在下列路徑中找到這個檔案。

    C:\WINDOWS\Microsoft.NET\Framework\v3.5

如果您安裝的是專業版，您可以在「開始/所有程式/Microsoft Visual Studio 2008/Visual Studio Tools/Visual Studio 2008 命令提示字元」這個功能表選項中，啟動 Visual Studio 的命令列工具。如此您可以使用命令列的方式，對程式進行編譯與執行的動作。

舉例而言，您可以使用「csc 檔案名稱」的指令，編譯特定的 C# 程式，像是下列指令就可以將 Hello.cs 編譯為 Hello.exe。

    csc Hello.cs

在某些時候，特別是開發網路程式的時候，命令列會比整合開發環境更方便使用，因此您可以自行決定何時應該用哪一種方式進行編譯。

由於微軟是目前軟體界最大的公司，並且極力推廣 C# 與 .NET 平台，這使得 C# 所支援的程式領域特別廣泛，除了命令列程式之外，C# 還常用在視窗、資料庫、網路、網頁、手機、遊戲等領域，其應用的廣泛性是其他語言所難以趕上的。

以下，我們分別就這些領域，逐一進行介紹。

## 視窗程式設計

C# 可用來撰寫 MS. Windows 作業系統上的視窗程式。微軟目前的視窗開發套件有兩種，比較舊但卻很成熟的一種稱為 Window Forms，比較新但卻較少人用的一種稱為 WPF (Windows Presentation Foundation)。

Window Forms 採用的是物件導向的視覺化設計元件，您可以用拖拉的方式，輕易的設計出視窗介面，然後利用事件驅動的方式，撰寫該事件的處理程式，像是滑鼠被按下，鍵盤被按下等都會觸發視窗系統中的事件。

WPF 的設計雖然也是物件導向式的，但是為了網路化的考量，微軟創造了一個稱為 XAML 的 XML 規格，讓使用者可以撰寫 XAML 語法以創建使用者介面。這種做法與 Google 在 Android 平台上的做法有點類似，但是直到目前為止，這些規格仍然沒有受到瀏覽器的支援，因此用 XAML 設計使用者介面的必要性並不強烈，筆者仍建議採用 Window Forms 撰寫程式。

## 資料庫

微軟設計的開發工具，通常都會極力支援自家的產品，因此在 C# 當中最容易使用的是MS. SQL 與 Access 資料庫。但是由於這兩個資料庫都是要收費的，因此對於經費有限的個人而言，並不適當。但是如果您有 MS. SQL 或 Access 等軟體，就會感覺到微軟在資料庫上的用心，因為這是微軟主要的獲利來源。

## 網路

微軟的 .NET 平台除了支援傳統的 TCP/IP 網路基礎函式庫 Socket 之外，還設計了許多新的網路物件，像是 HTTP 的 WebRequest 等，這些物件可以讓程式設計者更省力的設計出網路程式。但是以筆者觀點，Socket 函式庫仍然是最重要的，因為使用 Socket 函式庫可以讓你清楚的理解網路程式的運作原理，直接透過 TCP/IP 掌握通訊程式的精隨。

## 網頁

微軟的網頁伺服器 IIS (Internet Information Server) 當中，所使用的開發環境稱為  ASP.NET，這是從過去的 ASP (Active Server Pages) 所延伸而來的。在 ASP.NET 當中支援了 C# 與 VB 等兩種開發語言，您可以輕易的使用 Visual Studio 進行 ASP.NET 的程式開發。

## 手機

微軟的手機從 Smart Phone 開始，經過 Windows Mobile、Windows Phone 一直到現在的 Windows 8，一開始帶出了智慧型手機的概念，但是卻受到 iPhone 與 Android 的夾殺，目前仍然無法成為智慧型手機與平版的主流。

不過微軟最強的部份是在桌上型電腦，如果能將手機、平板、遊戲機 XBox、筆電與桌上型電腦的生態系建構好，或許還有機會在市場上與 Apple, Google 等公司一爭長短。

## 遊戲

微軟在 2007 年推出了 XNA 遊戲開發平台，讓程式設計者可以利用 C# 語言開發遊戲程式，並且可以將這些遊戲放到 PC、XBOX 與 Zune 等裝置上執行，這對想要學習遊戲程式設計的人而言，是一個很好的開發平台。在 XNA 出現之前，遊戲公司都必須購買昂貴的遊戲設計軟體，以便開發遊戲程式。因此遊戲程式成了遊戲公司人員的商業秘密，但是在 XNA 出現之後，個人或者工作室都可以利用 C# 語言，直接開發出遊戲程式，而不需要購買那些昂貴的設計軟體。這對想學習遊戲程式設計的人而言是一個很好的消息，遊戲的開發因 XNA 而變得普及了。

要撰寫 XNA 遊戲程式，您必須安裝 XNA Game Studio 套件於 Visual C# Express 當中，您可以從下列 MSDN 網址中取得該套件。

* <http://www.microsoft.com/downloads/details.aspx?FamilyID=80782277-d584-42d2-8024-893fcd9d3e82&displaylang=en>

## 跨平台的考量

假如您希望讓 C# 程式在 UNIX/Linux/FreeBSD/MAC OS X 等平台上執行，也可以採用 Novell 公司所主導的 Mono 計畫，該計畫已經發展出一套跨平台的函式庫，讓您可以輕易的將 C# 程式放到非微軟的平台執行，Mono 計畫的網址如下。

* <http://www.mono-project.com/>

## 最新的發展

C# 語言在 3.0 版當中，加入了許多方便的新語法，像是匿名函數、資料查詢語言 Linq 等等，這些新功能讓 C# 語言超越了 Java ，成為簡單又強大的語言，有興趣的讀者可以觀看下列網頁當中的說明，該文章對 C# 3.0 的功能有簡單且扼要的介紹。

* 搖擺天秤的程式開發日誌： <http://richielin-programer.blogspot.com/2008/02/visual-c-30.html>

## 結語

雖然我並不是微軟的擁護者，甚至還有點反微軟的傾向，但是我仍然選擇了用 C# 為主要的開發語言。原因是 C# 的用途相當廣泛，支援的體系很完整，Visual C# Express 也很好用，而且我是個實用主義者。

我需要撰寫 Windows 當中的視窗程式、網路程式與遊戲程式，因此我使用 C# 與 Visual C# Express。

在本文中，我們簡單介紹了 C# 程式語言開發環境 - Visual C# Express 與 Visual Studio 等工具的安裝與使用方式。當然，我們無法完整的介紹這些工具的所有功能，只能將最常用的幾種方式簡要的說明一下，以幫助初學者能順利的進入 C# 程式開發的領域。

## 參考文獻
* 賴榮樞 的軟體資訊誌: Hello C# 編譯執行 console 程式, 2008/01 -- <http://www.goodman-lai.idv.tw/2008/01/hello-c-console_3469.html>
