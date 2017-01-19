# C# 網路程式：TCP 程式設計

## TCP 簡介

TCP 是一個連線導向的網路傳輸協定，程式通常在斷線之前會一直記住這個連線。在我們使用 Socket 函式庫設計 TCP 網路程式時，通常會讓一個 Thread 負責處理一條連線，這樣可以讓問題變得較為單純，因為不需要用表格去記住連線。

所以，在學習 TCP 程式設計之前，我們有必要先複習一下 Thread (台灣稱為執行緒、中國大陸稱為線程) 的程式設計方式，若讀者對 Thread 尚不熟悉，請先閱讀本書的 Thread 章節。

## TCP 的程式架構

TCP 客戶端的通常在連上伺服端後，就會用一個迴圈透過 Socket.send 函數傳送訊息，以下是一個典型的 TCP 客戶端程式。

客戶端：Client

```CS
        IPEndPoint ip = new IPEndPoint(IPAddress.Parse(address), port);
        Socket server = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        server.Connect(ip);
        ...
        while(true) {
            ...
            server.Send(data);
            ...
        }
        ...
        server.Shutdown(SocketShutdown.Both);
        server.Close();
```

TCP 伺服端通常較為複雜，首先在利用 Socket 中的 bind()  函數佔用特定的 port 之後，會再進入一個無窮迴圈，在迴圈中利用 socket.Accept() 接受客戶端的連線，此時會產生一個新的 Socket 物件。通常，我們會建立一個新的 Thread 去處理這個連線，因此在下列程式中，我們建立了 TcpListener 這個物件，以便讓一個 Listener 處理一個 Socket 連線。

伺服端：Server

```CS
public class TcpServer
{
    public static void Main()
    {
        IPEndPoint ip = new IPEndPoint(IPAddress.Any, port);
        Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        socket.Bind(ip);
        socket.Listen(10);
        while(true)
        {
            Socket client = socket.Accept();
            TcpListener listener = new TcpListener(client); // 建立 Listener 物件處理這個連線。
            Thread thread = new Thread(new ThreadStart(listener.run)); // 建立 listener.run 的 Thread。
            thread.Start(); // 啟動 Thread
            ...
        }
         ...
    }
}

public class TcpListener {
    Socket socket;

    public TcpListener(Socket s)  { socket = s; }

    public void run() { // Thread 的主要函數
        while (true)  {
            ...
            byte[] data = new byte[1024];
            int recv = socket.Receive(data); // 接收資料
            ...
        }
        socket.Close();
    }
}
```

以上就是一個典型的 TCP 程式架構，該架構包含了『客戶端-伺服端』兩個部分，客戶端透過 Socket.send 傳送訊息，而伺服端則會針對每一個連線，建立新的 Thread ，以便處理連線的互動關係。這種架構對 TCP 而言是較為簡單的，有幾個連線就建立幾個 Thread。由於這種架構不需要用表格記住連線，因此簡化了伺服端的管理，讓程式設計更為容易。

在理解了這個架構後，讓我們來看看幾個真實的程式範例：

## TCP 單向的訊息傳遞程式

由於網路程式必須有連線，因此至少要有兩個程式才能運作，通常主動連線的一方稱為 Client，被動等待連線的一方稱為 Server，這就是所謂的 Client - Server 架構。

在本範例中，我們撰寫了一個 TcpClient 與一個 TcpServer 程式，TcpClient 連線到 TcpServer 之後，會將使用者所輸入的文字傳司送給 TcpServer。當 TcpServer 收到這些文字之後會印出在螢幕上，這個範例示範了一個極為簡單的網路程式架構。

檔案：TcpClient1.cs

```CS
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

public class TcpClient
{
    public static void Main(string[] args)
    {
    	IPEndPoint ipep = new IPEndPoint(IPAddress.Parse(args[0]), 20);

    	Socket server = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
    	server.Connect(ipep);

    	while(true)
    	{
    	 string input = Console.ReadLine();
    	 if (input == "exit")
    	 break;
    	 byte[] data = Encoding.UTF8.GetBytes(input);
//	 byte[] data = Encoding.ASCII.GetBytes(input);
    	 server.Send(data);
    	}
    	Console.WriteLine("Disconnecting from server...");
    	server.Shutdown(SocketShutdown.Both);
    	server.Close();
    }
}
```

