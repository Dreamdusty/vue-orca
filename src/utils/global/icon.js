function Icon(name,src){
  this.name=name;
  this.src=src;
  //this.name='开始任务';
  // this.src='../../../static/image/logo.png';
  function getName(){
    return name;
  }
  function getSrc(){
    return src;
  }

  function getIcon(){
    return {name,src};
  }
}

export function getIcon(){
  this.icon1= new Icon('开始任务','../../../static/image/logo.png');
  this.icon2= new Icon('结束','../../../static/image/logo.png');
  // this.icon=[new Icon('开始任务','../../../static/image/logo.png'),new Icon('结束','../../../static/image/logo.png')];
  // this.icon2 = {src:'../../../static/image/logo.png',name:'结束任务'};
  function getIcons(){
    return icon1;
  }
}
