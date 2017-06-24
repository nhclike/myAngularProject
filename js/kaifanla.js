/**
 * Created by uid on 2017/5/16.
 */
//创建模块
var app=angular.module('kaifanla',['ng','ngRoute']);

//创建抖动处理服务
app.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    function($rootScope, $browser, $q, $exceptionHandler) {
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
            var deferred = $q.defer(),
                promise = deferred.promise,
                skipApply = (angular.isDefined(invokeApply) && !invokeApply),
                timeoutId, cleanup,
                methodId, bouncing = false;

            // check we dont have this method already registered
            angular.forEach(methods, function(value, key) {
                if (angular.equals(methods[key].fn, fn)) {
                    bouncing = true;
                    methodId = key;
                }
            });

            // not bouncing, then register new instance
            if (!bouncing) {
                methodId = uuid++;
                methods[methodId] = { fn: fn };
            } else {
                // clear the old timeout
                deferreds[methods[methodId].timeoutId].reject('bounced');
                $browser.defer.cancel(methods[methodId].timeoutId);
            }

            var debounced = function() {
                // actually executing? clean method bank
                delete methods[methodId];

                try {
                    deferred.resolve(fn());
                } catch (e) {
                    deferred.reject(e);
                    $exceptionHandler(e);
                }

                if (!skipApply) $rootScope.$apply();
            };

            timeoutId = $browser.defer(debounced, delay);

            // track id with method
            methods[methodId].timeoutId = timeoutId;

            cleanup = function(reason) {
                delete deferreds[promise.$$timeoutId];
            };

            promise.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            promise.then(cleanup, cleanup);

            return promise;
        }


        // similar to angular's $timeout cancel
        debounce.cancel = function(promise) {
            if (promise && promise.$$timeoutId in deferreds) {
                deferreds[promise.$$timeoutId].reject('canceled');
                return $browser.defer.cancel(promise.$$timeoutId);
            }
            return false;
        };

        return debounce;
    }
]);

//定义路由
app.config(function($routeProvider){
    $routeProvider
        .when('/start',{
            templateUrl:'tp1/start.html'})
        .when('/header',{
            templateUrl:'tp1/header.html'})
        .when('/footer',{
            templateUrl:'tp1/footer.html'})
        .when('/main',{
            templateUrl:'tp1/main.html',
            controller:'main'
        })
        .when('/detail/:id',{
            templateUrl:'tp1/detail.html',
            controller:'detail'
        })
        .when('/order/:did',{
            templateUrl:'tp1/order.html',
            controller:'order'
        })
        .when('/myorder',{
            templateUrl:'tp1/myorder.html',
            controller:'myorder'
        })
        .otherwise({redirectTo:'/start'})
});
//创建父控制器跳转
app.controller('parent',['$scope','$location',function($scope,$location){
    $scope.jump=function(str){
        $location.path(str);
    }
}]);
//模拟main页面
//加载就有数据
app.controller('main',['$scope','$http','$debounce',function($scope,$http,$debounce){
    $scope.ismore=true;
    $http.get('data/dish_getbypage.php?start=0').success(function(data){
        $scope.dishlist=data;
        //console.log($scope.dishlist);
        $scope.count=data.length;
        //加载更多
        //console.log( $scope.count)
        $scope.more=function(){
            $http.get(`data/dish_getbypage.php?start=${$scope.count}`).success(function(data){
               $scope.dishlist=$scope.dishlist.concat(data);
                if(data.length<5){
                    $scope.ismore=false;
                }
            })
        };
        //搜索功能
        //绑定监听
            $scope.$watch('kw',function(){
                //放入抖动处理
                $debounce(watchHandler,300);
            })
       var watchHandler=function(){
            //console.log($scope.kw);
            if($scope.kw){
                $http.get('data/dish_getbykw.php?kw='+$scope.kw).success(function(data){
                    console.log(data);
                    if(data.length>0){
                        $scope.dishlist=data;
                    }

                })
            }
        }

    });

}]);
//detail页面
app.controller('detail',['$scope','$routeParams','$http',function($scope,$routeParams,$http){
    //console.log($routeParams.id);
    $http.get('data/dish_getbyid.php?id='+$routeParams.id).success(function(data){
        $scope.detail=data;
        //console.log($scope.detail);
    })
}]);
//我要订餐
app.controller('order',['$scope','$routeParams','$http','$httpParamSerializer',function($scope,$routeParams,$http,$httpParamSerializer){
    $scope.isorder=true;
    $scope.did=$routeParams.did;
    //console.log($scope.did);
    $scope.order={did:$scope.did};
    $scope.submit=function(){
        //console.log($scope.order);
        var data=$httpParamSerializer($scope.order);
        //console.log(data);
        $http.get('data/order_add.php?'+data).success(function(data){
            //console.log(data);
            if(data.msg='添加成功'){
                $scope.ordermsg=`下单成功!您的订单号为:${data.uid}`;
                //console.log($scope.order.phone);
                //浏览器缓存
                //sessionStorage['phone']=$scope.order.phone;
                sessionStorage.setItem('phone',$scope.order.phone);
                //console.log($scope.ordermsg);
                $scope.isorder=false;
            }
        })
    }
}]);
//订单列表
app.controller('myorder',['$scope','$http',function($scope,$http){
    //拿到电话号码
    $scope.tel=sessionStorage.getItem('phone');
    console.log($scope.tel);
    $http.get('data/order_getbyphone.php?phone='+$scope.tel).success(function(data){
        console.log(data);
        $scope.myorder=data;
    });
}])