檔案：TcpServer1.cs

```CS
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class TcpServer
{
    public static void Main()
    {
        IPEndPoint ipep = new IPEndPoint(IPAddress.Any, 20);

        Socket newsock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

        newsock.Bind(ipep);
        newsock.Listen(10);

        while(true)
        {
         Socket client = newsock.Accept();
         IPEndPoint clientep = (IPEndPoint) client.RemoteEndPoint;
         Console.WriteLine("Client End Point = " + clientep);
         // create a new thread and then receive message.
         TcpListener listener = new TcpListener(client);
         Thread thread = new Thread(new ThreadStart(listener.run));
         thread.Start();
        }
//     newsock.Close();
    }
}

public class TcpListener {
    Socket socket;

    public TcpListener(Socket s)
    {
        socket = s;
    }

    public void run() 
    {
    	try {
          while (true) 
          {
            byte[] data = new byte[1024];
            int recv = socket.Receive(data);
            if (recv == 0) break;
            Console.WriteLine(Encoding.UTF8.GetString(data, 0, recv));
          }
          socket.Close();
        } catch (Exception e) {
    	  Console.WriteLine("Client "+socket.RemoteEndPoint+" Error : close");
    	  Console.WriteLine(e);
    	}
    }
}
```



## TCP 雙向聊天程式

聊天程式是學習網路程式設計很好的入門題目之一，在本文中，我們將示範如何用 C# 的 Socket 函式庫設計一個網路聊天程式。以下是這個程式的執行時的一個畫面，讀者可以看到我們在兩個命令列視窗中執行同一個 ChatBox 程式，左上角是 Server 程式，右下角是 Client 程式。

![聊天程式的執行畫面](ChatBox.jpg)

在上圖中，Client 可以傳送訊息給 Server ，而 Server 也可傳送訊息給 Client，由於雙方在這個傳送接收的動作上幾乎是相同的，因此在寫程式時就將這些動作封裝後共用，可以讓程式更為精簡，這就是 P2P 架構的程式。

當然，這個程式也可以放在兩台不同的電腦上執行，其結果將與上述結果類似，只是無法同時在一台電腦上看到輸入與輸出的結果而已。

以下是上述雙向聊天程式 ChatBox 的原始程式碼，其中的 TcpListener 程式是 Client-Server 雙方所共用的部分，因此獨立出來變成一個類別，並且分別在 Client 與 Server 主程式當中都用 new TcpListener() 的方式呼叫。此時雙方都會建立一個寫入迴圈 (outLoop) 與讀取回圈 (inLoop)，寫入迴圈不斷等待鍵盤的輸入，並在有輸入時將訊息傳遞給對方。而讀取回圈則是不斷接收對方所傳來的訊息並顯示在螢幕上。

```CS
using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.IO;
using System.Threading;

class ChatBox
{
    int port = 20;

    public static void Main(String[] args)
    {
    	ChatBox chatBox = new ChatBox();
    	if (args.Length == 0)
    	 chatBox.ServerMain();
    	else
    	 chatBox.ClientMain(args[0]);
    }

    public void ServerMain()
    {
    	IPEndPoint ipep = new IPEndPoint(IPAddress.Any, port);
    	Socket newsock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
    	newsock.Bind(ipep);
    	newsock.Listen(10);
    	Socket client = newsock.Accept();
    	new TcpListener(client); // create a new thread and then receive message.
    	newsock.Close();
    }

    public void ClientMain(String ip)
    {
    	IPEndPoint ipep = new IPEndPoint(IPAddress.Parse(ip), port);
    	Socket server = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
    	server.Connect(ipep);
    	new TcpListener(server);
    	server.Shutdown(SocketShutdown.Both);
    	server.Close();
    }

}

public class TcpListener
{
    Socket socket;
    Thread inThread, outThread;
    NetworkStream stream;
    StreamReader reader;
    StreamWriter writer;

    public TcpListener(Socket s)
    {
    	socket = s;
    	stream = new NetworkStream(s);
    	reader = new StreamReader(stream);
    	writer = new StreamWriter(stream);
    	inThread = new Thread(new ThreadStart(inLoop));
    	inThread.Start();
    	outThread = new Thread(new ThreadStart(outLoop));
    	outThread.Start();
    	inThread.Join(); // 等待 inThread 執行續完成，才離開此函數。 
    	// (注意、按照 inLoop 的邏輯，這個函數永遠不會跳出，因為 inLoop 是個無窮迴圈)。
    } 

    public void inLoop()
    {
    	while (true)
    	{
    	 String line = reader.ReadLine();
    	 Console.WriteLine("收到：" + line);
    	}
    }

    public void outLoop()
    {
    	while (true)
    	{
    	 String line = Console.ReadLine();
    	 writer.WriteLine(line);
    	 writer.Flush();
    	}
    }
}
```

