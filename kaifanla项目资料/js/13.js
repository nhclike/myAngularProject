/**
 * Created by uid on 2017/5/12.
 */
var app = angular.module('myapp', ['ng']);

app.factory('$stu',function(){
    return {
        checkscore:function(){
            //return 80;
            console.log(80);
        }
    }
})

//app.controller('myctrol', function ($scope,$stu) {
//    console.log('控制调用了');
//    $stu.checkscore();
//});

//行内式注入
app.controller('myctrol',['$scope','$stu',function($scope,$stu){
    $scope.checkscore=function(){
        $stu.checkscore();
    }
}])
