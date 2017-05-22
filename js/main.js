var w;

var mlParams;

/**
 * mlResults: [ Array
 *   0 - costAr
 *   1 - iters
 *   2 - ThetaIdeal //only used for linear regression
 *   3 - IdealCost //only used for linear regression
 *   4 - X
 *   5 - Y
 *   6 - minTheta
 *   7 - XUnscaled
 *   8 - minThetaUnscaled
 *   9 - scaleFactors
 *   10- YOrig // Y is altered in once vs all logistic regression for individual runs
 *   ]
 */
var mlResults;

var visChart;
var costChart;

var vGraph;

var mlData;
var mlNN;



init();
  
startWorker();


/**
 * 
 */
function init() {
	
	w = null;
	
	costChart = null;
	visChart = null;
	
    mlParams = {};
	mlResults = [];
	mlData = {};
	mlNN = null;

	/*
    mlParams.featureType = "multi";
	featureTypeUpdated();
	*/
	
	mlParams.module = "reg";
	moduleUpdated();
	
	mlParams.numLogClasses = 2;
	numLogClassesUpdated();

    mlParams.displayTrainingNum = 0;

    mlParams.visualDisplay = 'chartsDiv';
    visualDisplayUpdated();


	
	document.getElementById('trainingInput').value = '224 895\n300 716\n310 667\n349 1111\n460 1450\n696 1638\n393 1150\n566 1657\n985 2540\n1109 2740\n710 1810\n828 3080\n948 2000';

    
	
}

/**
 * 
 */
function startWorker() {

if (typeof	(Worker) !== "undefined") {
	try {
		w = new Worker("js/mlTools_worker.js");
		w.onmessage = function(event) {
				if (event.data.action == 'progUp') {
					learnProgressForeground(event.data.elToUpdate,event.data.mess,event.data.clearFlag);
					
					if (event.data.obj) {
					  var mat = stringifyToMatrix(event.data.obj);
					  alert('obj: ' + mat + ' size: ' + mat.size());
					}
				
				}
				else if (event.data.action == 'fin') {
					//alert('min Th in: ' + event.data.minTheta);
					var minTheta = stringifyToMatrix(event.data.minTheta);
					//alert('Min Theta: ' + minTheta + ' size: ' + minTheta.size());
					var X = stringifyToMatrix(event.data.X);
					var Y = stringifyToMatrix(event.data.Y);
					var IdealCost = stringifyToMatrix(event.data.IdealCost);
					var ThetaIdeal = stringifyToMatrix(event.data.ThetaIdeal);
					var  XUnscaled = stringifyToMatrix(event.data.XUnscaled);
					var minThetaUnscaled = stringifyToMatrix(event.data.minThetaUnscaled);
					var scaleFactors = event.data.scaleFactors; //stringifyToMatrix(event.data.scaleFactors);
					var costAr =  event.data.costAr; // stringifyToMatrix(event.data.costAr);
					var iters =  event.data.iters;//stringifyToMatrix(event.data.iters);
					var YOrig = stringifyToMatrix(event.data.YOrig);
					
		
					mlResults.push([costAr,iters,ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors,YOrig]);
					
					if (mlParams.module == 'log') {
					       var acc = accuracy(math.transpose(minThetaUnscaled),XUnscaled,Y);
						   if (elVal('diagnosticsFlag')) {
							   el('diagnosticDiv').innerHTML += '<br>Predictions: ' + predict(math.transpose(minThetaUnscaled),XUnscaled);

							   el('diagnosticDiv').innerHTML += '<br>Accuracy: ' + acc;
							   el('diagnosticDiv').innerHTML += '<br>Confidence: ' + h(math.transpose(minThetaUnscaled),XUnscaled, true);
						   }
						   var perc  = (acc[1] / acc[2] * 100);
					       el('outputBlog').innerHTML +='<br>Summary this training run: ' + acc[1]  + '/' + acc[2] + ' (' + perc.toFixed(4) + '%)';

					}

					visualiseCostChart(costAr,iters);
					

					if (mlParams.module == 'neu') {
						var minThStr = applyNNThetaFromLearn(minTheta,X);
						
					}
					
					if (elVal('copyThetaFlag')) {
                          mlParams.initTheta = minThStr;
			               initThetaUpdated();
		            }
					
					
		
					visualise(X,Y,minTheta, XUnscaled,minThetaUnscaled,ThetaIdeal,scaleFactors);
					
					
					
				}
				else if (event.data.action == 'multiClassFin') {
					 console.log('One vs all is all finished');	
				//	 visualise(X,Y,minTheta, XUnscaled,minThetaUnscaled,ThetaIdeal,scaleFactors);
				
				    var YOrig = mlResults[0][10];  // Orig Y with all classes
		            var XUnscaled = mlResults[0][7];
		            var minThetaUnscaled = mlResults[0][8]; //not used
		            var scaleFactors = mlResults[0][9]; //not used
		
	             	visualise(null,YOrig,null, XUnscaled,minThetaUnscaled,null,scaleFactors);
					 //var acc = checkAccuracyMultiClass();
				}
				else if (event.data.action == 'chartUp') {
				
					//var costArExtra = event.data.costAr.slice(event.data.costAr.length - 1000);
					//var itersExtra = event.data.iters.slice(event.data.iters.length - 1000);
					var minTheta = stringifyToMatrix(event.data.minTheta);
					//alert('Min Theta: ' + minTheta + ' size: ' + minTheta.size());
					var X = stringifyToMatrix(event.data.X);
					var Y = stringifyToMatrix(event.data.Y);
					var IdealCost = stringifyToMatrix(event.data.IdealCost);
					var ThetaIdeal = stringifyToMatrix(event.data.ThetaIdeal);
					var  XUnscaled = stringifyToMatrix(event.data.XUnscaled);
					var minThetaUnscaled = stringifyToMatrix(event.data.minThetaUnscaled);
					var scaleFactors = event.data.scaleFactors; //stringifyToMatrix(event.data.scaleFactors);
					var costAr =  event.data.costAr; // stringifyToMatrix(event.data.costAr);
					var iters =  event.data.iters;//stringifyToMatrix(event.data.iters);
					
					updateCostChart(event.data.costAr,event.data.iters);
					if (mlParams.module == 'neu') {
						var minThStr = applyNNThetaFromLearn(minTheta,X);
					}
					
					visualise(X,Y,minTheta,XUnscaled,minThetaUnscaled,ThetaIdeal,scaleFactors);
					
				}
				
				else if (event.data.action == 'chartInit') {
					clearCharts();
				}

				else {
				   document.getElementById("rightBannerDiv").innerHTML = '<h2>Machine Learning Tools</h2>' + event.data;
				}   
			};
	}
	catch(e) {
		console.log('Worker not initialised, background processing will not be available.\nMessage: {' + e.message + '}');
		
	}
		
}
else {

        document.getElementById("rightBannerDiv").innerHTML = '<h2>Machine Learning Tools</h2>' + "Sorry! No Web Worker support.";
    }

}


/**
 * 
 */
function getParams() {
    
	//mlParams.featureType = featureType; //uses mvc
	mlParams.input = elVal('trainingInput');
	mlParams.degrees = parseInt(elVal('degreesInput'));
	mlParams.addOnesFlag = true;     //elVal('addOnesFlag');
	mlParams.scalingFlag = elVal('scalingFlag');
	mlParams.diagnosticsFlag = elVal('diagnosticsFlag');
	mlParams.solveAnalytically = elVal('analyticFlag');
	mlParams.initTheta = elVal('initTheta');
	mlParams.alpha = parseFloat(elVal('alphaInput'));
	var lam = elVal('lambdaInput');
	if (lam == '') {
		lam = '0';
	}
	mlParams.lambda = parseFloat(lam);
	mlParams.maxIterations = parseInt(elVal('maxIterationsInput'));
	mlParams.convThreshold = parseFloat(elVal('convThreshold'));
	
	mlParams.updateInitialThetaFlag = elVal('copyThetaFlag');
	
	mlParams.currClassNum = -1; //used for logisitic regression multi-class
	
	
	
	
 
 }


//Utility routines
/**
 * 
 * @param string
 * @returns {*}
 */
function stringifyToMatrix(string) {
  var obj = JSON.parse(string);
  //obj.__proto__ = math.matrix.prototype;
  var mat = math.matrix(obj.data);
  
  return mat;
}

/**
 * 
 * @param elId
 * @returns {*}
 */
function elVal(elId) {
    var el = document.getElementById(elId);
	
	if (!el) {
	   alert('el not defined: ' + elId);
	   return null;
	}
	
	if (el.type === 'checkbox') {
	   return el.checked;
	}
	
	else {
	
      return el.value;
	}
 
 }

/**
 * 
 * @param elId
 * @returns {*}
 */
 function el(elId) {
    return document.getElementById(elId	);
 
}
 