## TCP 多人聊天室 (視窗版)

專案程式下載：<https://dl.dropbox.com/u/101584453/cs/code/ChattingRoom.zip>

使用方法

```
// ---------------------------------------------------------------
// 共有四個程式檔案
//
//  程式檔 : ChatLib.cs
//  程式檔 : ChattingServer.cs
//  程式檔 : FormChatClient.cs
//  程式檔 : FormChatClient.Designer.cs
//
// 編譯方式 : 
//    步驟 1 : csc ChatServer.cs ChatLib.cs
//             會產生 ChattingServer.exe 檔
//
//    步驟 2 : csc WinChatClient.cs FormChatClient.cs FormChatClilent.Designer.cs ChatLib.cs
//             會產生 WinChatClient.exe 檔
//     
// 執行方式 : 
//    步驟 1 : 執行 ChatServer.exe
//    步驟 2 : 執行 WinChatClient.exe (使用者 1)
//    步驟 3 : 執行 WinChatClient.exe (使用者 2)
//
// 如此，兩個 WinChatClient.exe 的視窗間即可透過本機聊天
// ---------------------------------------------------------------
```

檔案：ChatLib.cs

```CS
// ------------------------- ChatLib.cs --------------------------
using System;
using System.Net;
using System.Net.Sockets;
using System.IO;
using System.Threading;

namespace ChattingRoom
{
    public class ChatSetting
    {
        public static String serverIp = "192.168.100.172";
        public static int port = 3766;
    }

    public delegate String StrHandler(String str);

    public class ChatSocket
    {
        public Socket socket;
        public NetworkStream stream;
        public StreamReader reader;
        public StreamWriter writer;
        public StrHandler inHandler;
        public EndPoint remoteEndPoint;
        public bool isDead = false;

        public ChatSocket(Socket s)
        {
            socket = s;
            stream = new NetworkStream(s);
            reader = new StreamReader(stream);
            writer = new StreamWriter(stream);
            remoteEndPoint = socket.RemoteEndPoint;
        }

        public String receive()
        {
            return reader.ReadLine();
        }

        public ChatSocket send(String line)
        {
            writer.WriteLine(line);
            writer.Flush();
            return this;
        }

        public static ChatSocket connect(String ip)
        {
            IPEndPoint ipep = new IPEndPoint(IPAddress.Parse(ip), ChatSetting.port);

            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            socket.Connect(ipep);
            return new ChatSocket(socket);
        }

        public Thread newListener(StrHandler pHandler)
        {
            inHandler = pHandler;

            Thread listenThread = new Thread(new ThreadStart(listen));
            listenThread.Start();
            return listenThread;
        }

        public void listen()
        {
            try
            {
                while (true)
                {
                    String line = receive();
                    inHandler(line);
                }
            }
            catch (Exception ex)
            {
                isDead = true;
                Console.WriteLine(ex.Message);
            }
        }
    }
}
```

檔案：ChattingServer.cs


