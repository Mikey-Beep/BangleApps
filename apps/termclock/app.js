const X = 160,Y = 140;
const fontColor = g.theme.dark ? "#0f0" : "#000";

function draw() {
  var d = new Date();
  var h = d.getHours(),m = d.getMinutes();
  var time = h.toString().padStart(2, 0) + ":" + m.toString().padStart(2,0);
  g.reset();
  g.setColor(fontColor);
  g.setFont("6x8",4);
  g.setFontAlign(1,1);
  g.drawString(time,X,Y,true);
  g.setFont("6x8");
  g.setFontAlign(0,1);
  var dateStr = "    "+require("locale").date(d)+"    ";
  g.drawString(dateStr,g.getWidth()/2,Y+15,true);
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