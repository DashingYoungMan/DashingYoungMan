# JDBC

## JDBC简介

`JDBC（Java Database Connectivity）`是`Java`语言中用来规范客户端程序如何来访问数据库的应用程序接口，提供了诸如查询和更新数据库中数据的方法。`JDBC`也是`Java`平台的一部分，它为访问不同的数据库提供了一种统一的途径，为开发者屏蔽了一些细节。😉

## JDBC API

`JDBC API`主要提供了以下接口和类：😃

- `DriverManager`：用于注册数据库驱动程序和管理与数据库的连接。
- `Connection`：表示与数据库的连接。
- `Statement`：用于执行SQL语句。
- `ResultSet`：用于存储查询结果。
- `SQLException`：用于处理数据库访问过程中发生的异常。

## JDBC连接数据库
在maven项目的`pom.xml`文件中加入mysql的驱动😁
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.22</version>
</dependency>
```
用代码连接mysql😁
```java
// 加载MySql5.0驱动
// Class.forName("com.mysql.jdbc.Driver")

// 加载MySql8.0驱动,8.0的驱动类名变了
Class.forName("com.mysql.cj.jdbc.Driver");

// mysql5.0
// String url = "jdbc:mysql:/ip:端口号/要连接的数据库名字";

// mysql8.0(8.0要配置时区不然连不上)
String url = "jdbc:mysql://ip:端口号/要连接的数据库名字?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true";
```
### 直接代码连接
```java
// 连接的url
String url = "jdbc:mysql://localhost:3306/demo?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true";
String admin = "root"; // 用户名
String pwd = "123456"; // 密码
// 加载驱动
Class.forName("com.mysql.cj.jdbc.Driver");
// 获得数据库连接
Connection conn = DriverManager.getConnection(url, admin, pwd);
// 操作数据库，实现增删改查
Statement stmt = conn.createStatement();
// 接收返回的结果集
ResultSet rs = stmt.executeQuery("select * from t_user");
// 遍历查询结果集
while (rs.next()) {
    // rs.getString 是获取表中对应列名的值,注意类型要对应,不然会报错
    System.out.println("username: " + rs.getString("username")
            + "\npassword: " + rs.getString("password")
            + "\nemail: " + rs.getString("email"));
}
// 关闭连接
rs.close();
stmt.close();
conn.close();
```
### 配置文件连接
创建配置文件`mysql.properties`(名字自己定义，我这里就是mysql.properties)😉
```properties
user=root
password=123456
url=jdbc:mysql://localhost:3306/demo?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true
driver=com.mysql.cj.jdbc.Driver
```
读取配置文件连接数据库😃
```java
// 通过properties对象获取配置文件的信息
Properties properties = new Properties();
// 加载本地的配置文件
properties.load(new FileInputStream("src/main/resources/mysql.properties"));
// 获取对应的信息
String user = properties.getProperty("user");
String password = properties.getProperty("password");
String url = properties.getProperty("url");
String driver = properties.getProperty("driver");
// 加载驱动
Class.forName(driver);
Connection connection = DriverManager.getConnection(url, user, password);
Statement statement = connection.createStatement();
ResultSet resultSet = statement.executeQuery("select * from t_user");
// 遍历查询的数据
while (resultSet.next()) {
    System.out.println("username: " + resultSet.getString("username")
            + "\npassword: " + resultSet.getString("password")
            + "\nemail: " + resultSet.getString("email"));
}
// 关闭连接
resultSet.close();
statement.close();
connection.close();
```

## SQL注入
`SQL注入`是利用某些系统没有对用户输入的数据进行充分检查,而在用户输入数据中注入非法的`SQL`语句段或者命令,恶意攻击数据库，直接使用`Statement`的话很容易就被恶意注入`SQL`代码。😨
### 演示一下简单的SQL注入
#### 准备一张表
```sql
create table admin(name varchar(20), pwd varchar(20));
```
#### 插入几条数据
```sql
insert into admin values('root','root');
insert into admin values('root1','root1');
insert into admin values('root2','root2');
```
#### 使用特殊的语法查出数据
可以看到，明明只想查name = 1 的数据，结果确把表中所有的数据都查出来了。😨
```sql
select * from admin where name = '1' or ' and pwd = ' or '1' = '1';
```
### Statement
演示一下用`Statement`会被SQL注入，运行下面的代码输入名字：`1 ' or`，密码：`or '1' = '1`，这时候就会提示登陆成功，这就说明`SQL`注入成功了。😱
```java
Scanner scanner = new Scanner(System.in);
System.out.print("输入名字:");
// 让用户输入名字和密码
// 演示SQL注入需要用nextLine()方法,next()方法当收到空格或者 ' 就是表示结束了
String name = scanner.nextLine();
System.out.print("输入密码:");
String pwd = scanner.nextLine();
Properties properties = new Properties();
properties.load(new FileInputStream("src/main/resources/mysql.properties"));
String user = properties.getProperty("user");
String password = properties.getProperty("password");
String url = properties.getProperty("url");
String driver = properties.getProperty("driver");
Connection connection = DriverManager.getConnection(url, user, password);
Statement statement = connection.createStatement();
// 让用户输入名字和密码查询数据
String sql = "select * from admin where name = '" + name + "' and pwd = '" + pwd + "'";
ResultSet resultSet = statement.executeQuery(sql);
if (resultSet.next()) // 如果查询到一条记录,说明该用户存在
{
    System.out.println("登陆成功");
}else
{
    System.out.println("登陆失败");
}
// 关闭连接
resultSet.close();
statement.close();
connection.close();
```

### PreparedStatement
`PreparedStatement`是预编译的`SQL`语句对象，是`Statement`的子接口，它能防止`SQL`注入，并且性能比`Statement`要好。同样输入名字：`1 ' or`，密码：`or '1' = '1`，这时候就不会提示登录成功，`SQL`注入失败了。😌
```java
Scanner scanner = new Scanner(System.in);
System.out.print("输入名字:");
// 让用户输入名字和密码
// 演示SQL注入需要用nextLine()方法,next()方法当收到空格或者 ' 就是表示结束了
String name = scanner.nextLine();
System.out.print("输入密码:");
String pwd = scanner.nextLine();
Properties properties = new Properties();
properties.load(new FileInputStream("src/main/resources/mysql.properties"));
String user = properties.getProperty("user");
String password = properties.getProperty("password");
String url = properties.getProperty("url");
String driver = properties.getProperty("driver");
Connection connection = DriverManager.getConnection(url, user, password);
// 让用户输入名字和密码查询数据
// SQL语句的? 相当于占位符
String sql = "select * from admin where name = ? and pwd = ?";
// 得到PreparedStatement对象,预处理sql语句,防止SQL注入
PreparedStatement preparedStatement = connection.prepareStatement(sql);
// 给?赋值
preparedStatement.setString(1,name); // 第一个?,注意类型
preparedStatement.setString(2,pwd); // 第二个?
/**
 *  执行查询语句(select)使用executeQuery()
 *  执行其他语句(update,instert,delete)使用executeUpdate()
 *  不要写出这样executeQuery(sql),上面已经预处理过了,这样写会报错
 */
