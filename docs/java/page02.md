# java定时任务

## Timer
Timer 是 JDK 自带的定时任务执行类，优点是方便，缺点是任务如果执行时间太长或者是任务执行异常，会影响其他任务调度，所以在生产环境下建议谨慎使用。

```java
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class TimerTest {
    public static void main(String[] args) {
//        定时任务
        TimeTask timeTask = new TimeTask();
//        计时器
        Timer t = new Timer();
//        添加执行任务schedule(定时任务,延迟时间,执行时间间隔);
        t.schedule(timeTask, 0, 2000);
    }
}

class TimeTask extends TimerTask {

    @Override
    public void run() {
        System.out.println("当前时间 => " + new Date());
    }
}
```

## ScheduledExecutorService

ScheduledExecutorService 是 JDK 1.5 自带的 API，ScheduledExecutorService 可以实现 Timer 类具备的所有功能，并且它可以解决了 Timer 类存在的所有问题。只有当任务的执行时间到来时，ScheduedExecutor 才会真正启动一个线程，其余时间 ScheduledExecutor 都是在轮询任务的状态。

```java
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TimerTest {
    public static void main(String[] args) {
// 创建任务队列
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);// 10 为线程数量
//       scheduleAtFixedRate(Runnable实现类,延时时间,间隔时间,给定单元粒度的时间段(下面会有说明));
        scheduledExecutorService.scheduleAtFixedRate(new Task(), 0, 2, TimeUnit.SECONDS);
    }
}

//任务类
class Task implements Runnable {

    @Override
    public void run() {
        System.out.println("当前时间 => " + new Date());
    }
}
```

**lambda表达式写法**

```java
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TimerTest {
    public static void main(String[] args) {
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);
        scheduledExecutorService.scheduleAtFixedRate(()->{
            System.out.println("当前时间 => " + new Date());
        },0,2, TimeUnit.SECONDS);
    }
}
```

### TimeUnit是java.util.concurrent包下面的一个类，表示给定单元粒度的时间段，主要作用：时间颗粒度转换、延时

**常用的颗粒度**

```java
TimeUnit.DAYS          //天
TimeUnit.HOURS         //小时
TimeUnit.MINUTES       //分钟
TimeUnit.SECONDS       //秒
TimeUnit.MILLISECONDS  //毫秒
```

**时间颗粒度转换**

```java
public long toMillis(long d)    //转化成毫秒
public long toSeconds(long d)  //转化成秒
public long toMinutes(long d)  //转化成分钟
public long toHours(long d)    //转化成小时
public long toDays(long d)     //转化天
```

#### 时间颗粒度转换用法

```java
import java.util.concurrent.TimeUnit;

public class TimerTest {
    public static void main(String[] args) {
//        一天有24个小时
        System.out.println(TimeUnit.DAYS.toHours(1));//24
//        一个小时有60分钟
        System.out.println(TimeUnit.HOURS.toMinutes(1));//60
//        一分钟有60秒
        System.out.println(TimeUnit.MINUTES.toSeconds(1));//60
//        一秒有1000毫秒
        System.out.println(TimeUnit.SECONDS.toMillis(1));//1000
//        把2天换算成小时(48小时)
        System.out.println(TimeUnit.HOURS.convert(2,TimeUnit.DAYS));//48
//        把2小时换算成分钟(120分钟)
        System.out.println(TimeUnit.MINUTES.convert(2,TimeUnit.HOURS));//120
    }
}
```

#### 延时用法

```java
import java.util.concurrent.TimeUnit;

public class TimerTest {
    public static void main(String[] args) {

        new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
                System.out.println("过去了2秒");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

## Spring Task
如果使用的是 Spring 或 Spring Boot 框架，可以直接使用 Spring Framework 自带的定时任务，使用上面两种定时任务的实现方式，很难实现设定了具体时间的定时任务，比如当我们需要每周五来执行某项任务时，但如果使用 Spring Task 就可轻松的实现此需求。SprngTask没有专门的包，其核心类位于spring-context包中。所以引入spring的核心包此功能即可使用**定时任务是自动触发的无需手动干预，也就是说 Spring 启动后会自动加载并执行定时任务。**

**记得要引入task的schema**

```xml
xmlns:task="http://www.springframework.org/schema/task"
http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task-3.2.xsd
```

**基于注解的使用**
在配置文件中打开注解

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:task="http://www.springframework.org/schema/task"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/context
                        http://www.springframework.org/schema/context/spring-context.xsd
                        http://www.springframework.org/schema/task
                        http://www.springframework.org/schema/task/spring-task-3.2.xsd">
<!--    自动扫描-->
    <context:component-scan base-package="com.demo1"/>
<!--    开启spring task注解模式-->
    <task:annotation-driven/>

</beans>
```

