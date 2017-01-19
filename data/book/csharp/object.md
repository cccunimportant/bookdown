# C# 程式基礎：物件

C# 是很好的物件導向語言，而且微軟的 .NET Framework 函式庫設計得相當優美，這使得 C# 的魅力相當大。

傳統的程式設計會將資料與程式分開，但是在物件導向的概念當中，資料與程式被合併成一個結構，這個結構就稱為物件。

一個物件可以包含資料部分 (資料成員) 與函數部分 (函數成員)，函數成員可以對資料成員進行操作，以下是一個 C# 的物件範例，該範例中定義了一個人員 (Person1) 的結構，該結構包含兩個資料成員 (name, weight) 與一個成員函數 (checkWeight)，該函數會檢查人員結構的體重 (weight) 看看是重還是輕。另外，還包含了一個建構函數 Person1() ，這個建構函數可以讓使用者在建立物件時順便將參數傳入，這是物件導向的一種常見手法。

```CS
using System;

class Object1 {
    public static void Main(String[] args) {
    	Person1 p1, p2;
    	p1 = new Person1("大雄", 50);
    	p2 = new Person1("胖虎", 80);
    	p1.checkWeight();
    	p2.checkWeight();
    	p2.weight = 68;
    	p1.checkWeight();
    	p2.checkWeight();
    }
}

class Person1 {
    public string name;
    public int weight;
    
    public Person1(string pName, int pWeight) {
    	name   = pName;
    	weight = pWeight;
    }

    public void checkWeight()
    {
    	Console.Write(name+"體重 "+weight+" 公斤,");
    	if (weight < 70) 
    	 Console.WriteLine("很苗條!");
    	else
    	 Console.WriteLine("很穩重!");
    }
}
```

執行結果

```
D:\myweb\teach\CSharpProgramming>csc Object1.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.


D:\myweb\teach\CSharpProgramming>Object1
大雄體重 50 公斤,很苗條!
胖虎體重 80 公斤,很穩重!
大雄體重 50 公斤,很苗條!
胖虎體重 68 公斤,很苗條!
```

## 封裝

在傳統的結構化程式設計 (像是 C, Fortran, Pascal) 當中，我們用函數來處理資料，但是函數與資料是完全區隔開來的兩個世界。然而，在物件導向當中，函數與資料被合為一體，形成一種稱為物件的結構，我們稱這種將函數與資料放在一起的特性為「封裝」。

以下我們將以矩形物件為範例，說明 C# 當中的封裝語法，以及物件導向中的封裝概念。

### 範例一：封裝 -- 將函數與資料裝入物件當中

```CS
using System;

class Rectangle
{
    double width, height;

    double area()
    {
        return width * height;
    }

    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle();
        r.width = 5.0;
        r.height = 8.0;
        Console.WriteLine("r.area() = " + r.area());
    }
}
```

執行結果

```
r.area() = 40
```

### 修改進化版

由於上述物件與主程式混在一起，可能容易造成誤解，因此我們將主程式獨立出來，並且新增了一個 r2 的矩形物件，此時程式如下所示。

```CS
using System;

class Rectangle
{
    public double width, height;

    public double area()
    {
        return width * height;
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle();
        r.width = 5.0;
        r.height = 8.0;
        Console.WriteLine("r.area() = " + r.area());

        Rectangle r2 = new Rectangle();
        r2.width = 7.0;
        r2.height = 4.0;
        Console.WriteLine("r2.area() = " + r2.area());
    }
}
```

執行結果：

```
r.area() = 40
r2.area() = 28
```

### 範例二：加上建構函數

```CS
using System;

class Rectangle
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
    }

    public double area()
    {
        return width * height;
    }

    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());
    }
}
```

執行結果

```
r.area() = 40
```

### 範例二：加上建構函數 -- 同時有 0 個與兩個引數

```CS
using System;

class Rectangle
{
    public double width, height;

    public Rectangle() { }

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
    }

    public double area()
    {
        return width * height;
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());

        Rectangle r2 = new Rectangle();
        r2.width = 7.0;
        r2.height = 4.0;
        Console.WriteLine("r2.area() = " + r2.area());
    }
}

```

