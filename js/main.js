var w;

var mlParams;
var mlResults;
var visChart;
var costChart;

var mlData;



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

	/*
    mlParams.featureType = "multi";
	featureTypeUpdated();
	*/
	
	mlParams.module = "reg";
	moduleUpdated();
	
	mlParams.numLogClasses = 2;
	numLogClassesUpdated();
	
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
					       var acc = accuracy(math.transpose(XUnscaled), math.matrix(minThetaUnscaled), Y);
						   if (elVal('diagnosticsFlag')) {
							   el('rightTwo').innerHTML += '<br>Predictions: ' + predict(math.transpose(XUnscaled), math.matrix(minThetaUnscaled));

							   el('rightTwo').innerHTML += '<br>Accuracy: ' + acc;
							   el('rightTwo').innerHTML += '<br>Confidence: ' + h(math.transpose(XUnscaled), math.matrix(minThetaUnscaled), true);
						   }
						   var perc  = (acc[1] / acc[2] * 100);
					       el('blog').innerHTML +='<br>Summary this training run: ' + acc[1]  + '/' + acc[2] + ' (' + perc.toFixed(4) + '%)';

					}
					
					visualiseCostChart(costAr,iters);
		
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
	mlParams.addOnesFlag = elVal('addOnesFlag');
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

/**
 * 
 */
function testButClicked() {

   mlParams.module = 'tst';
   moduleUpdated();
   
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
 
  var C = costFunction(testXT,testTheta,testY,lambda,true);
  var c = math.sum(C);
  
  var x = 1;

}

/**
 * 
 */
