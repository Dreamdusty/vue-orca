
$j("#leftOperateHeader").click(function(){
  $j( "#leftOperate" ).toggle( "blind" ,{direction:"up"});
})


$j("#leftOnTime").click(function(){
  $j("#leftOperateOnTime").toggle( "blind" ,{direction:"up"});
})

$j("#leftDbHeader").click(function(){
  $j("#leftDB").toggle("blind");
})




$j("#progressbar").progressbar({
  value:100,
  complete: function() {
    $j( ".progress-label" ).text( "完成" );
  }
})

$j("#leftHome").mouseover(function(){
  $j("#leftHome").css("background-color","rgb(68,113,146)")
  $j("#leftHome").css("color","white");
})
$j("#leftHome").mouseout(function(){
  $j("#leftHome").css("background-color","white")
  $j("#leftHome").css("color","rgb(26,52,75)");
})

$j("#leftDbHeader").mouseover(function(){
  $j("#leftDbHeader").css("background-color","rgb(68,113,146)")
  $j("#leftDbHeader").css("color","white");
})
$j("#leftDbHeader").mouseout(function(){
  $j("#leftDbHeader").css("background-color","white")
  $j("#leftDbHeader").css("color","rgb(26,52,75)");
})

$j("#leftOperateHeader").mouseover(function(){
  $j("#leftOperateHeader").css("background-color","rgb(68,113,146)")
  $j("#leftOperateHeader").css("color","white");
})
$j("#leftOperateHeader").mouseout(function(){
  $j("#leftOperateHeader").css("background-color","white")
  $j("#leftOperateHeader").css("color","rgb(26,52,75)");
})

$j("#leftTask").mouseover(function(){
  $j("#leftTask").css("background-color","rgb(68,113,146)")
  $j("#leftTask").css("color","white");
})
$j("#leftTask").mouseout(function(){
  $j("#leftTask").css("background-color","white")
  $j("#leftTask").css("color","rgb(26,52,75)");
})

$j("#leftOnTime").mouseover(function(){
  $j("#leftOnTime").css("background-color","rgb(68,113,146)")
  $j("#leftOnTime").css("color","white");
})
$j("#leftOnTime").mouseout(function(){
  $j("#leftOnTime").css("background-color","white")
  $j("#leftOnTime").css("color","rgb(26,52,75)");
})

$j("#leftOnTimeOperate").mouseover(function(){
  $j("#leftOnTimeOperate").css("background-color","rgb(68,113,146)")
  $j("#leftOnTimeOperate").css("color","white");
})
$j("#leftOnTimeOperate").mouseout(function(){
  $j("#leftOnTimeOperate").css("background-color","white")
  $j("#leftOnTimeOperate").css("color","rgb(26,52,75)");
})

$j("#leftOnTimeRoute").mouseover(function(){
  $j("#leftOnTimeRoute").css("background-color","rgb(68,113,146)")
  $j("#leftOnTimeRoute").css("color","white");
})
$j("#leftOnTimeRoute").mouseout(function(){
  $j("#leftOnTimeRoute").css("background-color","white")
  $j("#leftOnTimeRoute").css("color","rgb(26,52,75)");
})