### 習題：向量物件

```CS
using System;

class Vector
{
    double[] a;

    public Vector(double[] array)
    {
        a = new double[array.GetLength(0)];
        for (int i = 0; i < a.GetLength(0); i++)
        {
            a[i] = array[i];
        }
    }

    public Vector add(Vector v2)
    {
        Vector rv = new Vector(v2.a);
        for (int i = 0; i < rv.a.GetLength(0); i++)
        {
            rv.a[i] = this.a[i] + v2.a[i];
        }
        return rv;
    }

    public void print()
    {
        for (int i = 0; i < a.GetLength(0); i++)
        {
            Console.Write(a[i] + " ");
        }
        Console.WriteLine();
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Vector v1 = new Vector(new double[] { 1.0, 2.0, 3.0 });
        Vector v2 = new Vector(new double[] { 4.0, 5.0, 6.0 });
        Vector v3 = v1.add(v2);

        v1.print();
        v2.print();
        v3.print();
    }
}
```

進階練習 1：加上內積的函數，並寫出呼叫範例。
進階練習 2：寫出矩陣物件 (有加法、乘法) (方法一：用二維陣列、方法二：用 Vector)。

### 習題：矩陣物件

## 繼承

### 範例一：矩形、圓形繼承形狀 (Shape)

```CS
using System;

class Shape
{
    public virtual double area() { return 0.0; }
}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
    }

    public override double area()
    {
        return width * height;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
    }

    public override double area()
    {
        return 3.1416 * r * r;
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Shape s = new Shape();
        Console.WriteLine("s.area() = " + s.area());

        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());

        Circle c = new Circle(2);
        Console.WriteLine("c.area() = " + c.area());
    }
}
```

執行結果：

```
s.area() = 0
r.area() = 40
c.area() = 12.5664
```

### 範例二：加入厚度與體積函數 (在子物件使用父物件的欄位)

執行結果

```
s.area() = 0
r.area() = 40
r.volume() = 80
c.area() = 12.5664
c.volume() = 37.6992
c.volume() = 62.832
```

程式碼

```CS
using System;

class Shape
{
    public double thick;
    public virtual double area() { return 0.0; }
}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
        thick = 2.0;
    }

    public override double area()
    {
        return width * height;
    }

    public double volume()
    {
        return width * height * thick;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
        thick = 3.0;
    }

    public override double area()
    {
        return 3.1416 * r * r;
    }

    public double volume()
    {
        return area() * thick;
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Shape s = new Shape();
        Console.WriteLine("s.area() = " + s.area());

        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());
        Console.WriteLine("r.volume() = " + r.volume());

        Circle c = new Circle(2);
        Console.WriteLine("c.area() = " + c.area());
        Console.WriteLine("c.volume() = " + c.volume());
        c.thick = 5;
        Console.WriteLine("c.volume() = " + c.volume());
    }
}
```

### 範例三：將 volume() 函數提到 Shape 物件中

```CS
using System;

class Shape
{
    public double thick;
    public virtual double area() { return 0.0; }
    public double volume()
    {
        return area() * thick;
    }
}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
        thick = 2.0;
    }

    public override double area()
    {
        return width * height;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
        thick = 3.0;
    }

    public override double area()
    {
        return 3.1416 * r * r;
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Shape s = new Shape();
        Console.WriteLine("s.area() = " + s.area());

        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());
        Console.WriteLine("r.volume() = " + r.volume());

        Circle c = new Circle(2);
        Console.WriteLine("c.area() = " + c.area());
        Console.WriteLine("c.volume() = " + c.volume());
        c.thick = 5;
        Console.WriteLine("c.volume() = " + c.volume());
    }
}
```

### 習題：人、學生與老師

請定義「人、學生與老師」等三個類別，其中的人有「姓名、性別、年齡」三個欄位，學生另外有「學號、年級」等兩個欄位，老師另外有「職等」的欄位，所有物件都有 print() 函數，可以將該物件的所有欄位印出。