function logButClicked() {
	
   mlParams.module = 'log';
   moduleUpdated();
 

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
   
   document.getElementById('trainingInput').value = '224 895\n300 716\n310 667\n349 1111\n460 1450\n696 1638\n393 1150\n566 1657\n985 2540\n1109 2740\n710 1810\n828 3080\n948 2000';
  
  applyInput();
    
 
   
   //visualiseTrainingOnly(mlData.X,mlData.Y);
   
   
   
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

		yAr.push(yVal);

		return elAr;
	});


	var Xt = math.matrix(ar);
	var X = math.transpose(Xt);

	var Y = math.matrix(yAr);
	
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
	
	
	if (targetEl == 'blog') {
	   var elem = el('blog');
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
	mlResults = [];

   var res = parseDataInput(elVal('trainingInput'));
   mlData.X = res[0];
   mlData.Y = res[1];
   mlDataUpdated();

   if (mlParams.module == 'log') {
	   var yAr = mCol(mlData.Y, 0, true);
	   var multiClass = false;
	   if (math.max(yAr) > 1) { //contains multiple classes
		   multiClass = true;

		   if (math.max(yAr) != mlParams.numLogClasses) {
			   alert('Num classes: ' + mlParams.numLogClasses + '  not equal to classes found in training set: ' + math.max(yAr));
		   }
	   }
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

/**
 * 
 */
 function moduleUpdated() {
 
    switch (mlParams.module) {
	

	  
	  case 'log':
	       el('logistic').classList.remove('blackBut');
           el('logistic').classList.add('colourBut');
		   el('regression').classList.remove('colourBut');
           el('regression').classList.add('blackBut');
		   el('test').classList.remove('colourBut');
           el('test').classList.add('blackBut');
		   
		   el('numLogClasses').hidden = false;
           el('numLogClassesLab').hidden = false;
		   break;
		   
		

		case 'reg':
		
	       el('regression').classList.remove('blackBut');
           el('regression').classList.add('colourBut');
		   el('logistic').classList.remove('colourBut');
           el('logistic').classList.add('blackBut');
		   el('test').classList.remove('colourBut');
           el('test').classList.add('blackBut');
		   
		   el('numLogClasses').hidden = true;
           el('numLogClassesLab').hidden = true;
		
		   break;
		   
		case 'tst':
		
	       el('regression').classList.remove('colourBut');
           el('regression').classList.add('blackBut');
		   el('logistic').classList.remove('colourBut');
           el('logistic').classList.add('blackBut');
		   el('test').classList.remove('blackBut');
           el('test').classList.add('colourBut');

	       el('numLogClasses').hidden = true;
           el('numLogClassesLab').hidden = true;
			   
		
	   
	   default:
	   
	
	       break;
		   }
 
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
		 row.push(Y.get([i]));
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
	 

     ret = featureScale(mlData.X);
     scaleFactors = ret[1];
     if (mlParams.scalingFlag) {
       mlData.XScaled = ret[0];
 	 }
	 else {
	   mlData.XScaled = null;
	 }
	 
	 mlData.scaleFactors = scaleFactors;
	   
   
	 
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

/**
 * 
 */
function clearRes()  {

  
  el('blog').innerHTML = '';
  el('rightTwo').innerHTML = '';
  
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
				
				var conf = h(math.transpose(XUnscaled),math.matrix(minThetaUnscaled),true);
				confAr.push(conf);
			
		}
		
		var predAr = [];
		
		var Y = mlResults[0][10]; // get Y original from first result (will be same for all)
		
		for (var m = 0;m < Y.size()[0];++m) {
			var max = 0;
			var maxI = -1;
			for (var i = 0;i < mlParams.numLogClasses;++i) {
				var conf = confAr[i].get([m]);
				if (conf > max) {
					max = conf;
					maxI = i;
				}
				
			}
					
			
			predAr.push(maxI + 1);
			
			
			
		}
		var predMat = math.matrix(predAr);
		var acc = math.subtract(predMat,Y);
		var numCorrect = 0;
		acc.forEach(function(el) {
			if (el == 0) {
		        ++numCorrect;
			}
		});
		console.log('Num correct: ' + numCorrect);
		var tot = acc.size()[0];
		var perc = (numCorrect / tot * 100).toFixed(2);
		learnProgressForeground('rightBannerDiv','<br>Overall num Correct: ' + numCorrect + '/' + tot + ' (' + perc + '%)' );
		
	return acc;
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
		   res = learn(mlParams,mlData.X,mlData.Y,mlData.scaleFactors,learnProgressForeground);
		   mlResults.push(res);
	      break;
		 
		case 'log':
		   if (mlParams.numLogClasses > 2) { // multi class, use one vs all
		       
		       for (var i = 0;i < mlParams.numLogClasses;++i) {
			      mlParams.currClassNum = i;
		          res = learn(mlParams,mlData.X, mlData.Y, mlData.scaleFactors,learnProgressForeground);
		    	  mlResults.push(res);
		       }
			}
			else {
			    res = learn(mlParams,mlData.X, mlData.Y, mlData.scaleFactors,learnProgressForeground);
		        mlResults.push(res);
			}

          break;	

		default:
			break;
			
	}
	   
	 
	if (mlParams.numLogClasses > 2) { // multi class, use one vs all
	
	
		var YOrig = mlResults[0][10];  // Orig Y with all classes
		var XUnscaled = mlResults[0][7];
		var minThetaUnscaled = mlResults[0][8]; //not used
		var scaleFactors = mlResults[0][9]; //not used
		
		visualise(null,YOrig,null, XUnscaled,minThetaUnscaled,null,scaleFactors);
		
	
	/*
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
				
				var conf = h(math.transpose(XUnscaled),math.matrix(minThetaUnscaled),true);
				confAr.push(conf);
			
		}
		
		var predAr = [];
		
		var Y = mlResults[0][10]; // get Y original from first result (will be same for all)
		
		for (var m = 0;m < Y.size()[0];++m) {
			var max = 0;
			var maxI = -1;
			for (var i = 0;i < mlParams.numLogClasses;++i) {
				var conf = confAr[i].get([m,0]);
				if (conf > max) {
					max = conf;
					maxI = i;
				}
				
			}
					
			
			predAr.push(maxI + 1);
			
			
			
		}
		var predMat = math.matrix(predAr);
		var acc = math.subtract(predMat,Y);
		var numCorrect = 0;
		acc.forEach(function(el) {
			if (el == 0) {
		        ++numCorrect;
			}
		});
		console.log('Num correct: ' + numCorrect);
    */	
	
	}
    else {
	
	
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
		   el('blog').innerHTML += '<br>Predictions: ' + predict(math.transpose(XUnscaled),minThetaUnscaled);
		   var acc = accuracy(math.transpose(XUnscaled),math.matrix(minThetaUnscaled),Y);
		   el('blog').innerHTML += '<br>Accuracy: ' + acc;
		   el('blog').innerHTML += '<br>Confidence: ' + h(math.transpose(XUnscaled),math.matrix(minThetaUnscaled),true);
		   var perc = (acc[1] / acc[2] * 100);
		   el('blog').innerHTML +='<br>Summary this training run: ' + acc[1]  + '/' + acc[2] + ' (' + perc.toFixed(4) + '%)';
		}
		
		visualiseCostChart(costAr,iters);
		
		visualise(X,Y,minTheta, XUnscaled,minThetaUnscaled,ThetaIdeal,scaleFactors);
		
	}
	
	

}