//Event routines


function visualButClicked() {

    //toggle visual display
    switch (mlParams.visualDisplay) {
        case 'chartsDiv':
            mlParams.visualDisplay = 'architectureDiv';
            break;

        case 'architectureDiv':
            mlParams.visualDisplay = 'chartsDiv';
            break;
        
        case 'regressionDiv': // Not used
            mlParams.visualDisplay = 'chartsDiv';
            break;

        default:

            break;

    }

    visualDisplayUpdated();


}

/**
 * 
 */
function testButClicked() {

   mlParams.module = 'tst';
   moduleUpdated();
   
   var mat32 = math.matrix([[1,2],[2,3],[4,5]]);
   var mat25 = math.matrix([[4,5,6,7,8],[6,7,8,9,10]]);
   
   var res = math.multiply(mat32,mat25);
   console.log('siz 32 25: ' + res.size());
   
   var mat21arr = math.matrix([[1],[4]]);
   res = math.multiply(mat32,mat21arr);
   console.log('size 32 21arr: dim: ' + res.size().length + ' size: ' + res.size());
   
    var mat2vec = math.matrix([1,4]);
   res = math.multiply(mat32,mat2vec);
   console.log('size 32 2vec: dim: ' + res.size().length + ' size: ' + res.size());
   
    var mat3vec = math.matrix([1,4,3]);
    res = math.multiply(mat3vec,mat32);
   console.log('size 2vec 32: dim: ' + res.size().length + ' size: ' + res.size());
   
   var thVec = math.matrix([1,3,4]);
   //var cols = thVec.size()[1];
   //var rows = thVec.size()[0];
   //var firstRow = math.subset(thVec, math.index(0, math.range(0,2)));
   //var firstCol = math.subset(thVec, math.index(math.range(0,2),0));
  // console.log('first row: ' + firstRow + ' first col: ' + firstCol);
   var XVec = math.matrix([[1,2],[2,3],[3,4]]);
   res = math.multiply(thVec,XVec);
   console.log('size thvec3 XVec32: dim: ' + res.size().length + ' size: ' + res.size());
   
    var thVecAr = math.matrix([[1],[3],[4]]);
   var XVec = math.matrix([[1,2],[2,3],[3,4]]);
   var thvecartrans = math.transpose(thVecAr);
   console.log('thvecar trans: ' + thvecartrans);
   res = math.multiply(thvecartrans,XVec);
   console.log('size thvecar3 XVec32: dim: ' + res.size().length + ' size: ' + res.size());
   
   var ar51 = math.matrix([[5],[4],[3],[2],[1]]);
   var ar13  = math.matrix([[4,5,6]]);
   res = math.multiply(ar51,ar13);
   console.log('size ar51 ar13: dim: ' + res.size().length + ' size: ' + res.size());
   
   var g = res.get([0,0]);
   
   res.forEach(function(el) {
	   console.log('el: ' + el);
   });
   
   math.forEach(res,function(el) {
	   console.log('ell: ' + el);
   });
   
   var cols = res.size()[1];
   var rows = res.size()[0];
   var firstRow = math.subset(res, math.index(0, math.range(0,cols)));
   var firstCol = math.subset(res, math.index(math.range(0,rows),0));
   console.log('first row: ' + firstRow + ' first col: ' + firstCol);
   
   var ar15 = math.matrix([[5,4,3,2,1]]);
   var ar31  = math.matrix([[4],[5],[6]]);
   res = math.multiply(ar15,ar51);
   console.log('size ar51 ar13: dim: ' + res.size().length + ' size: ' + res.size());
   
   var g = res.get([0,0]);
   
    var cols = res.size()[1];
   var rows = res.size()[0];
   var firstRow = math.subset(res, math.index(0, math.range(0,cols)));
   var firstCol = math.subset(res, math.index(math.range(0,rows),0));
   console.log('first row: ' + firstRow + ' first col: ' + firstCol);
   
   
   var tst = math.matrix([1]);
   
   var tst2 = math.matrix([[3,4,5],[2,3,4],[5,6,7]]);
   var tst3 = math.subset(tst2,math.index(math.range(0,1),math.range(1,2)));
   var tst4 = mRow(tst2,1);
   var tst5 = mCol(tst2,1);
   
   var mattoar = matrixToArray(tst2);
   var tst6 = math.matrix([[2],[3]]);
   var mattoar2 = matrixToArray(tst6);
   
   
   var mat21 = math.matrix([[2],[3]]);
   var r = mRow(mat21,0);
   
    var rAr = mRow(mat21,0,true);
    var cAr = mCol(mat21,0,true);
    var rMat = mRow(mat21,0);
    var cMat = mCol(mat21,0);
	
	var testY = math.matrix([[1],[2],[3]]);
	
	var testA = math.matrix([[1],[2],[3]]);
	
	var tst = math.dotMultiply(testA,testY);
	
   
   
   /* Fails A col2, B row1
     var mat2vec = math.matrix([[1,4]]);
   res = math.multiply(mat32,mat2vec);
   console.log('size 32 2vec: dim: ' + res.size().length + ' size: ' + res.size());
   */



    drawNN();
   
   /*
   var magicX = math.matrix([[1,1,1],[2,3,4],[2,3,4],[2,3,4]]);
   var Th = math.matrix([1,2,3,4]);
   var res = math.multiply(Th,magicX);
   */
   
   var nnXt = math.matrix([[1,0,0],[1,0,1],[1,1,0],[1,1,1]]);
   var nnTht = math.matrix([[-20,30,30],[30,-20,-20]]);
   var nnTh = math.transpose(nnTht);
   var nnX = math.transpose(nnXt);
   var nnY = math.matrix([0,1,1,0]);
   
   var nnTht2 = math.matrix([-30,20,20]);
   var nnTh2 = math.transpose(nnTht2);
   
   
   
   var randomTheta = true;
   
   
   var nn = new NeuralNetwork([2,2,1],nnX,nnY,nnX,mlParams.alpha,mlParams.lambda,mlParams.initTheta);
   nn.layers[0].Theta = nnTh;
   nn.layers[1].Theta = nnTh2;
   
   console.log('nn: ' + nn.architecture + ' str: ' + nn.toString());
   nn.forward();
   
   /*
   nn.layers[0].forward();
   console.log('nn: ' + nn.architecture + ' str: ' + nn.toString());
   
   console.log('Singles: ' + nn.layers[0].singleMs());
   
   nn.layers[1].Theta = nnTh2;
   nn.layers[1].X = math.clone(nn.layers[0].A);
   nn.layers[1].addBias();
   nn.layers[1].forward();
   
   console.log('Singles 2: ' + nn.layers[1].singleMs());
  */ 
   
   
   //var magicX = math.matrix([[1,1,1],[8,3,4],[1,5,9],[6,7,2]]);
   var magicX = math.matrix([[1,8,1,6],[1,3,5,7],[1,4,9,2]]);
   var testY = math	.matrix([1,0,1]);
   var testTh = math.matrix([-2,-1,1,2]);
   var c = costFunction(magicX,testTh,testY,4);
   
   
   
   
   var testXt = math.matrix([[1,2],[1,3],[1,4]]);
   var testY = math.matrix([4,6,9]);
   var testTh = math.matrix([2,3]);
   var testLambda = 0.5;
   var c = costFunction(testXt,testTh,testY,testLambda);
   
   var testX = math.transpose(testXt);	
   var d = derivs(testX,testTh,testY,testLambda);
   

  var testIn = math.matrix([[120000],[-25000],[0]]);
  var sig = sigmoid(testIn);
  
  //var testXT = math.matrix([[1,8,3],[3,4,5],[1,2,1]]);
  var testXT  = math.matrix([[1,8,1,6],[1,3,5,7],[1,4,9,2]]);
  
  //var testTheta = math.matrix([[0.1],[-0.1],[0.1]]);
  var testTheta = math.matrix([[-2],[-1],[1],[2]]);
  
  var testY = math.matrix([[1],[0],[1]]);
 
  var testH = h(testXT,testTheta,true);
  
  var pred = predict(testXT,testTheta);
 
  var C = costFunction(testXT,testTheta,testY,lambda,'log');
  var c = math.sum(C);
  
  var x = 1;

}

function neuralButClicked() {

        mlParams.module = 'neu';
        moduleUpdated();

        mlParams.visualDisplay = 'architectureDiv';
        visualDisplayUpdated();

        document.getElementById('trainingInput').value = '1 0 1\n0 1 1\n0 0 0\n1 1 0';

        applyInput();

}

/**
 * 
 */
