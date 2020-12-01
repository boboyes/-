// 引入必要的模块
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
// #### 代码题

// ### 一、将下面异步代码使用 Promise 的方式改进

setTimeout(function() {
    var a = 'hello'
    setTimeout(function() {
        var b = 'lagou'
        setTimeout(function() {
            var c = 'I ❤️ U'
            // console.log(a + b + c)
        }, 10);
    }, 10);
}, 10);

// 解答
let p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('hello')
    },0)
})
let p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('lagou')
    },0)
})
let p3 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('I ❤️ U')
    },0)
})
Promise.all([p1,p2,p3]).then(res=>{
    console.log(res[0] + res[1] + res[2],'一')
})


// ### 二、基于以下代码完成下面的四个练习

// 数据：horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 185000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 130000, in_stock: false }
]
// #### 练习1：使用组合函数 fp.flowRight() 重新实现下面这个函数
let isLastInStock = function(cars){
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car)
}
let isLastInStock2 = fp.flowRight(fp.prop('in_stock'),fp.last)
console.log(isLastInStock2(cars),'二- 练习1')

// #### 练习2：使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name

let firstName = fp.flowRight(fp.prop('name'),fp.first)
console.log(firstName(cars),'二-练习2')


// #### 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现
let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}

let averageDollarValue = function(vars){
    let dollar_values = fp.map(function(car){return car.dollar_value},cars)
    return _average(dollar_values)
}
// > 先定义获取某个对象中的 dollar_value 属性的函数，将该函数作为 fp.map 的数组元素处理函数，
// 再用 fp.flowRight 组合函数

// 待做...



// #### 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连续的小写字符串，把数组中的 name 转换为这种形式，例如：sanitizeNames(["Hello World"]) => ["hello_world"]
let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在 sanitizeNames 中使用它
// > 先定义获取某个对象中的 name 属性的函数，再定义转化为小写的函数，再将空格和下划线替换，,再用 fp.flowRight 组合函数

const sanitizeNames = fp.flowRight(fp.map(name=>_underscore(name)),fp.map(name=>fp.toLower(name)),fp.map(car=>car.name))
const sanitizeNames2 = fp.flowRight(fp.map(fp.flowRight(_underscore,fp.toLower)),fp.map(car=>car.name))
console.log(sanitizeNames(cars),sanitizeNames2(cars),'二-联系4')


// ### 三、基于下面提供的代码，完成后续的四个练习

// #### 练习1：使用 fp.add(x, y) 和 fp.map(f,x) 创建一个能让 functor 里的值增加的函数 ex1
let maybe = Maybe.of([5,6,1])
// > 函子对象的 map 方法可以运行一个函数对值进行处理，函y数的参数为传入 of 方法的参数；接着对传入的整个数组进行遍历，并对每一项执行 fp.add 方法
let ex1 = (y) => {
    return maybe.map(fp.map(fp.add(y)))
}
console.log(ex1(5),'三-练习1')

// #### 练习2：实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
// let ex2 = () => {
//     // 你需要实现的函数。。。
// }
// > 解答如下：
let ex2 = () => {
    return xs.map(fp.first)
}
console.log(ex2(),'三-练习2')


