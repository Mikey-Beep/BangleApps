{ // must be inside our own scope here so that when we are unloaded everything disappears
  // we also define functions using 'let fn = function() {..}' for the same reason. function decls are global
let drawTimeout;
const fontColor=g.theme.dark?"#0f0":"#000";
let paddingY=2;
let font6x8At4Size=32;
let font6x8At2Size=18;
let font6x8FirstTextSize=4;
let font6x8DefaultTextSize=2;

// Actually draw the watch face
let draw = function() {
  g.reset().clearRect(Bangle.appRect); // clear whole background (w/o widgets)
  g.setFontAlign(-1,-1);
  g.setColor(fontColor);
  var date = new Date();
  var timeStr = date.getHours().toString().padStart(2,0) + ":" + date.getMinutes().toString().padStart(2,0);
  drawLine(timeStr, 1);
  var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2,0) + "-" + date.getDate().toString().padStart(2,0);
  drawLine(dateStr, 2);
  drawLine("Locked: "+Bangle.isLocked(), 3);
  drawLine("LCD: "+ Bangle.isLCDOn(),4);

  // queue next draw
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
};

let drawLine  = function(line, pos) {
  if(pos==1)
    g.setFont("6x8",font6x8FirstTextSize);
  else
    g.setFont("6x8",font6x8DefaultTextSize);
  let yPos=Bangle.appRect.y+paddingY*(pos-1)+font6x8At4Size*Math.min(1,pos-1)+font6x8At2Size*Math.max(0,pos-2);
  g.drawString(">"+line,5,yPos,true);
};

Bangle.on('lcdPower', draw);
Bangle.on('lock', draw);
// Show launcher when middle button pressed
Bangle.setUI({
  mode : "clock",
  remove : function() {
    // Called to unload all of the clock app
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }});
// Load widgets
Bangle.loadWidgets();
draw();
setTimeout(Bangle.drawWidgets,0);
}