請建立一個具有 3 個學生與兩個老師的陣列，利用多型機制，呼叫 print 函數以便印出這 5 個人的基本資料，如下所示。

```
學生 --  姓名：王小明，性別：男，年齡：20，學號：R773122456，年級：一年級
學生 --  姓名：李小華，性別：女，年齡：19，學號：R773122432，年級：一年級
教師 --  姓名：陳福氣，性別：男，年齡：40，職等：教授
學生 --  姓名：黃大虎，性別：男，年齡：22，學號：R773122721，年級：四年級
教師 --  姓名：李美女，性別：女，年齡：35，職等：助理教授
```

解答：

```CS
using System;
using System.Collections.Generic;
using System.Text;

namespace Person
{
/*
 * 請定義「人、學生與老師」等三個類別，其中的人有「姓名、性別、年齡」三個欄位，
 * 學生另外有「學號、年級」等兩個欄位，老師另外有「職等」的欄位，所有物件都有 
 * print() 函數，可以將該物件的所有欄位印出。
 * 
 * 請建立一個具有 3 個學生與兩個老師的陣列，利用多型機制，呼叫 print 函數以便
 * 印出這 5 個人的基本資料，如下所示。    
 * 
 * 學生 --  姓名：王小明，性別：男，年齡：20，學號：R773122456，年級：一年級
 * 學生 --  姓名：李小華，性別：女，年齡：19，學號：R773122432，年級：一年級
 * 教師 --  姓名：陳福氣，性別：男，年齡：40，職等：教授
 * 學生 --  姓名：黃大虎，性別：男，年齡：22，學號：R773122721，年級：四年級
 * 教師 --  姓名：李美女，性別：女，年齡：35，職等：助理教授
*/
        class Program
        {
            static void Main(string[] args)
            {
                Student s1 = new Student("王小明", "男", 20, "R773122456", 1);
                Student s2 = new Student("李小華", "女", 19, "R773122432", 1);
                Student s3 = new Student("黃大虎", "男", 22, "R773122721", 4);
                Person t1 = new Person("陳福氣", "男", 40);
                Person t2 = new Person("李美女", "女", 35);

                Person[] list = { s1, s2, t1, s3, t2 };
                foreach (Person p in list)
                {
                    p.print();
                    Console.WriteLine();
                }
            }
        }

        class Person
        {
            String name;
            String sex;
            int age;

            public Person(String name, String sex, int age)
            {
                this.name = name;
                this.sex = sex;
                this.age = age;
            }

            public virtual Person print()
            {
                Console.Write("姓名："+name+" 性別："+sex+" 年齡："+age);
                return this;
            }
        }

        class Student : Person
        {
            String id;
            int degree;

            public Student(String name, String sex, int age, String id, int degree)
                : base(name, sex, age)
            {
                this.id = id;
                this.degree = degree;
            }

            public override Person print()
            {
                Console.Write("學生 -- ");
                base.print();
                Console.Write(" 學號：" + id + " 年級：" + degree);
                return this;
            }
        }
}

```

## 多型

物件導向的多型機制，是指當兩個以上的類別繼承同一種父類別時，我們可以用父類別型態容納子類別的物件，真正進行函數呼叫時會呼叫到子類別的函數，此種特性稱之為多型。

以下是我們用 C# 實作的一個多型範例，在範例中，我們宣告了一個形狀類別，該類別具有一個 area() 函數可以計算該形狀的面積，然後我們又宣告了兩個子類別 Rectangle (矩形) 與 Circle (圓形)。我們將兩者放入到 shapes 陣列中，以便展示多型技巧，用父類別容器呼叫子類別的實體。

### 範例：形狀、矩形與圓形

```CS
using System;

class Shape
{
    public virtual double area() { return 0.0; }

    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());

        Circle c = new Circle(3.0);
        Console.WriteLine("c.area() = " + c.area());

        Shape[] shapes = { r, c };
        for (int i = 0; i < shapes.Length; i++)
            Console.WriteLine("shapes[" + i + "].area()=" + shapes[i].area());
    }
}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
    }

    public override double area()
    {
        return width * height;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
    }

    public override double area()
    {
        return 3.1416 * r * r;
    }
}
```

