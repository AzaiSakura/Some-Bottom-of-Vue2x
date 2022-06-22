//1.实现一个数据监听器
class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(data){
        if(data&& typeof data=== 'object'){
            Object.keys(data).forEach(key => {
              this.defineReactive(data,key,data[key]);
          })
        }
    }
    defineReactive(obj,key,value){
        //递归遍历
        this.observe(value);
        const dep = new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:false,
            get(){
                //订阅数据变化时候，往Dep中添加观察者
                Dep.target&&dep.addSub(Dep.target);
                return value;
            },
            set:(newVal)=>{
                if(newVal !== value){
                    console.log('监听到值变化了',val,'---',newVal);
                    value = newVal;
                }
                dep.notify();
            }
        })
    }
}

//实现一个Watcher
class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //先把旧的值保存起来
        this.oldVal = this.getOldVal();
    }
    getOldVal(){
        Dep.target = this;
       const oldVal = compileUtil.getVal(this.expr,this.vm);
       Dep.target = null ;
       return oldVal;
    }
    update(){
        const newVal = compileUtil.getVal(this.expr,this.vm);
        if(newVal !== this.oldVal){
            this.cb(newVal);
        }
    }
}

class Dep{
    constructor(){
        this.subs =[];
    }
    //收集观察者
    addSub(watcher){
        this.subs.push(watcher);
    }
    //通知观察者去更新
    notify(){
         this.subs.forEach(w=>w.update())
        console.log('通知了观察者');
    }

}