//Visualisation routines

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

  var yAr = mCol(Y,0,true);

   var scatData = [];
   x1Ar.forEach(function(x,i) {
       var y = yAr[i];
	   var plotPoint = {x:x,y:y};
	   scatData.push(plotPoint);
	 
   });
   
  
  return {'points':scatData,'colours':"#f0f",'styles':'circle'};

}

/**
 * 
 * @param XUnscaled
 * @param Y
 * @param ThetaUnscaled
 * @param showAccForMultiClass
 * @returns {{points: Array, colours: Array, styles: Array}}
 */
function constructLogTrainingPlotPoints(XUnscaled,Y,ThetaUnscaled,showAccForMultiClass) {
  var x1Ar = mRow(XUnscaled,1,true);
  
  var x2Ar = mRow(XUnscaled,2,true);
  
  var yAr = mCol(Y,0,true);
  
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
	  accMatrix = checkAccuracyMultiClass();
  }
  else if (ThetaUnscaled) {
     // if theta provided - check predictions and colour correct predictions green
     var acc = accuracy(math.transpose(XUnscaled),math.matrix(ThetaUnscaled),Y);
	 accMatrix = acc[0];
	 
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
	    if (math.subset(accMatrix,math.index(i)) == 0) {//accurate predictions
		
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
  if (mlParams.module == 'log') {
      res = constructLogTrainingPlotPoints(XUnscaled,Y,null,false);
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
function visualiseLog(XUnscaled,Y,ThetaOrig,scaleFactors) { 
	var ctx = document.getElementById("visualiseChart");
	
	var res = constructLogTrainingPlotPoints(XUnscaled,Y,ThetaOrig,true);
	createVisGraph(res.points,null,null,res.colours,res.styles);
	
	var incX = scaleFactors ? (scaleFactors[1][1] / 30) : 2000 / 10;
    var endX = scaleFactors ?  scaleFactors[1][2] + scaleFactors[1][1] +  incX  : 2000;
	
	var modelData = [];

    for (var i = scaleFactors[1][2] - incX;i <=	 endX;i = i + incX) {
          //construct boundary, ie line/curve where Xt Theta = 0
		  
		  //i represents x1
		  var Tmp = math.multiply(math.transpose(XUnscaled),ThetaOrig);
		  var sum = math.subset(ThetaOrig,math.index(0)); //ThetaOrig[0];
		  sum+= math.subset(ThetaOrig,math.index(1))  * i; //x1
		  var thx2 = sum * -1;
		  var x2 = thx2 / math.subset(ThetaOrig,math.index(2));

		  var plotPoint = {x:i,y:x2};
	      modelData.push(plotPoint);

	}
	
	if (XUnscaled.size()[0] > 3) {
	
	}
	else {
	
	  updateVisGraph(null,modelData);
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

if (mlParams.module == 'log') {
   visualiseLog(XUnscaled,Y,ThetaOrig,scaleFactors);	
   return;
}

var rows = XUnscaled.size();

var x1Ar = mRow(XUnscaled,1,true);


var yAr = mCol(Y,0,true);


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
	  
		  yVal+= (math.subset(ThetaModel,math.index(ii)) * Math.pow(i,ii));
		
    }
    if (mlParams.degrees > 1) {
	  var res = getNumFeatures();
	  var firstPolyX1 = res[1];
	  var lastPolyX1 = res[2];
	  var ind = 2;
	  for (ii = firstPolyX1;ii < lastPolyX1 + 1;++ii) {
		  yVal+= (math.subset(ThetaModel,math.index(ii)) * Math.pow(i,ind));
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
	  
		  yValIdeal+= (math.subset(ThetaIdeal,math.index(ii)) * Math.pow(i,ii));
		
    }
    if (mlParams.degrees > 1) {
	  var res = getNumFeatures();
	  var firstPolyX1 = res[1];
	  var lastPolyX1 = res[2];
	  var ind = 2;
	  for (ii = firstPolyX1;ii < lastPolyX1 + 1;++ii) {
		  yValIdeal+= (math.subset(ThetaIdeal,math.index(ii)) * Math.pow(i,ind));
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

Theta.subset(math.index(0)); 

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

