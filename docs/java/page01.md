# cglib动态代理

## 导入依赖
使用maven创建项目，在pom.xml中添加以下依赖：
```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>2.2.2</version>
</dependency>
```

## 代码示例

### 创建要代理的类
```java
public class Dog {
    public void say(){
        System.out.println("汪汪汪......");
    }
}
```

### 创建代理类
```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class CglibProxy implements MethodInterceptor {

    //    要代理的目标类
    private Object terget;

    public CglibProxy(Object terget) {
        this.terget = terget;
    }


    //    获取代理对象
    public Object getProxy(){
//        通过Enhancer对象中的create()方法生成一个类,用于生成代理对象
        Enhancer enhancer = new Enhancer();
//        设置父类 (将目标类作为代理类的父类)
        enhancer.setSuperclass(terget.getClass());
//        设置拦截器,回调对象为本身对象
        enhancer.setCallback(this);
//        生成代理类对象并返回
        return enhancer.create();
    }

//    拦截器(用于调用或增强目标方法)
//    intercept(cglib动态生成的代理类实例,实体类的方法,参数列表,生成代理类对方法的代理引用)
    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        //        增强行为
        System.out.println("有陌生人来了");
        Object o1 = methodProxy.invoke(terget, objects);
        //        增强行为
        System.out.println("陌生人走了,狗不叫了......");
        return o1;
    }
}
```
### 测试
```java
public class ProxyTest {
    public static void main(String[] args) {
        Dog proxy = (Dog) new CglibInterceptor(new Dog()).getProxy();
        proxy.say();
    }
}
```