function logButClicked() {
	
   mlParams.module = 'log';
   moduleUpdated();
   
   mlParams.visualDisplay = 'chartsDiv';
   visualDisplayUpdated();
 

 document.getElementById('trainingInput').value = '1 1 0\n2 0 0\n1 3 0\n3 5 1\n5 3 1\n4 2 1\n2.5 1 0\n2.5 6 1\n4 -1 1\n2 5 0\n3.5 -1 0\n3 10 1\n2 7 0\n1.666 11 1'	;
 // document.getElementById('trainingInput').value = '1 1 1\n2 2 2\n3 3 3'	;


 //el('initTheta').value = '-10 -10 10'; //set to non-optimal so that it is easier to see boundary adjusting
  
  //getParams();
  // var res = getXandY(mlParams);
   applyInput();
   
  
  
   //var X = res[0];
   //var Y = res[1];
   //var XUnscaled = res[2];
   
   //visualiseTrainingOnly(mlData.X,mlData.Y);

 
	
}

/**
 * 
 */
function regButClicked() {
	
   mlParams.module = 'reg';
   moduleUpdated();
   
   mlParams.visualDisplay = 'chartsDiv';
   visualDisplayUpdated();
 
   
   document.getElementById('trainingInput').value = '224 895\n300 716\n310 667\n349 1111\n460 1450\n696 1638\n393 1150\n566 1657\n985 2540\n1109 2740\n710 1810\n828 3080\n948 2000';
  
  applyInput();
    
 
   
   //visualiseTrainingOnly(mlData.X,mlData.Y);
   
   
   
 }
 
 function inputPasted() {
	 clearButtonPressed();
	 //applyInput();
	 
 }

function stepTraining(inc) {
    mlParams.displayTrainingNum+= inc; // used for neural network

    if (mlParams.displayTrainingNum < 0) {
        mlParams.displayTrainingNum = 0;
    }

    //drawNN(true);
	nnUpdated();
	
	/* test resize canvas
	el('nnCanvas').height = 400;
	el('outputDiv').style.height = 100;
	el('trainingInput').style.height = 100;
	el('diagnosticDiv').style.height = 100;
    */
}

/**
 * Now redundant
  * @param event
 */
function featureTypeClicked(event) {
    if (event.target.id === 'featurePoly') {
	    mlParams.featureType = 'poly';
		
    }
	else {
	   mlParams.featureType = 'multi';
	   
	}
	
	featureTypeUpdated();
 
 }

/**
 * 
 * @param event
 */
 function numLogClassesClicked(event) {
    mlParams.numLogClasses = parseInt(elVal('numLogClasses'));
	numLogClassesUpdated();
 
 }


/**
 * 
 * @param event
 */
function parseDataInput(data) {
	//mlParams.input = elVal('trainingInput');


	var ar=  data.split('\n'); //document.getElementById('trainingInput').value.split('\n');
	//alert(ar);
	yAr = [];
	//yOrigAr = [];

	ar = ar.map(function(line) {
		line = line.replace(/\[.*?\] */g,''); //remove any input in square brackets
		line = line.replace(/ +/g,' '); //remove extra spaces
		var elAr = line.split(' ');
		elAr = elAr.map(function(el) {
			return parseFloat(el);
		});

		yVal = elAr.pop();
		yOrigVal = yVal;

		//var first = elAr[0];

		//var out = (mlParams.addOnesFlag) ? [1] : [];

		var extra  = [];
		elAr.forEach(function(el) {

			for (var i = 2; i <=  mlParams.degrees;++i) {
				extra.push(Math.pow(el,i));
			}


		});
		elAr = elAr.concat(extra);

		if (mlParams.addOnesFlag) {

			elAr.unshift(1);

		}

		yAr.push([yVal]);

		return elAr;
	});


	var Xt = math.matrix(ar);
	var X = math.transpose(Xt);

	
	var Y;
	if (mlParams.module == 'neu') {
		var mx = math.max(yAr);
		if (mx > 1) {//multi output layers
			var multi = yAr.map(function(el) {
				var newAr = [];
				for (var i = 0;i < mx;++i) {
					if (i == el - 1) {
						newAr.push(1);
					}
					else {
						newAr.push(0);
					}
				}
				return newAr;
				
			});
			Y = math.matrix(multi);
			Y = math.transpose(Y);
		}
		else {
			Y = math.matrix(yAr);
			Y = math.transpose(Y);
		}
	}
	else {
 	  Y = math.matrix(yAr);
	  Y = math.transpose(Y);
	}
	
	/*
	var testX = math.matrix([[1,1,1],[20,5,10]]);
	var testThetaT = math.matrix([2,2]);
	testThetaT =  math.transpose(testThetaT);
	var test =  math.multiply(testThetaT,testX);
	*/

	return [X,Y];

}
 
//Callback routines

/**
 * 
 * @param targetEl
 * @param message
 * @param clearFlag
 */
function learnProgressForeground(targetEl,message,clearFlag) {
   
   if (targetEl == 'chart') {
      return; // 
   }
   if (clearFlag) {
       if (targetEl == 'rightBannerDiv') {
	       el(targetEl).innerHTML= '<h2>Machine Learning Tools</h2>' + message;
	   }
	   else {
          el(targetEl).innerHTML= message;
		}
	}
	
	else {
	   el(targetEl).innerHTML+= message;
	}
	
	
	if (targetEl == 'outputBlog') {
	   var elem = el('outputBlog');
       elem.scrollTop = elem.scrollHeight;
	
	}


}




//Action routines

/**
 * 
 */
function applyInput() {

   clearRes();
   getParams();

	mlData = {};
	mlNN = null;
	
	mlResults = [];

   var res = parseDataInput(elVal('trainingInput'));
   mlData.X = res[0];
   mlData.Y = res[1];
   mlDataUpdated();

   var yUnits = 1;
   
   if (mlParams.module == 'log') {
	   var yAr = mRow(mlData.Y, 0, true);
	   var multiClass = false;
	   if (math.max(yAr) > 1) { //contains multiple classes
		   multiClass = true;
		   yUnits = math.max(yAr);

		   if (math.max(yAr) != mlParams.numLogClasses) {
			   console.log('Num classes: ' + mlParams.numLogClasses + '  not equal to classes found in training set: ' + math.max(yAr) + ' auto fixing');
			   //alert('Num classes: ' + mlParams.numLogClasses + '  not equal to classes found in training set: ' + math.max(yAr));
		   }
		   
		
	   }
	   else {
		   yUnits = 1; //binary
	   }
	   
	   
   }
   else if (mlParams.module == 'neu') {
	   var yAr = mCol(mlData.Y, 0, true);
	   yUnits = yAr.length;
	   
   }
   
   mlParams.numLogClasses = yUnits;
   numLogClassesUpdated();
  // el('numLogClasses').value = yUnits;
   
   
   
   if (mlParams.module == 'neu') {
	      var randomTheta = true;
		  
	      mlNN = new NeuralNetwork([mlData.X.size()[0] - 1,mlData.X.size()[0] +1,yUnits],mlData.X,mlData.Y,mlData.X,mlParams.alpha,mlParams.lambda,mlParams.initTheta);
		  
		  if (mlParams.initTheta == '') {
			  var InTh = mlNN.unrollThetas();
			  var inThAr = matrixToArray(InTh);
			  var inThStr = arrayToString(inThAr);
			  mlParams.initTheta = inThStr;
			  initThetaUpdated();
			  
		  }
		  
		  nnUpdated();
		  /*
		  mlNN.forward(); // initial forward propagate based on initial Thetas
		  nnUpdated();
		  for (var i = 0;i < 5000;++i) {
		     mlNN.gradientCheck();
		  }
		  nnUpdated();
		  */
   	   
   }

   /*
   res = getXandY(mlParams,1);
   var X = res[0];
   var Y = res[1];
   var XUnscaled = res[2];
   visualiseTrainingOnly(XUnscaled,Y);
   */
  
    visualiseTrainingOnly(mlData.X,mlData.Y);

}


/**
 * Now redundant
 */
function featureTypeUpdated() {
 
    //mlParams.featureType = featureType;
	
    switch (mlParams.featureType) {
	
	  case 'poly':
	     if (elVal('featureMulti')) {
		 
	        el('featurePoly').checked = true;
		 }
		 el('degreesInput').style.display = 'inline-block';
		 el('degreesInputLab').style.display = 'inline-block';
	
	  break;
	  
	  case 'multi':
	    if (elVal('featurePoly')) {
		   el('featureMulti').checked = true;
		}
	    
		el('degreesInput').style.display = 'none';
		el('degreesInputLab').style.display = 'none';
	
	  break;
	   
	   default:
	   
	
	   break;
	
	}
 }

/**
 * 
 */
function numLogClassesUpdated() {
 
    
      el('numLogClasses').value = mlParams.numLogClasses;
	

 }
 
 function initThetaUpdated() {
	 el('initTheta').value = mlParams.initTheta;
	 
 }

