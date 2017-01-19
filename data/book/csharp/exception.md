# C# 程式基礎：例外處理

C# 支援例外處理機制，當有任何的例外錯誤發生時，程式會立刻中斷，然後跳出到外層。此時，如果有任何例外處理的程式 (try ... catch) 位於外層，就會接到這個例外，並可以即時處理之。否則，該例外會一直被往外丟，假如都沒有被處理，則程式將被迫中斷，系統會自行輸出例外訊息。

## 範例：引發例外

以下是一個會引發例外的程式，由於 a/b = 3/0 會導致嘗試以零除 (System.DivideByZeroException) 的例外，但這個例外又沒有被任何的 try ... catch 段落所處理，因此整個程式會中斷並輸出錯誤訊息。

```CS
using System;

class Try1
{
    public static void Main(string[] args)
    {
    	int a = 3, b = 0;
    	Console.WriteLine("a/b=" + a/b);
    }
}
```

執行結果

```
D:\myweb\teach\CSharpProgramming>csc Try1.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.


D:\myweb\teach\CSharpProgramming>Try1

未處理的例外狀況: System.DivideByZeroException: 嘗試以零除。
   於 Try1.Main(String[] args)
```

## 範例：捕捉例外


要處理例外可以用 try...catch 語句，以下範例就利用 try { ... } catch  (DivideByZeroException ex) 捕捉了上述的除以零之例外，您可以在 catch 段落中進行例外處理後，再決定要如何繼續執行程式。(本範例中只單純的提示被除數不可為零)。

```CS
using System;

class Try2
{
    public static void Main(string[] args)
    {
    	try
    	{
    	 int a = 3, b = 0;
    	 Console.WriteLine("a/b=" + a / b);
    	}
    	catch (DivideByZeroException ex)
    	{
    	 Console.WriteLine("被除數不可為 0 !\n"+ex);
    	}
    }
}
```

執行結果

```
D:\myweb\teach\CSharpProgramming>csc Try2.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.


D:\myweb\teach\CSharpProgramming>Try2
被除數不可為 0 !
System.DivideByZeroException: 嘗試以零除。
   於 Try2.Main(String[] args)
```

## 視窗版的例外處理

```CS
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace WError
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                double x = double.Parse(textBox1.Text);
                double y = double.Parse(textBox2.Text);
                String op = comboBox1.Text;
                double result = 0.0;
                switch (op)
                {
                    case "+": result = x + y; break;
                    case "-": result = x - y; break;
                    case "*": result = x * y; break;
                    case "/": result = x / y; break;
                    default: throw new Exception("出現錯誤!");
                }
                textBox3.Text = result.ToString();
            }
            catch
            {
                textBox3.Text = "錯誤";
            }
        }
    }
}
```

執行結果：

![圖、視窗版的例外處理](WinErrorRun.png)
