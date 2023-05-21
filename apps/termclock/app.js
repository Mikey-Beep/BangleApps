{ // must be inside our own scope here so that when we are unloaded everything disappears
  // we also define functions using 'let fn = function() {..}' for the same reason. function decls are global
let drawTimeout;
let dataTimeout;
let dataPolling = 10000;
let drawPolling = 10000;
const fontColor=g.theme.dark?"#0f0":"#000";
let paddingY=2;
let font6x8At4Size=32;
let font6x8At2Size=18;
let font6x8FirstTextSize=4;
let font6x8DefaultTextSize=2;
const batteryVals = [];
let alt = '?';
let temp = '?';

let update = function() {
  updateAlt();
  updateBattery();
  if (dataTimeout) clearTimeout(dataTimeout);
  dataTimeout = setTimeout(function(){
    dataTimeout = undefined;
    update();
  }, dataPolling - (Date.now() % dataPolling));
};

let updateAlt = function() {
  Bangle.getPressure().then(d=>{
    temp=d.temperature;
    alt=d.altitude;
  });
};

let updateBattery = function() {
  batteryVals.push(E.getBattery());
  if (batteryVals.length > 10) batteryVals.shift();
};

// Actually draw the watch face
let draw = function() {
  g.clear();
  g.setFontAlign(-1,-1);
  g.setColor(fontColor);
  let date = new Date();
  let curPos = 1;
  drawTime(date, curPos);
  curPos++;
  drawDate(date, curPos);
  curPos++;
  drawBattery(curPos);
  curPos++;
  drawTemp(curPos);
  curPos++;
  drawAlt(curPos);
  curPos++;
  drawLine("",curPos);
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, drawPolling - (Date.now() % drawPolling));
};

let drawLine = function(line, pos) {
  if(pos==1)
    g.setFont("6x8",font6x8FirstTextSize);
  else
    g.setFont("6x8",font6x8DefaultTextSize);
  let yPos=Bangle.appRect.y+paddingY*(pos-1)+font6x8At4Size*Math.min(1,pos-1)+font6x8At2Size*Math.max(0,pos-2);
  g.drawString(">"+line,5,yPos,true);
};

let drawTime = function(date, pos) {
  let l = Bangle.isLocked()?"*":"";
  let timeStr = date.getHours().toString().padStart(2,0) + ":" + date.getMinutes().toString().padStart(2,0);
  drawLine(timeStr+l, pos);
};

let drawDate = function(date, pos) {
  let dateStr = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2,0) + "-" + date.getDate().toString().padStart(2,0);
  drawLine(dateStr, 2);
};

let drawBattery = function(pos) {
  let c = Bangle.isCharging()?" +":"";
  let battSum = batteryVals.reduce((a,b)=>a+b,0);
  let battMean = Math.round((battSum / batteryVals.length)) || '?';
  drawLine("Batt: " + battMean + "%" + c, pos);
};

let drawTemp = function(pos) {
  drawLine('Temp: ' + temp, pos);
};

let drawAlt = function(pos) {
  drawLine('Alt: ' + alt, pos);
};

g.clear();
Bangle.loadWidgets();
require("widget_utils").swipeOn();
update();
draw();
Bangle.on('lock', function(lock) {
  if (lock) {
    dataPolling = 60000;
    drawPolling = 60000;
  }
  else {
    dataPolling = 10000;
    drawPolling = 10000;
  }
  update();
  draw();
});
Bangle.on('charging', draw);
Bangle.setUI({
  mode : "clock",
  remove : function() {
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
    if (dataTimeout) clearTimeout(dataTimeout);
    dataTimeout = undefined;
    Bangle.removeListener('lock',draw);
    Bangle.removeListener('charging',draw);
    require("widget_utils").show();
  }});
}