// #### 练习3：实现一个函数 ex3，使用 safeProp 和 fp.first 找到 user 的名字的首字母
let safeProp = fp.curry(function(x, o){
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
// let ex3 = () => {
//     // 你需要实现的函数。。。
// }
// > 调用 ex3 函数传入 user 对象，safeProp 是经过柯里化处理的，可以先传“属性”参数，后传“对象”参数。safeProp 函数处理后返回 user 的值，再调用fp.first 获取首字母
let ex3 = (user) => {
    return safeProp('name')(user).map(fp.first)
}
console.log(ex3(user),'三-练习3')


// #### 练习4：使用 Maybe 重写 ex4，不要有 if 语句
// let ex4 = function(n){
//     if(n){
//         return parseInt(n)
//     }
// }
// > MayBe 函子用来处理外部的空值情况，防止空值的异常，拿到函子的值之后进行 parseInt 转化
let ex4 = function(n){
    return Maybe.of(n).map(parseInt)
}
console.log(ex4('66.6'),ex4(null),ex4(undefined),'三-练习4')



// ### 四、手写实现 MyPromise 源码

// 要求：尽可能还原 Promise 中的每一个 API，并通过注释的方式描述思路和原理。【参考代码】
// 1.定义promise的三种状态PENDING,FULLFILLED,REJECTED
const PENDING = 'PENDING';
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'
class MyPromise {
    constructor(excutor){//2.首先promise接收一个立即执行函数作为参数
        try{//20.执行器异常处理
            excutor(this.resolve,this.reject) //3.该函数接受两个参数用于改变状态
        }catch(e){
            this.reject(e)
        }
        
    }
    status = PENDING;//4.定义初始状态
    value = undefined; //7.定义值的存储，以便传递向then
    reason = undefined; 
    successCallback = []; //11.存储回调
    failCallback = [] 
    resolve = value => {//5.改变状态
        if(this.status!==PENDING)return //6.状态一旦更改便无法再次改变
        this.value = value  //8.获取状态改变时传入的参数存储以便于向后传递
        this.status = FULLFILLED 
        // this.successCallback&&this.successCallback(this.value) //12.等到状态改变时再执行回调
        while(this.successCallback.length){  //14.依次执行多次调用then方法的函数
            // this.successCallback.unshift()(this.value)  
            this.successCallback.unshift()()  //23.存值是已经传递了参数，并且我们调用的是外层函数，因此不用再传值
        }
    }
    reject = reason => {
        if(this.status!==PENDING)return
        this.reason = reason
        this.status = REJECTED
        // this.failCallback&&this.failCallback(this.value)
        while(this.failCallback.length){
            this.failCallback.unshift()()
        }
    }
    then(successCallback,failCallback){//9.实现then方法，接受两个回调参数成功和失败
        let promise2 = new Promise((resolve,reject)=>{
            // 24.处理then方法中传递参数为空或不传时，不做处理把value或reason向下传递
            successCallback = successCallback?successCallback:value => value
            failCallback = failCallback?failCallback:reason => {throw reason}
            if(this.status===FULLFILLED){
                setTimeout(()=>{
                   try{ //21.then方法异常处理
                        // successCallback(this.value) 
                        let x = successCallback(this.value) //16.存储回调参数的返回值以便向后传递.注：如何向后传递，考虑用then返回的promise对象去把返回值向下传递。考虑把整块代码移入promise对象中，既能同步执行代码，又可以拿到resolve方法以便于传递返回值。
                        // resolve(x) 
                        //resolvePromise(x,resolve,reject)  //17.由于x值有可能为普通值  也有可能为promise对象，因此做判断后再传递
                        resolvePromise(promise2,x,resolve,reject)  //18.promise不允许then方法返回自身实例，因此该传入promise2做判断
                                                                //19.此处无法获取promise2实例，巧妙利用setTimeout解决问题
                   }catch(e){
                       reject(e)
                   }
                })
            }else if(this.status===REJECTED){
                setTimeout(()=>{
                    try{
                        let x = failCallback(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(e){
                        reject(e)
                    }
                })
            }else{//10.处理异步情况,调用then方法时装态还未更改，则存储回调函数，去resolve中状态更改时触发
                // this.successCallback = successCallback  
                // this.failCallback = failCallback
                // this.successCallback.push(successCallback)   //13.由于函数中可以多次调用then。改进
                // this.failCallback.push(failCallback)
                this.successCallback.push(()=>{//22.异步的也需要如上value操作，把回调函数用函数包裹再存储
                    setTimeout(()=>{
                        try{
                            let x = successCallback(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e){
                            reject(e)
                        }
                    })
                })   
                this.failCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = failCallback(this.reason)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e){
                            reject(e)
                        }
                    })
                })
            }
        })
      
        return promise2  //15.then方法会返回一个全新的promise以实现链式调用then
    }
}
const resolvePromise = (promise2,x,resolve,reject)=>{
    if(promise2 === x){return TypeError('XXX')}//仿照promise传出错误
    if(x instanceof MyPromise){
        x.then(resolve,reject)
    }else{
        resolve(x)
    }
}
