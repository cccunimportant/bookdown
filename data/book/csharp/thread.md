# C# 程式進階：作業系統與 Thread

很多資工系的學生都上過作業系統這門課，但是通常老師只有講理論，沒有說明如何實作，這讓很多同學都無法清楚的理解其中的概念。在本系列文章中，我們將使用 C# 語言來說明作業系統當中的一些關鍵概念，像是 Process (進程、行程、Task)、Thread (執行緒、線程)、Deadlock (死結)、Race Condition (競爭情況)、Semaphore (號誌、信號量) 等等。

## Process 與 Thread

Thread 在台灣被稱為『執行緒』，但是在中國被稱為『線程』，作業系統教科書中通常會定義 Process 為：執行中的程式。因此假如您開了一個 Word 檔案，那就是有一個 Word 行程在執行，如果您又開了個命令列，那就是又有一個命令列行程在執行，如果又開第二個命令列，那就有兩個命令列行程在執行。

Thread 在作業系統中通常被定義為輕量級行程 (Light Weight Process)，一個 Process 可以包含很多個 Thread，如下圖所示：

![圖、Process 與 Thread 的關係](ProcessVsThread.jpg)

每個 Process 與 Thread 都會執行，而且執行到一半很可能就會因為進行輸出入或佔用 CPU 過久而被作業系統切換出去，改換另一個 Process 或 Thread 執行，這種概念稱為 Multitasking (多工)。

在 Windows 當中，我們可以按下 Ctrl-Alt-Del 鍵以顯示出系統的行程資訊，而在 Linux 中則可以用 ps (Process Status) 這個指令顯示行程資訊，以下是這兩個作業系統中的行程資訊範例。

![圖、Linux 與 Windows 中的 Process](ProcessScreenshot.jpg)

Thread 交替執行的這種慨念可以用下圖表示。(Proces 也是如此，只是將圖中的 Thread 改為 Process 而已)

![圖、Thread 的概念](FileMultithreadedProcess.jpg)

## C# 中的 Thread 概念

在現代的作業系統當中，如果我們將一個程式重複執行兩次，將會產生兩個 Process ，那麼這兩個程式將是毫不相關的。任何一個程式都不需要知道另一個程式是否存在，通常也不會與另一個程式進行溝通。

但是，如果我們希望兩個程式能夠互相分享某些變數，但是卻又同時執行，此時就可以利用 Thread 的機制。對於程式設計師而言，Thread 就像一個可以單獨執行的函數，這個函數與其他程式 (包含主程式) 同時執行，感覺上好像互相獨立，但是又可以共用某些變數。以下是一個 C# 的 Thread 範例：

```CS
using System;
using System.Threading;

class SimpleThread
{
    String name;

    public static void Main(String[] args)
    {
        SimpleThread a = new SimpleThread("A");
        SimpleThread b = new SimpleThread("B");
        Thread athread = new Thread(a.run);
        Thread bthread = new Thread(b.run);
        athread.Start();
        bthread.Start();
        athread.Join();
        bthread.Join();
    }

    SimpleThread(String pName)
    {
        name = pName;
    }

    public void run()
    {
        for (int i = 0; i < 10; i++)
        {
            String line = name + ":" + i;
            Console.WriteLine(line);
            // Thread.Sleep(10);
        }
    }
}
```

其執行結果如下圖所示：

![圖、Thread 的執行結果 -- 沒有 Sleep 的情況](CSharpThreadRun1.jpg)

對於剛開始接觸 Thread 的程式人員而言，會感覺到相當的詭異。因為『兩個 Thread 同時執行』是一個相當難以理解的概念。事實上，對於只有一個 CPU 的程式而言，並非兩個程式真的會「同時」執行，而只不過是「交錯」執行而已。但是這個交錯方式是由作業系統決定的，而非由程式設計師自行安排。而對於多 CPU 或多核心的處理器而言，就真的會「同時」執行，而不是只有「交錯」執行而已。

通常，程式人員對於這種不能由自己操控決定的情況會有不安的感覺，但是當您多寫幾個程式之後，這種疑慮就會消除了，畢竟，程式人員本來就相當依賴作業系統，只是自己通常感覺不到而已。

當然，如果我們想要稍微控制一下 Thread 的執行順序，那麼就可以要求目前的 Thread 去休息睡覺，像是上述程式中的 Thread.Sleep(10) 這行程是本來是被註解掉的，但是如果我們將這行程式的註解拿掉，那麼將得到下列執行結果。

![圖、Thread 的執行結果 2 -- 有 Sleep 的情況](CSharpThreadRun2.jpg)