```CS
// ------------------------- ChatServer.cs -------------------
using System;
using System.Net;
using System.Net.Sockets;
using System.IO;
using System.Threading;
using System.Collections.Generic;

namespace ChattingRoom
{
    public class ChatServer
    {
        List<ChatSocket> clientList = new List<ChatSocket>();

        public static void Main(String[] args)
        {
            ChatServer chatServer = new ChatServer();
            chatServer.run();
        }

        public void run()
        {
            IPEndPoint ipep = new IPEndPoint(IPAddress.Any, ChatSetting.port);

            Socket newsock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

            newsock.Bind(ipep);
            newsock.Listen(10);

            while (true)
            {
                Socket socket = newsock.Accept();
                Console.WriteLine("接受一個新連線!");
                ChatSocket client = new ChatSocket(socket);
                try
                {
                    clientList.Add(client);
                    client.newListener(processMsgComeIn);
                }
                catch
                {
                }
//                clientList.Remove(client);
            }
            //	  newsock.Close();
        }

        public String processMsgComeIn(String msg)
        {
            Console.WriteLine("收到訊息："+msg);
            broadCast(msg);
            return "OK";
        }

        public void broadCast(String msg)
        {
            Console.WriteLine("廣播訊息給 " + msg+" 線上使用者共"+clientList.Count+"個人!");
            foreach (ChatSocket client in clientList)
            {
    	 if (!client.isDead) {
    	 Console.WriteLine("Send to "+client.remoteEndPoint.ToString()+":"+msg);
    	 client.send(msg);
    	 }
            }
        }
    }
}
```

檔案：FormChatClient.cs


```CS
// ------------------------- FormChatClient.cs -------------------
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace ChattingRoom
{
    public partial class FormChatClient : Form
    {
        ChatSocket client;
        StrHandler msgHandler;

        public FormChatClient()
        {
            InitializeComponent();

            msgHandler = this.addMsg;
        }

        private void buttonSend_Click(object sender, EventArgs e)
        {
            sendMsg();
        }
    	
    	private void textBoxMsg_KeyPress(object sender, KeyPressEventArgs e)
    	{
    	 if (e.KeyChar == '\r')
    	 sendMsg();
    	}

        public String user() {
            return textBoxUser.Text.Trim();
        }

        public String msg() {
            return textBoxMsg.Text;
        }

        public void sendMsg()
        {
            if (user().Length == 0)
            {
                MessageBox.Show("請輸入使用者名稱!");
                return;
            }
            if (client == null) {
                client = ChatSocket.connect(ChatSetting.serverIp);
                client.newListener(processMsgComeIn);
                client.send(user() + " : 新使用者進入!");
                textBoxUser.Enabled = false;
            }
            if (msg().Length > 0) {
                client.send(user()+" : "+msg());
    	 textBoxMsg.Text = "";
    	 }
        }

        public String processMsgComeIn(String msg)
        {
            this.Invoke(msgHandler, new Object[] { msg });
            return "OK";
        }

        public String addMsg(String msg)
        {
            richTextBoxBoard.AppendText(msg + "\n");
            return "OK";
        }
    }
}
```

檔案：FormChatClient.Designer.cs


