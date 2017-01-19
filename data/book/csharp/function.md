# C# 程式基礎：函數

## 簡介

C# 分為靜態函數與成員函數兩類，靜態函數附屬於類別，呼叫時可以直接指定類別名稱即可。成員函數附屬於物件，呼叫時必須透過物件變數進行呼叫。

通常函數會接收到一些呼叫端傳入的參數。C# 的參數有數種傳遞方式，包含傳值參數 (call by value)，傳址參數 (call by reference) 等，基本型態的參數，像是 int, double, char, ... 等，預設都使用傳值的方式，而物件形態的參數，像是 StringBuilder，陣列等，預設則是使用傳址的方式。

以下是一個 C# 的靜態函數範例，其中的 square 就是靜態函數，其功能是將傳入的數值進行平方動作後傳回，這是一個傳值參數的範例。

```CS
using System;

class Func1
{
    public static void Main(string[] args)
    {
    	int x = square(5);
    	Console.WriteLine("x="+x);
    }

    public static int square(int n) 
    {
    	return n*n;
    }
}
```

## 參數的傳遞

檔案：functionTest.cs

```CS
using System;
class Program
{
    static void Main(string[] args)
    {
        double a = area(1.0);              
        double v = volume(1.0);
        Console.WriteLine("a=" + a + " v=" + v); // a=3.1416 v=4.1888

        int c = 0;

        add(3, 5);
        Console.WriteLine("c=" + c); // c=0

        add(3, 5, ref c);
        Console.WriteLine("c=" + c); // c=8

        int x = 1, y = 2;
        swap1(x, y);
        Console.WriteLine("x=" + x + " y=" + y); // x=1 y=2

        swap2(ref x, ref y);
        Console.WriteLine("x=" + x + " y=" + y); // x=2 y=1


        F1 f = area;
        var a2 = f(2.0);

        f = volume;
        var v2 = f(2.0);

        Console.WriteLine("a2=" + a2 + " v2=" + v2); // a2=12.5664 v2=33.5104
    }

    static double area(double r)
    {
        return pi * r * r;
    }

    static double volume(double r)
    {
        return 4.0 / 3.0 * pi * r * r * r;
    }

    static int add(int a, int b)
    {
        int c = a + b;
        return c;
    }

    // ref 參考：http://msdn.microsoft.com/zh-tw/library/14akc2c7(v=vs.90).aspx
    static void add(int a, int b, ref int c)
    {
        c = a + b;
    }

    static void swap1(int a, int b)
    {
        int t;
        t = a; a = b; b = t;
    }

    static void swap2(ref int a, ref int b)
    {
        int t;
        t = a; a = b; b = t;
    }

    static double pi = 3.1416;

    delegate double F1(double r);

}

```


## 陣列型參數

當你學會 if, for, while 等流程控制技巧後，應該可以寫出很多程式了，但是還有一個問題，如果你寫出來的程式要呼叫很多次，那你只能用剪貼的方式
一直加代碼，這會讓你的程式零亂不堪，而且不斷膨脹。

舉例而言、如果您寫了一個程式可以計算兩個向量 (一維陣列) 的內積，那麼當你想呼叫第二次時，初學者可能會寫出下列程式。

```CS
using System;

class Program
{
    static void Main(string[] args)
    {
        double[] a = { 2.22, 3.33, 4.44 };
        double[] b = { 1.11, 4.44, 3.33 };
        double sum = 0;
        for (int i = 0; i < a.Length; i++)
        {
            sum += a[i] * b[i];
        }
        Console.WriteLine("\ninnerProduct(a,b)= " + sum);

        double[] x = { 2.22, 2.33, 4.44 };
        double[] y = { 1.11, 5.44, 3.33 };
        sum = 0;
        for (int i = 0; i < x.Length; i++)
        {
            sum += x[i] * y[i];
        }
        Console.WriteLine("\ninnerProduct(x,y)= " + sum);
```

在以上程式中，為了計算 x, y 的內積，只好將先前已經寫過的 a, b 內積程式複製一份，然後再將 `a[i]*b[i]` 改成 `x[i]*y[i]` ，
這種方法很不好，有點「將帥無能、累死三軍」的感覺。

評論：如果想要呼叫 100 次的內積，那不是要剪貼 100 次，然後每次改程式  .....


所以、當然不能這樣做，這就是為甚麼要用函數或副程式的原因，我們可以將上述程式改寫如下，這樣寫起程式來就會輕鬆愉快了。

```CS
using System;

class Program
{
    static void Main(string[] args)
    {
        double[] a = { 2.22, 3.33, 4.44 };
        double[] b = { 1.11, 4.44, 3.33 };
        double[] x = { 2.22, 2.33, 4.44 };
        double[] y = { 1.11, 5.44, 3.33 };

        double c = inner(a, b);
        double z = inner(x, y);
    }

    static double inner(double[] a, double[] b)
    {
        double sum = 0;
        for (int i = 0; i < a.Length; i++)
        {
            sum += a[i] * b[i];
        }
        return sum;
    }
```

當然、上述程式只做了內積，但是沒有輸出，如果你用 Visual Studio 除錯模式，是可以輕易的在執行過程中看到 a,b,c,x,y,z 等變數內容，
因此還是可以驗證程式的正確性，但是如果是用「命列列」的  csc 編譯器來編譯執行，那麼可能就得加上「輸出函數」，才能觀察變數內容了。

