var canvas = document.createElement("canvas");
var btnDiv = document.createElement("div");
btnDiv.id = "btn";

var btn = document.createElement("button");
btn.setAttribute("type", "button");
var btnText = document.createTextNode("save");

btnDiv.appendChild(btn);

btn.appendChild(btnText);

$(function() {

	canvas.width = canvas.height = 60;
	var cl = new cloud(canvas, 0, 0, 60, 100);

	//-------------------------------------

	document.body.appendChild(canvas);
	document.body.appendChild(btnDiv);

	//-------------------------------------

	btn.addEventListener("click", clicked, false);

	function clicked() {
		var img = canvas.toDataURL("image/png");
		// console.log(img);
		var createImg = document.createElement("img");
		createImg.setAttribute("src", img);
		document.body.appendChild(createImg);
		
		//document.body.appendChild('<img src="' + img + '"/>');
		
		
	}

});
