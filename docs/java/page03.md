# IO

## 创建文件
使用`new File`创建单个文件😜
```java
String filePath = "e:\\news1.txt";
File file = new File(filePath);
file.createNewFile();
System.out.println("文件创建成功");   
```

使用`new File(File parentFile,String child)`创建父目录+子路径文件😜
```java
File parentFile = new File("e:\\");
String fileName = "news2.txt";
File file = new File(parentFile, fileName);
// 执行了createNewFile()才是真正创建文件
file.createNewFile();     
```

## 创建文件夹
```java
String dirPath = "e:/demo/a/b/c";
File file = new File(dirPath);
// exists() 判断文件是否存在
if (file.exists())
{
    System.out.println(dirPath + "存在");
} else
{
    // 创建多级目录必须用mkdirs,创建一级目录可以用mkdir
    if (file.mkdirs())
    {
        System.out.println(dirPath + "创建成功");
    } else
    {
        System.out.println(dirPath + "创建失败");
    }
}
```

## 删除文件(文件夹)
```java
File file = new File("e:\\news1.txt");
if (file.exists())
{
    // delete() 删除文件或空文件夹
    // delete() 删除非空文件夹会报错
    // delete() 删除文件夹时，必须保证文件夹是空的
    if (file.delete())
    {
        System.out.println("删除成功");
    } else
    {
        System.out.println("删除失败");
    }
} else
{
    System.out.println("文件不存在");
}
```

## 获取文件信息
```java
// 创建文件对象
File file = new File("e:\\news1.txt");
// 调用相应的方法,得到对应信息
System.out.println("文件名字 => " + file.getName());
System.out.println("文件的绝对路径 => " + file.getAbsolutePath());
System.out.println("文件父级目录 => " + file.getParent());
System.out.println("文件大小(字节) => " + file.length());
System.out.println("文件是否存在 => " + file.exists());
System.out.println("是不是一个文件 => " + file.isFile());
System.out.println("是不是一个目录 => " + file.isDirectory());
```

## 字节输入流(FileInputStream)
```java
String filePath = "e:/hello.txt";
// 创建FileInputStream对象,用于读取文件
FileInputStream inputStream = new FileInputStream(filePath);
// 从输入流中读取1个字节的数据,如果没有输入,此方法将阻止,如果返回-1,表示读取完毕
int readData = 0;
// read()只能一个一个字节读取,效率低
while ((readData = inputStream.read()) != -1)
{
    System.out.print((char) readData);
}
// 关闭文件流,释放资源
inputStream.close();
```

```java
String filePath = "e:/hello.txt";
// 创建FileInputStream对象,用于读取文件
FileInputStream inputStream = new FileInputStream(filePath);
// 从输入流中读取1个字节的数据,如果没有输入,此方法将阻止,如果返回-1,表示读取完毕
int readLen = 0;//保存当次读取的字符长度
// 字节数组
byte[] buff = new byte[3];//一次读取3个字节
// inputStream.read(buff)读取正常返回实际读取的字节数
while ((readLen = inputStream.read(buff)) != -1)
{
    System.out.print(new String(buff, 0, readLen));
}
// 关闭文件流,释放资源
inputStream.close();
```

## 字节输出流(FileOutputStream)
```java
// 要写入内容的文件路径
String filePath = "e:/hi.txt";
// FileOutputStream(filePath); 这种创建方式,当写入内容时,会覆盖掉原来的内容
// FileOutputStream(filePath,true);这种创建方式,当写入内容时,会追加内容到文件后面
FileOutputStream fileOutputStream = new FileOutputStream(filePath,true);
// 写入一个字节
// fileOutputStream.write('A');
// 写入字符串
String str = "hello outputStream";
// str.getBytes() 可以把 字符串 -> 字节数组
// fileOutputStream.write(str.getBytes());
// 将len字节从位于偏移量off的指定字节数组写入此文件的输出流
// fileOutputStream.write(byte[] b, int off, int len);
fileOutputStream.write(str.getBytes(), 0, str.length());
// 关闭流
fileOutputStream.close();
```

## 使用字节流拷贝文件
```java
// 要拷贝内容的文件
String p1 = "e:/hello.txt";
// 保存拷贝内容的文件
String p2 = "e:/hello1.txt";
// 获取输入流
FileInputStream is = new FileInputStream(p1);
// 获取输出流
FileOutputStream os = new FileOutputStream(p2);
// 定义一个字节数组,提高读取效果
byte[] buf = new byte[1024];
int readLen = 0;
// 读取p1的内容写入p2
while ((readLen = is.read(buf)) != -1)
{
    // 写入文件,一定要用write(buf,0,readLen)，不然可能会乱码
    os.write(buf,0,readLen);
}
System.out.println("拷贝完成...");
os.close();
is.close();
```

