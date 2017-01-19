# C# 程式基礎：流程控制

在結構化的程式語言中，流程控制是以判斷 (if, switch) 與迴圈 (for, while) 為主的。C# 也不例外，我們將在本文中介紹 C# 的流程控制語法，包含如何利用條件判斷語法控制程式的分支情況，以及用迴圈語法重複運行某些程式碼。

## if 語法

C# 的條件判斷以 if 為主，語法完全繼承 C 語言的語法，其語法如下：

```CS
if EXP 1
  BLOCK 1
else if EXP 2
  BLOCK 2
...
else EXP K
  BLOCK K
```

舉例而言，假如我們想要判斷成績變數 score 是否及格，也就是 score 是否到達 60 分以上，則可以用下列語法。

```CS
if (score >= 60)
  Console.WriteLine("及格");
else
  Console.WriteLine("不及格");
```

更進一步的，假如我們想用程式判斷等第，其中 90 分以上為 A，80-90 之間為 B，70-80 之間為 C，70 以下為 D，那麼就可以用下列語法進行判斷。

```CS
if (score >=90)
  degree = "A";
else if (score >= 80)
  degree = "B";
else if (score >= 70)
  degree = "C";
else
  degree = "D";
```

如果我們將上述範例與 if 語句的語法對照起來，可以很清楚的看到 if 語句的語法結構，如以下範例所示。

```CS
if (score >=90)            // if EXP 1
  degree = "A";            //   BLOCK 1
else if (score >= 80)      // else if EXP 2
  degree = "B";            //   BLOCK 2
else if (score >= 70)      // else if (EXP 3
  degree = "C";            //   BLOCK 3
else                       // else EXP 4
  degree = "D";            //   BLOCK 4  
```

## for 語法

C# 當中的迴圈語法，包含 for, while, foreach 等，其中的 for 與 while 是由 C 繼承而來的，語法與 C 語言一致。而 foreach 的語法則是新創造的，其使用上比 for 語法更方便。

for 迴圈的語法如下所示，其中的 EXP1 是指定敘述，可以用來設定索引變數的初值，EXP2 是一個判斷條件，用來判斷是否應跳出迴圈，EXP3 則是累加條件，通常用來對索引變數進行累加 (++) 的動作。

```CS
for (EXP1; EXP2; EXP3)
  BLOCK;
```

舉例而言，假如我們想計算從 1 加到 100 的結果，就可以利用下列程式，不斷的將索引變數值 i 加入到總和變數 sum 當中，最後 sum 當中所儲存的就會是 1+2+...+100 的結果 5050。

```CS
int sum = 0;
for (int i=1; i<=100; i++)
  sum += i;
```

## while 語法

while 迴圈的語法比 for 迴圈更簡單，其語法如下範例所示，其中的 EXP 是一個邏輯判斷式，用來判斷是否應該離開迴圈。在還沒離開之前，會不斷的重複執行 BLOCK 區塊。

```CS
while (EXP)
  BLOCK
```

同樣的，我們也可以利用 while 迴圈計算從 1 加到 100 的結果，其程式如以下範例所示。

```CS
int sum=0;
int i = 1;
while (i<=100) 
{
  sum = sum + i;
  i++;
}
```

至於 foreach 迴圈，則是針對某個容器結構 (例如陣列) 當中的每個元素都巡迴執行一次，其語法我們將留待未來討論陣列的主題時再行說明。

## 結語

判斷與迴圈是結構化程式設計的兩大流程控制方法，有效的結合判斷與迴圈，就能產生變化無窮的程式，這正是程式設計精妙的地方，也是程式設計師必須要會的基本能力。

## 練習：if 範例

```CS
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            // int score = 55;
            Console.Write("請輸入分數：");
            String scoreStr = Console.ReadLine();
            int score = int.Parse(scoreStr);
            if (score >= 60)
                Console.WriteLine("及格");
            else
                Console.WriteLine("不及格");
        }
    }
}
```

## 練習：while 範例

```CS
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            int score = 55;
            if (score >= 60)
                Console.WriteLine("及格！");
            else
                Console.WriteLine("不及格！");

            while (score < 60)
            {
                Console.WriteLine("score=" + score + "=> 不及格！");
                score++;
            }
            Console.WriteLine("score=" + score + "=> 恭喜你！及格了！");
/*
            int i = 1;
            while (i <= 10)
            {
                Console.WriteLine("i=" + i);
                i++; // i = i + 1; // i++
            }
*/
            for (int i = 1; i <= 10; i+=2) // i+=2 => i=i+2
                Console.WriteLine("i=" + i);


        }
    }
}
```
