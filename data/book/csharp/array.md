# C# 程式基礎：陣列

陣列是傳統程式設計上用來儲存很多個元素的資料結構。有了陣列，我們就可以將無數的資料放入程式當中以供存取、排序或搜尋。雖然在現代的語言當中都會有其他更方便的容器存在，像是字典 (Dictionary)，但這些容器也通常是利用陣列所實作出來的。

## 一維陣列

C# 當中的陣列是用中括號的方式宣告的。舉例而言，假如我們想宣告一個陣列可以儲存一年當中每個月的天數，我們可以用下列程式表示。

```CS
int[] days;
days = new int[12];
days[0]=31; days[1]=28; days[2] =31; days[3]=30;
days[4]=31; days[5]=30; days[6] =31; days[7]=31;
days[8]=30; days[9]=31; days[10]=30; days[11]=31;
```

請注意，由於 C# 繼承了 C 語言的習慣，陣列都是從 0 開始算起的。所以在上述程式中，我們用 days[0] 代表 1 月的天數，days[1] 代表 2 月的天數，以此類推，...。

然而，僅僅宣告每個月的天數，就需要這莫多指令，未免也太複雜了。因此，C# 語言允許我們直接設定陣列的初值，以下是我們用很簡潔的語法做到與上述範例相同的功能，但卻只要用一行就夠了。

```CS
int[] days = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
```

有了陣列之後，我們就可以透過迴圈的方式，逐一存取陣列的內容。舉例而言，我們可以利用下列程式計算一年當中所有月份的天數總和。

```CS
int count = 0;
for (int i=0; i<12; i++)
   count += days[i];
```

如果您經常寫程式，就會覺得上述範例中的 for 迴圈語法仍然不夠簡潔，因為我們總是要寫 (i=0; i< ...; i++)。所以 C# 當中設計了一種更簡潔的迴圈語法，用來巡訪陣列或容器當中的每個元素，這個語法稱為 foreach。

我們可以用 foreach 寫出計算天數總和的程式如以下範例所示，在本範例中我們用 d 變數取出每個月的天數後，將之加入 count 變數以便計算總和。

```CS
int count = 0;
foreach (int d in days)
  count += d;
```

### 作業：請寫出內積的版本 int c = innerProduct(a,b)

解答：

```CS
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ArrayTest
{
    class Program
    {
        static void Main(string[] args)
        {
            int[,] a1 = { { 1, 2 }, { 3, 4 } };
            int[,] b1 = { { 3, 4 }, { 5, 6 } };
            int[,] c1 = new int[2, 2];

            int[] a = { 1, 2, 3, 4, 5 };
            int[] b = { 3, 3, 3, 3, 3 };
            int[] c = new int[5];

            for (int i = 0; i < a.Length; i++)
            {
                c[i] = a[i] + b[i];
            }

            int[] d = new int[5];
            arrayAdd2(a, b, d);

            int[] e = arrayAdd(a, b);

            printArray(a);
            printArray(b);
            printArray(c);
            printArray(d);
            printArray(e);
        }

        static void printArray(int[] x)
        {
            for (int i = 0; i < x.Length; i++)
                Console.Write(x[i] + " ");
            Console.WriteLine();
        }

        static void arrayAdd2(int[] x, int[] y, int[] z)
        {
            for (int i = 0; i < x.Length; i++)
            {
                z[i] = x[i] + y[i];
            }
        }

        static int[] arrayAdd(int[] x, int[] y)
        {
            int[] z= new int[x.Length];
            for (int i = 0; i < x.Length; i++)
            {
                z[i] = x[i] + y[i];
            }
            return z;
        }
    }
}

```

## 二維陣列

以下我們用「矩陣加法」作為範例，以說明 C# 二維陣列的用法。

範例：請寫出矩陣的加法 int[,] c = matrixAdd(a,b)

```CS
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ArrayTest
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] a = { 1, 2, 3, 4, 5 };
            int[] b = { 3, 3, 3, 3, 3 };
            int[] c = new int[5];

            for (int i = 0; i < a.Length; i++)
            {
                c[i] = a[i] + b[i];
            }

            int[] d = new int[5];
            arrayAdd2(a, b, d);

            int[] e = arrayAdd(a, b);

            printArray(a);
            printArray(b);
            printArray(c);
            printArray(d);
            printArray(e);
        }

        static void printArray(int[] x)
        {
            for (int i = 0; i < x.Length; i++)
                Console.Write(x[i] + " ");
            Console.WriteLine();
        }

        static void arrayAdd2(int[] x, int[] y, int[] z)
        {
            for (int i = 0; i < x.Length; i++)
            {
                z[i] = x[i] + y[i];
            }
        }

        static int[] arrayAdd(int[] x, int[] y)
        {
            int[] z= new int[x.Length];
            for (int i = 0; i < x.Length; i++)
            {
                z[i] = x[i] + y[i];
            }
            return z;
        }
    }
}
```

### 進階題：矩陣的轉置

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
            double[,] a = { { 1, 2, 3 }, { 3, 4, 5 } };
            double[,] b = { { 3, 4, 2 }, { 5, 6, 1 } };
            double[,] at = transpose(a);

            Console.WriteLine("a.GetLength(0)=" + a.GetLength(0));
            Console.WriteLine("a.GetLength(1)=" + a.GetLength(1));
            printMatrix("a", a);
            printMatrix("b", b);
            printMatrix("at", at);
        }

        static void printMatrix(String name, double[,] x)
        {
            Console.WriteLine("==========" + name + "==============");
            for (int i = 0; i < x.GetLength(0); i++)
            {
                for (int j = 0; j < x.GetLength(1); j++)
                {
                    Console.Write(x[i,j]+" ");
                }
                Console.WriteLine();
            }
        }

        static double[,] transpose(double [,] x)
        {
            double[,] t = new double[x.GetLength(1), x.GetLength(0)];
            for (int i = 0; i < x.GetLength(0); i++)
            {
                for (int j = 0; j < x.GetLength(1); j++)
                {
                    t[j, i] = x[i, j];
                }
            }
            return t;
        }

    }
}
```

### 加分題：請寫出矩陣的乘法 int[,] c = matrixMul(a,b)

## 參考文獻
* C# 教學課程
    * 陣列教學課程 - http://msdn.microsoft.com/zh-tw/library/aa288453(VS.71).aspx
    * 索引子教學課程 - http://msdn.microsoft.com/zh-tw/library/aa288465(VS.71).aspx
    * 索引屬性教學課程 - http://msdn.microsoft.com/zh-tw/library/aa288464(VS.71).aspx