## 字符输入流(FileReader)
```java
// 文件路径
String path = "e:/hello.txt";
// 创建FileReader对象
FileReader fileReader = new FileReader(path);
// 定义一个char
int data = 0;
// 循环读取,使用read(单个字符读取)
// while ((data = fileReader.read()) != -1)
// {
//      System.out.print((char) data);
// }
// 循环读取,使用read(char[] buf) ,字符数组读取,提高效率,返回的是实际读取的字符数
int readLen = 0;
char[] buf = new char[8];
while ((readLen = fileReader.read(buf)) != -1)
{
    // 把字符装成字符串
    System.out.print(new String(buf, 0, readLen));
}
// 关闭字符流
fileReader.close();
```

## 字符输出流(FileWriter)
一定要关闭流,或者flush(),才能真正把数据写入文件🧐
```java
// 文件路径
String path = "e:/haha.txt";
// 创建FileWriter对象,默认写入是覆盖原来的内容
FileWriter fileWriter = new FileWriter(path);
// write(int):写入单个字符
fileWriter.write('a');
// write(char[] c)写入指定数组
char[] c = {'a', 'b', 'c'};
fileWriter.write(c);
// write(char[] c, off, len)写入指定数组的指定部分
fileWriter.write("玉树临风美少年".toCharArray(), 0, 3);
// write(String),写入整个字符串
fileWriter.write("玉树临风美少年");
// write(String, off, len),写入字符串的指定部分
fileWriter.write("揽镜自顾夜不眠", 0, 3);
// 关闭流,对于FileWriter,一定要关闭流,或者flush(),才能真正把数据写入文件
// fileWriter.flush();
fileWriter.close(); // 关闭文件流相当于 flush() + close()
```

## BufferedReader
```java
// 文件路径
String path = "e:/hello.txt";
// 创建BufferedReader对象
BufferedReader buffer = new BufferedReader(new FileReader(path));
// 读取文件
String line; // 按行读取,效率高
// 按行读取,当返回null时,表示文件读取完毕
while ((line = buffer.readLine()) != null)
{
    System.out.println(line);
}
// 关闭流,这里只需要关闭BufferedReader,底层会自动去关闭节点流
buffer.close();
```

## BufferedWriter
```java
// 文件路径
String path = "e:/hi.txt";
// 创建BufferedWriter对象
// 默认写入文件是覆盖,new FileWriter(path,true),这样是追加
BufferedWriter writer = new BufferedWriter(new FileWriter(path, true));
// 向文件写入内容
writer.write("玉树临风美少年,揽镜自顾夜不眠");
writer.newLine(); // 插入一个和系统相关的换行
int i = 0;
while (i < 5)
{
    writer.write("玉树临风美少年,揽镜自顾夜不眠");
    writer.newLine(); // 插入一个和系统相关的换行
    i++;
}
// 关闭流,关闭外层流即可
writer.close();
```

## 拷贝文件
这种方式是不是比上面的要简洁的多😜
```java
// 文件路径
String p1 = "e:/hi.txt";
String p2 = "e:/hi1.txt";
// 输入流
BufferedReader reader = new BufferedReader(new FileReader(p1));
// 输出流
BufferedWriter writer = new BufferedWriter(new FileWriter(p2));
// 拷贝文件
String line; // 读的只是一行数据,没有换行符,要自己换行
while ((line = reader.readLine()) != null)
{
    writer.write(line);
    writer.newLine(); // 写一行换一行
}
// 关闭流
writer.close();
reader.close();
```

## BufferedInputStream和BufferedOutputStream
使用方法跟上面的差不多,就直接用拷贝文件的例子来演示一下😜
```java
// 文件路径
String p1 = "e:/bg.jpg";
String p2 = "e:/bg1.jpg";
// 创建BufferedInputStream和BufferedOutputStream对象
BufferedInputStream bis = new BufferedInputStream(new FileInputStream(p1));
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(p2));
// 循环读取文件
byte[] buf = new byte[1024]; // 缓冲数组
int len = 0; // 当次读取长度
while ((len = bis.read(buf)) != -1) // 当返回-1表示读取完毕
{
    bos.write(buf, 0, len);
}
// 关闭流
bos.close();
bis.close();
```