```CS
// ------------------------- FormChatClient.Designer.cs ----------
namespace ChattingRoom
{
    partial class FormChatClient
    {
        /// <summary>
        /// 設計工具所需的變數。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清除任何使用中的資源。
        /// </summary>
        /// <param name="disposing">如果應該公開 Managed 資源則為 true，否則為 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 設計工具產生的程式碼

        /// <summary>
        /// 此為設計工具支援所需的方法 - 請勿使用程式碼編輯器修改這個方法的內容。
        ///
        /// </summary>
        private void InitializeComponent()
        {
            this.panelInput = new System.Windows.Forms.Panel();
            this.labelSaid = new System.Windows.Forms.Label();
            this.textBoxUser = new System.Windows.Forms.TextBox();
            this.textBoxMsg = new System.Windows.Forms.TextBox();
            this.buttonSend = new System.Windows.Forms.Button();
            this.panelPadding1 = new System.Windows.Forms.Panel();
            this.panelMsg = new System.Windows.Forms.Panel();
            this.richTextBoxBoard = new System.Windows.Forms.RichTextBox();
            this.panelInput.SuspendLayout();
            this.panelMsg.SuspendLayout();
            this.SuspendLayout();
            // 
            // panelInput
            // 
            this.panelInput.Controls.Add(this.labelSaid);
            this.panelInput.Controls.Add(this.textBoxUser);
            this.panelInput.Controls.Add(this.textBoxMsg);
            this.panelInput.Controls.Add(this.buttonSend);
            this.panelInput.Controls.Add(this.panelPadding1);
            this.panelInput.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panelInput.Location = new System.Drawing.Point(0, 283);
            this.panelInput.Name = "panelInput";
            this.panelInput.Size = new System.Drawing.Size(494, 64);
            this.panelInput.TabIndex = 0;
            // 
            // labelSaid
            // 
            this.labelSaid.AutoSize = true;
            this.labelSaid.Font = new System.Drawing.Font("DFKai-SB", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.labelSaid.Location = new System.Drawing.Point(94, 17);
            this.labelSaid.Name = "labelSaid";
            this.labelSaid.Size = new System.Drawing.Size(54, 21);
            this.labelSaid.TabIndex = 4;
            this.labelSaid.Text = "說：";
            // 
            // textBoxUser
            // 
            this.textBoxUser.Location = new System.Drawing.Point(3, 17);
            this.textBoxUser.Name = "textBoxUser";
            this.textBoxUser.Size = new System.Drawing.Size(88, 22);
            this.textBoxUser.TabIndex = 3;
            // 
            // textBoxMsg
            // 
            this.textBoxMsg.Location = new System.Drawing.Point(154, 17);
            this.textBoxMsg.Name = "textBoxMsg";
            this.textBoxMsg.Size = new System.Drawing.Size(250, 22);
            this.textBoxMsg.TabIndex = 2;
            this.textBoxMsg.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.textBoxMsg_KeyPress);
            // 
            // buttonSend
            // 
            this.buttonSend.Location = new System.Drawing.Point(410, 14);
            this.buttonSend.Name = "buttonSend";
            this.buttonSend.Size = new System.Drawing.Size(81, 28);
            this.buttonSend.TabIndex = 1;
            this.buttonSend.Text = "送出";
            this.buttonSend.UseVisualStyleBackColor = true;
            this.buttonSend.Click += new System.EventHandler(this.buttonSend_Click);
            // 
            // panelPadding1
            // 
            this.panelPadding1.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panelPadding1.Location = new System.Drawing.Point(0, 48);
            this.panelPadding1.Name = "panelPadding1";
            this.panelPadding1.Size = new System.Drawing.Size(494, 16);
            this.panelPadding1.TabIndex = 0;
            // 
            // panelMsg
            // 
            this.panelMsg.Controls.Add(this.richTextBoxBoard);
            this.panelMsg.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelMsg.Location = new System.Drawing.Point(0, 0);
            this.panelMsg.Name = "panelMsg";
            this.panelMsg.Size = new System.Drawing.Size(494, 283);
            this.panelMsg.TabIndex = 1;
            // 
            // richTextBoxBoard
            // 
            this.richTextBoxBoard.Dock = System.Windows.Forms.DockStyle.Fill;
            this.richTextBoxBoard.Location = new System.Drawing.Point(0, 0);
            this.richTextBoxBoard.Name = "richTextBoxBoard";
            this.richTextBoxBoard.Size = new System.Drawing.Size(494, 283);
            this.richTextBoxBoard.TabIndex = 0;
            this.richTextBoxBoard.Text = "";
            // 
            // FormChatClient
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(494, 347);
            this.Controls.Add(this.panelMsg);
            this.Controls.Add(this.panelInput);
            this.Name = "FormChatClient";
            this.Text = "C# 聊天室";
            this.panelInput.ResumeLayout(false);
            this.panelInput.PerformLayout();
            this.panelMsg.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panelInput;
        private System.Windows.Forms.Panel panelMsg;
        private System.Windows.Forms.TextBox textBoxMsg;
        private System.Windows.Forms.Button buttonSend;
        private System.Windows.Forms.Panel panelPadding1;
        private System.Windows.Forms.RichTextBox richTextBoxBoard;
        private System.Windows.Forms.Label labelSaid;
        private System.Windows.Forms.TextBox textBoxUser;
    }
}
```

檔案：Program.cs (主程式)

```CS
using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace ChattingRoom
{
    static class Program
    {
        /// <summary>
        /// 應用程式的主要進入點。
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new FormChatClient());
            Application.Exit();
        }
    }
}
```

