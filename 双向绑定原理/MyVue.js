class MyVue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if(this.$el){
            new Observer(this.$data());
            //2.实现一个指令解析器
            new Compile(this.$el,this);
        }
    }
}
//1.解析器的实现
class Compile {
    constructor(el,vm){
        this.el = this.isElementNode(el) ? el:document.querySelector(el);
        this.vm = vm;
        //1.获取文档碎片对象，放入内存中会减少页面的回流和重绘；
        const fragment = this.node2Fragment(this.el);
        //2.编译模板
        this.compile(fragment);
        //3.追加子元素到根元素
        this.el.appendChild(fragment);
    }

    isElementNode(node){
        return node.nodeType ===1;
    }

    node2Fragment(el){
        //创建文档碎片对象
        const f = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            f.appendChild(firstChild);
        }
        return f;
    }

    compile(fragment){
        //获取所有子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child=>{
           if(this.isElementNode(child)){
               //是元素节点 ， 编译元素节点
               this.compileElement(child);
           }else{
               //是文本节点，编译文本节点
               this.compileText(child);
           }
           //目前只是遍历了第一层的子元素，所以可以通过递归来遍历全部子节点
           if(child.childNodes && child.childNodes.length){
               this.compile(child);
           }
        })
    }

    compileText(node){
        const content = node.textContent;
        // 匹配{{xxx}}的内容
        if (/\{\{(.+?)\}\}/.test(content)) {
            // 处理文本节点
            compileUtil['text'](node, content, this.vm)
        }
    }

    compileElement(node){
        const attributes = node.attributes;
        [...attributes].forEach(attr =>{
            const {name,value} = attr;
            //这里是得到所有属性中的属性，在通过自定义方法筛选出我们自定义的指令
            if(this.isDirective(name)){
                const [,directive] = name.split('-');
                //v-bind:src
                const [dirName,eventName] = directive.split(':');
                //更新数据
                compileUtil[dirName] && compileUtil[dirName](node,value,this.vm,eventName);
                //移除当前元素中的属性
                node.removeAttribute('v-'+directive);
            }else if(this.isEventName(name)){
                //对事件进行处理，这里处理的是click
                let [,eventName] =name.split('@');
                compileUtil['on'](node,value,this.vm,eventName)
            }
        })
    }
    
    isEventName(attrName){
        return attrName.startsWith('@')
    }

    isDirective(attrName){
        return attrName.startsWith('v-')
    }
}

const compileUtil = {
    //获取值的方法
    getVal(expr,vm){
        return expr.split('.').reduce((data,currentVal) =>{
            return data[currentVal]
        }, vm.$data())
    },
    text(node,expr,vm){
        let val;
        if (expr.indexOf('{{') !== -1) {
            // 
            val = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                return this.getVal(args[1], vm);
            })
        }else{ //也可能是v-text='obj.name' v-text='msg'
            val = this.getVal(expr,vm);
        }
        this.updater.textUpdater(node, val);
    },
    html(node,expr,vm){
        // html处理 非常简单 直接取值 然后调用更新函数即可
        let val = this.getVal(expr,vm);
        new Watcher(vm,expr,(newVal)=>{
            this.updater.htmlUpdater(node,value);
        })
        this.updater.htmlUpdater(node,val);
    },
    model(node,expr,vm){
        const val = this.getVal(expr,vm);
        this.updater.modelUpdater(node,val);
    },
    on(node,expr,vm,eventName){
         // 获取事件函数
         let fn = vm.$options.methods && vm.$options.methods[expr];
         // 添加事件 因为我们使用vue时 都不需要关心this的指向问题,这是因为源码的内部帮咱们处理了this的指向
         node.addEventListener(eventName,fn.bind(vm),false);
    },
    bind(node,expr,vm,attrName){
            let attrVal = this.getVal(expr,vm);
            this.updater.attrUpdater(node,attrName,attrVal)
    },
    updater:{
        attrUpdater(node, attrName, attrVal){
            node.setAttribute(attrName,attrVal);
        },
        modelUpdater(node,value){
            node.value = value;
        },
        textUpdater(node, value) {

            node.textContent = value;

        },
        htmlUpdater(node,value){
            node.innerHTML = value;
        }
    }
    }




