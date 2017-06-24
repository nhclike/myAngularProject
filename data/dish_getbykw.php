<?php
header('Content-Type:application/json;charset=utf8');
require('init.php');
$kw=$_REQUEST['kw'];
if(!$kw){
echo '[]';
return;
}
$sql="select did,name,price,img_sm,material from kf_dish WHERE name LIKE '%$kw%' OR material LIKE '%$kw%'";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);

if($rows){
$str=json_encode($rows);
echo $str;
}
else{
echo "没有查到";
}

?>