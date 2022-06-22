const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        //虚拟打包路径，就是说文件夹不会真正生成而是在8080端口虚拟生成
        publicPath: 'xuni',
        filename:'bundle.js'
    },
    devServer:{
        port:8080,
        contentBase:'www'
    }
}