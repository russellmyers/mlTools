

//Utility routines

/**
* This should be in gen utilities
*/
function arrayToString(ar,sep) {
    var str = ''
    if (sep == null) {
        sep = ' ';
    }
    
    ar.forEach(function(el,i) {
        if (i == ar.length - 1) {
            str += el;
        }
        else {
            str += el + sep;
        }
        
    });
    
    return str;
    
}



/**
 *
 * @param mat
 * @param rNum rownum to remove, optional
 * @param cNum colnum to remove, optional
 * @returns {Array}
 */
function matrixToArray(mat,rNum,cNum) {

	rNum = rNum == null ? -1 : rNum;
	cNum = cNum == null ? -1 : cNum;
 
  var ar = [];
  
 
  var rows;
  
  if (mat.size().length == 1) { //Vector
      rows = 1;
	  var arEntry = [];
	  mat.forEach(function(el,i) {
		  if (i == rNum) {
		  }
		  else {
		    arEntry.push(el);
		  }
	  });
	  return arEntry;
  }
  else {
	  rows = mat.size()[0];
  }
  for (var i = 0;i < rows;++i) {

	 if (i == rNum) {
		 continue;
	 }

     var row = mRow(mat,i);
	 var arEntry = [];
	// if (row.constructor === Array) {
		 row.forEach(function(el,j) {
			if (j == cNum) {

			}
			else {
				arEntry.push(el);
			}
		 });
	// }
//	 else {
	//	 arEntry = [row];
	// }
	 ar.push(arEntry);
 
  }
  
  return ar;

}

/**
 *
 * @param matrix
 * @param index
 * @param retAsArray
 * @returns {*} matrix or array
 */
function mRow(matrix, index,retAsArray,assumeRowVector) {
   
   if (matrix.size().length == 1) { //vector
	   if (assumeRowVector) {
		   if (retAsArray) {
			    var arEntry = [];
	            matrix.forEach(function(el) {
		             arEntry.push(el);
	            });
	            return arEntry;
		   }
		   else {
		      return matrix;
		   }
	   }
	   else {
		   var els = math.subset(matrix, math.index(index)); //will be scalar
		   
		   if (retAsArray) {
			   
	          return [els];
			}
		   
		   else {
			   return math.matrix([els]);
			   
		   }
		   
	   }
   }
   
   
   var cols = matrix.size()[1];
   var els = math.subset(matrix, math.index(index, math.range(0,cols)));
   if (retAsArray) {
	  if (cols == 1) {
		  return [els]; // els will be scalar
		  
	  }
	  else {
        var ar = [];
	    els.forEach(function(el) {
	       ar.push(el);
	     });
	    return ar;
	  }
   }
   else {
	 if (cols == 1) {
        return math.matrix([els]); //els will be scalar
	 }
     else {	 
       return els;
	 }
   }	
  
}

/**
 *
 * @param matrix
 * @param index
 * @param retAsArray
 * @returns {*} matrix or array
 */
function mCol(matrix, index,retAsArray,assumeRowVector) {
 
 if (matrix.size().length == 1) { //vector
      if (assumeRowVector) {
		  var els = math.subset(matrix, math.index(index)); //will be scalar
		  if (retAsArray) {
			  return [els];
		  }
		  else {
		     return math.matrix(els);
		  }
	  }
	
	  else {
		  if (retAsArray) {
		        var arEntry = [];
	            matrix.forEach(function(el) {
		             arEntry.push(el);
	            });
	            return arEntry;
				 
	       }
		   else {
				 return matrix;
		   }
	  }
		  
	  

  }  
  
  var rows = matrix.size()[0];
  var els = math.subset(matrix, math.index(math.range(0,rows),index));
  if (retAsArray) {
	  if (rows == 1) {
		  return [els]; // will be scalar
	  }
	  else {
	    var ar = [];
	    els.forEach(function(el) {
		    ar.push(el); 
	    });
	    return ar;
	  }
	  
  }
	  /*
     if (rows == 1) {
		 return elements;
	 }
	 else {
		 var flat = math.flatten(elements);
		 var ar = [];
		 flat.forEach(function (el) {
			 ar.push(el);
		 });
		 return ar;
	 }
	 */
  
  else {
	 if (rows == 1) {
        return math.matrix([els]);
	 }
     else {	 
       return  els; //els.reshape([rows]); 
	 }
  
  }
  
} 

// ML routines

/**
 *
 * @param In
 * @returns {Matrix}
 */
function sigmoid(In) {
	var Out = math.map(In,function(el) {
		
		var exp = Math.pow(Math.E,el * -1);	
		return  1 / (1 + exp);
		
	});
	
	return Out;

}

/**
 *
 * @param Xt
 * @param Theta
 * @param Y
 * @returns {*}
 */
function accuracy(Theta,X,Y) {
	var pred = predict(Theta,X);
	
	var accMatrix =  math.subtract(Y,pred);
	
	var correctNum = 0;
	
	var prec = null;
    var recall = null;
    var f1Score = null;
	
	accMatrix.forEach(function(el) {
		if (el == 0) {
			++correctNum;
		}
	});
	
	return [correctNum,Y.size()[1],prec,recall,f1Score,accMatrix];
	
}

/**
 *
 * @param Xt
 * @param Theta
 * @returns {*}
 */
function predict(Theta,X) {
	//Logistic regression prediction
	
	var thresh = 0.5; // predict true if >= this
	var H = h(Theta,X,true);
	return math.map(H,function(el) {
		return el >= 0.5 ? 1 : 0;
	});
	
	
}

/**
 *
 * @param Xt
 * @param Theta
 * @param logisticFlag
 * @returns {*}
 */
