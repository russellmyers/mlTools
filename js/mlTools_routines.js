
function matrixToArray(mat,rNum,cNum) {

 
  var ar = [];
  var rows = math.size(mat).valueOf()[0];
  for (var i = 0;i < rows;++i) {
  
     var row = mRow(mat,i);
	 var arEntry = [];
	 row.forEach(function(el) {
	    arEntry.push(el);
	 });
	 ar.push(arEntry);
 
  }
  
  return ar;

}

function mRow(matrix, index,retAsArray) {
   var sz = math.size(matrix);
   var cols = math.size(matrix).valueOf()[1];
   var elements = math.subset(matrix, math.index(index, math.range(0,cols)));
   if (retAsArray) {
      var ar = [];
	  elements.forEach(function(el) {
	    ar.push(el);
	  });
	  return ar;
   }
   else {
     return elements;
   }	
  //return math.flatten(math.subset(matrix, math.index(index, [0, rows - 1])));
}

function mCol(matrix, index,retAsArray) {
  var rows = math.size(matrix).valueOf()[0];
  var elements = math.subset(matrix, math.index(math.range(0,rows),index));
  if (retAsArray) {
  
     var flat = math.flatten(elements);
	 var ar = [];
	 flat.forEach(function(el) {
	    ar.push(el);
	 });
	 return ar;
  }
  else {
     return elements;
  
  }
  
} 

function sigmoid(In) {
	var Out = math.map(In,function(el) {
		
		var exp = Math.pow(Math.E,el * -1);	
		return  1 / (1 + exp);
		
	});
	
	return Out;

}

function accuracy(Xt,Theta,Y) {
	var pred = predict(Xt,Theta);
	
	var accMatrix =  math.subtract(Y,pred);
	
	var correctNum = 0;
	
	accMatrix.forEach(function(el) {
		if (el == 0) {
			++correctNum;
		}
	});
	
	return [accMatrix,correctNum,Y.size()[0]];
	
}

function predict(Xt,Theta) {
	//Logistic regression prediction
	
	var thresh = 0.5; // predict true if >= this
	var H = h(Xt,Theta,true);
	return math.map(H,function(el) {
		return el >= 0.5 ? 1 : 0;
	});
	
	
}
	
function h(Xt,Theta,logisticFlag) {
	if (logisticFlag) {
		return sigmoid(math.multiply(Xt,Theta));
	}
    else {	
        return math.multiply(Xt,Theta);
	}
}

function err(Xt,Theta,Y,logisticFlag) {
    return math.subtract(h(Xt,Theta,logisticFlag),Y);

}

function sqErr(Xt,Theta,Y,logisticFlag)  {
    return math.square(err(Xt,Theta,Y,logisticFlag));
}

function gdUpdate(X,Theta,Y,lambda,logisticFlag) {
    var Derivs = derivs(X,Theta,Y,logisticFlag);
	var adjDerivs = math.multiply(Derivs,lambda);
	var ThetaUpdated = math.subtract(Theta,adjDerivs);
	return [ThetaUpdated,Derivs];
	
	
}
 
function derivs(X,Theta,Y,logisticFlag) {
    //console.log('X: ' + X);
    var Xt = math.transpose(X);
    //console.log('Xt: ' + Xt);
	var errs = err(Xt,Theta,Y,logisticFlag);
    var Derivs = math.multiply(X,errs);
    //console.log('der: ' + Derivs);

    var sz = Y.size();
    var m = sz[0];
    //console.log('sz: ' + sz);
    Derivs = math.multiply(Derivs,1 / m);
    //console.log('m: ' + m + ' 1 on m: ' + 1 / m);
    return Derivs;

    
}
  

