# 网络编程

## TCP网络通信编程
### TCP协议
- TCP（Transmission Control Protocol，传输控制协议）是一种面向连接的、可靠的、基于字节流的传输层通信协议。
- TCP协议的特点：
  - 面向连接：通信双方必须先建立连接，才能进行数据的传输。在传输数据结束后，必须断开连接，以释放网络资源。
  - 可靠传输：TCP提供可靠的数据传输服务，保证数据能够准确、完整地传输到目的地。
  - 基于字节流：TCP以字节流的形式传输数据，没有数据边界，需要应用程序自己处理数据边界。🥴
### 字节流
#### 服务端
```java
// 在本机的9999端口监听,等待客户端连接
ServerSocket serverSocket = new ServerSocket(9999);
System.out.println("服务端程序在9999端口监听...");
// 没有客户端连接9999端口时,程序会阻塞,等待连接
// 如果有客户端连接,则会返回Socket对象,程序继续执行
// 细节: 这个ServerSocket可以通过serverSocket.accept()返回多个Socket(多个客户端连接服务器的并发)
Socket socket = serverSocket.accept();
System.out.println("服务端 socket => " + socket.getClass());
// 通过socket.getInputStream() 读取客户端写入到数据通道的数据
InputStream inputStream = socket.getInputStream();
// 读取
byte[] buf = new byte[1024];
int len = 0;
while ((len = inputStream.read(buf)) != -1)
{
    System.out.println(new String(buf, 0, len));
}

// 获取socket的输出流
OutputStream outputStream = socket.getOutputStream();
outputStream.write("年少不知富婆好,错报少女当成宝".getBytes());
// 设置结束标记
socket.shutdownOutput();
// 关闭流和socket
outputStream.close();
inputStream.close();
socket.close();
serverSocket.close(); // 关闭 serverSocket
System.out.println("服务端结束服务...");
```
#### 客户端
```java
// 要连接的服务端(ip,端口)
// InetAddress.getLocalHost()本机地址
Socket socket = new Socket(InetAddress.getLocalHost(), 9999);
System.out.println("客户端 socket => " + socket.getClass());
// 连接上后,生成Socket,通过socket.getOutputStream()输出信息
OutputStream outputStream = socket.getOutputStream();
// 通过输出流,写入数据到数据通道
outputStream.write("玉树临风美少年,揽镜自顾夜不眠".getBytes());
// 设置结束标记
socket.shutdownOutput();
// 获取输入流,读取数据
InputStream inputStream = socket.getInputStream();
byte[] buf = new byte[1024];
int len = 0;
while ((len = inputStream.read(buf)) != -1)
{
    System.out.println(new String(buf, 0, len));
}
// 关闭对象和socket,必须关闭
inputStream.close();
outputStream.close();
socket.close();
System.out.println("客户端退出...");
```

### 字符流
#### 服务端
```java
// 在本机的9999端口监听,等待客户端连接
ServerSocket serverSocket = new ServerSocket(9999);
System.out.println("服务端程序在9999端口监听...");
// 没有客户端连接9999端口时,程序会阻塞,等待连接
// 如果有客户端连接,则会返回Socket对象,程序继续执行
// 细节: 这个ServerSocket可以通过serverSocket.accept()返回多个Socket(多个客户端连接服务器的并发)
Socket socket = serverSocket.accept();
System.out.println("服务端 socket => " + socket.getClass());
// 通过socket.getInputStream() 读取客户端写入到数据通道的数据
InputStream inputStream = socket.getInputStream();
// 使用字符流读取,使用InputStreamReader将InputStream转换成字符流
BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
String s = br.readLine();
System.out.println(s);
// 获取socket的输出流,使用字符输出流回复信息
BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
bw.write("揽镜自顾夜不眠");
bw.newLine(); // 表示结束
bw.flush(); // 刷新数据,不然不会写入数据通道
// 关闭流和socket
bw.close();
br.close();
socket.close();
serverSocket.close(); // 关闭 serverSocket
System.out.println("服务端结束服务...");
```
#### 客户端
```java
// 要连接的服务端(ip,端口)
// InetAddress.getLocalHost()本机地址
Socket socket = new Socket(InetAddress.getLocalHost(), 9999);
System.out.println("客户端 socket => " + socket.getClass());
// 连接上后,生成Socket,通过socket.getOutputStream()输出信息
OutputStream outputStream = socket.getOutputStream();
// 通过输出流,写入数据到数据通道,使用字符流
BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(outputStream));
bw.write("玉树临风美少年");
bw.newLine(); // 插入一个换行符,表示写入内容结束,要求对方读取时使用readLine()
bw.flush(); // 如果使用字符流,需要手动刷新,否则数据不会写入到数据通道
// 获取字符输入流,读取数据
BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
String s = br.readLine();
System.out.println(s);
// 关闭对象和socket,必须关闭
br.close();
bw.close();
socket.close();
System.out.println("客户端退出...");
```