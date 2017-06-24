<?php
header('Content-Type:application/json;charset=utf8');
require('init.php');
$phone=$_REQUEST['phone'];
if(empty($phone)){
echo '[]';
return;
}
$sql="SELECT kf_order.did,kf_order.oid,kf_order.user_name,kf_order.order_time,kf_dish.img_sm FROM kf_order,kf_dish WHERE kf_order.did=kf_dish.did AND kf_order.phone=$phone";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
$str=json_encode($rows);
echo $str;