function costFunction(Xt,Theta,Y,logisticFlag) {
	
	     var Cost;
		 
		 var m = Y.size()[0];
		 
		 if (logisticFlag) {
			 var H = h(Xt,Theta,logisticFlag);
			 var LogH = math.map(H,function(el) {
				 return math.log(el);
			 });
			 
			 var Cost1 = math.dotMultiply(Y,LogH);
             Cost1 = math.multiply(Cost1,-1);			 

			 var OtherLogH = math.map(H,function(el) {
				 return math.log(1 - el);
			 });
			 var OtherY = math.map(Y,function(el) {
				 return 1 - el;
			 });
			 var Cost2 = math.dotMultiply(OtherY,OtherLogH);
			 
			 
			 return math.multiply((math.subtract(Cost1,Cost2)),1 / m);
			 
		 }
		 else {
            Cost = sqErr(Xt,Theta,Y);
		    Cost = math.multiply(Cost,1 / (2 * Y.size()[0]));//math.square(math.subtract(h(Xt,Theta),Y));
		 }
         var costSum = math.sum(Cost);
         return Cost;

 }
 
 function featureScale(mat) {
	 //scale factors indexes: 0-mean, 1-range, 2-lowest
 
   var scaledMat = mat.clone();
   var rows = math.size(mat).valueOf()[0];
   var cols = math.size(mat).valueOf()[1];
   var scaleFactors = [];
   scaleFactors.push([1,0,1]);
   for (var r = 1;r < rows;++r) {
    ///don't scale 1st feature, ie r = 0, as this is always 1
	   var row = mRow(scaledMat,r);
	   //var sum = math.sum(row);
	   var min = math.min(row);
	   var max = math.max(row);
	   var range = max - min;
	   //var mean = sum / cols;
	   var mean = math.mean(row);
	   
	   row = math.subtract(row,mean);
	   row = range > 0 ? math.divide(row,range) : row;
	   
	   var ind = math.index(r, math.range(0,cols));
	   scaledMat = math.subset(scaledMat,ind,row);
	   scaleFactors.push([mean,range,min]);
   }
   
   return [scaledMat,scaleFactors];
   
   
   
 
 }
 
 function getXandY(mlParams) {
	 
	  
	
   var ar =  mlParams.input.split('\n'); //document.getElementById('trainingInput').value.split('\n');
   //alert(ar);
   yAr = [];
   ar = ar.map(function(el) {
       var inAr = el.split(' ');
	   inAr = inAr.map(function(inEl) {
	      return parseFloat(inEl);
	   });
	   var first = inAr[0];
	   //if (elVal('featurePoly')) {
	   if (mlParams.featureType == 'poly') {
	   
	      for (var i = 2; i <=  mlParams.degrees;++i) { //parseInt(elVal('degreesInput'));++i) {
				inAr.splice(i-1,0,Math.pow(inAr[0],i));
   
	      }
		}
	   
	   //if (elVal('addOnesFlag')) {
	   if (mlParams.addOnesFlag) {
	   
	     inAr.unshift(1);
		 
	   }
	   
	   yVal = inAr.pop();
	   
	   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
		   if (yVal == mlParams.currClassNum + 1) { //input class y vals are one based 
		      yVal = 1;
		   }
		   else {
			   yVal = 0;
		   }
		   
	   }
	   
	   
	   yAr.push([yVal]);
	   return inAr;
   });
 
   
   var Xt = math.matrix(ar);

   var Y = math.matrix(yAr);
   var X = math.transpose(Xt);	
   
   var XUnscaled = X.clone();

   //if (document.getElementById('scalingFlag').checked) {
   ret = featureScale(X);
   scaleFactors = ret[1];
   //if (document.getElementById('scalingFlag').checked) {
   if (mlParams.scalingFlag) {
      X = ret[0];
 	}
	
   
   return [X,Y, XUnscaled,scaleFactors];   
 
 }
 /*
 function getXandY_background(inp,degrees,addOnesFlag,scalingFlag,polyFlag) {
 
   if (degrees) {
      
	}
	else {
	   degrees = 1;
	}
	
   var ar =  inp.split('\n');//document.getElementById('trainingInput').value.split('\n');
   //alert(ar);
   yAr = [];
   ar = ar.map(function(el) {
       var inAr = el.split(' ');
	   inAr = inAr.map(function(inEl) {
	      return parseFloat(inEl);
	   });
	   var first = inAr[0];
	   if  (polyFlag) {//(elVal('featurePoly')) {
	   
	      for (var i = 2; i <= degrees;++i) {
				inAr.splice(i-1,0,Math.pow(inAr[0],i));
   
	      }
		}
	   
	   if (addOnesFlag) {
	   
	     inAr.unshift(1);
		 
	   }
	   
	   yVal = inAr.pop();
	   
	   yAr.push([yVal]);
	   return inAr;
   });
 
   
   var Xt = math.matrix(ar);

   var Y = math.matrix(yAr);
   var X = math.transpose(Xt);	
   
   var XUnscaled = X.clone();

   //if (document.getElementById('scalingFlag').checked) {
   ret = featureScale(X);
   scaleFactors = ret[1];
   if (scalingFlag) {
      X = ret[0];
 	}
	
   
   return [X,Y, XUnscaled,scaleFactors];   
 
 }
 
 */
 function solveAnalytically(X,Y) {
 
 var Xt = math.transpose(X);

 var A = math.multiply(Xt,X);
 A = math.inv(A);
 A = math.multiply(A,Xt);
 A = math.multiply(A,Y);
 
 return A;
 
 
 
 }
 
 
