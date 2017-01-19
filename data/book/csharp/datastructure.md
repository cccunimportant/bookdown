# C# 程式基礎：資料結構

## 容器函式庫

|一般型別            |泛型型別              |說明                                                                     |
|--------------------|----------------------|-------------------------------------------------------------------------|
|ArrayList           |`List< >`             |串列，以陣列實作的串列結構                                               |
|Queue               |`Queue< >`            |佇列，先進先出的結構                                                     |
|Stack               |`Stack< >`            |堆疊，後進先出的結構                                                     |
|Hashtable           |`Dictionary< >`       |雜湊表格，快速用 key 查找 value                                          |
|SortedList          |`SortedList< >`       |排序串列，使用排序與二分搜尋法的結構                                     |
|ListDictionary      |`Dictionary< >`       |字典，快速用 key 查找 value                                              |
|HybridDictionary    |`Dictionary< >`       |小集合採用 ListDictionary，集合變大時，會自動改用 Hashtable 的一種字典   |
|OrderedDictionary   |`Dictionary< >`       |比SortedList類別多了一些功能的類別                                       |
|SortedDictionary    |`SortedDictionary< >` |鍵值一定是字串，用法跟 Hashtable 相似                                    |
|NameValueCollection |`Dictionary< >`       |NameValueCollection可以單一索引鍵對應多重值                              |
|DictionaryEntry     |`KeyValPair< >`       |字典中的一個項目，(Key, Value) 的結構                                    |
|StringCollection    |`List<String>`        |用法跟ArrayList相似                                                      |
|StringDictionary    |`Dictionary<String>`  |字串字典                                                                 |

* 上層結構：Collection
* 容器物件：Array, ArrayList, HashTable, SortedList
* 位元容器：BitArray, BitVector32, 
* 泛型容器：NameValueCollection, Dictionary

## 容器的使用

範例：

```CS
using System;
using System.Collections;
using System.Collections.Generic;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            ArrayList a = new ArrayList();
            a.Add("John");
            a.Add(1);
            a.Add(3.1416);
            a.RemoveAt(2);

            Object[] array = a.ToArray();
            Console.WriteLine(array);

            List<Object> list = new List<Object>();
            list.Add("John");
            list.Add("Mary");
            list.Add("George");
            list.Add("3.14159");
            list.Add(3.14159);

            foreach (Object o in list)
                Console.Write(o+" ");
            Console.WriteLine();
            char c = 'A';
//            Console.Write("{0:X}", (int) c);

            Hashtable h = new Hashtable();
            h.Add("John", "0977332415");
            h.Add("Mary", "0977342415");
            h.Add("George", "0977372416");
            h.Add("Peter", "0977332425");
            String gtel = (String) h["George"];
            Console.WriteLine("George Tel : "+gtel);

            Dictionary<String, String> d = new Dictionary<string, string>();
            d.Add("John", "0977332415");
            d.Add("Mary", "0977342415");
            d.Add("George", "0977372416");
            d.Add("Peter", "0977332425");
            gtel = d["George"];
            Console.WriteLine("George Tel : " + gtel);

        }

    }
}
```