從上面兩個圖中，您可以看到還沒加入 Thread.Sleep(10) 之前，兩個 Thread 的交錯方是很隨興，基本上是由作業系統任意安排的，但是在加入 Thread.Sleep(10) 之後，因為兩個 Thread 在印一次後就會禮讓給對方，所以就成了嚴格交互的 A, B, A, B .... 之情形了。

## 以 C# 體驗死結 (Deadlock)

在作業系統的課程當中我們會學到『死結』這個問題，當程式 1 抓住資源 A，卻又在等程式 2 釋放資源 B，而程式 2 則抓住資源 B ，卻又在等程式 1 釋放資源 A 的時候，就會進入死結狀態。這就像兩台很長的火車，互相卡住對方一般，下圖顯示了死結情況的示意圖。

![圖、死結的示意圖](Deadlock.jpg)

在程式設計中我們真的會遇到死結嗎？如果真的有死結，能否寫一個會造成死結的程式呢？

這並不難，只要用執行緒 (Thread) 與鎖定 (lock) 機制，我們很容易就可以造出會導致死結的程式，以下是我們用 C# 撰寫的一段死結程式，請參考。

```CS
using System;
using System.Threading;
using System.Text;

class ThreadTest
{
    static String A = "A";
    static String B = "B";

    public static void Main(String[] args)
    {
        Thread thread1 = new Thread(AB);
        Thread thread2 = new Thread(BA);
        thread1.Start();
        thread2.Start();
        thread1.Join();
        thread2.Join();
    }

    public static void AB()
    {
        lock (A)
        {
            Console.WriteLine("AB.lock(A)");
            Thread.Sleep(1000);
            lock (B)
            {
                Console.WriteLine("AB.lock(B)");
            }
        }
    }

    public static void BA()
    {
        lock (B)
        {
            Console.WriteLine("BA.lock(B)");
            Thread.Sleep(1000);
            lock (A)
            {
                Console.WriteLine("BA.lock(A)");
            }
        }
    }
}
```

上述程式的執行結果如下圖所示，當程式跑到 BA.lock(B) 之後就進入了死結，再也無法跑下去了，因此我們不會看到 BA.lock(A) 與 AB.lock(B) 這兩行輸出的結果，程式已經進入了死結狀態，再也出不來了。

![圖、Deadlock.cs 程式的執行結果](CSharpDeadlockRun1.jpg)

## 競爭情況 (Race Condition)

至此，我們已經用 C# 實作了作業系統中的 Thread 與 Deadlock 這兩種慨念，但事實上、這兩個概念之間是有關係的，要理解 Thread 與死結之間的關係，就必須從 Race Condition (競爭情況) 這個問題談起。

在多 Thread (或多 CPU) 的情況之下，兩個 thread 可以共用某些變數，但是共用變數可能造成一個嚴重的問題，那就是當兩個 thread 同時修改一個變數時，這種修改會造成變數的值可能錯誤的情況，以下是一個範例。

|Thread 1      |Thread 2      |Thread1+2 (第 1 種情況) |Thread1+2 (第 2 種情況) |
|--------------|--------------|------------------------|------------------------| 
|counter = 0   |              |                        |                        |
|...           |              |                        |                        |
|R1 = counter  |R1 = counter  |T1:R1 = counter         |T1:R1 = counter         |
|R1 = R1 + 1   |R1 = R1 - 1   |T2:R1 = counter         |T1:R1 = R1+1            |
|counter = R1  |counter = R1  |T2:R1 = R1-1            |T2:R1 = counter         |
|              |              |T2:counter=R1           |T2:R1 = R1-1            |
|              |              |T1:R1 = R1+1            |T2:counter = R1         |
|              |              |T1:counter = R1         |T1:counter = R1         |
|              |              |...                     |...                     |
|              |              |執行結果 : counter = 0  |執行結果 : counter = -1 |

這種情況並非只在多 CPU 的系統裡會發生，在單 CPU 的多線程系統裡也會發生，因為一個高階語言指令在翻譯成機器碼時，通常會變成很多個指令，這讓修改的動作無法在單一指令內完成，如果這些修改動作執行到一半的時候，線程被切換了，就會造成上述的競爭情況。

|高階語言   | 組合語言        |對應動作     |
|-----------|-----------------|-------------|
|counter ++	| LD  R1, counter |R1 = counter |
|					  | ADD R1, R1, 1   |R1 = R1 + 1  |
|					  | ST  R1, counter |counter = R1 |

這種競爭情況對程式設計者而言是無法接受的，如果程式的執行結果無法確保，那所有的程式都將陷入一團混亂，連 counter++ 這樣的動作都有問題的話，那任何多線程的程式都將無法正確運作。

為了避免這樣的問題產生，一個可能的解決方法是採用鎖定 (lock) 的方式，當我們執行共用變數的修改時，先進行鎖定，讓其他的線程無法同時修改該變數，等到修改完畢後解索後，其他的線程才能修改該變數，這樣就能避免掉競爭情況的問題了。