function thetaUnscale(Theta) {

	var constAdj = 0;
	var ThetaUnscaled = [];
	
	var n = Theta.size()[0] - 1;
	
	for (var a = 1;a < n+1;++a) {
			var ThetaUnscaledEntry =  Theta.subset(math.index(a, 0)) / scaleFactors[a][1];
			ThetaUnscaled.push([ThetaUnscaledEntry]);
			constAdj += (scaleFactors[a][0] * -1) / scaleFactors[a][1] * Theta.subset(math.index(a, 0));
	}

	ThetaUnscaled.unshift([Theta.subset(math.index(0,0)) + constAdj]);
	return math.matrix(ThetaUnscaled);


}	
 
function learn(mlParams,progCallback) {
  
   var minCost = null;
   var minCostSum = 99999999999999999999;
   var minTheta = [];
   
   var degrees = mlParams.degrees; //parseInt(elVal('degreesInput'));
   var res = getXandY(mlParams);
   var X = res[0];
   var Y = res[1];
   var XUnscaled = res[2];
   var scaleFactors = res[3];
   var Xt = math.transpose(X);
   
   var m = Y.size()[0];
   var n = X.size()[0] -1;
   
   var logisticFlag = (mlParams.module == 'log');
   
   
   if (progCallback) {
       progCallback('blog','<br>----------------------------------------------------------------------------------------');  // document.getElementById('blog').innerHTML+='<br>----========================-------------------------------------';
	   if (mlParams.diagnosticsFlag) {
          progCallback('rightTwo',	'<br>-----------');   
	   }
       if (mlParams.numLogClasses > 2) {
		progCallback('blog','<br>Training class: ' + (mlParams.currClassNum + 1));
	   }	   
	}
	
	/*
	if (elVal('diagnosticsFlag')) {
		   document.getElementById('rightTwo').innerHTML += '<br>-----------';
		   
	}
	*/
   
   //var solveFlag = elVal('analyticFlag');
   var ThetaIdea,IdealCost;
   if ((mlParams.solveAnalytically) && (mlParams.module == 'reg')) {
       ThetaIdeal = solveAnalytically(math.transpose(XUnscaled),Y);
	   var d = 4;
	   if (progCallback) {
	        progCallback('blog','<br>Ideal h(Theta) = ' + math.subset(ThetaIdeal,math.index(0,0)).toFixed(d));
			
	        //document.getElementById('blog').innerHTML+= '<br>Ideal h(Theta) = ' + math.subset(ThetaIdeal,math.index(0,0)); //minThetaUnscaled[0]; // + ' + ' + minThetaUnscaled[1] + 'x1';
  
            for (var i = 1;i < n+1;++i) {
			   progCallback('blog',' + ' + math.subset(ThetaIdeal,math.index(i,0)).toFixed(d) + 'x' + i);
	           //document.getElementById('blog').innerHTML+= ' + ' + math.subset(ThetaIdeal,math.index(i,0)) + 'x' + i;
	        }
		}
	//  document.getElementById('blog').innerHTML+='<br>Analytics result: ' + ThetaIdeal;
	  IdealCost =  costFunction(math.transpose(XUnscaled),ThetaIdeal,Y,logisticFlag);
	  if (progCallback) {
	       progCallback('blog','<br> Ideal Cost: ' + math.sum(IdealCost));
	       //document.getElementById('blog').innerHTML+='<br> Ideal Cost: ' + math.sum(IdealCost);
		}   
   }
   else {
	   IdealCost = math.matrix([[0],[0]]);
	   ThetaIdeal = math.matrix([[0],[0]]);
	   
   }
   
  
  /*
   var ar = document.getElementById('trainingInput').value.split('\n');
   //alert(ar);
   yAr = [];
   ar = ar.map(function(el) {
       var inAr = el.split(' ');
	   inAr = inAr.map(function(inEl) {
	      return parseFloat(inEl) / 1000;
	   });
	   inAr.unshift(1);
	   yVal = inAr.pop();
	   
	 

	 yAr.push([yVal]);
	   return inAr;
   });
 
   
   var Xt = math.matrix(ar);

   var Y = math.matrix(yAr);
   var X = math.transpose(Xt);	  
*/   
   
   var iters = [];
   var iterNum = 0;
   
   var lambda = mlParams.lambda; //parseFloat(document.getElementById('lambdaInput').value);
   
   var maxIters = mlParams.maxIterations; //parseInt(document.getElementById('maxIterationsInput').value);

    var prevCost = 9999999999999999999;
	var prevMinus1Cost = 9999999999999999999;
	var costAr = [];
   
    var startThetaInput = mlParams.initTheta;//document.getElementById('initTheta').value;
	if (startThetaInput.length == 0) {
	   for (var i = 0;i < n +1;++i) {
			startThetaInput+='0';
			if (i < n) {
			   startThetaInput+=' ';
			}
		}
	}
		
	startThetaInput = startThetaInput.split(' ');
	startTheta = startThetaInput.map(function(el) {
		 return [parseFloat(el)];
	});
	
	//var startTheta = [[0],[0]];
	
	var degrees = mlParams.degrees;//parseInt(elVal('degreesInput'));
	/*
	for (var i = 0;i < extra;++i) {
	   startTheta.push([0]);
	}
	*/
	var Theta = math.matrix(startTheta);
	minTheta = Theta.clone();
		
		
	for (var i = 0;i < maxIters;++i) {
			//var Theta = math.matrix([[th1],[th2]]);
			
			
  
			var Cost =  costFunction(Xt,Theta,Y,logisticFlag);
			++iterNum;
			
			if (i % 50 == 0) {
				if (progCallback) {
					progCallback('rightBannerDiv','Iter: ' + i + ' Cost: ' + math.sum(Cost),true);
					var acc = accuracy(Xt,minTheta,Y);
					progCallback('rightBannerDiv','<br>Accuracy: ' + acc[1] + '/' + acc[2]);
					if (mlParams.numLogClasses > 2) {
						progCallback('rightBannerDiv','<br>Training class: ' + (mlParams.currClassNum + 1));
					}
					
				}
			}
		//	if (i % 50 == 0) {
				costAr.push(math.sum(Cost));
			 
				iters.push(iterNum);
		//	}
		
		    if (i % 1000 == 0) {
				if (progCallback) {
					
					var costArRed,itersRed;
					
					if (costAr.length > 500) {
						   costArRed = costAr.filter(function(el,i) {
							   if ((i == 0) || ((i + 1) % 50 == 0)) {
								  return true;
							   }
							   return false;
						   });
						   itersRed = iters.filter(function(el,i) {
							   if ((i == 0) || ((i + 1) % 50 == 0)) {
								  return true;
							   }
							   return false;
						   });
					}
					else  {
						costArRed = costAr;
						itersRed = itersRed;
					}
					
					/*
					var constAdj = 0;
	                var minThetaUnscaled = [];
	                for (var a = 1;a < n+1;++a) {
	                        var minThetaUnscaledEntry =  minTheta.subset(math.index(a, 0)) / scaleFactors[a][1];
	                    	minThetaUnscaled.push(minThetaUnscaledEntry);
	                    	constAdj += (scaleFactors[a][0] * -1) / scaleFactors[a][1] * minTheta.subset(math.index(a, 0));
	                }
	
	                minThetaUnscaled.unshift(minTheta.subset(math.index(0,0)) + constAdj);
				    */
					var minThetaUnscaled;
					if (mlParams.scalingFlag) {
					    minThetaUnscaled = thetaUnscale(minTheta);
					}
					else {
						minThetaUnscaled = minTheta.clone();
					}
   		

		            if (i == 0) {
						//progCallback('chart',null,true);
					}
					else {
			          progCallback('chart',[costArRed,itersRed,ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors]);
					}
				}
			
			}
		
			if  (mlParams.diagnosticsFlag) {//(elVal('diagnosticsFlag')) {
			   if (progCallback) {
			      progCallback('rightTwo','<br> Cost: ' +  math.sum(Cost));
			      //document.getElementById('rightTwo').innerHTML += '<br> Cost: ' +  math.sum(Cost);
			     //document.getElementById('rightTwo').innerHTML += '<br>' +  Cost;
				}
			}	
			
			
			console.log('Cost: ' +  Cost + '\nTot cost: ' + math.sum(Cost))	;
			
			if (math.sum(Cost) > prevCost) {
				if (math.sum(Cost) > prevMinus1Cost) { //check if going up twice in a row, just in case small rounding error
				   if (progCallback) {
				      progCallback('blog','<br>Non Convergence. Try smaller lambda. ' + i + ' iterations');
				      //document.getElementById('blog').innerHTML+='<br>Non Convergence. Try smaller lambda. ' + i + ' iterations';
					}
				   break;
				}
			}
			
			//document.getElementById('navDiv').innerHTML +='<br>' + math.sum(Cost);
			
			if ((prevCost - math.sum(Cost) >= 0) && (prevCost - math.sum(Cost) <  mlParams.convThreshold)) { //parseFloat(elVal('convThreshold')))) { //0.0000000001)) {
				console.log('Converged after: ' + i);
				if (progCallback) {
				    progCallback('blog','<br>Converged after: ' + i + ' iterations');
				   //document.getElementById('blog').innerHTML+='<br>Converged after: ' + i + ' iterations';
				}
				break;
			}	
			
			prevMinus1Cost = prevCost;
			
			prevCost = math.sum(Cost);

			//var Derivs = derivs(X,Theta,Y);
			console.log('theta before: ' + Theta);
		
			var res = gdUpdate(X,Theta,Y,lambda,logisticFlag);
			Theta = res[0];
			console.log('Theta after: ' + Theta);
			
			if  (mlParams.diagnosticsFlag) {//(elVal('diagnosticsFlag')) {
			    if (progCallback) {
				  progCallback('rightTwo','<br>Grad: ' + res[1]);
				  progCallback('rightTwo','<br>Theta: ' + Theta);
			      //document.getElementById('rightTwo').innerHTML+='<br>Grad: ' + res[1];
			      //document.getElementById('rightTwo').innerHTML+='<br>Theta: ' + Theta;
				}
			}

			//console.log('derivs: ' + Derivs);

			if ( math.sum(Cost) < minCostSum) {
				minCost = Cost;
				minCostSum = math.sum(Cost);
				minTheta = Theta;
			}
	
			//document.getElementById('stats').innerHTML+= 'cost sum: th1: ' + th1 + ' th2: ' + th2 + ' ' + math.sum(Cost) + '<br>';
			
			
	}
	
	/*
	var constAdj = 0;
	var minThetaUnscaled = [];
	for (var i = 1;i < n+1;++i) {
	    var minThetaUnscaledEntry =  minTheta.subset(math.index(i, 0)) / scaleFactors[i][1];
		minThetaUnscaled.push(minThetaUnscaledEntry);
		constAdj += (scaleFactors[i][0] * -1) / scaleFactors[i][1] * minTheta.subset(math.index(i, 0));
	}
	
	minThetaUnscaled.unshift(minTheta.subset(math.index(0,0)) + constAdj);
    */
	
	if (progCallback) {
		progCallback('rightBannerDiv','Iter: ' + i + ' Cost: ' + math.sum(Cost),true);
		var acc = accuracy(Xt,minTheta,Y);
		progCallback('rightBannerDiv','<br>Accuracy: ' + acc[1] + '/' + acc[2]);
		if (mlParams.numLogClasses > 2) {
			progCallback('rightBannerDiv','<br>Training class: ' + (mlParams.currClassNum + 1));
		}
					
	}
	
	
	var minThetaUnscaled;
    if (mlParams.scalingFlag) {
          minThetaUnscaled  = thetaUnscale(minTheta);
	}
	else {
		minThetaUnscaled = minTheta.clone();
		
	}
	

	if (progCallback) {
		var g = minThetaUnscaled.get([0,0]);
		var h = math.subset(minThetaUnscaled,math.index(0,0));
		
		var gg = parseFloat(g);
		var aa = math.format(g,8);
		var bb = parseFloat(aa);
				
		var cc = h.toFixed(2);
		
		var d = 4;
		
		//progCallback('blog','<br><br>get: ' + Math.toFixed(minThetaUnscaled.get([0,0])));

	   progCallback('blog','<br><br>Model h(Theta) = ' + math.subset(minThetaUnscaled,math.index(0,0)).toFixed(d)); //minThetaUnscaled[0]);
       //document.getElementById('blog').innerHTML+= '<br><br>Lambda: ' + document.getElementById('lambdaInput').value + '<br>Model h(Theta) = ' + minThetaUnscaled[0]; // + ' + ' + minThetaUnscaled[1] + 'x1';
		for (var i = 1;i < n+1;++i) {
		   progCallback('blog',' + ' + math.subset(minThetaUnscaled,math.index(i,0)).toFixed(d) + 'x' + i); //;minThetaUnscaled[i] + 'x' + i);
		   //document.getElementById('blog').innerHTML+= ' + ' + minThetaUnscaled[i] + 'x' + i;
		}
			
	    progCallback('blog','<br>Model Cost: ' + minCostSum);
	   //document.getElementById('blog').innerHTML+=  '<br>Model 								Cost: ' + minCostSum;
	
		progCallback('blog','<br>(scaled:  Model h(Theta) = ' + minTheta.subset(math.index(0, 0)).toFixed(d));
		//document.getElementById('blog').innerHTML+= '<br>(scaled:  Model h(Theta) = ' + minTheta.subset(math.index(0, 0));//+ ' + ' + minTheta.subset(math.index(1, 0)) + 'x1)';
		 for (var i = 1;i < n+1;++i) {
		   progCallback('blog',' + ' + minTheta.subset(math.index(i, 0)).toFixed(d) + 'x' + i);
		   //document.getElementById('blog').innerHTML+= ' + ' + minTheta.subset(math.index(i, 0)) + 'x' + i;
		}
		progCallback('blog',')');
			   progCallback('blog','<br>Lambda: ' +  mlParams.lambda) ;

		//document.getElementById('blog').innerHTML+= ')';
	}	
	
 /*
	
	for (var e = 0;e < extra;++e) {
	   document.getElementById('blog').innerHTML+= ' + ' + minTheta.subset(math.index(e+2, 0)) + 'x' + (e+2);
	}
	*/

	//document.getElementById('blog').innerHTML+=  '<br>Cost: ' + Cost;
	
	
	return [costAr,iters,ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors];
   
     

}
 