/**
 * 
 */
 function moduleUpdated() {
	 
	clearButtonPressed();
 
    switch (mlParams.module) {
	

	  
	  case 'log':
	       el('logistic').classList.remove('blackBut');
           el('logistic').classList.add('colourBut');
		   el('regression').classList.remove('colourBut');
           el('regression').classList.add('blackBut');
		   el('test').classList.remove('colourBut');
           el('test').classList.add('blackBut');
           el('neural').classList.remove('colourBut');
           el('neural').classList.add('blackBut');
		   
		   el('numLogClasses').hidden = false;
           el('numLogClassesLab').hidden = false;
		   
		   el('analyticFlag').hidden = true;
           el('analyticFlagLab').hidden = true;

		   break;

        case 'neu':
            el('logistic').classList.remove('colourBut');
            el('logistic').classList.add('blackBut');
            el('regression').classList.remove('colourBut');
            el('regression').classList.add('blackBut');
            el('test').classList.remove('colourBut');
            el('test').classList.add('blackBut');
            el('neural').classList.remove('blackBut');
            el('neural').classList.add('colourBut');



            el('numLogClasses').hidden = false;
            el('numLogClassesLab').hidden = false;
			
		    el('analyticFlag').hidden = true;
            el('analyticFlagLab').hidden = true;

			
            break;



        case 'reg':
		
	       el('regression').classList.remove('blackBut');
           el('regression').classList.add('colourBut');
		   el('logistic').classList.remove('colourBut');
           el('logistic').classList.add('blackBut');
		   el('test').classList.remove('colourBut');
           el('test').classList.add('blackBut');
           el('neural').classList.remove('colourBut');
           el('neural').classList.add('blackBut');



           el('numLogClasses').hidden = true;
           el('numLogClassesLab').hidden = true;
		   
		   el('analyticFlag').hidden = false;
           el('analyticFlagLab').hidden = false;

		
		   break;
		   
		case 'tst':
		
	       el('regression').classList.remove('colourBut');
           el('regression').classList.add('blackBut');
		   el('logistic').classList.remove('colourBut');
           el('logistic').classList.add('blackBut');
		   el('test').classList.remove('blackBut');
           el('test').classList.add('colourBut');
           el('neural').classList.remove('colourBut');
           el('neural').classList.add('blackBut');


            el('numLogClasses').hidden = true;
           el('numLogClassesLab').hidden = true;
			   
		
	   
	   default:
	   
	
	       break;
		   }
 
 }

 function nnUpdated() {
	 drawNN();
	 el('outputIndiv').innerHTML = 'Training sample: ' + (mlParams.displayTrainingNum + 1) + ' Inputs: ' + mlNN.getInputsForSingleM(mlParams.displayTrainingNum,4) + '<br>Training sample cost contrib / output unit: ' + mlNN.getCost('CM',mlParams.displayTrainingNum,4);
	 if (mlParams.diagnosticsFlag) {
 	    el('diagnosticDiv').innerHTML += ' Tot output layers: ' + mlNN.getCost('CM',mlParams.displayTrainingNum);
	    el('diagnosticDiv').innerHTML += '<br>Tot overall cost all training: ' + mlNN.getCost('C') + ' Tot Reg Cost: ' + mlNN.getCost('R') + ' Tot cost both: ' + mlNN.getCost('T');
	 }

 }
 
 function visualDisplayUpdated() {

     var visDivs = document.getElementsByClassName('visClass');

     [].forEach.call(visDivs,(function(vd) {
        if (vd.id === mlParams.visualDisplay) {
            vd.style.display = "block";
        }
        else {
            vd.style.display = "none";
        }
     }));
     var xx = 1;

 }


        /**
 * Works out number of features (excluding x0) from an X matrix which has had extra polynomial degrees added
 * @returns {Array}  Number of features excluding x0, index of first x1 poly feature, index of last x1 poly feature
 */
 function getNumFeatures() {
	 var numFeatures = (mlData.X.size()[0]  - 1) /  mlParams.degrees;
	 
	 var x1PolyFrom = -1;
	 var x1PolyTo = -1;
	 if (mlParams.degrees > 1) {
	    x1PolyFrom = numFeatures + 1;
	    x1PolyTo =  numFeatures  + mlParams.degrees - 1;
	 }
	 return [numFeatures,x1PolyFrom,x1PolyTo];
 }
 
 /**
 * Formats data for display
 */
 function formatData() {
	 var str = '';
	 var Xt = math.transpose(mlData.X);
	 var Y = mlData.Y;
	 
	 var numFeatures =  getNumFeatures()[0]; //(Xt.size()[1] - 1) /  mlParams.degrees;
	
	 
	 for (var i = 0;i < Xt.size()[0];++i) {
		 var row = mRow(Xt,i,true);
		 
		 
		 var firstDegree = true;
		 row = row.map(function(el,j) {
			 if (j == 0) {
				 el = '[' + el + ']';
			 }
			 else {
				 if ((j - 1) % numFeatures == 0) {
					 if (!firstDegree) {
					   el = '[' + el;
					 }
			     }
			     if (j % numFeatures == 0) {
					 if (!firstDegree) {
				        el = el + ']';
					 }
					 firstDegree = false;
			     }
			 
			 }
			 return el;
				 
			
		 });
		 //row.push(Y.get([i]));
		 
		 if (mlParams.module == 'neu') {
			 
			 var yColumn = mCol(Y,i,true);
			 if (yColumn.length == 1) {
				 row.push(yColumn); //just binary value
			 }
			 else {
				 //multi output layers
				 var yVal = -1;
				 for (var k = 0;k < yColumn.length;++k) {
					 if (yColumn[k] == 1) {
						 yVal = k+1;
						 break;
					 }
				 }
				 row.push(yVal);
			 }
		 }
		 else {
		    row.push(mCol(Y,i,true));
		 }
		 str+= arrayToString(row);
	     if (i < Xt.size()[0]  - 1)  {
			  str+= '\n';
		 }
		 
		 
	 }
	 
	 el('trainingInput').value = str;
		 
	 
	 
 }
 
 
 function mlDataUpdated() {
	 //Updates textarea showing X and Y
	 // also triggers scaling etc
	 
	 getParams();
	 
	 formatData();
	 

	 /*
     ret = featureScale(mlData.X);
     scaleFactors = ret[1];
     if (mlParams.scalingFlag) {
       mlData.XScaled = ret[0];
 	 }
	 else {
	   mlData.XScaled = null;
	 }
	 
	 mlData.scaleFactors = scaleFactors;
	   */
   
	 
 }


/**
 * 
 */
function clearCharts() {
   if (visChart) {
     visChart.destroy();
	 
   }
   
   if (costChart) {
     costChart.destroy();
   }
   
   visChart = null;
   costChart = null;

 
 }
 
 function clearButtonPressed() {
	 
	 el('initTheta').value = '';
	 
	  clearRes();
 }

/**
 * 
 */
function clearRes()  {

  
  el('outputBlog').innerHTML = '';
  el('diagnosticDiv').innerHTML = '';
  el('rightBannerDiv').innerHTML = '<h2>Machine Learning Tools</h2>';
  
  
  
  clearCharts();
  
  
  
  
}

/**
 * 
 * @returns {*}
 */
function checkAccuracyMultiClass() {
	
	

	var confAr = [];
		
	    for (var i = 0;i < mlParams.numLogClasses;++i) {
			
				res = mlResults[i];
		
				var costAr = res[0];
				var iters = res[1];
				var ThetaIdeal = res[2];
				var IdealCost = res[3];
				var X = res[4];
				var Y = res[5];
				var minTheta = res[6];
				var XUnscaled = res[7];
				var minThetaUnscaled = res[8];
				var scaleFactors = res[9];
				var YOrig = res[10];
				
				var conf = h(math.transpose(minThetaUnscaled),XUnscaled,true);
				confAr.push(conf);
			
		}
		
		var predAr = [];
		
		var Y = mlResults[0][10]; // get Y original from first result (will be same for all)
		
		for (var m = 0;m < Y.size()[1];++m) {
			var max = 0;
			var maxI = -1;
			for (var i = 0;i < mlParams.numLogClasses;++i) {
				var conf = confAr[i].get([0,m]);
				if (conf > max) {
					max = conf;
					maxI = i;
				}
				
			}
					
			
			predAr.push([maxI + 1]);
			
			
			
		}
		var predMat = math.transpose(math.matrix(predAr));
		var acc = math.subtract(predMat,Y);
		var numCorrect = 0;
		acc.forEach(function(el) {
			if (el == 0) {
		        ++numCorrect;
			}
		});
		console.log('Num correct: ' + numCorrect);
		var tot = acc.size()[1];
		var perc = (numCorrect / tot * 100).toFixed(2);
		learnProgressForeground('rightBannerDiv',' Overall num Correct: ' + numCorrect + '/' + tot + ' (' + perc + '%)' );
		
	return acc;
}


