# C# 程式基礎：變數與運算式

## 簡介

以下是一個完整的 C# 程式 (Hello.cs)，可以印出 Hello !。

```CS
using System;                           // 引用 System 函式庫

public class Hello                      // 宣告類別 Hello
{
   public static void Main()            // 類別 Hello 的主程式
   {
      Console.WriteLine("Hello !");     // 印出 Hello !
   }
}
```

如果您將上述程式加入到 Visual C# Express 的空專案中，就可以直接執行之。如果您會使用命令列的 csc 編譯器，就可以用下列指令將該程式編譯成執行檔 Hello.exe，然後您就可以在命令列中輸入 Hello 指令執行該程式。

```
    C:\>csc Hello.cs
    C:\>Hello
    Hello!
```

對於初學程式設計的人而言，我們還需要很長的一段時間才能完全理解上述程式中每個指令的意義，先讓我們從最基本的變數與型態開始熟悉 C# 語言。

## 變數與型態

變數是程式用來儲存資料的地方，程式透過變數存取資料，並透過指定敘述 (Assign) 搬移資料。舉例而言，假如我們希望設定變數 X 為 3，可以用 X=3 的運算式，若我們希望將 Y 的內容複製給 X ，則可以用  X=Y 這個指定敘述。

C# 是一個強型態的語言，每個變數都必須要指定型態，C# 中常用的基本型態包含字元 (char)、整數 (int)、實數 (float)、字串(string) 、布林 (bool) 等，以下是這些基本型態的一些範例。

```CS
    int a = 3, b = a;          // 整數
    double pi = 3.14;          // 浮點數
    char c = 'H';              // 字元
    string msg = "Hello!";     // 字串
    bool x = true, y = false;  // 布林 (邏輯)
    string str = "a=" + a + " b=" + b;
    Console.Write(str);
```

+ 運算式
程式語言當中的指定運算式，通常用 = 符號代表，其意義與數學當中的等號不同，請看下列範例。

```CS
    int x = 3, y = 5;
    x = y;
```

在上述範例中，x, y 分別被設定為 3 與 5，因此若以數學式的看法, x=y 是不成立的，但是在 C# 當中，若我們想判斷 X 與 Y 是否相等，應該用兩個等號的  x==y 表達。與此不同的是，上述範例中的 x=y 是指定的意思，也就是將 y 當中的 5 複製一份給 x，於是 x 的值也就變成 5 了。

C# 語言中的加減乘除等運算，基本上與數學的定義類似，因此，您可以寫出下列的運算式，該運算是依照先乘除後加減的順序，結果會設定 x 的值為 19。

```CS
    int x = 3 * 5 + 8 / 2;
```

C# 語言承襲了 C 語言的許多語法，遞增運算 (x++), 移位運算 (x < < 2), 邏輯運算 (&& , | |, !) 等，其語法都與 C 語言一致。


遞增運算 ++ 的意義，是將該變數加上 1，而遞減運算 --  的意義，則是將該變數減去 1，所以 x++ 代表將變數 x 加上 1，等同於 x=x+1 的結果，而 x-- 代表將變數 x 減去 1，等同於 x = x - 1 的結果。

移位運算 < < 的意義，代表左移，而 > > 則是右移的意思。舉例而言，x < < 2 代表將 x 視為位元串，並且向左移兩位。因此若 x  是一個值為 2 的整數 (int) ，由於其二進位表達式為 00000010。所以當我們執行運算式 x = x< <2 後，x 將會變成 00001000，也就是十進位的 8，請看下列範例。

```CS
    int x = 2;    // x = 00000010 = 2
    x = x << 2;   // x = 00001000 = 8
```

邏輯運算 ! 是邏輯反閘 (not) 的意思，此運算會將真假值顛倒，也就是 !true = false, !false = true。

邏輯運算 && 是邏輯且 (AND) 的意思，只有當 X 與 Y 兩者均為真 (true) 時， X && Y 才會為真，否則 X&&Y 將會是假 (false) 值。

邏輯運算 | | 是邏輯或 (OR) 的意思，只要 X 與 Y 兩者當中有一個為真 (true) 時， X || Y 就會為真。

下列範例顯示了 C# 當中的邏輯運算式用法。

```CS
    bool x = true, y = false;
    bool a = x && y;   // a = true and false = false
    bool b = x || y;   // b = true or false = true
    bool c = !x;       // c = !true = false 
```

C# 由於繼承了 C 語言的運算式語法，因此在位元邏輯上也採用 & 代表逐位元的 AND 運算，而 | 代表 逐位元的 OR 運算。舉例而言，下列範例中的 x & y 之結果為 1， x | y 的結果為 7。

```CS
    int x = 3, y = 5;
    int a = x & y;      // a=00000011 AND 00000101 = 00000001 = 1
    int b = x | y;      // b=00000011 OR 00000101 = 00000111 = 7
```

## 測驗

請寫出以下程式的輸出：

```CS
    int x = 3, y = 5;
    x = y;
    x = x << 2;

    bool t = true, u = false;
    bool a = t && u;   // a = true and false = false
    bool b = t || u;   // b = true or false = true
    bool c = !u;       // c = !false = true

    int d = x & y;      // d=00010100 AND 00000101 = 00000100 = 4
    int e = x | y;      // e=00010100 OR  00000101 = 00010101 = 21
```

## 結語

萬事起頭難，學習程式設計尤其是如此。雖然到目前為止我們只學習了 C# 當中的基本運算與變數宣告，但這兩個主題卻是所有程式語言都必須要具備的。有了這些基礎，我們才能開始學習 if 判斷語句和 for, while 等迴圈語法。

## 參考文獻
* C# 程式設計人員參考
    * C# 教學課程：http://msdn.microsoft.com/zh-tw/library/aa288436(VS.71).aspx
    * Hello World 教學課程：http://msdn.microsoft.com/zh-tw/library/aa288463(VS.71).aspx
    * 命令列參數教學課程：http://msdn.microsoft.com/zh-tw/library/aa288457(VS.71).aspx
    
    