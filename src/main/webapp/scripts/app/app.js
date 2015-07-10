var jq = jQuery.noConflict();
jq.ajaxSetup({
	type: 'POST',
	dataType: 'json'
});

var App = {
	init: function(){
		this.cacheElements();
		this.bindEvents();
		this.jqsaveJpegButton.hide();
		this.url = {
			image: this.jqbody.data('imageUrl')
		}
		this.initCanvas();
		this.textFigure = null;
		this.groupFigure = null;
		this.maxArea = null;
	},
	cacheElements: function(){
		this.jqbody = jq("body");
		this.jqtextInput = jq("#textInput");
		this.jqerrorContainer = jq("#error-container");
		this.jqsavePngButton = jq("#save-png");
		this.jqtranscodeJpegButton = jq("#transcode-jpeg");
		this.jqsaveJpegButton = jq("#save-jpeg");
	},
	bindEvents: function(){
		this.jqtextInput.on("change", this.onTextChange.bind(this));
		this.jqsavePngButton.on("click", this.onSavePngClick.bind(this));
		this.jqtranscodeJpegButton.on("click", this.onTranscodeJpegClick.bind(this));
	},
	onTextChange: function(ev){
		this.renewTextArea();
	},
	onSavePngClick: function(ev){
		this.maxRectangle.setOpacity(0);
		var image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
		this.maxRectangle.setOpacity(0.1);
		this.canvas.renderAll();
		this.jqsavePngButton.attr({
    		'download': 'YourProduct.png',
    		'href': image
		});
	},
	onTranscodeJpegClick: function(ev){
		var that = this;
		this.maxRectangle.setOpacity(0);
		var image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
		this.maxRectangle.setOpacity(0.1);
		this.canvas.renderAll();

		jq.ajax({
			url:'/transcodeToJpeg',
			data: {"imageValue":image},
			success: function(response){
				console.log(response);
				that.jqsaveJpegButton.show();
				that.jqsaveJpegButton.attr("href", response.jpegPath);
				that.jqsaveJpegButton.attr("download", response.jpegPath.substring(14));
				that.jqsaveJpegButton.attr("title", response.jpegPath.substring(14));
			}
		})
	},
	initCanvas: function(){
		var that = this;
		this.canvas = new fabric.Canvas('the-canvas');
		this.canvasContext = this.canvas.getContext('2d');
		fabric.Image.fromURL(this.url.image, function(oImg) {
			that.canvas.setBackgroundImage(oImg);
			that.canvas.setWidth(oImg.width);
			that.canvas.setHeight(oImg.height);
			that.findMaxTextArea();
			that.canvas.renderAll();
		});
		this.bindCanvasEvents();
	},
	bindCanvasEvents: function(){
		this.bindCursorDebug();
	},
	findMaxTextArea: function(){
		var x = this.canvas.getWidth() / 2;
		var y = this.canvas.getHeight() / 2;

		var findSourceArea = new FindSourceArea(this.canvas, x, y);
		var area = findSourceArea.calculate();
		var imageData = this.canvasContext.getImageData(area.x, area.y, area.width, area.height);
		var centerPoint = this.canvasContext.getImageData(x, y, 1, 1).data;
		var findingColor = {
			r:centerPoint[0],
			g:centerPoint[1],
			b:centerPoint[2]
		};
		var maximalRectangle = new MaximalRectangle(imageData, area.width, area.height, findingColor);

		var rectangleDefinition = maximalRectangle.calculate();

		rectangleDefinition.top += area.y;
		rectangleDefinition.left += area.x;
		rectangleDefinition.opacity = 0.1;
		rectangleDefinition.fill = '#DA2';
		rectangleDefinition.originX = 'left';
		rectangleDefinition.originY = 'top';
		rectangleDefinition.hasRotationPoint = false;
		
		this.limit = {
			left: rectangleDefinition.left,
			right: rectangleDefinition.left + rectangleDefinition.width,
			top: rectangleDefinition.top,
			bottom: rectangleDefinition.top + rectangleDefinition.height
		}
		this.rectangleDefinition = rectangleDefinition;

		this.createNewText(rectangleDefinition, "konkurs");
	},
	onAreaMove: function(ev){
		this.getRectDimension();
		this.maxArea.setCoords();
		var top = this.maxArea.getTop();
		var height = this.maxArea.getHeight();
		var bottom = top + height;
		var left = this.maxArea.getLeft();
		var width = this.maxArea.getWidth();
		var right = left + width;
		if(top < this.limit.top){
			this.maxArea.setTop(this.limit.top);
		}
		if(bottom > this.limit.bottom){
			this.maxArea.setTop(this.limit.bottom - height);	
		}
		if(left < this.limit.left){
			this.maxArea.setLeft(this.limit.left);
		}
		if(right > this.limit.right){
			this.maxArea.setLeft(this.limit.right - width);
		}

		this.canvas.renderAll();
	},
	getRectDimension: function(){
		var resutl;
		if(this.maxArea){
			var dimensions = this.maxArea._calculateCurrentDimensions();
			console.log("new");
			result = {
				top:Math.floor(this.maxArea.getTop()),
				left:Math.floor(this.maxArea.getLeft()),
				width:Math.floor(dimensions.x),
				height:Math.floor(dimensions.y)
			}
		}else{
			//only on begining
			console.log("old");
			result ={
				top:Math.floor(this.maxRectangle.getTop()),
				left:Math.floor(this.maxRectangle.getLeft()),
				width:Math.floor(this.maxRectangle.getWidth()),
				height:Math.floor(this.maxRectangle.getHeight())
			}
		}
		console.log(result);
		return result;
		
	},
	MAX_FONT_SIZE: 600,
	MIN_FONT_SIZE: 10,
	calculateMaxFont: function(text){
		var maxDimensions = this.getRectDimension();
		var currentFontSize = 600;
		var fit = false;
		//+=" "for margin
		if(text.length>3) text +=" ";
		while(currentFontSize>=10 && !fit){
			var textFigureTest = new fabric.Text(text, {
				fontSize: currentFontSize
			});
			//+10 for margin
			var currentHeight = textFigureTest.getHeight()+10 
			//+10 for margin
			var currentWidth = textFigureTest.getWidth()+10;
			if( currentWidth < maxDimensions.width && currentHeight < maxDimensions.height){
				fit = true;
			}else{
				currentFontSize--;
			}
		};
		if(!fit) return -1;
		return currentFontSize;
	},
	renewTextArea: function(){
		this.createNewText(this.getRectDimension(), this.jqtextInput.val());
	},
	createNewText: function(dimension, text){
		if(this.maxArea) this.canvas.remove(this.maxArea);
		if(this.textFigure) this.canvas.remove(this.textFigure);
		if(this.maxRectangle) this.canvas.remove(this.maxRectangle);

		var rectangleDefinition ={
			opacity : 0.1,
			fill : '#DA2',
			originX : 'left',
			originY : 'top',
			hasBorders : false,
			hasRotationPoint: false
		};
		jq.extend(rectangleDefinition, dimension);
		
		this.maxRectangle = new fabric.Rect(rectangleDefinition);
		this.maxRectangle.lockRotation = true;
		this.maxRectangle.hasRotatingPoint = false;

		var maxFontSize = this.calculateMaxFont(text);
		if(maxFontSize == -1){
			this.displayError("Tekst nie mieści się w polu");
			text = "";
			maxFontSize = 10;
		}else{
			this.displayError("");
		}
		this.textFigure = new fabric.Text(text, {
			fontSize: maxFontSize,
			originX: 'left',
  			originY: 'top',
  			top: dimension.top,
			left: dimension.left,
			hasRotationPoint: false
		});
		this.textFigure.lockRotation = true;
		this.textFigure.hasRotatingPoint = false;

		this.maxArea = new fabric.Group([this.maxRectangle, this.textFigure],{
			originX: 'left',
  			originY: 'top',
  			hasBorders: false,
  			hasRotationPoint: false,
  			width: this.maxRectangle.getWidth(),
  			height: this.maxRectangle.getHeight()
		});
		this.maxArea.lockRotation = true;
		this.maxArea.hasRotatingPoint = false;
		this.maxArea.on('moving', this.onAreaMove.bind(this));
		// this.maxArea.on('scaling', this.onAreaScale.bind(this));
		this.maxArea.on('modified', this.onAreaModify.bind(this));
		this.canvas.add(this.maxArea);
		this.canvas.renderAll();
	},
	displayError: function(error){
		this.jqerrorContainer.html(error);
	},
	onAreaModify: function(ev){
		this.renewTextArea();
		this.jqsaveJpegButton.hide();
	},
	onAreaScale: function(ev){
		this.renewTextArea();
	},
	bindCursorDebug: function(){
		var that = this;
		this.canvas.observe('mouse:move', function(e) {
			var mouse = that.canvas.getPointer(e.e);
			var x = mouse.x;
			var y = mouse.y;
			var coord = "x=" + x + ", y=" + y;
			var p = that.canvasContext.getImageData(x, y, 1, 1).data;
			var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
			jq('#status').html(coord + "<br>" + hex);
		});
	}
};
function findPos(obj) {
	var curleft = 0, curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return { x: curleft, y: curtop };
	}
	return undefined;
}
function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}
var jqApp = jq(App);
jq(function(){
	App.init();
});