function applyNNThetaFromLearn(MinTheta,ScaledX) {
			//var MinTheta = res[6];
			var Th = MinTheta.clone();
			
			Th = math.squeeze(Th);
			var minThStr = arrayToString(matrixToArray(Th),' ');
			
			mlNN.reInitThetas(minThStr);
			
			if (mlParams.scalingFlag) {
				mlNN.reInitX(ScaledX);
			}
			
			mlNN.forward(); // initial forward propagate based on initial Thetas
			nnUpdated();
			
			return minThStr;
	
}

/**
 * 
 */
function learnBackground() {

    if (!w) {
	  alert('Background processing not available');
	  return;
	}

	/*
    getParams();
	
	mlResults = [];
	
	clearCharts();
	*/
	applyInput();
	
	visualiseCostChart([],[]);
	
	//Todo
	//Also pass X, Y and scalefactors to background worker, may need to stringify
	
	switch (mlParams.module) {
	    case 'reg': 
		case 'neu':
		    w.postMessage({'action':'Go','params':mlParams,'mlData':mlData});
	      break;
		 
		case 'log':
		   if (mlParams.numLogClasses > 2) { // multi class, use one vs all
		       
		       for (var i = 0;i < mlParams.numLogClasses;++i) {
			      mlParams.currClassNum = i;
		          w.postMessage({'action':'Go','params':mlParams,'mlData':mlData});
	           }
			}
			else {
			    w.postMessage({'action':'Go','params':mlParams,'mlData':mlData});
			}

          break;	

		default:
			break;
			
	}
	
    //w.postMessage({'action':'Go','params':mlParams});
	

}


/**
 * 
 */
function learnForeground() {

	/*
    getParams();
	
	mlResults = [];

	clearCharts();
	*/
	applyInput();

	var res;
	
	switch (mlParams.module) {
	    case 'reg': 
		   res = learn(mlParams,mlData.X,mlData.Y,learnProgressForeground); //mlData.scaleFactors,learnProgressForeground);
		   mlResults.push(res);
		   
		   if (elVal('copyThetaFlag')) {
		   var finalTh = mlResults[0][6];
			   var fl = math.flatten(finalTh);
			   var flAr = matrixToArray(fl);
			   var str = arrayToString(flAr);
			   mlParams.initTheta = str;
			   initThetaUpdated();
		   }
		   
		   
		   
	      break;
		 
		case 'log':
		   if (mlParams.numLogClasses > 2) { // multi class, use one vs all
		       
		       for (var i = 0;i < mlParams.numLogClasses;++i) {
			      mlParams.currClassNum = i;
		          res = learn(mlParams,mlData.X, mlData.Y,learnProgressForeground);
		    	  mlResults.push(res);
		       }
			}
			else {
			    res = learn(mlParams,mlData.X, mlData.Y, learnProgressForeground);
		        mlResults.push(res);
			}

          break;

        case 'neu':
  			
			res = learn(mlParams,mlData.X,mlData.Y,learnProgressForeground); //mlData.scaleFactors,learnProgressForeground);
		    mlResults.push(res);
			
			var minThStr = applyNNThetaFromLearn(res[6],res[4]);
			
			if (elVal('copyThetaFlag')) {
		       mlParams.initTheta = minThStr;
			   initThetaUpdated();
		   }
		   
		   var accNeu = mlNN.checkAccuracy();
			
			break;
			
		default:
			break;
			
	}
	   
	 
	if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2)) { // multi class, use one vs all
	
	
		var YOrig = mlResults[0][10];  // Orig Y with all classes
		var XUnscaled = mlResults[0][7];
		var minThetaUnscaled = mlResults[0][8]; //not used
		var scaleFactors = mlResults[0][9]; //not used
		
		visualise(null,YOrig,null, XUnscaled,minThetaUnscaled,null,scaleFactors);
		
	
	
	
	}
    else {

        if (mlParams.module == 'neu') {
			if (mlParams.diagnosticsFlag) {
               el('diagnosticDiv').innerHTML += '<br>Neural done. Accuracy: ' + accNeu[0] + ' / ' + accNeu[1];
			}
            
        }
	
	
		res = mlParams.module == 'reg' ? mlResults[0] : mlResults[mlResults.length -1];
		
		var costAr = res[0];
		var iters = res[1];
		var ThetaIdeal = res[2];
		var IdealCost = res[3];
		var X = res[4];
		var Y = res[5];
		var minTheta = res[6];
		var XUnscaled = res[7];
		var minThetaUnscaled = res[8];
		
		var scaleFactors = res[9];
		
		if (mlParams.module == 'log') {
			if (mlParams.diagnosticsFlag) {	
			   el('diagnosticDiv').innerHTML += '<br>Predictions: ' + predict(math.transpose(minThetaUnscaled),XUnscaled);
			   var acc = accuracy(math.transpose(minThetaUnscaled),XUnscaled,Y);
			   el('diagnosticDiv').innerHTML += '<br>Accuracy: ' + acc;
			   el('diagnosticDiv').innerHTML += '<br>Confidence: ' + h(math.transpose(minThetaUnscaled),XUnscaled,true);
			   var perc = (acc[1] / acc[2] * 100);
			   el('diagnosticDiv').innerHTML +='<br>Summary this training run: ' + acc[1]  + '/' + acc[2] + ' (' + perc.toFixed(4) + '%)';
		   }
		}
		
		visualiseCostChart(costAr,iters);
		
		visualise(X,Y,minTheta, XUnscaled,minThetaUnscaled,ThetaIdeal,scaleFactors);
		
	}
	
	

}

//Visualisation routines

function drawNN(useExisting) {

    var c=document.getElementById("nnCanvas");
    var ctx=c.getContext("2d");

    if (useExisting) {
        vGraph.display(ctx,mlParams.displayTrainingNum);
        return;
    }


    /*
    ctx.beginPath();
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();
    */

	
	/* test neural network without using traininginput visual element
    var nnXt = math.matrix([[1,0,0],[1,0,1],[1,1,0],[1,1,1]]);
    var nnTht = math.matrix([[-20,30,30],[30,-20,-20]]);
    var nnTh = math.transpose(nnTht);
    var nnX = math.transpose(nnXt);
    var nnY = math.matrix([0,1,1,0]);
    var nnTht2 = math.matrix([-30,20,20]);
    var nnTh2 = math.transpose(nnTht2);
    var randomTheta = true;

    var YUnits;
    if (mlData.Y.size().length == 1) {
        YUnits = 1;
    }
    else {
        YUnits = mlData.Y.size()[0];
    }

    var nn = new NeuralNetwork([mlData.X.size()[0] - 1,mlData.X.size()[0] - 1,YUnits],mlData.X,mlData.Y,randomTheta);
    nn.layers[0].Theta = nnTh;
    nn.layers[1].Theta = nnTh2;

    nn.forward();
	*/
	

	
	/*
    var tstXT = math.matrix([[1,3,4,5,6],[1,4,5,6,7],[1,115,116,117,118]]);
    var tstX = math.transpose(tstXT);
    var nn = new NeuralNetwork([4,2,1],tstX,nnY,randomTheta);
    nn.forward();
*/
    var vController = new VNetworkController(mlNN);

    vGraph = new VNetwork('Neural Network',c.width,c.height,vController);
    vGraph.display(ctx,mlParams.displayTrainingNum);

    /*
    var v1 = new VNode();
    v1.display(ctx);

    var v2 = new VNode('L12',[20,80],10,20,'#0000FF');
    v2.display(ctx);

    var v3 = new VNode('L13',[20,140],10,4);
    v3.display(ctx);

    var v4 = new VNode('L21',[200,80],10,1);
    v4.display(ctx);

    var con1 = new VEdge('Connect:',v1,v4,3);
    con1.display(ctx);

    var con2 = new VEdge('Connect:',v2,v4,5);
    con2.display(ctx);

    var con3 = new VEdge('Connect:',v3,v4,7);
    con3.display(ctx);
    */

    /*
    var l = c.clientLeft;
    var t = c.clientTop;
    var w = c.clientWidth;
    var h = c.clientHeight;
    ctx.rect(l,t,w,h);
    ctx.stroke();
    */


}


/**
 * 
 * @param scatData
 * @param modelData
 * @param idealData
 * @param scatPointBackgroundColors
 * @param scatPointStyles
 */
function updateVisGraph(scatData,modelData,idealData,scatPointBackgroundColors,scatPointStyles) {
    if (scatData) {
	  visChart.data.datasets[0].data = scatData;
	  
	}
    if (modelData) {
	  visChart.data.datasets[1].data = modelData;
	}
	
	if (idealData) {
	    visChart.data.datasets[2].data = idealData;
	}
	
	if (scatPointBackgroundColors) {
	  visChart.data.datasets[0].pointBackgroundColor = scatPointBackgroundColors;
	}
	
	
	if (scatPointStyles) {
	  visChart.data.datasets[0].pointStyle  = scatPointStyles;
	}
	
  
    visChart.update();
	

}

