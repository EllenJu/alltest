/**
 * Created by Hajay on 16/5/24.
 */
//由于使用了bower，有很多非必须资源。通过set project.files对象指定需要编译的文件夹和引用的资源
// 'bower_components/**',
fis.set('project.ignore', ['dist/**']);
fis.set('project.files', ['bower_components/**', 'app/**']);
//fis.set('project.files', ['bower_components/**','dashboard/**', 'dashboard_old/**', 'map.json', 'pages/**', 'sdkv1/**', 'hajay/**', 'vendor/**']);
//  fis.set('project.files', ['dashboard/**','dashboard/**','pages/**']);
// fis.set('project.files', ['dashboard/**', 'dashboard_old/**', 'map.json', 'new_pages/**', 'sdkv1/**', 'hajay/**', 'vendor/**']);
// fis.set('project.files', ['dashboard/modules/overview/**','dashboard/modules/app/**','dashboard/common/**','dashboard/index.js']);
// fis.set('project.files', ['dashboard/modules/mch/**', 'dashboard/common/data/**']);
//FIS modjs模块化方案，您也可以选择amd/commonjs等
fis.hook('module', {
    mode: 'mod'
});

fis.match('/app/**.js', {
    isMod: true,
    moduleId: '$1'
})
.match('/app/mod.js', {
    isMod: false,
  })
//前端模板,当做类js文件处理，可以识别__inline, __uri等资源定位标识
fis.match("**/*.tmpl", {
    isJsLike: true,
    release: false
})
    //页面模板不用编译缓存
    .match(/.*\.(html|jsp|tpl|vm|htm|asp|aspx|php)$/, {
        useCache: false
    });

/****************异构语言编译*****************/
//less的编译
//npm install [-g] fis-parser-less
fis.match('app/**/*.less', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('less', {
        //fis-parser-less option
    })
});


//打包与css sprite基础配置
fis.match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true // 资源映射表内嵌
    }),
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites', {
        layout: 'matrix',
        margin: '15'
    })
});

// fis.match('*', {
//     release: '$0'
// });

fis.match(/^\/app\/(.*)$/i, {
    useCache: false,
    release: '$1'
})


fis.media('qa').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://test.beecloud.cn/test/receiver.php',
        to: '/var/www/bc-homepage-2016/www/' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});




fis.media('prod').match('**.js', {
    preprocessor: fis.plugin('annotate'),
    optimizer: fis.plugin('uglify-js')
}).match('**.css', {
    optimizer: fis.plugin('clean-css')
});