const path = require('path');
const util = require('util');
const fs = require('fs');
const iconvLite = require('iconv-lite');

//全局
const   entry = './script',
        dist = './script/utf8',
        from_code = 'GBK',
        target_code = 'UTF8';

var target = '';
       
function run(folderPath,targetPath){
    folderPath = path.join(__dirname,folderPath);
    target = path.join(__dirname,targetPath);
    if(!fs.existsSync(folderPath)){ //判断文件夹是否存在
        throw new Error('输入路径不存在')
    };
    if(!fs.existsSync(target)){
        fs.mkdir(target);
    };
    var files = fs.readdirSync(folderPath); //获取目录下所有文件列表
    files.forEach(filename => {
        var filepath = path.join(folderPath,filename);
        var stats = fs.statSync(filepath); //同步的start,作用是获取文件信息
        if(stats.isFile()){ //是否为文件
            var ext = path.extname(filepath).toLowerCase(); //返回路径文件扩展名
            if(['.js'].includes(ext)){ 
                convertToUtf8(filepath,filename)
            }else{
               
            }
        }else if(stats.isDirectory()){ //是否为目录

        }
    });
};

function convertToUtf8(fileName,fname){
    var byte = fs.readFileSync(fileName);
    if(byte[0] == 0xef && byte[1]==0xbb || byte[0] == 0xfe && byte[1] == 0xff || byte[0] == 0xff && byte[1] == 0xfe){
        //已经是utf8不做转换
        return;
    };
    byte = iconvLite.decode(byte,from_code); //按gbk读取之后转换为utf8才不会乱码
    var content = "\ufeff" + byte.toString(target_code); //标记bom-utf8
    fs.writeFileSync(target+'/'+fname,content);
    
}


run(entry,dist);
