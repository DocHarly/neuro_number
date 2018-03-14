$( document ).ready(function() {

  function elt(name, attributes) {
    var node = document.createElement(name);
    if (attributes) {
      for (var attr in attributes)
        if (attributes.hasOwnProperty(attr))
          node.setAttribute(attr, attributes[attr]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (typeof child == "string")
        child = document.createTextNode(child);
      node.appendChild(child);
    }
    return node;
  }

  var controls = Object.create(null);
  var cx = 0;

  function createPaint(parent) {
    var canvas = elt("canvas", {width: 240, height: 400, id: "help"});
    cx = canvas.getContext("2d");
    var toolbar = elt("div", {class: "toolbar"});
    for (var name in controls)
      toolbar.appendChild(controls[name](cx));

    var panel = elt("div", {class: "picturepanel"}, canvas);
    parent.appendChild(elt("div", null, panel, toolbar));
  }

  var tools = Object.create(null);

  controls.tool = function(cx) {
    var select = elt("select");
    for (var name in tools)
      select.appendChild(elt("option", null, name));

    cx.canvas.addEventListener("mousedown", function(event) {
      if (event.which == 1) {
        tools[select.value](event, cx);
        event.preventDefault();
      }
    });

    return elt("span", null, "Инструменты: ", select);
  };

  function relativePos(event, element) {
    var rect = element.getBoundingClientRect();
    return {x: Math.floor(event.clientX - rect.left),
            y: Math.floor(event.clientY - rect.top)};
  }

  function trackDrag(onMove, onEnd) {
    function end(event) {
      removeEventListener("mousemove", onMove);
      removeEventListener("mouseup", end);
      if (onEnd)
        onEnd(event);
    }
    addEventListener("mousemove", onMove);
    addEventListener("mouseup", end);
  }

  tools.Кисть = function(event, cx, onEnd) {
    cx.lineCap = "round";

    var pos = relativePos(event, cx.canvas);
    trackDrag(function(event) {
      cx.beginPath();
      cx.moveTo(pos.x, pos.y);
      pos = relativePos(event, cx.canvas);
      cx.lineTo(pos.x, pos.y);
      cx.stroke();
    }, onEnd);
  };

  tools.Ластик = function(event, cx) {
    cx.globalCompositeOperation = "destination-out";
    tools.Line(event, cx, function() {
      cx.globalCompositeOperation = "source-over";
    });
  };

  controls.brushSize = function(cx) {
    var select = elt("select");
    var sizes = [2, 4, 6, 8, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
    sizes.forEach(function(size) {
      select.appendChild(elt("option", {value: size},
                             size + " пиксель"));
    });
    select.addEventListener("change", function() {
      cx.lineWidth = select.value;
    });
    return elt("span", null, "Размер кисти: ", select);
  };

  controls.color = function(cx) {
    var input = elt("input", {type: "color"});
    input.addEventListener("change", function() {
      cx.fillStyle = input.value;
      cx.strokeStyle = input.value;
    });
    return elt("span", null, "Цвет кисти: ", input);
  };

  $('.lolik').click(function(){
    var canvas = document.getElementById("help");
    //var ctx = canvas.getContext("2d");
    var rez = canvas.toDataURL();
    function fileResize(image, callback){
      var canvas      = document.createElement('canvas');
      var ctx         = canvas.getContext("2d");
      var newImage    = new Image();
      newImage.onload     = function(){

          canvas.width    = 24;
          canvas.height   = 40;

          ctx.drawImage(this, 0, 0, 24, 40);

          callback(canvas);
      }
      newImage.src = image;
    }

    fileResize(rez, function(canvas) {
      document.getElementById("testIMG").src = canvas.toDataURL('image/png');
      var ctx = canvas.getContext("2d");
      var arrCanvas = [];
      var pixel = ctx.getImageData(1, 1, 24, 40).data;
      for (var i = 0; i < 3840; i += 4) {
        if ((pixel[i] + pixel[i+1] + pixel[i+2] + pixel[i+3]) > 0) {
          arrCanvas.push(1);
        } else {
          arrCanvas.push(0);
        }
      }
      console.log(arrCanvas);
    });

  });

  createPaint(document.body);
});

var arrNumber = [];
  arrNumber[0] = [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1];
  arrNumber[1] = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  arrNumber[2] = [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1];
  arrNumber[3] = [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1];
  arrNumber[4] = [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1];
  arrNumber[5] = [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1];
  arrNumber[6] = [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1];
  arrNumber[7] = [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  arrNumber[8] = [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1];
  arrNumber[9] = [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1];

var arrFive1 = [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1];
var arrFive2 = [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1];
var arrFive3 = [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1];
var arrFive4 = [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1];
var arrFive5 = [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1];
var arrFive6 = [1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1];

var arrWeight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//console.log(arrWeight);

var bias = 7;

traning();

function proceed(number) {
  var net = 0;
  for (var i = 0; i < 15; i++) {
    net += number[i] * arrWeight[i];
    //console.log(number[i]);
  }
  return net >= bias;
}

function decrease(number) {
  for (var i = 0; i < 15; i++) {
    if (number[i] == 1) {
      arrWeight[i] -= 1;
    }
  }
}

function increase(number) {
  for (var i = 0; i < 15; i++) {
    if (number[i] == 1) {
      arrWeight[i] += 1;
    }
  }
}

function traning() {
  for (var i = 0; i < 40000; i++) {
    //console.log(i);
    var n = ~~(Math.random()*10);
    if (n != 5) {
      //console.log(n);
      if (proceed(arrNumber[n])) {
        decrease(arrNumber[n]);
      }
    } else {
      //console.log(n);
      if (!proceed(arrNumber[5])) {
        increase(arrNumber[5]);
      }
    }
    //console.log('coco ' + arrWeight);
  }
}

console.log(arrWeight);

console.log("0 это 5? " + proceed(arrNumber[0]));
console.log("1 это 5? " + proceed(arrNumber[1]));
console.log("2 это 5? " + proceed(arrNumber[2]));
console.log("3 это 5? " + proceed(arrNumber[3]));
console.log("4 это 5? " + proceed(arrNumber[4]));
console.log("6 это 5? " + proceed(arrNumber[6]));
console.log("7 это 5? " + proceed(arrNumber[7]));
console.log("8 это 5? " + proceed(arrNumber[8]));
console.log("9 это 5? " + proceed(arrNumber[9]));
console.log("Узнал 5? " + proceed(arrNumber[5]));
console.log("Узнал 5 1? " + proceed(arrFive1));
console.log("Узнал 5 2? " + proceed(arrFive2));
console.log("Узнал 5 3? " + proceed(arrFive3));
console.log("Узнал 5 4? " + proceed(arrFive4));
console.log("Узнал 5 5? " + proceed(arrFive5));
console.log("Узнал 5 6? " + proceed(arrFive6));