function h(Theta,X,logisticFlag) {
	if (logisticFlag) {
		return sigmoid(math.multiply(Theta,X));
	}
    else {	
        return math.multiply(Theta,X);
	}
}

/**
 *
 * @param Xt
 * @param Theta
 * @param Y
 * @param logisticFlag
 * @returns {*}
 */
function err(Theta,X,Y,logisticFlag) {
    return math.subtract(h(Theta,X,logisticFlag),Y);

}

/**
 *
 * @param Xt
 * @param Theta
 * @param Y
 * @param logisticFlag
 * @returns {*}
 */
function sqErr(Theta,X,Y,logisticFlag)  {
    return math.square(err(Theta,X,Y,logisticFlag));
}

/**
 *
 * @param X
 * @param Theta
 * @param Y
 * @param alpha
 * @param lambda
 * @param logisticFlag
 * @returns {*}
 */
function gdUpdate(ThetaT,X,Y,alpha,lambda,logisticFlag) {
    var Derivs = derivs(ThetaT,X,Y,lambda,logisticFlag);
	var adjDerivs = math.multiply(Derivs,alpha);
	var ThetaUpdated = math.subtract(math.transpose(ThetaT),adjDerivs);
	return [ThetaUpdated,Derivs];
	
	
}

/**
 *
 * @param X
 * @param Theta
 * @param Y
 * @param lambda
 * @param logisticFlag
 * @returns {*|{commutative}}
 */
 
function derivs(ThetaT,X,Y,lambda,logisticFlag) {
  
    var Xt = math.transpose(X);

	var errs = err(ThetaT,X,Y,logisticFlag);
    var Derivs = math.multiply(X,math.transpose(errs));
  
    var sz = Y.size();
    var m = sz[1];
	
	var RegPart = math.multiply(math.transpose(ThetaT),lambda);
	RegPart.set([0,0],0); // don't regularise theta0
	
	Derivs = math.add(Derivs,RegPart);
    Derivs = math.multiply(Derivs,1 / m);
   
    return Derivs;
    
}

/**
* cost of regularisation term
*/
function regCost(Theta,lambda,m) {
		var RegCost = math.square(Theta);
		RegCost = math.multiply(RegCost,(lambda / (2 * m)));
				
		RegCost.set([0,0],0); //don't regularise theta0
		
		return RegCost;
	
}

/**
 *
 * @param Xt
 * @param Theta
 * @param Y
 * @param mlType ('reg, 'log' or 'neu')
 * @param A (output layer activations for neural network)
 * @returns {*}
 */

function costFunction(Theta,X,Y,lambda,mlType,A) {
	
	    if (mlType == 'log') {
			logisticFlag = true;
		}
		
		/*
		if  ((A.size().length == 2) && (A.size()[0] == 1)) {
			 //2 dim array with 1 row, convert to vector
			 A = math.flatten(A);
		}
		*/
	
	     var Cost;
		 
		 var m;
		 if (Y.size().length == 1) { //vector
		    m = Y.size()[0];
		 }
		 else {
			m =  Y.size()[1];
		 }
			 
		 //var m = Y.size()[0];
		 
		 if ((mlType == 'log') || (mlType == 'neu')) {
			 var H;
			 if (mlType == 'log') {
				 H = h(Theta,X,logisticFlag);
			 }
			 else {
                 H = A; //neural network forward prop result
			 }
			 
			 
			 var LogH = math.map(H,function(el) {
				 if (el == 0) {
					 return 1e-20;
				 }
				 else {
				   return math.log(el);
				 }
			 });
			 
			 var Cost1 = math.dotMultiply(Y,LogH);
             Cost1 = math.multiply(Cost1,-1);			 

			 var OtherLogH = math.map(H,function(el) {
				 if (1 - el == 0) {
					 return 1e-20;
				 }
				 else {
				     return math.log(1 - el);
				 }
			 });
			 var OtherY = math.map(Y,function(el) {
				 return 1 - el;
			 });
			 var Cost2 = math.dotMultiply(OtherY,OtherLogH);
			 
			 var RegCost = regCost(Theta,lambda,m);
			 
			 return [math.multiply((math.subtract(Cost1,Cost2)),1 / m),RegCost];
			 
		 }
		 else {
            var SqErrCost = sqErr(Theta,X,Y);
			
			var RegCost = regCost(Theta,lambda,m);
			
		    Cost = math.multiply(SqErrCost,1 / (2 * m));   
		 }
         var	 costSum = math.sum(Cost) + math.sum(RegCost);
		 
         return [Cost,RegCost];

 }

/**
 * scale factors indexes: 0-mean, 1-range, 2-lowest
 * @param mat
 * @returns {*}
 */
 function featureScale(mat) {
	 
   var scaledMat = math.clone(mat);
   var rows = mat.size()[0];
   var cols = mat.size()[1];
   var scaleFactors = [];
   scaleFactors.push([1,0,1]);
   for (var r = 1;r < rows;++r) {
       //don't scale 1st feature, ie r = 0, as this is always 1
	   var row = mRow(scaledMat,r);
	   var min = math.min(row);
	   var max = math.max(row);
	   var range = max - min;
	   var mean = math.mean(row);
	   
	   row = math.subtract(row,mean);
	   row = range > 0 ? math.divide(row,range) : row;
	   
	   var ind = math.index(r, math.range(0,cols));
	   scaledMat = math.subset(scaledMat,ind,row);
	   scaleFactors.push([mean,range,min]);
   }
   
   return [scaledMat,scaleFactors];
   
   
   
 
 }
 
 function factorYForOneVsAll(mlParams, Y) {
	 
	    var YFactored = Y.clone();
	 
	    for (var i = 0;i < Y.size()[1];++i) {
			   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
				     var yVal  = YFactored.get([0,i]);
		             if (yVal == mlParams.currClassNum + 1) { //input class y vals are one based 
		                   yVal = 1;
		             }
		             else {
			               yVal = 0;
		             }
					 YFactored.set([0,i],yVal); //math.set(YFactored,[i],yVal);
					 
			   }
		   
	   }
	   
	   return YFactored;
	 
	 
 }

