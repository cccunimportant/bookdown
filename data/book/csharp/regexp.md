# C# 程式進階：正規表達式

正規表達式是現代程式設計的重要工具，在 C# 當中，對正規表達式的支援相當的完整。您可以用正規表達式抽取出文件中的電話、地址、超連結、email 等欄位，因此正規表達式在文字型資料的處理上是相當方便的。

## 程式範例

在以下的範例中，我們利用正規表達式 "[0-9]+號"，抽取出字串當中的號碼，像是 32號，45號等。其中的 matches 函數是正規表達式的主要部分，我們透過 Regex 物件中的 Match(pText) 與 NextMatch() 函數，不斷取得比對的結果 (Match m)，然後再利用Match 結構取出 m.Groups[pGroupId].Value 這個比對的值，其中若 pGroudId 為 0 ，代表所要取得的是比對結果的全部。而 m.Success 可以用來判斷下一個比對是否成功，這可以做為回圈節數的條件。

```CS
using System;
using System.Collections;
using System.Text.RegularExpressions;

public class Regexp
{
    public static void Main(String[] args)
    {
    	String text = "王小明:32號，李小華：45號";
    	foreach (String s in matches("[0-9]+號", text, 0))
    	 Console.WriteLine(s);
    }

    public static IEnumerable matches(String pPattern, String pText, int pGroupId)
    {
    	Regex r = new Regex(pPattern, RegexOptions.IgnoreCase | RegexOptions.Compiled);
    	for (Match m = r.Match(pText); m.Success; m = m.NextMatch())
    	 yield return m.Groups[pGroupId].Value;
    }
}
```

上述範例的執行結果如下所示，您可以看到字串 "王小明:32號，李小華：45號" 當中的 32號與 45 號被抽出來了，這正是正規表達式 "[0-9]+號" 所指定的樣式阿。

```
D:\myweb\teach\CSharpNetworkProgramming>csc RegexpTest1.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.


D:\myweb\teach\CSharpNetworkProgramming>RegexpTest1
32號
45號
```

