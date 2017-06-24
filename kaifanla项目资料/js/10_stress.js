/**
 * Created by uid on 2017/5/12.
 */
var app = angular.module('myapp', ['ng']);

app.factory('$show',function(){
    return {
        show:function(){
            alert('show is sucess')
        }
    }
})

app.controller('myctrol', function ($scope,$show) {
    console.log('控制调用了');
    $scope.handclick=function(){
        $show.show();
    }
})