執行結果

```
r.area() = 40
c.area() = 28.2744
shapes[0].area()=40
shapes[1].area()=28.2744
```

### 範例：使用抽象父型態

```CS
using System;

class ShapeTest
{
    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());

        Circle c = new Circle(3.0);
        Console.WriteLine("c.area() = " + c.area());

        Shape[] shapes = { r, c };
        for (int i = 0; i < shapes.Length; i++)
            Console.WriteLine("shapes[" + i + "].area()=" + shapes[i].area());
    }
}

abstract class Shape
{
    public abstract double area();

}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
    }

    public override double area()
    {
        return width * height;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
    }

    public override double area()
    {
        return 3.1416 * r * r;
    }
}
```

執行結果：
```
r.area() = 40
c.area() = 28.2744
shapes[0].area()=40
shapes[1].area()=28.2744
```

### 範例：使用介面

```CS
using System;

class ShapeTest
{
    public static void Main(string[] args)
    {
        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());

        Circle c = new Circle(3.0);
        Console.WriteLine("c.area() = " + c.area());

        Shape[] shapes = { r, c };
        for (int i = 0; i < shapes.Length; i++)
            Console.WriteLine("shapes[" + i + "].area()=" + shapes[i].area());
    }
}

interface Shape
{
    double area();

}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
    }

    public double area()
    {
        return width * height;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
    }

    public double area()
    {
        return 3.1416 * r * r;
    }
}
```

執行結果：

```
r.area() = 40
c.area() = 28.2744
shapes[0].area()=40
shapes[1].area()=28.2744
```

### 範例：較完整複雜的版本

```CS
using System;

class Shape
{
    public double thick = 0.0;
    public virtual double area() { return 0.0; }
    public double volume()
    {
        return area() * thick;
    }

    public override String ToString()
    {
        return "Shape: thick=" + thick+" area="+area()+" volume="+volume();
    }
}

class Rectangle : Shape
{
    double width, height;

    public Rectangle(double w, double h)
    {
        width = w;
        height = h;
        thick = 2.0;
    }

    public override String ToString()
    {
        return base.ToString()+" Rectangle:width=" + width + " height=" + height;
    }

    public override double area()
    {
        return width * height;
    }
}

class Circle : Shape
{
    double r;

    public Circle(double r)
    {
        this.r = r;
        thick = 3.0;
    }

    public override String ToString()
    {
        return base.ToString() + " Circle:r=" + r + " thick=" + thick;
    }

    public override double area()
    {
        return 3.1416 * r * r;
    }
}

class Test
{
    public static void Main(string[] args)
    {
        Shape s = new Shape();
        Console.WriteLine("s.area() = " + s.area());

        Rectangle r = new Rectangle(5.0, 8.0);
        Console.WriteLine("r.area() = " + r.area());
        Console.WriteLine("r.volume() = " + r.volume());

        Circle c = new Circle(2);
        Console.WriteLine("c.area() = " + c.area());
        Console.WriteLine("c.volume() = " + c.volume());
        c.thick = 5;
        Console.WriteLine("c.volume() = " + c.volume());

        Shape[] array = new Shape[] { s, r, c, r };
        foreach (Shape o in array)
        {
//            Console.WriteLine("o.area()=" + o.area() +" o.volume()="+o.volume());
            Console.WriteLine(o.ToString());
        }
    }
}
```

## 參考文獻
* C# 教學課程
    * 結構教學課程 - <http://msdn.microsoft.com/zh-tw/library/aa288471(VS.71).aspx>
    * 使用者定義轉換教學課程 - <http://msdn.microsoft.com/zh-tw/library/aa288476(VS.71).aspx>
    * 運算子多載化教學課程 - <http://msdn.microsoft.com/zh-tw/library/aa288467(VS.71).aspx>