### 任务类
```java
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class Tasks {
	//cron 表达式(下面介绍)
    @Scheduled(cron = "0/2 * * * * ?")
    public void test(){
        System.out.println("我是定时任务1,当前时间为 => " + new Date());
    }

    @Scheduled(cron = "0/5 * * * * ?")
    public void test1(){
        System.out.println("我是定时任务2,当前时间为 => " + new Date());
    }
}
```

### 测试类
```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
    public static void main(String[] args) {
        //获取spring的上下文
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
        System.out.println("定时任务会自动启动...");
    }
}
```

**基于xml的使用**

配置xml文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:task="http://www.springframework.org/schema/task"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/context
                        http://www.springframework.org/schema/context/spring-context.xsd
                        http://www.springframework.org/schema/task
                        http://www.springframework.org/schema/task/spring-task-3.2.xsd">
<!--    自动扫描-->
    <context:component-scan base-package="com.demo1"/>
<!--    task xml配置 -->
    <task:scheduled-tasks>
<!--        第一个定时任务-->
        <task:scheduled ref="tasks" method="test" cron="0/2 * * * * ?"/>
<!--        第二个定时任务-->
        <task:scheduled ref="tasks" method="test1" cron="0/5 * * * * ?"/>
    </task:scheduled-tasks>
</beans>
```

去掉任务类的注解

```java
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class Tasks {

    public void test(){
        System.out.println("我是定时任务1,当前时间为 => " + new Date());
    }

    public void test1(){
        System.out.println("我是定时任务2,当前时间为 => " + new Date());
    }
}
```

测试

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring2.xml");
        System.out.println("定时任务会自动启动...");
    }
}
```

### Spring Task 的实现需要使用 cron 表达式来声明执行的频率和规则，cron 表达式是由 6 位或者 7 位组成的（最后一位可以省略），每位之间以空格分隔，每位从左到右代表的含义如下：

格式: [秒] [分] [小时] [日] [月] [周] [年]

| 序号 | 说明 | 是否必填 | 允许填写的值           | 允许的通配符  |
| :--: | ---- | -------- | ---------------------- | ------------- |
|  1   | 秒   | 是       | 0-59                   | , - * /       |
|  2   | 分   | 是       | 0-59                   | , - * /       |
|  3   | 小时 | 是       | 0-23                   | , - * /       |
|  4   | 日   | 是       | 1-31，要考虑月份的日期 | , - * ? / L W |
|  5   | 月   | 是       | 1-12 或者 JAN-DEC      | , - * /       |
|  6   | 周   | 是       | 1-7 或者 SUN-SAT       | , - * ? / L # |
|  7   | 年   | 否       | 1970-2099              | , - * /       |

通配符说明:

> \* 表示所有值. 例如:在分的字段上设置 "*",表示每一分钟都会触发。
>
>  ? 表示不指定值。使用的场景为不需要关心当前设置这个字段的值。例如:要在每月的10号触发一个操作，但不关心是周几，所以需要周位置的那个字段设置为"?" 具体设置为 0 0 0 10* ?
>
>  \- 表示区间。例如 在小时上设置 "10-12",表示 10,11,12点都会触发。
>
>  , 表示指定多个值，例如在周字段上设置 "MON,WED,FRI" 表示周一，周三和周五触发
>
>  / 用于递增触发。如在秒上面设置"5/15" 表示从5秒开始，每增15秒触发(5,20,35,50)。在月字段上设置'1/3'所示每月1号开始，每隔三天触发一次。
>
>  L 表示最后的意思。在日字段设置上，表示当月的最后一天(依据当前月份，如果是二月还会依据是否是润年[leap]), 在周字段上表示星期六，相当于"7"或"SAT"。如果在"L"前加上数字，则表示该数据的最后一个。例如在周字段上设置"6L"这样的格式,则表示“本月最后一个星期五"
>
>  W 表示离指定日期的最近那个工作日(周一至周五)
>
>  'L'和 'W'可以一组合使用。如果在日字段上设置"LW",则表示在本月的最后一个工作日触发
>
>  \# 序号(表示每月的第几个周几)，例如在周字段上设置"6#3"表示在每月的第三个周六.注意如果指定"#5",正好第五周没有周六，则不会触发该配置

[在线生成cron表达式的网站][1]

[1]:https://www.matools.com/cron/