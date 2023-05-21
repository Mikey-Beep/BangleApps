const X = 160,Y = 140;
const fontColor = g.theme.dark ? "#0f0" : "#000";
let paddingY = 2;
let font6x8At4Size = 32;
let font6x8At2Size = 18;
let font6x8FirstTextSize = 4;
let font6x8DefaultTextSize = 2;

function drawLine(line, pos){
  if(pos == 1)
    g.setFont("6x8",font6x8FirstTextSize);
  else
    g.setFont("6x8",font6x8DefaultTextSize);
  let yPos = Bangle.appRect.y + paddingY * (pos - 1) + font6x8At4Size * Math.min(1, pos-1) + font6x8At2Size * Math.max(0, pos-2);
  g.drawString(">" + line,5,yPos,true);
};

function draw() {
  g.reset();
  let curPos = 1;
  g.setFontAlign(-1, -1);
  g.setColor(fontColor);
  var d = new Date();
  var h = d.getHours(),m = d.getMinutes();
  var time = h.toString().padStart(2, 0) + ":" + m.toString().padStart(2,0);
  drawLine(time, curPos);
  curPos++;
  var dateStr = "    "+require("locale").date(d)+"    ";
  drawLinw(dateStr,curPos);
  curPos++;
}

g.clear();
draw();
setInterval(draw,60000);
Bangle.on('lcdPower',on=>{
  if (on) {
    draw();
  }
});
Bangle.setUI("clock");