const fontColor=g.theme.dark?"#0f0":"#000";
let paddingY=2,font6x8At4Size=32,font6x8At2Size=18,font6x8FirstTextSize=4,font6x8DefaultTextSize=2;

function draw() {
  g.reset();
  let curPos=1;
  g.setFontAlign(-1,-1);
  g.setColor(fontColor);
  var d=new Date();
  drawTime(d,curPos);
  curPos++;
  drawDate(d,curPos);
  curPos++;
  drawBattery(curPos);
  curPos++;
  drawLine("",curPos);
}

function drawLine(line,pos){
  if(pos==1)
    g.setFont("6x8",font6x8FirstTextSize);
  else
    g.setFont("6x8",font6x8DefaultTextSize);
  let yPos=Bangle.appRect.y+paddingY*(pos-1)+font6x8At4Size*Math.min(1,pos-1)+font6x8At2Size*Math.max(0,pos-2);
  g.drawString(">"+line,5,yPos,true);
}

function drawTime(d,pos){
  var t=("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
  var c=Bangle.isLocked()?"*":"";
  drawLine(t+c,pos);
}

function drawDate(d,pos){
  var y=d.getFullYear();
  var m=d.getMonth()+1;
  var dy=d.getDate();
  var ds=y+"-"+("0"+m).slice(-2)+"-"+("0"+dy).slice(-2);
  drawLine(ds,pos);
}

function drawBattery(pos){
  var c=Bangle.isCharging()?" +":""
  drawLine("Batt: "+E.getBattery()+c,pos);
}

g.clear();
draw();
setInterval(draw,60000);
Bangle.on('lcdPower',on=>{
  if(on){
    draw();
  }
});
Bangle.setUI("clock");