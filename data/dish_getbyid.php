<?php
header('Content-Type:application/json;charset=utf8');
require('init.php');
$id=$_REQUEST['id'];
if(empty($id)){
echo '[]';
return;
}
$sql="select did,name,price,img_lg,material,detail from kf_dish WHERE did=$id";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_assoc($result);
if($rows){
$str=json_encode($rows);
echo $str;
}
else{
echo "[]";
}

?>