以下是我們為上述程式補上「輸出函數」後的結果。

```CS
using System;

class Program
{
    static void Main(string[] args)
    {
        double[] a = { 2.22, 3.33, 4.44 };
        double[] b = { 1.11, 4.44, 3.33 };
        double[] x = { 2.22, 2.33, 4.44 };
        double[] y = { 1.11, 5.44, 3.33 };
        double c = inner(a, b);
        double z = inner(x, y);

        printArray(a);
        printArray(b);
        Console.WriteLine("a*b="+c);
        printArray(x);
        printArray(y);
        Console.WriteLine("x*y="+z);

        Console.WriteLine("a=" + arrayToStr(a) + " b=" + arrayToStr(b) + "c=" + c);
        Console.WriteLine("x=" + arrayToStr(x) + " y=" + arrayToStr(y) + "z=" + z);
    }

    static double inner(double[] a, double[] b)
    {
        double sum = 0;
        for (int i = 0; i < a.Length; i++)
        {
            sum += a[i] * b[i];
        }
        return sum;
    }

    static void printArray(double[] a) {
        for (int i=0; i<a.Length; i++) {
            Console.Write(a[i]+" ");
        }
        Console.WriteLine();
    }

    static String arrayToStr(double[] a)
    {
        String rzStr = "";
        for (int i = 0; i < a.Length; i++)
        {
            rzStr += a[i] + " ";
        }
        return rzStr;
    }
}
```

在上述程式中，我們用了兩種方法做輸出，一種是用 printArray(double[] a) 直接將陣列 a 輸出，另一種是用 arrayToStr(double[] a) 將陣列轉換成字串，
再利用 Console.Write 等函數輸出。

筆者覺得第二種會比較好用，也就是建議採用將內容轉換成字串，然後再用 Console.Write 等函數輸出的方式，這樣是比較有彈性的方式。

### 二維陣列

陣列也可以用來作為函數的參數，由於陣列的傳遞採用傳址的方式，因此在函數中對陣列的修改將會是永久性的修改，離開函數後並不會恢復成原先的數值。

以下範例中的 add 函數用來將兩個二維陣列 (x,y) 相加，然後將結果放入 z 當中，print 函數則是將傳入的陣列 x 印出來。必須注意的是，對於二維陣列而言，要取得陣列的第一維元素個數 (列數)，可用 GetLength(0)，要取得陣列的第二維元素個數 (行數)，必須使用 GetLength(1)。

```CS
using System; 

class Func2
{ 
    public static void Main(string[] args)
    {
    	int[,] a = {{1,2}, {3,4}};
    	int[,] b = {{5,6}, {7,8}};
    	int[,] c = new int[2,2];
    	add(a, b, c);
    	Console.WriteLine("=======a=======");
    	print(a);
    	Console.WriteLine("=======b=======");
    	print(b);
    	Console.WriteLine("=======c=======");
    	print(c);
    }

    public static void add(int[,] x, int[,] y, int[,] z)
    {
    	for (int i=0; i<z.GetLength(0); i++)
    	for (int j=0; j<z.GetLength(1); j++)
    	{
    	 z[i,j] = x[i,j] + y[i,j];
    	}
    }

    public static void print(int[,] x)
    {
    	for (int i=0; i<x.GetLength(0); i++)
    	{
    	for (int j=0; j<x.GetLength(1); j++)
    	 Console.Write(x[i,j]+" ");
    	Console.WriteLine();
    }
    }
}
```

## 練習

```CS
using System;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            sum(10);
            sum(20);
            sum(30);
        }
        
        static void sum(int n) 
        {
            int s = 0;
            for (int i = 1; i <= n; i++)
            {
                s = s + i;
            }
            Console.WriteLine("s = " + s);
        }
    }
}
```


## 補充： C 語言的函數

採用 return 的方法傳回值

```CPP
#include <stdio.h>

int add(int a, int b) {
  int c = a + b;
  return c;
}

int main() {
  printf("add(3,5)=%d\n", add(3,5));
}
```

如果不用 return ，但想將結果放在參數 c 傳回，應該怎麼辦呢？

```CPP
#include <stdio.h>

void add(int a, int b, int *c) {
  *c = a + b;
}

int main() {
  int x;
  
  add(3,5, &x);
  
  printf("x=%d\n", x);
}
```

在 C 語言當中，如果想要寫一個 swap(a,b) 函數，可以將 a, b 的內容調換過來，方法有很多種，
像是用 #define 或副程式都可以，但是副程式的參數要用傳址的方式進行。

```CPP
#include <stdio.h>

#define SWAP(a,b,t) { t=a; a=b; b=t; }

void add2(int a, int b, int *c) {
  *c = a + b;
}
   
int add(int a, int b) {
  int c = a + b;
  return c;
}

void swap(int *a, int *b) {
  int t;
  t = *a; *a = *b; *b = t;
}

int main() {
  int d=add(3,5);
  printf("add(3,5)=%d\n", d);
  
  int c;
  add2(3,5, &c);
  printf("add2(3,5)=c=%d\n", c);
  
  int x=3,y=5;
  printf("x=%d y=%d\n", x, y);
  swap(&x, &y);
  printf("x=%d y=%d\n", x, y);
  
  int t;
  SWAP(x, y, t);
  printf("x=%d y=%d\n", x, y);
}
```