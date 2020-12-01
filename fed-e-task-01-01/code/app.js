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


