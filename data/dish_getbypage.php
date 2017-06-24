<?php
header('Content-Type:application/json;chartset=utf8');
require('init.php');
$start=$_REQUEST['start'];
$count=5;
$sql="select did,name,price,img_sm,material from kf_dish limit $start,$count";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
$str=json_encode($rows);
echo $str;
?>