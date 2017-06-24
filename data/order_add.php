<?php
header('Content-Type:application/json;charset=utf8');
require('init.php');
@$sex=$_REQUEST['sex'];
@$phone=$_REQUEST['phone'];
@$addr=$_REQUEST['addr'];
@$did=$_REQUEST['did'];
@$user_name=$_REQUEST['user_name'];
if(empty($sex)||empty($phone)||empty($addr)||empty($did)||empty($user_name)){
echo '[]';
return;
}
$ordertime=time()*1000;
$sql="INSERT INTO kf_order VALUES(NULL,'$phone','$user_name','$sex','$ordertime','$addr','$did')";
$result=mysqli_query($conn,$sql);
if($result){
$count=mysqli_affected_rows($conn);
$uid=mysqli_insert_id($conn);
$arr=[];
$arr['uid']=$uid;
$arr['msg']='添加成功';
$str=json_encode($arr);
echo $str;
}


?>