/**
 *
 * @param mlParams
 * @returns {*}
 */
 function getXandY(mlParams,data) {
	 
	  
	
   var ar;
   if (data) {
	   ar = data
   }
   else {
	   ar = mlParams.input;
   }
	ar=  ar.input.split('\n'); 
    yAr = [];
    yOrigAr = [];
   
   ar = ar.map(function(el) {
       var inAr = el.split(' ');
	   inAr = inAr.map(function(inEl) {
	      return parseFloat(inEl);
	   });
	   var first = inAr[0];
	   if (mlParams.featureType == 'poly') {
	   
	      for (var i = 2; i <=  mlParams.degrees;++i) { 
				inAr.splice(i-1,0,Math.pow(inAr[0],i));
   
	      }
		}
	   
	   if (mlParams.addOnesFlag) {
	   
	     inAr.unshift(1);
		 
	   }
	   
	   yVal = inAr.pop();
	   yOrigVal = yVal;
	   
	   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
		   if (yVal == mlParams.currClassNum + 1) { //input class y vals are one based 
		      yVal = 1;
		   }
		   else {
			   yVal = 0;
		   }
		   
	   }
	   
	   
	   yAr.push([yVal]);
	   yOrigAr.push([yOrigVal]);
	   return inAr;
   });
   
 
   
   var Xt = math.matrix(ar);

   var Y = math.matrix(
   yAr);
   var YOrig = math.matrix(yOrigAr);
   
   var X = math.transpose(Xt);	
   
   var XUnscaled = X.clone();
   
   ret = featureScale(X);
   scaleFactors = ret[1];
   if (mlParams.scalingFlag) {
      X = ret[0];
 	}
  
   return [X,Y, XUnscaled,scaleFactors,YOrig];   
 
 }
 
 function solveAnalytically(X,Y) {
 
 var Xt = math.transpose(X);

 var A = math.multiply(Xt,X);
 A = math.inv(A);
 A = math.multiply(A,Xt);
 
 A = math.multiply(A,math.transpose(Y));
 
 return A;
 
 
 
 }

/**
 *
 * @param Theta
 * @returns {*}
 */
function thetaUnscale(Theta,scaleFactors) {

	var constAdj = 0;
	var ThetaUnscaled = [];
	
	var n = Theta.size()[0] - 1;
	
	for (var a = 1;a < n+1;++a) {
			var ThetaUnscaledEntry =  Theta.subset(math.index(a,0)) / scaleFactors[a][1];
			ThetaUnscaled.push(ThetaUnscaledEntry);
			constAdj += (scaleFactors[a][0] * -1) / scaleFactors[a][1] * Theta.subset(math.index(a,0));
	}

	ThetaUnscaled.unshift(Theta.subset(math.index(0,0)) + constAdj);
	ThetaUnscaled = ThetaUnscaled.map(function(el) {
		return [el];
	});
	return math.matrix(ThetaUnscaled);


}


function getDashboardInfo(mlParams,nn,iterNum,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg) {
	
	var d = 4; //dec places
	
	var dashInfo = '';
	
	dashInfo += 'Iter: ' + iterNum + ' Cost: ' + (math.sum(Cost) + math.sum(RegCost)) + '<br>';
	
	
	if ((mlParams.module === 'log') && (mlParams.numLogClasses > 2)) {
		dashInfo += 'Training class: ' + (mlParams.currClassNum + 1);
		
	}
	
	
	if ((mlParams.module == 'log') || (mlParams.module == 'neu')) {
		var num = 0;var dem = 1;
		
		if (mlParams.module == 'log') {
			var acc = accuracy(math.transpose(minTheta),X,Y);
			num = acc[0];
			dem = acc[1];
		}
		else {
			var accNeu = nn.checkAccuracy();
			num = accNeu[0];
			dem = accNeu[1];
            var prec = accNeu[2];
            var recall = accNeu[3];
            var f1Score = accNeu[4];
		}
		var perc = num / dem * 100;

        var precRecallStr = '';
        if (prec == null) {
        }
        else {
		precRecallStr = ' Prec/Recall: ' + prec.toFixed(2) + '|' + recall.toFixed(2) + '=F1: ' + f1Score.toFixed(2);
        }
        dashInfo += ' Accuracy: ' + num + ' / ' + dem + ' (' + perc.toFixed(2) + '%)' + precRecallStr;


		
	}
	
	
	if (mlParams.module === 'neu') {
		
	}
	else {
			dashInfo += '<br>Model h(Theta) = ' + math.subset(minThetaUnscaled,math.index(0,0)).toFixed(d);
			
			for (var i = 1;i < n+1;++i) {
			     dashInfo += ' + ' + math.subset(minThetaUnscaled,math.index(i,0)).toFixed(d) + 'x' + i;
			}
			
	}
	
	if (errMsg) {
		
		dashInfo += errMsg;
	}
	
	return dashInfo;
	
	
	
	
        
	
}

/**
 *
 * @param mlParams
 * @param progCallback
 * @returns {*}
 */