/**
 * 
 * @param scatData
 * @param modelData
 * @param idealData
 * @param scatPointBackgroundColors
 * @param scatPointStyles
 */
function createVisGraph(scatData,modelData,idealData,scatPointBackgroundColors,scatPointStyles) {
   var ctx = document.getElementById("visualiseChart");

   if (visChart) {
     updateVisGraph(scatData,modelData,idealData,scatPointBackgroundColors,scatPointStyles);

  }

else {

    if (!modelData) {
	   modelData = [];
	}
	
	if (!idealData) {
	
	   idealData = [];
	   
	}
	
	if (!scatData) {
	   scatData = [];
	}
	
	
	var scatterChart = new Chart(ctx, {
		type: 'line',
		options: {
           title: {
               display: true,
               text: 'Training'
           }
        },
		data: {
			datasets: [{
				label: 'Training Data',
				
				data: scatData,
				pointBackgroundColor: scatPointBackgroundColors,
				pointStyle:scatPointStyles,
				//pointRadius: 1
				
				//fill: false
			},
			{
					
				label: 'Model',
				data: modelData,
				pointBackgroundColor: "#000",
				
				pointRadius: 1,
				
				fill: false
			
			},
				{
				label: 'Ideal',
				
				data: idealData,
				pointBackgroundColor: "#0f0",
				pointRadius: 1,
				
				fill: false
			
			}
			
			
			]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}]
			},
			showLines:false,
			responsive:false
		}
	});

	 visChart = scatterChart;
  }
 


}

/**
 * 
 * @param XUnscaled
 * @param Y
 * @param ThetaUnscaled
 * @returns {{points: Array, colours: string, styles: string}}
 */
function constructRegTrainingPlotPoints(XUnscaled,Y,ThetaUnscaled) {
 
 
  var pointBackgroundColors = [];
  var pointStyles = [];
  
  var x1Ar = mRow(XUnscaled,1,true);

  var yAr = mRow(Y,0,true);

   var scatData = [];
   x1Ar.forEach(function(x,i) {
       var y = yAr[i];
	   var plotPoint = {x:x,y:y};
	   scatData.push(plotPoint);
	 
   });
   
  
  return {'points':scatData,'colours':"#f0f",'styles':'circle'};

}


/**
* Converts  all multi class Y vectors, eg [0 1 0 0] to class number, eg 2 for neural networks
*/
function convMultiClassMatrixToNum(Y) {
	
	var yAr = [];
	
	for (var c = 0;c < Y.size()[1];++c) {

     	var yVec = mCol(Y,c,true);
		
		for (var i = 0;i < yVec.length;++i) {
			  if (yVec[i] == 1) {
				yAr.push(i+1);
				break;
			  }				
		}
	}
	
	return yAr;
	
}

/**
 * 
 * @param XUnscaled
 * @param Y
 * @param ThetaUnscaled
 * @param showAccForMultiClass
 * @returns {{points: Array, colours: Array, styles: Array}}
 */
function constructClassificationTrainingPlotPoints(XUnscaled,Y,ThetaUnscaled,showAccForMultiClass) {
  var x1Ar = mRow(XUnscaled,1,true);
  
  var x2Ar = mRow(XUnscaled,2,true);
  
  var yAr;
  
  if ((mlParams.module === 'neu') && (Y.size()[0] > 1)) {
	   yAr = convMultiClassMatrixToNum(Y);
  }
  else {
       yAr = mRow(Y,0,true);
  }
  
  var scatData = [];
  
  var pointBackgroundColors = [];
  var pointStyles = [];
  
  var accMatrix;
  
  var multiClass = false;
  if (math.max(yAr) > 1) { //contains multiple classes
     multiClass = true;
  }
  
 
 
  if ((multiClass) && (showAccForMultiClass)) {
	  //check accuracy against all classes
	  if (mlParams.module === 'neu') {
		  accMatrix =  mlNN.checkAccuracy()[5];
	  }
	  else {
	    accMatrix = checkAccuracyMultiClass();
	  }
  }
  else if (ThetaUnscaled) {
	 // if theta provided - check predictions and colour correct predictions green
	 if (mlParams.module === 'neu') {
		 accMatrix =  mlNN.checkAccuracy()[5];
	 }
	 else {
	   var acc = accuracy(math.transpose(ThetaUnscaled),XUnscaled,Y);
	   accMatrix = acc[5];
	 }
	 
  }
  
  
  
  x1Ar.forEach(function(x,i) {
     var x2 = x2Ar[i]; //"y" is actually just second x here
	 var rad = yAr[i] == 1 ? 6 : 1;
	 var plotPoint = {x:x,y:x2};
	 
	 var col;
	 
	 scatData.push(plotPoint);
	 if (multiClass) {
	     var shape;
	     switch (yAr[i]) {
		    case 1:
			   shape = 'rect';
			   col = '#000000';
			   break;
			   
			   
			case 2:
			   shape = 'triangle';
			   col = '#00ff00';
			   break;
			   
			
			
			case 3:
			   shape = 'circle';
			   col = '#0000ff';
			   break;
			   
			default:
               shape = 'cross';
			   col = '#000000';
               break;			   
			   
		   
		 }
		 pointStyles.push(shape);
	 } 
	 else {
	     pointStyles.push(yAr[i] == 1 ? 'triangle' : 'circle');
		 col = yAr[i] == 1 ? "#00ff00" : "#0000ff";
	 
	 }
	 
	 if ((ThetaUnscaled) || ((multiClass) && (showAccForMultiClass))) {
	    if (math.subset(accMatrix,math.index(0,i)) == 0) {//accurate predictions
		
		    pointBackgroundColors.push(col);
		}
		else {
		   pointBackgroundColors.push("#ff0000");
		}
	    
	 }
	 else {
	    pointBackgroundColors.push(col);
	}
	 
	 
  });  
  
  
  return {'points':scatData,'colours':pointBackgroundColors,'styles':pointStyles};

}

/**
 * 
 * @param XUnscaled
 * @param Y
 */
function visualiseTrainingOnly(XUnscaled,Y) {
  var ctx = document.getElementById("visualiseChart");
  
  
  var res;
  if ((mlParams.module == 'log') || (mlParams.module === 'neu')) {
      res = constructClassificationTrainingPlotPoints(XUnscaled,Y,null,false);
  }
  else {
      res = constructRegTrainingPlotPoints(XUnscaled,Y);
 
  }
  
  createVisGraph(res.points,null,null,res.colours,res.styles);

}


/**
 * 
 * @param XUnscaled
 * @param Y
 * @param ThetaOrig
 * @param scaleFactors
 */
function visualiseClassification(XUnscaled,Y,ThetaOrig,scaleFactors) { 
	var ctx = document.getElementById("visualiseChart");
	
	var res = constructClassificationTrainingPlotPoints(XUnscaled,Y,ThetaOrig,true);
	createVisGraph(res.points,null,null,res.colours,res.styles);
	
	var incX = scaleFactors ? (scaleFactors[1][1] / 30) : 2000 / 10;
    var endX = scaleFactors ?  scaleFactors[1][2] + scaleFactors[1][1] +  incX  : 2000;
	
	
	if (mlParams.module === 'log') {
		var modelData = [];

		for (var i = scaleFactors[1][2] - incX;i <=	 endX;i = i + incX) {
			  //construct boundary, ie line/curve where Xt Theta = 0
			  
			  //i represents x1
			  var Tmp = math.multiply(math.transpose(XUnscaled),ThetaOrig);
			  var sum = math.subset(ThetaOrig,math.index(0,0)); //ThetaOrig[0];
			  sum+= math.subset(ThetaOrig,math.index(1,0))  * i; //x1
			  var thx2 = sum * -1;
			  var x2 = thx2 / math.subset(ThetaOrig,math.index(2,0));

			  var plotPoint = {x:i,y:x2};
			  modelData.push(plotPoint);

		}
		
		if (XUnscaled.size()[0] > 3) {
		
		}
		else {
		
		  updateVisGraph(null,modelData);
		}
	}


}

/**
 * 
 * @param X
 * @param Y
 * @param Theta
 * @param XUnscaled
 * @param ThetaOrig
 * @param ThetaIdeal
 * @param scaleFactors
 */