ResultSet resultSet = preparedStatement.executeQuery();
if (resultSet.next()) // 如果查询到一条记录,说明该用户存在
{
    System.out.println("登陆成功");
} else
{
    System.out.println("登陆失败");
}
// 关闭连接
resultSet.close();
preparedStatement.close();
connection.close();
```

### preparedStatement的更新、修改和删除操作
```java
Scanner scanner = new Scanner(System.in);
System.out.print("输入名字:");
// 让用户输入名字和密码
String name = scanner.nextLine();
Properties properties = new Properties();
properties.load(new FileInputStream("src/main/resources/mysql.properties"));
String user = properties.getProperty("user");
String password = properties.getProperty("password");
String url = properties.getProperty("url");
String driver = properties.getProperty("driver");
Connection connection = DriverManager.getConnection(url, user, password);
// 添加数据
// String sql = "insert into admin values (?,?)";
// 修改(更新)数据
// String sql = "update admin set pwd = ? where name = ?";
// 删除数据
String sql = "delete from admin where name = ?";
PreparedStatement preparedStatement = connection.prepareStatement(sql);
// 赋值,注意执行语句中?的位置
preparedStatement.setString(1, name);
// preparedStatement.setString(1, pwd);
// 执行语句
int i = preparedStatement.executeUpdate();
System.out.println(i > 0 ? "执行成功" : "执行失败");
// 关闭连接
preparedStatement.close();
connection.close();
```
### preparedStatement的查询操作
```java
Properties properties = new Properties();
properties.load(new FileInputStream("src/main/resources/mysql.properties"));
String user = properties.getProperty("user");
String password = properties.getProperty("password");
String url = properties.getProperty("url");
String driver = properties.getProperty("driver");
Connection connection = DriverManager.getConnection(url, user, password);
String sql = "select * from admin";
PreparedStatement preparedStatement = connection.prepareStatement(sql);
ResultSet resultSet = preparedStatement.executeQuery();
while (resultSet.next())
{
    String name = resultSet.getString("name"); // 直接使用数据库中的列名获取当前行的数据
    String pwd = resultSet.getString(2); // 通过该行的第几列获取
    System.out.println(name + "\t" + pwd);
}
// 关闭连接
resultSet.close();
preparedStatement.close();
connection.close();
```

## 事务模拟及处理
比如转账操作过程中出现了异常，那么转账操作应该回滚，即撤销执行的sql语句，保证数据的一致性，这个时候就需要用到事务。事务的四大特性：原子性、一致性、隔离性、持久性。😉
```java
Connection connection = null;
PreparedStatement preparedStatement = null;
ResultSet resultSet = null;
try
{
    // 转账事务模拟
    // connection = xxx //省略获取连接,跟之前的操作一样
    //  默认情况下connection是自动提交,设置false不自动提交
    connection.setAutoCommit(false);
    // 组织sql语句 账户4转100给账户5
    String sql = "update tb_account set money = money - 100 where account_name = '账户4'";
    String sql1 = "update tb_account set money = money + 100 where account_name = '账户5'";
    // 预处理第一条sql语句
    preparedStatement = connection.prepareStatement(sql);
    // 执行第一条sql语句
    preparedStatement.executeUpdate();
    // 让程序出现异常
    int i = 1 / 0; // 只会成功执行上面的语句,下面的不会执行
    // 预处理第二条sql语句
    preparedStatement = connection.prepareStatement(sql1);
    // 执行第二条sql语句
    preparedStatement.executeUpdate();
    // 执行完sql语句后提交事务,因为上面的代码抛出了异常,所以不会执行到这里
    connection.commit();
} catch (SQLException throwables)
{
    // 在这里可以回滚事务,即撤销执行的sql语句
    try
    {
        // 默认事务回滚到事务开始的状态,保证数据的一致性
        connection.rollback();
    } catch (SQLException e)
    {
        e.printStackTrace();
    }
    throwables.printStackTrace();
} finally
{
    // 关闭连接
}
```

## 批处理
如果一条一条的插入数据，那么每插入一条数据就会执行一次sql语句，这样效率会非常低，所以可以使用批处理来解决这个问题。😉

要使用批处理需要在连接上加上rewriteBatchedStatements=true,让数据库支持批处理。😃
```properties
rewriteBatchedStatements=true
```
然后就可以在代码中使用😉
```java
// 使用批量方式添加5000条数据到表中
Connection connection = null;
PreparedStatement preparedStatement = null;
try
{
    // connection = xxx //省略获取连接,跟之前的操作一样
    // 添加数据的sql
    String sql = "insert into admin1 values(null,?,?)";
    preparedStatement = connection.prepareStatement(sql);
    System.out.println("开始插入数据...");
    // 开始时间
    long start = System.currentTimeMillis();
    for (int i = 0; i < 5000; i++)
    {
        preparedStatement.setString(1, "da" + i);
        preparedStatement.setString(2, "666" + i);
        // 将sql语句加入到批处理包中
        preparedStatement.addBatch();
        // 当有1000条数据时,批量执行一下
        if ((i + 1) % 1000 == 0)//存了1000条sql语句
        {
            // 批量执行语句
            preparedStatement.executeBatch();
            // 清空这1000条语句,让后面的语句重新加进来
            preparedStatement.clearBatch();
        }
    }
    long end = System.currentTimeMillis();//结束时间
    System.out.println("批量处理耗时: " + (end - start));

} catch (SQLException throwables)
{
    throwables.printStackTrace();
} finally
{
    // 关闭连接
}
```

## 连接池
连接池是创建和管理一个连接的缓冲池的技术，这些连接准备好被任何需要它们的线程使用。连接池在创建时被初始化，当应用程序需要连接时，连接池会提供一个连接，当应用程序使用完连接后，连接池会将连接回收，而不是关闭连接。这样可以减少创建和关闭连接的开销，提高程序的性能。😉

使用`Druid`连接池,在`maven`的`pom.xml`中加入依赖
```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.10</version>
</dependency>
```
编辑配置文件
```properties
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/demo?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true
username=root
password=123456
#初始化连接数
initialSize=10
#最小连接数
minIdle=5
#最大连接数
maxActive=50
#最大的等待时间(5秒)
maxWait=5000
```
使用
```java
// 创建properties对象读取配置文件
Properties properties = new Properties();
properties.load(new FileInputStream("src/main/resources/druid.properties"));
// 创建一个指定参数的数据连接池,druid的连接池
DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);
// 测试连接池效率,对MySql数据库进行 500000次连接
long start = System.currentTimeMillis();
for (int i = 0; i < 500000; i++)
{
    // 获取连接
    Connection connection = dataSource.getConnection();
    connection.close(); // 关闭连接
}
long end = System.currentTimeMillis();
System.out.println("连接池耗时: " + (end - start)); // 连接池耗时: 1014
```