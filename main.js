var c = document.getElementById("collision_simulator");
//var can_cont = document.getElementById("canvas_container");
//c.width = can_cont.innerWidth;
//#c.height = can_cont.innerHeight;
var dragging = false;
var ball_drag_id = 0;
c.addEventListener("mousedown", startDrag);
function startDrag(event) {dragging = true;}
c.addEventListener("mousemove", drag);
function drag(event)
{
    if(dragging) {
        
    }
}
c.addEventListener("mouseup", endDrag);
function endDrag(event) {dragging = false;}
var pos_1 = document.getElementById("pos_1");
var pos_2 = document.getElementById("pos_2");
var vel_1 = document.getElementById("vel_1");
var vel_2 = document.getElementById("vel_2");
var mass_1 = document.getElementById("mass_1");
var mass_2 = document.getElementById("mass_2");
var elast = document.getElementById("elast");

var slider_pos_1 = document.getElementById("slider_pos_1");
var slider_pos_2 = document.getElementById("slider_pos_2");
var slider_vel_1 = document.getElementById("slider_vel_1");
var slider_vel_2 = document.getElementById("slider_vel_2");
var slider_mass_1 = document.getElementById("slider_mass_1");
var slider_mass_2 = document.getElementById("slider_mass_2");
var slider_elast = document.getElementById("slider_elast");

var cur_pos_1 = parseFloat(pos_1.value);
var cur_pos_2 = parseFloat(pos_2.value);
var cur_vel_1 = parseFloat(vel_1.value);
var cur_vel_2 = parseFloat(vel_2.value);
var cur_mass_1 = parseFloat(mass_1.value);
var cur_mass_2 = parseFloat(mass_2.value);
var cur_elast = parseFloat(elast.value);

function zeroButtonClick(event) {
    console.log(event.target.id);
    var element = document.getElementById(event.target.id.substring(5));
    console.log(element);
    element.value = 0;
}

document.getElementById("zero_pos_1").addEventListener("click", zeroButtonClick);
document.getElementById("zero_pos_2").addEventListener("click", zeroButtonClick);

document.getElementById("zero_vel_1").addEventListener("click", zeroButtonClick);
document.getElementById("zero_vel_2").addEventListener("click", zeroButtonClick);

document.getElementById("zero_mass_1").addEventListener("click", zeroButtonClick);
document.getElementById("zero_mass_2").addEventListener("click", zeroButtonClick);

