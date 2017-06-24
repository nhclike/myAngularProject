var app = angular.module('myapp', ['ng']);
app.service('$test',function(){
    this.test=function(){
        console.log('this is a test');
    }
});
//推断式依赖注入
//app.controller('myctrol', function ($scope,$test) {
//    console.log('控制调用了');
//    $test.test();
//});
//标记式依赖注入
var CtrFunc=function($scope,$test){
    $test.test();
};
//对依赖做标记
CtrFunc.$inject=['$scope','$test']
app.controller('myctrol',CtrFunc)