但是、一但我們能夠進行鎖定的動作，那就可能會造成上述的死結情況，這也正是 Thread 與死結之間的關係，讓我們用一句話總結如下：

	因為多線程的程式會有競爭情況，為了避免該情況而引入了鎖定機制，
    但是鎖定機制用得不好就會造成死結。

讓我們先用程式來驗證競爭情況的存在，以下是一個 C# 的競爭情況範例 (當然這種競爭情況是我們刻意造成的)。

檔案：RaceConditon.cs

```CS
using System;
using System.Threading;
using System.Collections.Generic;

class RaceCondition
{
    static int counter = 0, R1 = 0;
    static void Main(string[] args)
    {
        Thread thread1 = new Thread(inc);
        Thread thread2 = new Thread(dec);
        thread1.Start();
        thread2.Start();
        thread1.Join();
        thread2.Join();
    }

    static Random random = new Random();

    static void waitAndSee(String msg)
    {
        Thread.Sleep(random.Next(0, 10));
        Console.WriteLine(msg+"     R1:"+R1+" counter:"+counter);
    }

    static void inc()
    {
        R1 = counter;
        waitAndSee("inc:R1 = counter");
        R1 = R1 + 1;
        waitAndSee("inc:R1 = R1 + 1 ");
        counter = R1;
        waitAndSee("inc:counter = R1");
    }

    static void dec()
    {
        R1 = counter;
        waitAndSee("dec:R1 = counter");
        R1 = R1 - 1;
        waitAndSee("dec:R1 = R1 - 1 ");
        counter = R1;
        waitAndSee("dec:counter = R1");
    }
}
```

執行結果

```
D:\Dropbox\Public\cs\code>RaceCondition
inc:R1 = counter     R1:0 counter:0
dec:R1 = counter     R1:0 counter:0
inc:R1 = R1 + 1      R1:0 counter:0
inc:counter = R1     R1:0 counter:0
dec:R1 = R1 - 1      R1:0 counter:0
dec:counter = R1     R1:0 counter:0

D:\Dropbox\Public\cs\code>RaceCondition
inc:R1 = counter     R1:0 counter:0
inc:R1 = R1 + 1      R1:0 counter:0
dec:R1 = counter     R1:0 counter:0
inc:counter = R1     R1:-1 counter:0
dec:R1 = R1 - 1      R1:-1 counter:0
dec:counter = R1     R1:-1 counter:-1
```
	
要解決以上的競爭情況，必須採用一些協調 (Cooperation) 方法，C# 當中所提供的主要協調方法是 lock 這個語句。簡單來說，C# 的 lock 的實作方式就是採用作業系統教科書中所說的 Monitor 之方法，只是在 lock 的開始加入 Monitor.Enter() 語句，然後在 lock 的結束加入 Monitor.Exit() 語句而已，其方法如下所示。

|C# lock					|Monitor 語句            |
|-----------------|------------------------|
|lock (_locker) {	|Monitor.Enter(_locker); |
|   ...						|...					           |
|   critical();   |critical();             |
|   ...           |...                     |
|}							  |Monitor.Exit(_locker);  |

使用 lock 的方式，我們可以很輕易的解決上述程式的競爭情況，以下是該程式加入 lock 機制後的程式碼與執行結果。

檔案：RaceConditonLock.cs

```CS
using System;
using System.Threading;
using System.Collections.Generic;

class RaceConditionLock
{
    static int counter = 0, R1 = 0;
	static String counterLocker = "counterLocker";
	
    static void Main(string[] args)
    {
        Thread thread1 = new Thread(inc);
        Thread thread2 = new Thread(dec);
        thread1.Start();
        thread2.Start();
        thread1.Join();
        thread2.Join();
    }

    static Random random = new Random();

    static void waitAndSee(String msg)
    {
        Thread.Sleep(random.Next(0, 10));
        Console.WriteLine(msg+"     R1:"+R1+" counter:"+counter);
    }

    static void inc()
    {
		lock (counterLocker) {
			R1 = counter;
			waitAndSee("inc:R1 = counter");
			R1 = R1 + 1;
			waitAndSee("inc:R1 = R1 + 1 ");
			counter = R1;
			waitAndSee("inc:counter = R1");
		}
    }

    static void dec()
    {
		lock (counterLocker) {
			R1 = counter;
			waitAndSee("dec:R1 = counter");
			R1 = R1 - 1;
			waitAndSee("dec:R1 = R1 - 1 ");
			counter = R1;
			waitAndSee("dec:counter = R1");
		}
    }
}

```

執行結果