## 序列化保存数据(ObjectOutputStream)
保存值和数据类型称为序列化,把保存的值和数据类型恢复成原来的样子称为反序列化🧐
> 序列化注意事项:
>
> 1、读写顺序要一致
>
> 2、要求序列化或反序列化对象，需要实现Serializable
>
> 3、序列化的类中建议添加SerialVersionUID。为了提高版本的兼容性
>
> 4、序列化对象时，默认将里面所有属性都进行序列化，但除了static或transient修饰的成员
>
> 5、序列化对象时，要求里面属性的类型也需要实现序列化接口
>
> 6、序列化具备可继承性，也就是如果某类已经实现了序列化，则它的所有子类也已经默认实现了序列化
```java
/**
 * 实现Serializable接口
 */
public class Dog implements Serializable{
    //...
}
```

```java
// 保存文件的路径,序列化后保存的格式不是纯文本,而是按照他的格式(.dat)来保存
String path = "e:/data.dat";
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(path));
// 序列化数据到 e:/data.dat中
oos.writeInt(100); // int -> Integer (实现了Serializable接口,可以序列化)
oos.writeBoolean(true); // boolean -> Boolean (实现了Serializable接口,可以序列化)
oos.writeChar('a'); // char -> Character (实现了Serializable接口,可以序列化)
oos.writeDouble(9.9); // double -> Double (实现了Serializable接口,可以序列化)
oos.writeUTF("玉树临风美少年,揽镜自顾夜不眠"); // String (实现了Serializable接口,可以序列化)
// 保存一个Dog对象
oos.writeObject(new Dog("旺财", 10));
// 关闭流
oos.close();
System.out.println("数据保存完毕(序列化形式)");
```

## 反序列化读取数据(ObjectInputStream)
读取(反序列化)的顺序需要和你保存数据(序列化)的顺序一致,否则会出现异常😜
```java
// 序列化文件的路径
String path = "e:/data.dat";
ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path));
// 读取(反序列化)的顺序需要和你保存数据(序列化)的顺序一致,否则会出现异常
System.out.println(ois.readInt());
System.out.println(ois.readBoolean());
System.out.println(ois.readChar());
System.out.println(ois.readDouble());
System.out.println(ois.readUTF());
Object dog = ois.readObject();
System.out.println("运行类型 => " + dog.getClass());
System.out.println("dog信息 => " + dog); // 底层 Object -> Dog
// 如果要调用Dog类中的方法,Dog类的位置要可以找到,还要向下转型
Dog dog1 = (Dog) dog;
System.out.println(dog1.getName());
// 关闭流,关闭外层流即可
ois.close();
```

## 标准输入输出流
```java
// System.in 类的 public static final InputStream in = null;
// System.in 编译类型 InputStream
// System.in 运行类型 BufferedInputStream
// 标准输入流 键盘
System.out.println(System.in.getClass());
// System.out 类的 public static final PrintStream out = null;
// System.out 编译类型 PrintStream
// System.out 运行类型 PrintStream
// 标准输出流 显示器
System.out.println(System.out.getClass());
```

## InputStreamReader
默认情况下,读取文件是按照utf-8编码读取,如果文件是其他编码保存的就会出现乱码问题,所以需要将字节流转换成字符流并指定编码格式😜
```java
String path = "e:/hello.txt";
// 将字节流转换成字符流并指定编码,指定编码为GBK
// InputStreamReader isr = new InputStreamReader(new FileInputStream(path), "gbk");
// BufferedReader br = new BufferedReader(isr);
// 压缩成一句
BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(path), "gbk"));
// 读取
String line;
while ((line = br.readLine()) != null)
{
    System.out.println(line);
}
// 关闭流
br.close();
```

## OutputStreamWriter
同样输出也可以指定编码格式😜
```java
String path = "e:/hi.txt";
BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path), "gbk"));
bw.write("玉树临风美少年,揽镜自顾夜不眠");
bw.close();
```

## PrintSteam
```java
PrintStream out = System.out;
// 在默认情况下,PrintStream 输出数据的位置是 标准输出,即显示器
out.print("玉树临风美少年");
// 因为print底层使用的是write,所以我们可以直接调用write进行打印/输出
out.write("揽镜自顾夜不眠".getBytes());
out.close();
// 我们可以修改打印流输出的位置/设备
System.setOut(new PrintStream("e:/haha.txt")); // 修改输出位置到e:/haha.txt
System.out.println("玉树临风美少年,揽镜自顾夜不眠");
```

## PrintWriter
```java
// PrintWriter printWriter = new PrintWriter(System.out);
PrintWriter printWriter = new PrintWriter(new FileWriter("e:/haha.txt")); // 指定输入位置
printWriter.print("玉树临风美少年");
printWriter.close(); // PrintWriter如果不关闭,就不会把内容真正写入文件
```