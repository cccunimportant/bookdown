# C# 程式基礎：檔案處理

C# 當中的檔案主要以串流 (Stream) 的形式呈現，串流讀取器 (StreamReader) 與串流寫入器 (StreamWriter) 是兩個主要的檔案處理類別。另外像 File，FileInfo, DirectoryInfo 等，則是用來存取檔案屬性與資料夾的類別。而BufferedStream、FileStream、MemoryStream、NetworkStream 則是分別對應到緩衝、檔案、記憶體、網路等類型的串流物件。因此串流可以說是檔案與網路的共同介面。

## 讀取檔案

以下範例中的 fileToText() 函數，會將一個文字檔讀入放到字串中傳回，其方法是利用 StreamReader 物件，指定所要讀取的檔案，然後利用 readToEnd() 函數讀取整個文字檔，再用 Close() 函數關閉該檔案。

```CS
using System;
using System.IO;

class FileTest 
{
    public static void Main(String[] args)
    {
    	String text = fileToText(args[0]);
    	Console.WriteLine(text);
    }

    public static String fileToText(String filePath)
    {
    	StreamReader file = new StreamReader(filePath);
    	String text = file.ReadToEnd();
    	file.Close();
    	return text;
    }
}
```

上述範例的執行結果如下所示，必須注意的是，Hello.txt 檔案必須存在，而且儲存成 Unicode 的 UTF8 格式，這是因為 C# 內部預設使用 Unicode 的編碼格式。如果希望讀取 Big5 (或 GB2312) 格式的檔案，必須在 StreamReader() 建構函數當中，指定StreamReader file = new StreamReader(filePath, System.Text.Encoding.GetEncoding("Big5")) ，如此 StreamReader 才會以 Big5 的編碼方式對檔案進行讀取，結果才不會變成亂碼。

```
D:\>csc FileTest.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.

D:\>FileTest Hello.txt
Hello !
你好 !
```

## 寫入檔案

```CS
using System;
using System.IO;

class FileTest
{
    public static void Main(String[] args)
    {
        String text1 = "Hello, C#!";
        String file = "Hello.txt";
        textToFile(file, text1);
        String text2 = fileToText(file);
        Console.WriteLine(text2);
    }

    public static String fileToText(String filePath)
    {
        StreamReader file = new StreamReader(filePath);
        String text = file.ReadToEnd();
        file.Close();
        return text;
    }

    public static void textToFile(String filePath, String text)
    {
        StreamWriter file = new StreamWriter(filePath);
        file.Write(text);
        file.Close();
    }
}
```

執行結果

```
C:\ccc>csc File.cs
Microsoft (R) Visual C# 2005 Compiler version 8.00.50727.3053
for Microsoft (R) Windows (R) 2005 Framework version 2.0.50727
Copyright (C) Microsoft Corporation 2001-2005. All rights reserved.


C:\ccc>File Hello.txt
Hello, C#!
```

## 物件導向的寫法

```CS
using System;
using System.IO;

class File
{
    String path;

    public static void Main(String[] args)
    {
        File file = new File("Hello.txt");
        file.save("Hello, C#!");
        String text2 = file.load();
        Console.WriteLine(text2);
    }

    public File(String path)
    {
        this.path = path;
    }

    public String load()
    {
        StreamReader file = new StreamReader(path);
        String text = file.ReadToEnd();
        file.Close();
        return text;
    }

    public void save(String text)
    {
        StreamWriter file = new StreamWriter(path);
        file.Write(text);
        file.Close();
    }
}
```

執行結果

```
C:\ccc>csc FileTest.cs
Microsoft (R) Visual C# 2005 Compiler version 8.00.50727.3053
for Microsoft (R) Windows (R) 2005 Framework version 2.0.50727
Copyright (C) Microsoft Corporation 2001-2005. All rights reserved.


C:\ccc>FileTest Hello.txt
Hello, C#!
```

## 更物件導向的寫法

```CS
using System;
using System.IO;

class TextFile
{
    String path;
    String text;

    public static void Main(String[] args)
    {
        TextFile file = new TextFile();
        file.load(args[0]).print();
    }

    public TextFile() {}

    public TextFile load(String path)
    {
        this.path = path;
        StreamReader file = new StreamReader(path);
        text = file.ReadToEnd();
        file.Close();
        return this;
    }

    public TextFile save()
    {
        StreamWriter file = new StreamWriter(path);
        file.Write(text);
        file.Close();
        return this;
    }

    public TextFile print()
    {
        Console.WriteLine("file: path="+path);
        Console.WriteLine(text);
        return this;
    }
}
```

執行結果

```
C:\ccc>csc TextFile.cs
Microsoft (R) Visual C# 2005 Compiler version 8.00.50727.3053
for Microsoft (R) Windows (R) 2005 Framework version 2.0.50727
Copyright (C) Microsoft Corporation 2001-2005. All rights reserved.


C:\ccc>TextFile Hello.txt
file: path=Hello.txt
Hello, C#!
C# 真有趣!
I love C#.

```