```
D:\Dropbox\Public\cs\code>csc RaceConditionLock.cs
適用於 Microsoft (R) .NET Framework 4.5 的
Microsoft (R) Visual C# 編譯器版本 4.0.30319.17929
Copyright (C) Microsoft Corporation. 著作權所有，並保留一切權利。


D:\Dropbox\Public\cs\code>RaceConditionLock
inc:R1 = counter     R1:0 counter:0
inc:R1 = R1 + 1      R1:1 counter:0
inc:counter = R1     R1:1 counter:1
dec:R1 = counter     R1:1 counter:1
dec:R1 = R1 - 1      R1:0 counter:1
dec:counter = R1     R1:0 counter:0

D:\Dropbox\Public\cs\code>RaceConditionLock
inc:R1 = counter     R1:0 counter:0
inc:R1 = R1 + 1      R1:1 counter:0
inc:counter = R1     R1:1 counter:1
dec:R1 = counter     R1:1 counter:1
dec:R1 = R1 - 1      R1:0 counter:1
dec:counter = R1     R1:0 counter:0

D:\Dropbox\Public\cs\code>RaceConditionLock
inc:R1 = counter     R1:0 counter:0
inc:R1 = R1 + 1      R1:1 counter:0
inc:counter = R1     R1:1 counter:1
dec:R1 = counter     R1:1 counter:1
dec:R1 = R1 - 1      R1:0 counter:1
dec:counter = R1     R1:0 counter:0
```

## 號誌 (Semaphore) 與生產者/消費者問題


```CS
using System;
using System.Threading;
using System.Collections.Generic;

class ProducerConsumer
{
    static readonly int BUFFER_SIZE = 4;
    static Queue<int> circularBuffer = new Queue<int>(BUFFER_SIZE);
    static Semaphore semaFilledSlots = new Semaphore(0, BUFFER_SIZE);
    static Semaphore semaUnfilledSlots = new Semaphore(BUFFER_SIZE, BUFFER_SIZE);
    static Mutex mutex = new Mutex(false);

    static void Main(string[] args)
    {
        Thread producer = new Thread(new ThreadStart(produce));
        Thread consumer = new Thread(new ThreadStart(consume));
        producer.Start();
        consumer.Start();
        producer.Join();
        consumer.Join();
    }

    static Random random = new Random();

    private static void produce()
    {
        while (true)
        {
            Thread.Sleep(random.Next(0, 500));
            int produceNumber = random.Next(0, 20);
            Console.WriteLine("Produce: {0}", produceNumber);

            semaUnfilledSlots.WaitOne(); 	// wait(semaUnfilledSlots)
            mutex.WaitOne();				// wait(mutex)
            
            queue.Enqueue(produceNumber);

            mutex.ReleaseMutex();           // signal(mutex)
            semaFilledSlots.Release();		// signal(semaFilledSlots)

            if (produceNumber == 0)
                break;
        }
    }

    private static void consume()
    {
        while (true)
        {
            semaFilledSlots.WaitOne(); 		// wait(semaFilledSlots)
            mutex.WaitOne();				// wait(mutex)
            int number = circularBuffer.Dequeue();
            Console.WriteLine("Consume: {0}", number);

            mutex.ReleaseMutex();       	// signal(mutex)
            semaUnfilledSlots.Release();	// signal(semaUnfilledSlots)
            if (number == 0)
                break;
            Thread.Sleep(random.Next(0, 1000));
        }
    }
}
```	

執行結果

```
D:\Dropbox\Public\cs\code>csc ProducerConsumer.cs
適用於 Microsoft (R) .NET Framework 4.5 的
Microsoft (R) Visual C# 編譯器版本 4.0.30319.17929
Copyright (C) Microsoft Corporation. 著作權所有，並保留一切權利。


D:\Dropbox\Public\cs\code>ProducerConsumer
Produce: 9
Consume: 9
Produce: 8
Consume: 8
Produce: 2
Consume: 2
Produce: 6
Produce: 0
Consume: 6
Consume: 0
```

另外、在作業系統中有個多行程的經典問題稱為 Dining Philospher (哲學家用餐) 問題，也可以採用 lock 的方法解決，由於這個問題實務上比較不那麼常用，本文中就不再詳細探討此一問題，有興趣的朋友可以看看網路上的解決方法，像是以下這篇 java2s 當中的程式就用 C# 實作解決了此一問題。

* <http://www.java2s.com/Tutorial/CSharp/0420__Thread/DiningPhilosopher.htm>

在本章中，我們購過透過實作的方式，讓讀者感受作業系統當中的 Thread、Deadlock、Race Condition、與 Semaphore 等概念，希望這樣的說明方式對讀者會有所幫助。

## 參考文獻
* Threading in C#, Joseph Albahari (超讚！)
	* <http://www.albahari.com/threading/>
	