document.getElementById("play").addEventListener("click", function(event) {
    playing = !playing;
    if(playing) {
        event.target.innerHTML = "Pause";
        if(cur_vel_1+cur_vel_2 == 0) {
            collideTime = -1;
            if(cur_pos_1 < cur_pos_2)
                collidePos = cur_pos_1 + Math.sqrt(parseFloat(cur_mass_1)/Math.PI);
            else
                collidePos = cur_pos_2 + Math.sqrt(parseFloat(cur_mass_2)/Math.PI);
            return;
        }
        var r = Math.sqrt(parseFloat(cur_mass_1)/Math.PI)+Math.sqrt(parseFloat(cur_mass_2)/Math.PI);
        //x1+t*v1-(x2+t*v2)=r
        // t(v1-v2) = r+x2-x1
        //x2+t*v2-(x1+t*v1)=r
        // t(v2-v1)=r+x1-x2
        cur_pos_2 = parseFloat(cur_pos_2);
        cur_pos_1 = parseFloat(cur_pos_1);
        cur_vel_1 = parseFloat(cur_vel_1);
        cur_vel_2 = parseFloat(cur_vel_2);
        cur_mass_1 = parseFloat(cur_mass_1);
        cur_mass_2 = parseFloat(cur_mass_2);
        var minT = (r+cur_pos_2-cur_pos_1)/(cur_vel_1-cur_vel_2);
        var maxT = (r+cur_pos_1-cur_pos_2)/(cur_vel_2-cur_vel_1);
        var t;
        if(maxT < minT) {
            t = maxT;
        } else {
            t = minT;
        }
        collideTime = t;
        console.log(minT + " " + maxT + " " + t);
        if(cur_pos_1 < cur_pos_2)
            collidePos = cur_pos_1 + cur_vel_1*t + Math.sqrt(parseFloat(cur_mass_1)/Math.PI);
        else
            collidePos = cur_pos_2 + cur_vel_2*t + Math.sqrt(parseFloat(cur_mass_2)/Math.PI);
        var inelastForce = ((cur_vel_1*cur_mass_1+cur_vel_2*cur_mass_2)/(cur_mass_1+cur_mass_2)-cur_vel_2)*cur_mass_2;
        // vel_1*m1+vel_2*m2=vel_1^*m1+vel_2^*m2;
        // m1*(vel_1)^2+m2*(vel_2)^2=m1*(vel_1^)^2+m2*vel_2^)^2
        // vel_1^ = (vel_1*m1+vel_2*m2-vel_2^*m2)/m1
        // m1^2*(vel_1)^2+m1*m2*(vel_2)^2=vel_1^2*m1^2 + 2*vel_1*m1*vel_2*m2 - 2*vel_1*m1*vel_2^*m2 + vel_2^2+m2^2 - 2*vel_2*vel_2^*m2^2 + vel_2^^2*m2^2 + m1*m2*vel_2^)^2
        // 0 =  + vel_2^^2*m2^2 + m1*m2*vel_2^)^2
        // v1m1+v2m2=v3m1+v4m2
        // v3 = v1m1+v2m2-v4m2)/m1
        // m1*v1^2+m2*v2^2=m1*v3^2+m2*v4^2
        // m1^2*v1^2+m1*m2*v2^2=(v1m1+v2m2-v4m2)^2m1*m2*v4^2
        // m1^2*v1^2+m1*m2*v2^2=v1^2*m1^2+v2^2*m2^2+v4^2*m2^2+2*v1*v1*v2*v2-v1*m1*v4*m2+m1*m2*v4^2
        // m1*m2*v2^2-2*v1*m1*v2*m2-v2^2*m2^2=v4^2*m2^2  -2*v1*m1*v4*m2 - 2*v2*m2^2*v4   + m1*m2*v4^2
        // 
        var m1 = cur_mass_1;
        var m2 = cur_mass_2;
        var c = 2*cur_vel_1*m1*cur_vel_2*m2 + cur_vel_2*cur_vel_2*m2*m2 - m1*m2*cur_vel_2*cur_vel_2;
        var b = - 2*cur_vel_1*m1*m2 - 2*cur_vel_2*m2*m2;
        var a = m2^2 + m1*m2;
        var sol1 = (-b + Math.sqrt(b*b-4*a*c))/(2*a);
        var sol2 = (-b - Math.sqrt(b*b-4*a*c))/(2*a);
        var sol1 = 2*m1/(m1+m2)*cur_vel_1-(m1-m2)/(m2+m1)*cur_vel_2;
        var sol2 = 2*m1/(m1+m2)*cur_vel_1-(m1-m2)/(m2+m1)*cur_vel_2;
        var elasticForce;
        if(sol1 == cur_vel_2) {
            console.log(sol2)
            elasticForce = (sol2-cur_vel_2)*cur_mass_2;
        } else {
            console.log(sol1)
            elasticForce = (sol1-cur_vel_2)*cur_mass_2;
        }
        force = elasticForce*cur_elast/100.0+inelastForce*(1-cur_elast/100.0);
        console.log(force, inelastForce, elasticForce, collidePos, sol1, sol2);
    }
    if(!playing) {
        event.target.innerHTML = "Play";
    }
});
document.getElementById("restart").addEventListener("click", function(event) {
    sliderTime = 0;
});



var ctx = c.getContext("2d");

var text_pos_1 = document.getElementById("text_pos_1");
var text_pos_2 = document.getElementById("text_pos_2");
var text_vel_1 = document.getElementById("text_vel_1");
var text_vel_2 = document.getElementById("text_vel_2");
var text_ke = document.getElementById("text_ke");
var text_mom_1 = document.getElementById("text_mom_1");
var text_mom_2 = document.getElementById("text_mom_2");
var text_mom_3 = document.getElementById("text_mom_3");