function learn(mlParams,X,Y,progCallback) {
  
   var minCost = null;
   var minReg = null;
   var minCostSum = 99999999999999999999;
   var minTheta = [];
   
   var degrees = mlParams.degrees; //parseInt(elVal('degreesInput'));

   var scaleFactors;
   
   var XUnscaled = X;
   
   //if (mlParams.scalingFlag) {
	   
    var res = featureScale(X);
      
     
    scaleFactors = res[1];
	
	if (mlParams.scalingFlag) {
		 X = res[0];
	}
	  
  // }
   
   
   var YOrig = Y;
   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
	   Y = factorYForOneVsAll(mlParams,YOrig); 
   }
  
   var Xt = math.transpose(X);
   
   var m = Y.size()[1];
   var n = X.size()[0] -1;
   
   var logisticFlag = (mlParams.module == 'log');
   
   
   if (progCallback) {
 	   if (mlParams.diagnosticsFlag) {
          progCallback('diagnosticDiv',	'<br>-----------');   
	   }
	
	}
	
 
   var ThetaIdeal,IdealCost;
   if ((mlParams.solveAnalytically) && (mlParams.module == 'reg')) {
       ThetaIdeal = solveAnalytically(math.transpose(XUnscaled),Y);
	   var d = 4;
	   if (progCallback) {
		   if (mlParams.diagnosticsFlag) {
	           progCallback('diagnosticDiv','<br>Ideal h(Theta) = ' +  math.subset(ThetaIdeal,math.index(0,0)).toFixed(d)); 
	    
               for (var i = 1;i < n+1;++i) {
			      progCallback('diagnosticDiv',' + ' +  math.subset(ThetaIdeal,math.index(i,0)).toFixed(d) + 'x' + i); 
	           }
		   }
		}
	  IdealCost =  costFunction(math.transpose(ThetaIdeal),XUnscaled,Y,0,mlParams.module)[0];    //zero lambda
	  if (progCallback) {
		   if (mlParams.diagnosticsFlag) { 
	          progCallback('diagnosticDiv','<br> Ideal Cost: ' + math.sum(IdealCost));
		   }
	      
		}   
   }
   else {
	   IdealCost = math.matrix([0,0]);
	   ThetaIdeal = math.matrix([0,0]);
	   
   }
   
   
   var iters = [];
   var iterNum = 0;
   
   var alpha = mlParams.alpha; 
   var lambda = mlParams.lambda;
   
   var maxIters = mlParams.maxIterations; 

    var prevCost = 9999999999999999999;
	var prevMinus1Cost = 9999999999999999999;
	var costAr = [];
	
	var Theta;
	
	
	var nn;
   
    if (mlParams.module == 'neu') {
         nn = new NeuralNetwork([X.size()[0] - 1,X.size()[0] + 1,Y.size()[0]],X,Y,mlParams.alpha,mlParams.lambda,mlParams.initTheta);
	     Theta = nn.unrollThetas();
 	}
    else {	
		var startThetaInput = mlParams.initTheta;
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

		Theta = math.matrix(startTheta);
	}
	
	minTheta = Theta.clone();
	

	var minThetaUnscaled;
	if (mlParams.module == 'neu') {
		//TODO Need to implement unscaling for neural network
		minThetaUnscaled = minTheta.clone();
	}
	
	else {
	
		if (mlParams.scalingFlag) {
			minThetaUnscaled = thetaUnscale(minTheta,scaleFactors);
		}
		else {
			minThetaUnscaled = minTheta.clone();
		}
	}
	
		
    var degrees = mlParams.degrees;//parseInt(elVal('degreesInput'));
		
	var errMsg = null;	
		
	for (var i = 0;i < maxIters;++i) {
 
            var Cost;
			var RegCost;
			
            if (mlParams.module == 'neu') {
				nn.forward();
				Cost = nn.getCost('CM');
				RegCost = nn.getCost('RM');
				
			}
			else {
				var res =  costFunction(math.transpose(Theta),X,Y,lambda,mlParams.module);
			    Cost = res[0];
			    RegCost = res[1];
				
			}
	
			++iterNum;
			
			
			console.log('iter: ' + iterNum);
			
			if (i % 2 == 0) {
				if (progCallback) {
					
					var dashInfo = getDashboardInfo(mlParams,nn,i,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
					progCallback('rightBannerDiv',dashInfo,true);
					
				}
			}
		
			costAr.push(math.sum(Cost) + math.sum(RegCost));
			iters.push(iterNum);
		
		
		    if (i % 50 == 0) {
				if (progCallback) {
					
					var costArRed,itersRed;
					
					if (costAr.length > 50) {
						//costArRed = costAr.slice(costAr.length - 500,costAr.length);
						//itersRed = iters.slice(iters.length - 50,iters.length);
                        
                        //costArRed = costAr.slice(costAr.length-50,costAr.length);
                        //itersRed = iters.slice(iters.length-50,iters.length);
						
						   costArRed = costAr.filter(function(el,ii) {
							   if ((ii == 0) || ((ii + 1) % Math.floor(costAr.length / 50) == 0)) { // 50 == 0)) {  // Math.floor(costAr.length / 500) == 0)) {
								  return true;
							   }
							   return false;
						   });
						   itersRed = iters.filter(function(el,ii) {
							   if ((ii == 0) || ((ii + 1) % Math.floor(costAr.length / 50) == 0)) {
								  return true;
							   }
							   return false;
						   });
						   

					}
					else  {
                        //costArRed = costAr.slice(costAr.length-50,costAr.length);
                        //itersRed = iters.slice(iters.length-50,iters.length);
						costArRed = costAr;
						itersRed = iters;
					}
					
	
		            if (i == 0) {
						//progCallback('chart',null,true);
					}
					else {
			          progCallback('chart',[costArRed,itersRed,ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors]);
					}
				}
			
			}
		
		
			
			if ((math.sum(Cost) + math.sum(RegCost)) > prevCost) {
				if ((math.sum(Cost) + math.sum(RegCost)) > prevMinus1Cost) { //check if going up twice in a row, just in case small rounding error
			       errMsg = '<br>Non Convergence. Try smaller alpha. ' + i + ' iterations';
				   if (progCallback) {
					   progCallback('rightBannerDiv',  getDashboardInfo(mlParams,nn,i,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg));
					}
				   break;
				}
			}
			
			
			if ((prevCost - (math.sum(Cost) + math.sum(RegCost)) >= 0) && (prevCost - (math.sum(Cost) + math.sum(RegCost)) <  mlParams.convThreshold)) { 
				console.log('Converged after: ' + i);
				errMsg = '<br>Converged after: ' + i + ' iterations';
				if (progCallback) {
					progCallback('rightBannerDiv',  getDashboardInfo(mlParams,nn,i,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg));
	
				}
				break;
			}	
			
			prevMinus1Cost = prevCost;
			
			prevCost = math.sum(Cost) + math.sum(RegCost);

			if (mlParams.module == 'neu') {
                nn.backProp();
				//nn.gradientCheck(); uncomment if checking gradient manually
				Theta = nn.unrollThetas();
			}
			else {
			   var res = gdUpdate(math.transpose(Theta),X,Y,alpha,lambda,logisticFlag);
			   Theta = res[0];
			}
			
			
			if  (mlParams.diagnosticsFlag) {
			    if (progCallback) {
				  //progCallback('diagnosticDiv','<br>Grad: ' + res[1]);  //uncomment if showing gradient per m
				  //progCallback('diagnosticDiv','<br>Theta: ' + Theta); //uncomment if showing theta per m
				}
			}
			

			if ( (math.sum(Cost) + math.sum(RegCost)) < minCostSum) {
				minCost = Cost;
				minReg = RegCost;
				minCostSum = math.sum(Cost) + math.sum(RegCost);
				minTheta = Theta;
				if (mlParams.module == 'neu') {
		           //TODO Need to implement unscaling for neural network
		           minThetaUnscaled = minTheta.clone();
	            }
	            else {
	             	if (mlParams.scalingFlag) {
			            minThetaUnscaled  = thetaUnscale(minTheta,scaleFactors);
	            	}
	            	else {
		             	minThetaUnscaled = minTheta.clone();
					}
				}
				
			
			}
			
				
	}					
		
	
		
	
	console.log('Cost: ' +  Cost + '\nTot cost: ' + (math.sum(Cost) + math.sum(RegCost)))	;
	
	if (progCallback) {
		
		var dashInfo = getDashboardInfo(mlParams,nn,i,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
		progCallback('rightBannerDiv',dashInfo,true);
 					
	}
	
	
	//var minThetaUnscaled;
	


	if (progCallback) {
		
		/*
		minTheta = math.reshape(minTheta,[1,minTheta.size()[0]]);
		minThetaUnscaled = math.reshape(minThetaUnscaled,[1,minThetaUnscaled.size()[0]]);
		*/
		
			
		var d = 4;
		
		

		
		if (mlParams.module == 'neu') {
			if (mlParams.diagnosticsFlag) {
				
			   progCallback('diagnosticDiv','<br>Alpha: ' +  mlParams.alpha) ;
			   progCallback('diagnosticDiv',' Model Cost: ' + minCostSum);
			}
		}
		
		else {
			if (mlParams.diagnosticsFlag) {
			   progCallback('diagnosticDiv','<br><br>Model h(Theta) = ' + math.subset(minThetaUnscaled,math.index(0,0)).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + math.subset(minThetaUnscaled,math.index(i,0)).toFixed(d) + 'x' + i); 
				}
					
				progCallback('diagnosticDiv','<br>Model Cost: ' + minCostSum);
			
				progCallback('diagnosticDiv','<br>(scaled:  Model h(Theta) = ' + minTheta.subset(math.index(0,0)).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + minTheta.subset(math.index(i,0)).toFixed(d) + 'x' + i);
				}
				progCallback('diagnosticDiv',')');
				progCallback('diagnosticDiv','<br>Alpha: ' +  mlParams.alpha) ;
			}

		}
		
	}	
	
 	
	return [costAr,iters,ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors,YOrig];
    

}

