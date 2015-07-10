/*
	numColumns - width
	numRows - height
*/
function MaximalRectangle(imageData, numColumns, numRows, color){
	this.imageData = imageData;
	this.numColumns = numColumns;
	this.numRows = numRows;
	this.findingColor = color;
}
MaximalRectangle.Cache = function(size){
	this.aggregateHeights = [];
	for(var i = 0; i <= size; i++) {
		this.aggregateHeights.push(0);
	}
};
MaximalRectangle.Cache.prototype ={
	get: function(col){
		return this.aggregateHeights[col];
	},
	aggregate: function(elements){
		var output = "";
		for(var col = 0; col < elements.length; col++) {
			var element = elements[col];
			output += element + " ";

			if(0 == element) {
				this.aggregateHeights[col] = 0;
			} else {
				this.aggregateHeights[col] = this.aggregateHeights[col] + 1;
			}
		}
	}
};
MaximalRectangle.Cell = function(colArg, rowArg) {
	this.col = colArg;
	this.row = rowArg;
};
MaximalRectangle.Cell.prototype = {
	col:null,
	row:null
};
MaximalRectangle.prototype = {
	calculate: function(){
		var bestArea = 0;
		var bestLowerLeftCorner = new MaximalRectangle.Cell(0, 0);
		var bestUpperRightCorner = new MaximalRectangle.Cell(-1, -1);

		var stack = [];
		var rectangleHeightCache = new MaximalRectangle.Cache(this.numColumns);
		for(var row = 0; row < this.numRows; row++) {
			
			rectangleHeightCache.aggregate(this.generateRow(this.imageData, this.numColumns, row));
			for(var col = 0, currentRectHeight = 0; col <= this.numColumns; col++) {
				var aggregateRectHeight = rectangleHeightCache.get(col);

				if(aggregateRectHeight > currentRectHeight) {
					stack.push(new MaximalRectangle.Cell(col, currentRectHeight));
					currentRectHeight = aggregateRectHeight;
				} else if(aggregateRectHeight < currentRectHeight) {

					var rectStartCell;
					do {
						rectStartCell = stack.pop();
						var rectWidth = col - rectStartCell.col;
						var area = currentRectHeight * rectWidth;
						if(area > bestArea) {
							bestArea = area;
							bestLowerLeftCorner = new MaximalRectangle.Cell(rectStartCell.col, row);
							bestUpperRightCorner = new MaximalRectangle.Cell(col - 1, row - currentRectHeight + 1);
						}
						currentRectHeight = rectStartCell.row;
					} while(aggregateRectHeight < currentRectHeight);

					currentRectHeight = aggregateRectHeight;
					if(currentRectHeight != 0) {
						stack.push(rectStartCell);
					}
				}
			}
		}
		var recDef = {
			width: bestUpperRightCorner.col - bestLowerLeftCorner.col + 1,
			height: bestLowerLeftCorner.row - bestUpperRightCorner.row + 1,
			left: bestLowerLeftCorner.col,
			top: bestUpperRightCorner.row,
		};
		return recDef;
	},
	rgbaToInt: function(r, g, b, a) {
		if(r == this.findingColor.r && g == this.findingColor.g && b == this.findingColor.b){
			return 1;
		}else{
			return 0;
		}
	//    return ((r << 24) | (g << 16) | (b << 8) | a);
	},
	generateRow: function(imageData, width, rowNumber){
		var elements = [];
		for(var i=(rowNumber*width*4); i<(rowNumber*width*4)+(4*width); i+=4){
			elements.push(this.rgbaToInt(imageData.data[i], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3]));
		}
		return elements;
	}
};


function FindSourceArea(canvas, x, y){
	this.canvas = canvas;
	this.context =  this.canvas.getContext('2d');
	this.x = Math.floor(x);
	this.y = Math.floor(y);
}
FindSourceArea.prototype = {
	findBound: function(sourceLine, startPoint, direction){
		var r,g,b,a;
		var it;
		do{
			it = startPoint*4;
			r = sourceLine[it];
			g = sourceLine[it+1];
			b = sourceLine[it+2];
			a = sourceLine[it+3];
			if(direction){
				startPoint++;
			}else{
				startPoint--;
			}
		}while(
			this.center[0] == r &&
			this.center[1] == g &&
			this.center[2] == b
		);
		return startPoint;
	},
	calculate: function(){
		this.center =  this.context.getImageData(this.x, this.y, 1, 1).data;
		
		var verticalLine = this.context.getImageData(this.x, 1, 1, this.canvas.height).data;
		var horizontalLine = this.context.getImageData(1, this.y, this.canvas.width, 1).data;

		var topBound = this.findBound(verticalLine, this.y, false),
		bottomBound = this.findBound(verticalLine, this.y, true),
		leftBound = this.findBound(horizontalLine, this.x, false),
		rightBound = this.findBound(horizontalLine, this.x, true);
		var rect = {
			x: leftBound,
			y: topBound,
			width: rightBound - leftBound,
			height: bottomBound - topBound
		};
		return rect;
	}
};