function visualise(X,Y,Theta,XUnscaled,ThetaOrig,ThetaIdeal,scaleFactors) {

var ctx = document.getElementById("visualiseChart");

if ((mlParams.module == 'log') || (mlParams.module === 'neu')) {
   visualiseClassification(XUnscaled,Y,ThetaOrig,scaleFactors);	
   return;
}

var rows = XUnscaled.size();

var x1Ar = mRow(XUnscaled,1,true);


var yAr = mRow(Y,0,true);


var scatData = [];
x1Ar.forEach(function(x,i) {
     var y = yAr[i];
	 var plotPoint = {x:x,y:y};
	 scatData.push(plotPoint);
	 
});

var modelData =[];

var idealData = [];

var incX = scaleFactors ? (scaleFactors[1][1] / 60) : 2000 / 10;
var endX = scaleFactors ?  scaleFactors[1][2] + scaleFactors[1][1] +  incX  : 2000;

for (var i = scaleFactors[1][2] - incX;i <=	 endX;i = i + incX) {
   //var th0 = math.subset(Theta,math.index(0));
   //var th1 = math.subset(Theta,math.index(1)); 
 
   var xVal;
   
	xVal = i;
	
	
	var yVal = 0;
	var yValIdeal = 0;
	
	var ThetaModel =  document.getElementById('scalingFlag').checked ? ThetaOrig : Theta;
  
//  if (document.getElementById('scalingFlag').checked)  {
	
	// Only visualising x1 against y for model (including any additional x1 poly terms)
    for (var ii = 0;ii < 2;++ii) {  //ThetaOrig.size()[0];++ii) {
	  
		  yVal+= (math.subset(ThetaModel,math.index(ii,0)) * Math.pow(i,ii));
		
    }
    if (mlParams.degrees > 1) {
	  var res = getNumFeatures();
	  var firstPolyX1 = res[1];
	  var lastPolyX1 = res[2];
	  var ind = 2;
	  for (ii = firstPolyX1;ii < lastPolyX1 + 1;++ii) {
		  yVal+= (math.subset(ThetaModel,math.index(ii,0)) * Math.pow(i,ind));
		  ++ind;
	  }
    
	}
	/*
	else {
	   for (var ii = 0;ii < Theta.size()[0];++ii) {
	       yVal += (math.subset(Theta,math.index(ii))  * Math.pow(i,ii));
	   }
	}
	*/
	
	
	/*
	for (var ii = 0;ii < ThetaIdeal.size()[0];++ii) {
	       yValIdeal += (math.subset(ThetaIdeal,math.index(ii))  * Math.pow(i,ii));
	}
	*/
	
	//Only visualise x1 and its polys against y
	for (var ii = 0;ii < 2;++ii) {  
	  
		  yValIdeal+= (math.subset(ThetaIdeal,math.index(ii,0)) * Math.pow(i,ii));
		
    }
    if (mlParams.degrees > 1) {
	  var res = getNumFeatures();
	  var firstPolyX1 = res[1];
	  var lastPolyX1 = res[2];
	  var ind = 2;
	  for (ii = firstPolyX1;ii < lastPolyX1 + 1;++ii) {
		  yValIdeal+= (math.subset(ThetaIdeal,math.index(ii,0)) * Math.pow(i,ind));
		  ++ind;
	  }
    
	}
	
	
	
   //var yVal = th0 + (th1 * xVal); 
  
   var degrees = parseInt(elVal('degreesInput'));
 
 
    var plotPoint = {x:i,y:yVal};
	var plotPointIdeal = {x:i, y:yValIdeal};
	
	 
 
   modelData.push(plotPoint);
   
   idealData.push(plotPointIdeal);
   
}

Theta.subset(math.index(0,0)); 

if (visChart) {

  visChart.data.datasets[0].data = scatData;
  visChart.data.datasets[1].data = modelData;
  visChart.data.datasets[2].data = idealData;
  visChart.update();

}

else {
	var scatterChart = new Chart(ctx, {
		type: 'line',
		options: {
           title: {
               display: true,
               text: 'Training'
           }
        },
		data: {
			datasets: [{
				label: 'Training Data',
				/*
				data: [{
					x: -10,
					y: 0
				}, {
					x: 0,
					y: 10
				}, {
					x: 10,
					y: 5
				}]
				*/
				data: scatData,
				pointBackgroundColor: "#f0f",
				
				fill: false
			},
			{
				   label: 'Model',
				
				/*
				data: [{
					x: 0,
					y: 0.1
				}, {
					x: 0.3,
					y: 0.3
				}, {
					x: 0.5,
					y: 0.5
				}]
				*/
				
				
				data: modelData,
				pointBackgroundColor: "#000",
				pointRadius: 1,
				
				fill: false
			
			},
				{
				   label: 'Ideal',
				
				/*
				data: [{
					x: 0,
					y: 0.1
				}, {
					x: 0.3,
					y: 0.3
				}, {
					x: 0.5,
					y: 0.5
				}]
				*/
				
				
				data: idealData,
				pointBackgroundColor: "#0f0",
				pointRadius: 1,
				
				fill: false
			
			}
			
			
			]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}]
			},
			showLines:false,
			responsive:false
		}
	});

	 visChart = scatterChart;
  }

}
	
function updateCostChart(newCost,newIters) {

//var len = costAr.length;

//var smallerCost = costAr.slice(len - lastHowMany);
//var smallerIter = iters.slice(len - lastHowMany);


	 costChart.data.labels = newIters;
	 costChart.data.datasets[0].data = newCost;


/*
	if (newIters.length > 50) {
		if (costChart.data.labels.length % 2 == 0) {
			costChart.data.labels.push(newIters[newIters.length - 1]);
			costChart.data.datasets[0].data.push(newCost[newCost.length - 1]);
		}
		else {


		//	costChart.data.labels.splice(0,1);
		//	costChart.data.datasets[0].data.splice(0,1);


		}
	}
    else {
        costChart.data.labels = newIters;
        costChart.data.datasets[0].data = newCost;

    }
*/


costChart.update();



}

/**
 * 
 * @param costAr
 * @param iters
 */
function visualiseCostChart(costAr,iters) {

//console.log('costar: ' + costAr);

var len = costAr.length;

if (len > 500) {
   costAr = costAr.filter(function(el,i) {
       if ((i == 0) || ((i + 1) % 50 == 0)) {
	      return true;
	   }
	   return false;
   });
   iters = iters.filter(function(el,i) {
       if ((i == 0) || ((i + 1) % 50 == 0)) {
	      return true;
	   }
	   return false;
   });
   
}

var ctx = document.getElementById("costChart");
/*
var cont = ctx.getContext("2d");
cont.canvas.width = 300;
cont.canvas.height = 300;
*/
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
	
        labels:  iters,
		
        datasets: [{
            label: 'Cost function',
            data: costAr,//[12, 19, 3, 5, 2, 3]
			/*
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
			*/
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
		
		
                responsive: false
            
    }
});
costChart = myChart;
}

function VGraph(l,w,h) {
    this.label = (l == null) ? 'Graph' : l;
    this.w = (w == null) ? 100 : w;
    this.h = (h == null) ? 100 : h;

    this.display = function(ctx) {

        ctx.clearRect(0,0,this.w,this.h);
		
		ctx.save();
		

        var txtLen = ctx.measureText(this.label).width;
        var xPos = (this.w / 3) - (txtLen / 2);
        var yPos = 10;
		
		ctx.translate(xPos,yPos);
		/*
		ctx.rotate(Math.PI/2);
		ctx.translate(-xPos,-yPos);
		*/
        ctx.fillText(this.label,0,0);
		ctx.restore();



    };

};

