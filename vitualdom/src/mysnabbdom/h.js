import vnode from './vnode.js'

export default function(sel,data,c){
    if(arguments.length !==3){
        throw new Error("参数有错误！！！")
    }
    //检查c类型
    if(typeof c=='string'||typeof c =='number'){
        return vnode(sel,data,undefined,c,undefined);
    }else if (Array.isArray(c)){
        //遍历c因为c可能是h函数
        let children =[]
        for(let i=0;i<c.length;i++){
            
            //检查c[i]必须是一个对象
            if(!(typeof c[i]=='object'&&c[i].hasOwnProperty('sel'))){
                throw new Error("传入数组的参数有项不是h函数")
            }
            //收集chlidren
            children.push(c[i]);
        }//循环结束了就表明children收集完毕了
        return vnode(sel,data,children,undefined,undefined)
        
    }else if(typeof c=='object'&&c.hasOwnProperty('sel')){
        let children =[c]
        return vnode(sel,data,children,undefined,undefined)
    }
    else{
        throw new Error("参数有错误！！！")
    }
}