var lastTime = 0;
var totalTime = 0;
var ball_1_x = 0;
var ball_2_x = 0;
var sliderTime = 0;
var playing = false;
var collideTime = 0;
var collidePos = 0;
var force = 0;

function update() {
    var now = (new Date()).getTime();
    delta = now-lastTime;
    lastTime = now;
    totalTime+=delta;
    if(playing) {
        sliderTime += delta;
    }
    
    if(pos_1.value != "" && pos_1.value != cur_pos_1) {
        cur_pos_1 = parseFloat(pos_1.value);
        slider_pos_1.value = cur_pos_1;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_pos_1.value != cur_pos_1) {
        cur_pos_1 = parseFloat(slider_pos_1.value);
        pos_1.value = cur_pos_1;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    if(pos_2.value != "" && pos_2.value != cur_pos_2) {
        cur_pos_2 = parseFloat(pos_2.value);
        slider_pos_2.value = cur_pos_2;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_pos_2.value != cur_pos_2) {
        cur_pos_2 = parseFloat(slider_pos_2.value);
        pos_2.value = cur_pos_2;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    
    if(vel_1.value != "" && vel_1.value != cur_vel_1) {
        cur_vel_1 = parseFloat(vel_1.value);
        slider_vel_1.value = cur_vel_1;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_vel_1.value != cur_vel_1) {
        cur_vel_1 = parseFloat(slider_vel_1.value);
        vel_1.value = cur_vel_1;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    if(vel_2.value != "" && vel_2.value != cur_vel_2) {
        cur_vel_2 = parseFloat(vel_2.value);
        slider_vel_2.value = cur_vel_2;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_vel_2.value != cur_vel_2) {
        cur_vel_2 = parseFloat(slider_vel_2.value);
        vel_2.value = cur_vel_2;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    
    if(mass_1.value != "" && mass_1.value != cur_mass_1) {
        cur_mass_1 = parseFloat(mass_1.value);
        slider_mass_1.value = cur_mass_1;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_mass_1.value != cur_mass_1) {
        cur_mass_1 = parseFloat(slider_mass_1.value);
        mass_1.value = cur_mass_1;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    if(mass_2.value != "" && mass_2.value != cur_mass_2) {
        cur_mass_2 = parseFloat(mass_2.value);
        slider_mass_2.value = cur_mass_2;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_mass_2.value != cur_mass_2) {
        cur_mass_2 = parseFloat(slider_mass_2.value);
        mass_2.value = cur_mass_2;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    if(elast.value != "" && elast.value != cur_elast) {
        cur_elast = parseFloat(elast.value);
        slider_elast.value = cur_elast;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    if(slider_elast.value != cur_elast) {
        cur_elast = parseFloat(slider_elast.value);
        elast.value = cur_elast;
        sliderTime = 0; playing = false; document.getElementById("play").innerHTML = "Play";
    }
    
    var offset = 300;// Where is Zero?
    var scl = 1; // Pixels per meter
    // cur_pos_1+offset+sliderTime*cur_vel_1
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, c.width, c.height);
    //ctx.fill();//"#FFFFFF");
    //ctx.beginPath();
    var x1;
    var x2;
    var r1 = Math.sqrt(parseFloat(cur_mass_1)/Math.PI);
    var r2 = Math.sqrt(parseFloat(cur_mass_2)/Math.PI);
    //console.log(collideTime + " " + sliderTime);
    if(sliderTime/1000.0 > collideTime) {
        if(cur_pos_1 < cur_pos_2) {
            x1 = collidePos - r1 + (sliderTime/1000.0-collideTime)*(-force/cur_mass_1 + cur_vel_1);
            x2 = collidePos + r2 + (sliderTime/1000.0-collideTime)*(force/cur_mass_2 + cur_vel_2);
        } else {
            x1 = collidePos + r1 + (sliderTime/1000.0-collideTime)*(-force/cur_mass_1 + cur_vel_1);
            x2 = collidePos - r2 + (sliderTime/1000.0-collideTime)*(force/cur_mass_2 + cur_vel_2);
        }
        text_vel_1.innerHTML = "Ball 1 Velocity: " + (-force/cur_mass_1 + cur_vel_1).toFixed(2) + "m/s";
        text_vel_2.innerHTML = "Ball 2 Velocity: " + (force/cur_mass_2 + cur_vel_2).toFixed(2) + "m/s";
        text_ke.innerHTML = "Total Kinetic Energy: " + (0.5*cur_mass_2*(force/cur_mass_2 + cur_vel_2)*(force/cur_mass_2 + cur_vel_2) + 0.5*cur_mass_1*(-force/cur_mass_1 + cur_vel_1)*(-force/cur_mass_1 + cur_vel_1)).toFixed(2) + "J";
        text_mom_1.innerHTML = "Ball 1 Momentum: " + (cur_mass_1*(-force/cur_mass_1 + cur_vel_1)).toFixed(2) + "kg*m/s";
        text_mom_2.innerHTML = "Ball 2 Momentum: " + (cur_mass_2*(force/cur_mass_2 + cur_vel_2)).toFixed(2) + "kg*m/s";
        text_mom_3.innerHTML = "Total Momentum: " + (cur_mass_1*(-force/cur_mass_1 + cur_vel_1)+cur_mass_2*(force/cur_mass_2 + cur_vel_2)).toFixed(2) + "kg*m/s";
        
    } else {
        x1 = parseFloat(cur_pos_1)+sliderTime/1000.0*cur_vel_1;
        x2 = parseFloat(cur_pos_2)+sliderTime/1000.0*cur_vel_2;
        text_vel_1.innerHTML = "Ball 1 Velocity: " + (cur_vel_1).toFixed(2) + "m/s";
        text_vel_2.innerHTML = "Ball 2 Velocity: " + (cur_vel_2).toFixed(2) + "m/s";  
        text_ke.innerHTML = "Total Kinetic Energy: " + (cur_vel_2*cur_vel_2*cur_mass_2*0.5+cur_vel_1*cur_vel_1*cur_mass_1*0.5).toFixed(2) + "J";  
        text_mom_1.innerHTML = "Ball 1 Momentum: " + (cur_vel_1*cur_mass_1).toFixed(2) + "kg*m/s";
        text_mom_2.innerHTML = "Ball 2 Momentum: " + (cur_vel_2*cur_mass_2).toFixed(2) + "kg*m/s";
        text_mom_3.innerHTML = "Total Momentum: " + (cur_vel_1*cur_mass_1+cur_vel_2*cur_mass_2).toFixed(2) + "kg*m/s";
    }
    if(sliderTime == 0) {
        x1 = parseFloat(cur_pos_1);
        x2 = parseFloat(cur_pos_2);
    }
    text_pos_1.innerHTML = "Ball 1 Position: " + x1.toFixed(2) + "m";
    text_pos_2.innerHTML = "Ball 2 Position: " + x2.toFixed(2) + "m";
    
    ctx.strokeStyle = "#EEEEEE";
    for(var x = -300; x < 300; x+=25) {
      ctx.beginPath(); 
      ctx.moveTo(x+offset+12.5,-100);
      ctx.lineTo(x+offset+12.5,300);
      ctx.stroke();
    }
    for(var y = 0; y < 300; y+=25) {
      ctx.beginPath(); 
      ctx.moveTo(0,y+12.5);
      ctx.lineTo(600, y+12.5);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.arc(x1*scl+offset, 100, r1*scl, 0, 2 * Math.PI);
    ctx.stroke();
    //ctx.endPath();
    ctx.beginPath();
    ctx.arc(x2*scl+offset, 100, r2*scl, 0, 2 * Math.PI);
    ctx.stroke();
}
setInterval(update, 10);