function VNetworkController(nn) {
    this.nn = nn;

    this.VNodesCached = {};

    this.VEdgesCached = {};

    //datasource "interface" methods
    this.getArchitecture = function() {
      return this.nn.architecture;

    };

    this.layers = function() {
        return this.nn.numLayers;
    };

    this.unitsForLayer = function(lNum) {
        if (lNum == this.nn.numLayers - 1)  {
            return this.nn.architecture[lNum];
        }
        else {
            return this.nn.architecture[lNum] + 1; //include bias
        }


    };

    this.VEdgesForLayerAndUnit = function(lNum,uNum,m) {

        var vEdges;
        var key = lNum + '-' + uNum;
        if (key in this.VEdgesCached) {

            vEdges = this.VEdgesCached[key];
        }

        else {

            vEdges = [];
            var v1 = this.VNodeForLayerAndUnit(lNum,uNum,m);

            var stJ = lNum+1 == this.layers() -1 ? 0 : 1;
            for (var j = stJ;j < this.unitsForLayer(lNum+1);++j) {
                var v2 = this.VNodeForLayerAndUnit(lNum + 1, j,m);
                var vEdge = new VEdge('', v1, v2, 4);
                vEdges.push(vEdge);

            }

            this.VEdgesCached[key] = vEdges;


        }

        var svdThis = this;
        vEdges.forEach(function(vEdge,edNum)  {
            var th =  svdThis.nn.layers[lNum].getThetaForUnitToUnit(uNum,edNum);
            th = th.toFixed(3);
            vEdge.weight = th;
            switch (edNum % 4) {
                case 0:
                    vEdge.colour = "#FF00FF";
                    break;
                case 1:
                    vEdge.colour = "#0000FF";
                    break;
                case 2:
                    vEdge.colour = "#6C7B8B"; //"#00FFFF";
                    break;
				case 3:
				    vEdge.colour = "#C67171";
                    break;
	
					
            }
        });

        return vEdges;


    };

    this.VNodeForLayerAndUnit = function(lNum,uNum,m) {
        var vNode;
        var key = lNum + '-' + uNum;
        if (key in this.VNodesCached) {

            vNode = this.VNodesCached[key];
        }

        else {
            var col;
            if (lNum == this.layers() - 1) {
                col = '#000000';
            }
			
            else {
                col = uNum == 0 ? '#B0B0B0' : '#000000';
            }

			var uNumLab;
			if (lNum == this.layers() - 1) {
				uNumLab = uNum + 1;
			}
			else {
				uNumLab = uNum;
			}
			
            vNode = new VNode('' + lNum + '-' + uNumLab, null, null, 0, col);
            this.VNodesCached[key] = vNode;
            //return vNode;
        }

        var nodeWeight = this.nn.layers[lNum].getAForSingleM(m, uNum);
        if (nodeWeight) {
			if (nodeWeight == '-') {
				
			}
			else {
				nodeWeight = nodeWeight.toFixed(3);
				if (lNum == 0) {
					
					
				}
				else if (lNum == this.layers() - 1) {
					var nodeY = this.nn.layers[lNum].getYForSingleM(m, uNum);
					if ( ((nodeY == 1) && (nodeWeight > 0.5))
						|| ((nodeY == 0) && (nodeWeight < 0.5))) {
							
						vNode.colour = "#00FF00";
						}
						else {
						vNode.colour = "#FF0000";	
						}
				}
				else {
					if (nodeWeight >= 0.6) {
						vNode.colour = "#FF8C00";
					}
					else if (nodeWeight >= 0.4) {
						vNode.colour = "#AAAA00";
					}
					else if (nodeWeight < 0.4) {
						vNode.colour = "#B0B0B0";
					}
					
					if (uNum == 0) {
							vNode.colour = '#B0B0B0';
					}
					
				}
			}
        }
        vNode.weight = nodeWeight;

        if (lNum == this.layers() -1) {
            //output layer
            var nodeY = this.nn.layers[lNum].getYForSingleM(m, uNum);
            vNode.yVal = nodeY;

        }
		
		if (lNum == 0) {
		   vNode.xValUnscaled = this.nn.XUnscaled.get([uNum,m]);
		}

        return vNode;


    };


};

function VNetwork(label,w,h,datasource) {

    VGraph.apply(this,[label,w,h]);

    this.datasource = datasource;

    this.parentDisplay = this.display;

    this.display = function(ctx,m) {


      this.parentDisplay(ctx);

      var layerYMargin = 30;
      var layerXMargin = 20;


      var layerXStart = layerXMargin;
      var layerXEnd = this.w - layerXMargin;
      var layerXInc = (layerXEnd - layerXStart) / (this.datasource.layers() - 1);

      var layerX = layerXStart;

      for (var s = 0;s < this.datasource.layers();++s) {
          var layerYStart;
          var layerYEnd;
          var layerYInc;

          layerYMargin = this.datasource.unitsForLayer(s) == 2 ? 50 : 30;

          if (this.datasource.unitsForLayer(s) == 1) {
              layerYStart = this.h / 2;
              layerYEnd   = this.h / 2;
              layerYInc   = 0;
          }
          else {
              layerYStart = layerYMargin;
              layerYEnd = this.h - layerYMargin;
              layerYInc = (layerYEnd - layerYStart) / (this.datasource.unitsForLayer(s) - 1);
          }

          var layerY = layerYStart;

          for (var j = 0; j < this.datasource.unitsForLayer(s);++j) {
              //var vNode = new VNode('' + s + '-' + j,[layerX,layerY],null,3);
              var vNode = this.datasource.VNodeForLayerAndUnit(s,j,m);
              vNode.centre = [layerX,layerY];
              vNode.display(ctx);
             // ctx.fillText('x',layerX,layerY);
              layerY+=layerYInc;

          }
          layerX += layerXInc;


      }

      for (var lay = 0;lay < this.datasource.layers() - 1;++lay) {

           for (var i = 0;i < this.datasource.unitsForLayer(lay);++i) {
               /*
               var v1 = this.datasource.VNodeForLayerAndUnit(lay,i);
               var stJ = lay+1 == this.datasource.layers() -1 ? 0 : 1;
               for (var j = stJ;j < this.datasource.unitsForLayer(lay+1);++j) {
                   var v2 = this.datasource.VNodeForLayerAndUnit(lay+1, j);
                   var vEdge = new VEdge('lab:', v1, v2, 4);
                   vEdge.display(ctx);
               }
               */
               var vEdges = this.datasource.VEdgesForLayerAndUnit(lay,i,m);
               vEdges.forEach(function(vEdge) {
                  vEdge.display(ctx);
               });
           }
      }

    };

    
};

function VEdge(l,v1,v2,w,col) {

    this.v1 = v1;
    this.v2 = v2;
    this.colour = (col == null) ? '#00000' : col;
    this.label =  (l == null) ? 'Connection' : l;
    this.weight = (w == null) ? 0 : w;

	/*
	this.getTransformedCoordinates = function(coords) {
			var self = this;
			var obj = self.activeObj;
			var angle = (obj.angle*-1) * Math.PI / 180;
			var x2 = coords.x - obj.left;
			var y2 = coords.y - obj.top;
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var newx = x2*cos - y2*sin + obj.left;
			var newy = x2*sin + y2*cos + obj.top;

			return {
				x : newx,
				y : newy
			};
		}
	};
	*/

    this.display = function(ctx) {

        var weightVertOffset = 2;

        var start = [30,30];
        var end =   [100,30];
        if ((this.v1) && (this.v2)) {
            var startX = this.v1.centre[0] + this.v1.radius;
            var endX =   this.v2.centre[0] - this.v2.radius;
            var startY = this.v1.centre[1];
            var endY   = this.v2.centre[1];
            start = [startX,startY];
            end   = [endX,endY];
        }

        ctx.beginPath();
        var svdStrokeStyle = ctx.strokeStyle;
        ctx.strokeStyle = this.colour;

        ctx.moveTo(start[0],start[1]);
        ctx.lineTo(end[0],end[1]);
		ctx.lineWidth = 0.5;
        ctx.stroke();

        var vertTxtOffset = 0;

		
		
		
		/*
		ctx.rotate(ang);
		//ctx.translate(..,..); need to work out new relative pos using sin, cos etc
        */
		
		var uNum = parseInt(this.v2.label.split('-')[1]);
		var xScale = (uNum  % 4) / 5;
		if (xScale == 0) {
			xScale = 4 / 5;
		}
		
        var txt = this.label + '' + this.weight;
        var txtWidth = ctx.measureText(txt).width;
        var txtPosX = start[0] + ((end[0] - start[0]) * xScale) // - (txtWidth / 2);
        var txtPosY = start[1] + ((end[1] - start[1]) * xScale) + vertTxtOffset;
		
		ctx.save();

		ctx.translate(txtPosX,txtPosY);
		var ang = Math.atan2(end[1] - start[1], end[0] - start[0]);
		ctx.rotate(ang);
		ctx.translate(-txtPosX,-txtPosY);
		ctx.fillStyle = this.colour;
        ctx.fillText(txt,txtPosX,txtPosY);
		

		ctx.restore();

        ctx.strokeStyle = svdStrokeStyle;

    };


}

function VNode(l,c,r,w,col) {

    this.radius = (r == null) ? 15 : r;
    this.centre = (c == null) ? [30,30] : c;
    this.colour = (col == null) ? '#0000FF' : col;
    this.label =  (l == null) ? 'Unit' : l;
    this.weight = (w == null) ? 0 : w;

    this.yVal = -1;
	this.xValUnscaled = -1;

    this.display = function(ctx) {
        var svdStrokeStyle = ctx.strokeStyle;

        var weightVertOffset = 2;

        ctx.beginPath();
        ctx.strokeStyle = this.colour;
        ctx.arc(this.centre[0],this.centre[1],this.radius,0,2*Math.PI);
        ctx.stroke();
        ctx.strokeStyle = svdStrokeStyle;

        ctx.fillText(this.label,this.centre[0] - this.radius,this.centre[1] - this.radius - 1);
        var txtWidth = ctx.measureText(this.weight).width;
        ctx.fillText(this.weight,this.centre[0] - txtWidth /2,this.centre[1] + weightVertOffset);

        if (this.yVal == -1) {
        }

        else {
            ctx.fillText(this.yVal, this.centre[0] - this.radius, this.centre[1] + this.radius + 6);
        }
		
		if (this.xValUnscaled == -1) {
        }

        else {
            ctx.fillText(this.xValUnscaled, this.centre[0] - this.radius, this.centre[1] + this.radius + 6);
        }

    };

}