function NeuralNetwork(architecture,X,Y,alpha,lambda,initTheta) {
	this.architecture = architecture;
	this.numLayers = architecture.length;
	this.numInputFeatures = architecture[0];
	this.numOutputs = architecture[architecture.length-1];
	this.numHiddenLayers = this.numLayers - 2;
	this.X = X;
	this.Y = Y;
	
	this.randomTheta = true;
	
	this.initTheta = initTheta;

	if ((initTheta) && (initTheta.length > 0)) {
		this.randomTheta = false;
	}
		
	
	//this.randomTheta = randomTheta;
	
	this.Cost = null;
	this.RegCost = null;
	
	this.lambda = lambda == null ? 0 : lambda;
	
	this.alpha = alpha == null ? 0.1 : alpha;
	
	this.layers = [];
	
	
	this.toString = function() {
		var str = 
		      'Layers: ' + this.numLayers
		   +  '\nInput Features: ' + this.numInputFeatures
		   +  '\nOutputs: ' + this.numOutputs
		   +  '\nHidden Layers: ' + this.numHiddenLayers;
		   
		this.layers.forEach(function(lay) {
              str+= '\n' + lay.toString();
		});

        return str;		
		   
		   
	};
	
	this.rollThetas = function() {
		
		var svdThis = this;
		
		var ThMats = [];
		
		var initThAr = this.initTheta.split(' ');
		initThAr = initThAr.map(function(el) {
			return parseFloat(el);
		});
		
		this.architecture.forEach(function(unitsThisLayer,i) {

     		if (i == svdThis.numLayers - 1) {
				
			}
			else {
			
				var thRows = unitsThisLayer + 1;
		    	var thCols = svdThis.architecture[i+1];
				var thAr = initThAr.splice(0,thRows * thCols);
				var thMat = math.matrix(thAr);
				var thMat = math.reshape(thMat,[thRows,thCols]);
				ThMats.push(thMat);
	
			}
		});
		
		return ThMats;
		
		
	};
	
	this.checkAccuracy = function() {
		var A = this.layers[this.layers.length -1];
		var Y = this.Y;
		
		
		var P = this.predict();

        var PosNeg = [];

        var prec = null;
        var recall = null;
        var f1Score = null;

        if (Y.size()[0] == 1) { //binary
            P.forEach(function(el,i) {

               if ((el == 0)  && (Y.get(i) == 0)) {
                   PosNeg.push([0,0,1,0]); // true neg
               }
               else if ((el == 0)  && (Y.get(i) == 1)) {
                   PosNeg.push([0,0,0,1]); // false neg
               }
               else if ((el == 1)  && (Y.get(i) == 0)) {
                    PosNeg.push ([0,1,0,0]); // false pos
                }
                else  {
                    PosNeg.push([1,0,0,0]); // true pos
                }

            });

            var PosNegSum = math.multiply(math.ones(Y.size()[1]),PosNeg);

            if (PosNegSum.get([0]) + PosNegSum.get([1]) == 0) {
                prec = 0;
            }
            else {
                prec = PosNegSum.get([0]) / (PosNegSum.get([0]) + PosNegSum.get([1]));
            }

            if (PosNegSum.get([0]) + PosNegSum.get([3]) == 0) {
                recall = 0;
            }
            else {
                recall = PosNegSum.get([0]) / (PosNegSum.get([0]) + PosNegSum.get([3]));
            }

            if (prec + recall == 0) {
                f1Score = 0;
            }
            else {
                f1Score = 2 * prec * recall / (prec + recall);

            }

        }
		
		
		var D = math.subtract(P,Y);
			
		var AbsD = math.map(D,function(el) {
				return Math.abs(el);
		        });
		  	
		var onesM = math.matrix(math.ones(AbsD.size()[0]));
			
		var Prod = math.multiply(onesM,AbsD);
		
		
		Prod = math.map(Prod,function(el) {
			return el == 0 ? 1 : 0;
	    });
		
		var numCorrect = math.sum(Prod);
		
		Prod = math.map(Prod,function(el) {
			return el == 0 ? 1 : 0;
	    });
		
		return [numCorrect,Y.size()[1],prec,recall,f1Score,math.reshape(Prod,[1,Prod.size()[0]])];
		
		
		
		
	};
	
	this.predict = function() {
		var A = this.layers[this.layers.length -1].A;
		var Y = this.Y;
		
		
		
		var P;
		
		if (this.numOutputs == 1) {
			P = math.map(A,function(el,i) {
				return el > 0.5 ? 1 : 0;
			});
			
		}
		else  {
			var Maxvals = math.max(A,0);
			
			var colNum = 0;
		    P = math.map(A,function(el,i) {
				
				if (el == Maxvals.get([colNum])) {
					el = 1;
				}
				else {
					el = 0;
				}
				
				if (colNum == A.size()[1] - 1) {
					colNum = 0;
				}
				else {
					++colNum;
				}
				
				return el;
				
			});
			
	
			
			
			
			
		}
		
		
		return P;
		
		
		
		
	};
	
	 this.getInputsForSingleM = function(m) {
		 if (this.layers[0].A) {
			 return mCol(this.layers[0].A,m,true);
			 
		 }
		 else {
			 return [];
		 }
		 
		 
	 };
	 

	
	 
	 this.getCost = function(costType,m,decPlaces) {

	    //C Cost sum, CM - cost matrix
		//R - Reg sum only, RM - Reg matrix (one per theta)
		//T total C + R, only avail as a number, since diff dimensions
		
		if (costType == null) {
			costType = 'C';
		}
		
		if (m == null) {
			m = -1;
		}
		
		//decPlaces = decPlaces == null ? -1 : decPlaces;
			
		switch (costType) {
			case 'C':
			
				 if (this.Cost) {
					 if (m > -1) {
						if (decPlaces) { 
					       return (math.sum(mCol(this.Cost,m,true,true))).toFixed(decPlaces);
						}
						else {
						   return math.sum(mCol(this.Cost,m,true,true));
						}
					 }
					 else {
						if (decPlaces) {
						   return math.sum(this.Cost).toFixed(decPlaces);
						}
						else {
						   return math.sum(this.Cost)
						}
					 }
				 }
				 else {
					return [];
				 }
			  
			     break;
				 
		    case 'CM':
		
				if (this.Cost) {
					 if (m > -1) {
						 var c = mCol(this.Cost,m,true,true);
					     return c.map(function(el) {
							 if (decPlaces) {
							    return el.toFixed(decPlaces);
							 }
							 else {
								return el; 
							 }
						 });
					 }
					 else {
						 
					    return matrixToArray(this.Cost);
					 }
				 }
				 else {
					return [];
				 }
			  
			     break;
				 
			case 'R':
				if (this.RegCost) {
	
	
					var mat =  matrixToArray(this.RegCost);
					return mat.map(function(el) {
						    if (decPlaces) {
							   return el.toFixed(decPlaces);
							}
							else {
							   return el;
							}
					});
					 
				 }
				 else {
					return [];
				 }
                break;	

			case 'RM':
				if (this.RegCost) {
					return matrixToArray(this.RegCost);
				}
				else {
					return [];
				}

                break;				
		
				 
		    default: //TODO
				if ((this.RegCost) && (this.Cost)) {
					 var costSum = math.sum(this.Cost);
					 var regSum =  math.sum(this.RegCost);
				     return (costSum + regSum); 
				}
				 else {
					return [];
				}
			  
			     break;		
		}				 

				 
				 
			

  
		 
	 };
	 
	 
	 
	 
	 this.unrollThetas = function(excludeBias) {
		 //unroll all Thetas into a vector
		 
		 //If excludeBias is true, sets all bias theta values to zero (so not included in regularised cost
 		 //TODO !! 
		 
		 var unrolled = [];
		 for (var i = 0;i < this.layers.length - 1;++i) {
			 var Th = matrixToArray(this.layers[i].Theta);
			 if (excludeBias) {
			 	Th = Th.map(function(row,rNum) {
			   	     if (rNum == 0) {
			   	     	return row.map(function(el) {
			   	     		return 0;
			   	     	});
			   	     }
			   	     else {
			   	     	return row;
			   	     }
			    });
			 }
			 Th	 = math.flatten(Th);
			 unrolled = unrolled.concat(Th);
		 }
		 return math.matrix(unrolled);
		 
	 };

    this.calcDeltas = function() {
        for (var i = this.numLayers - 1;i > 0;--i) {
            this.layers[i].calcDeltas();

        }



    };

    this.calcDerivs = function() {
        for (var i = 0;i < this.numLayers -1;++i) {
            this.layers[i].calcDerivs();
        }
    };

	this.backProp = function() {

        this.calcDeltas();
        this.calcDerivs();

        for (var lay = 0;lay < this.numLayers - 1;++lay) {
            this.layers[lay].adjustTheta(this.alpha);

        }

        this.forward();


	};
	 
	 
	 this.gradientCheck = function() {
		 
		 var eps = 0.0001;
		 
		 
		 for (var lay = 0; lay < this.numLayers - 1;++lay) {
			 var Th = this.layers[lay].Theta;
			 this.layers[lay].initApproxGrads();
			 for (var i = 0;i < Th.size()[0];++i) {
			      for (var j = 0;j < Th.size()[1];++j) {
					  var curVal = Th.get([i,j]);
					  Th.set([i,j],curVal + eps);
					  this.forward();
					  var cost2 = this.getCost('T');
					  Th.set([i,j],curVal - eps);
					  this.forward();
					  var cost1 = this.getCost('T');
					  var gradApprox = (cost2 - cost1) / (2 * eps);
					  this.layers[lay].ApproxGrads.set([i,j],gradApprox);
					  
					  Th.set([i,j],curVal); //restore
	
				  }
			 }
		 }
		 
		 
		 /*
		 for (lay = 0;lay < this.numLayers - 1;++lay) {
			 this.layers[lay].adjustThetaApprox(this.alpha);
			 
		 }
			 
		 this.forward();
		 */

        // console.log('new cost: ' + this.getCost('T'));		 
		 
	 };
	 
	 this.calcCost = function() {
		 var excludeBias = true;
		 var unrolled = this.unrollThetas(excludeBias);
		 var res = costFunction(unrolled,X,Y,this.lambda,'neu',this.layers[this.layers.length - 1].A);
		 
		 return res;
		 
	 };
	
	this.forward = function() {
		
		for (var j = 0;j < this.layers.length;++j) {
			if (j == 0) { 
			   /*
				this.layers[j].X = this.X;
				this.layers[j].A = math.matrix(matrixToArray(this.X,0)); //remove first row of 1s
				*/
			}
			else {
				this.layers[j].X = math.clone(this.layers[j-1].A);
				/*
				if (j == 1) {
				   // first A has bias already added. May need to change this
				}
				else {
					this.layers[j].addBias();
				}
				*/
				this.layers[j].addBias();

				this.layers[j].forward();

			}

			/*
			if (j == this.layers.length - 1) {

			}
			else {
			*/
				//console.log(this.layers[j].singleMs());
			//}
			
		}
		
		var res = this.calcCost();
		this.Cost = res[0];
		this.RegCost = res[1];
		
		//this.layers[this.layers.length - 1].X = math.clone(this.layers[this.layers.length - 2].A);

		
		
	};
	
	
	this.reInitThetas = function(ThUnrolledStr) {
		this.initTheta = ThUnrolledStr;
		var ThMats = this.rollThetas();
		for (var i = 0;i < this.layers.length - 1;++i) {
			this.layers[i].InitThMat = ThMats[i];
			this.layers[i].init();
		}
		
		
		
	};
	
	this.reInitX = function(X) {
		//supply scaled X
		this.X = X;
		this.layers[0].X = X;
		this.layers[0].A = math.matrix(matrixToArray(this.X,0)); //remove first row of 1s
		
		
	};
	
	this.init = function() {
		
		var ThMats = [];
		
		if ((this.initTheta) && (this.initTheta.length > 0)) {	
            var ThMats = this.rollThetas();

		}
        else {
			for (var i = 0;i < this.numLayers - 1;++i) {
				ThMats.push(null);
				
			}
			
		}
	
				

		for (var i = 0;i < this.numLayers;++i) {
			var next = i == this.numLayers -1 ? -1 : this.architecture[i+1];
			var lay = new NNLayer(i+1,this.architecture[i],next,this.layers[i-1],ThMats[i]);
			this.layers.push(lay);
			if (i == 0) {
				lay.X = this.X;
				lay.A = math.matrix(matrixToArray(this.X,0)); //remove first row of 1s
				
			}
			if (i == this.numLayers - 1) {
				lay.Y = this.Y;
			}
			
		}

        for (var i = 0;i < this.numLayers - 1;++i) {
            this.layers[i].nextLayer = this.layers[i+1];
        }
		
	};
	
	this.init();
		
	
}
 
 function NNLayer(layerNum,n,nextLayerN,prevLayer,InitThMat) {
	 this.layerNum = layerNum;
	 this.n = n;
	 this.nextLayerN = nextLayerN;
	 this.Theta = null;
	 this.X = null; //input
	 this.Z = []; //intermediate
	 this.A = null; //output
     this.D = null // delta, used for gradient

	 this.prevLayer = prevLayer;

     this.nextLayer = null;

	 
	 this.InitThMat = InitThMat;
	 
	 this.ApproxGrads = null;
	 
	 
	 this.toString = function() {
	 return 'Layer num: ' + this.layerNum  + ' Features: ' + n + '\nTheta: ' + this.Theta + '\nX In: ' + this.X +  '\nZ: ' + this.Z + '\nA Out: ' + this.A;
	 };
	 
	 
	 this.init = function() {
		 
		 if (this.nextLayerN == -1) {
			 this.Theta = [];
		 }
		 else {

			if (this.InitThMat) {
				this.Theta = this.InitThMat;
			}
			else {
                this.Theta =  math.matrix(math.random([this.n + 1, this.nextLayerN],-2,2)); ///-1,1));
			}
			/*
            else {			
		        this.Theta =  math.zeros(this.n + 1, this.nextLayerN);
			}
			*/
		 }
		 
		 /*
		 if (this.X.size()[0] == this.n + 1)  {
			 
		 }
		 else {
			 console.log('Error: num rows of X does not match architecture');
		 }
		 */
		 
		 
			 
		 
	 };

     this.calcDerivs = function() {

      var ones = math.ones(1,this.A.size()[1]);
      this.AWithBias = math.concat(ones,this.A,0);

      this.Derivs = math.multiply(this.AWithBias,math.transpose(this.nextLayer.D));

      this.Derivs = math.multiply(this.Derivs,1 / this.A.size()[1]); //divide by m




     };


     this.calcDeltas = function()  {
       if (this.isOutputLayer()) {
           this.D = math.subtract(this.A,this.Y);
       }
       else {
           this.D = math.multiply(this.Theta,this.nextLayer.D);
           var ones = math.ones(1,this.A.size()[1]);
           this.AWithBias = math.concat(ones,this.A,0);
           this.AComplement = math.subtract(math.ones(math.size(this.AWithBias)),this.AWithBias);
           this.prime = math.dotMultiply(this.AWithBias,this.AComplement);
           this.D = math.dotMultiply(this.D,this.prime);

           this.D = math.matrix(matrixToArray(this.D,0)); //remove first row of 1s

       }



     };


     this.isOutputLayer = function() {
         return this.nextLayerN == -1;

     };

	 
	 
	 this.initApproxGrads = function() {
		 
		this.ApproxGrads = math.clone(this.Theta);
		this.ApproxGrads = this.ApproxGrads.map(function(el) {
			return 0;
		});
	
		 
		 
	 };


     this.adjustTheta = function(alpha) {
         this.DerivsAdj =  math.multiply(this.Derivs,alpha);

         this.Theta = math.subtract(this.Theta,this.DerivsAdj);

     };
	 
	 this.adjustThetaApprox = function(alpha) {
		 this.ApproxGrads = math.multiply(this.ApproxGrads,alpha);
		 
		 this.Theta = math.subtract(this.Theta,this.ApproxGrads);
		 
	 };
	 
	 
	 this.getThetaForUnitToUnit = function(un1,un2) {
		var thVal;

		if (this.Theta.size().length == 1) {
			thVal = this.Theta.get([un1]);
		}
		 else {
			thVal = this.Theta.get([un1, un2]);
		}
		 
		 return thVal;
		 
	 };
	 
	 this.getAForSingleM = function(m,uNum) {
		 //get An for training example m for this layer
		 if (this.A) {

		 }
		 else {
			 return '-';
		 }


		 var ins = mCol(this.A,m,true,true);
		 if (this.A.size().length == 1) {
			 return ins[0];
		 }
		 else if (ins.constructor === Array) {
			 if (this.nextLayerN == -1) {
				 return ins[uNum]; // no bias unit in last layer
			 }
			 else {
			    return uNum == 0 ? 1 : ins[uNum - 1];
			 }
		 }
		 else {
	         return ins;

		 }
		 
	 };
	 
	

	 this.getYForSingleM = function(m,uNum) {
		 //get Xn for training example m for this layer
		 if (this.Y) {

		 }
		 else {
			 return -1;
		 }

		 var outs = mCol(this.Y,m,true,true);
		 if (this.Y.size()[0] == 1) {
            return outs;
		 }
		 else {
			 return outs[uNum];

		 }

	 };
	 
	 
	 
	 this.singleMs = function() {
		 var str = '';
		 for (var i = 0;i < this.X.size()[1];++i) {
			 var ins = mCol(this.X,i,true);
			 ins = ins.map(function(el) {
				 return math.round(el,3);
			 });
			 var outs =  mCol(this.A,i,true,true);
			 if (this.A.size()[0] == 1) {

			 }
			 else {
				 outs = outs.map(function (el) {
					 return math.round(el, 3);
				 });
			 }
			 
			  str+= '\nInputs: ' + ins + ' Activations: ' + outs	;
		 }
		
		 return str;
		 
	 };
	 
	 this.addBias = function() {
		 /*
		 var ar = matrixToArray(this.X);
		 var ones= [];
		 for (var i = 0;i < this.X.size()[1];++i) {
		     ones.push(1);
		 }
		 ar.unshift(ones);
		 return math.matrix(ar);
		 */
		 var ones = math.ones(1,this.X.size()[1]);
		 
		 this.X = math.concat(ones,this.X,0);
	 
	 };
	 
	 
	 this.forward = function() {
		 this.Z = h(math.transpose(this.prevLayer.Theta),this.X,false); //this.X = prev layer A with bias 1s added
		 this.A = h(math.transpose(this.prevLayer.Theta),this.X,true);
		 
	 };
	 
	 this.init();
	 
	 
 }