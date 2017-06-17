

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


var pauseFlag = false;

/**
* Removes first row of matrix, returns new matrix
*/

function mRemoveFirstRow(mat) {
	
	var newMat = math.subset(mat,math.index(math.range(1,mat.size()[0]),math.range(0,mat.size()[1])));
	return newMat;
	
	
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
	
	
	if ((rNum == -1) && (cNum == -1)) {
		return mat.toArray();
		
	}
	
 
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
 * scale factors indexes: 0-mean, 1-range, 2-lowest. If scaleFactors passed then uses these to scale, otherwise calcs scalefactors as well as scaling
 * @param mat
 * @returns {*}
 */
 function featureScale(mat,inScaleFactors) {
	 
   //var scaledMat = math.subset(mat,math.index(0,math.range(0,mat.size()[1]))); //mRow(mat,0); 
   var scaledMat; // =  matrixToArray(math.flatten(mRow(mat,0)));
   
   
   var rows = mat.size()[0];
   var cols = mat.size()[1];
   var scaleFactors = [];
   scaleFactors.push([1,0,1]);
   console.log('starting scale loop');
   for (var r = 1;r < rows;++r) {
       //don't scale 1st feature, ie r = 0, as this is always 1
	   var row = mRow(mat,r);
	   
	   var min = math.min(row);
	   var max = math.max(row);
	   var range = max - min;
	   var mean = math.mean(row);
	   
	   scaleFactors.push([mean,range,min]);
	   
   }
   
   scaledMat = mat.map(function(el,ind) {
	   var r = ind[0];
	   
	   var newEl;
  	   
	   var min,max,range,mean,lowest;
	  
	   
	   if (inScaleFactors) {
		   mean = inScaleFactors[r][0];
		   range = inScaleFactors[r][1];
		   lowest = inScaleFactors[r][2];
	   }
	   else {
		   mean = scaleFactors[r][0];
		   range = scaleFactors[r][1];
		   lowest = scaleFactors[r][2];
		   
	   }
	   
	
	   if (r == 0) {
           return el;
	   }
	   else {
  	   
		   newEl = el - mean;
		   newEl = (range > 0) ? newEl / range : newEl;
			
		   return newEl;
	   }		   
	
	   
	   
	});
	   
  
   
   console.log('ended scale loop');
   //scaledMat = math.matrix(scaledMat); 
  // scaledMat = math.reshape(scaledMat,mat.size());  //Need to reshape!!!
   
   return [scaledMat,scaleFactors];
   
   
   
 
 }
 
 /**
 * scale factors indexes: 0-mean, 1-range, 2-lowest. If scaleFactors passed then uses these to scale, otherwise calcs scalefactors as well as scaling
 * @param mat
 * @returns {*}
 */
 function featureScaleBitBetter(mat,inScaleFactors) {
	 
   //var scaledMat = math.subset(mat,math.index(0,math.range(0,mat.size()[1]))); //mRow(mat,0); 
   var scaledMat =  matrixToArray(math.flatten(mRow(mat,0)));
   
   
   var rows = mat.size()[0];
   var cols = mat.size()[1];
   var scaleFactors = [];
   scaleFactors.push([1,0,1]);
   console.log('starting scale loop');
   for (var r = 1;r < rows;++r) {
       //don't scale 1st feature, ie r = 0, as this is always 1
	   var row = mRow(mat,r);
	   
	   var min = math.min(row);
	   var max = math.max(row);
	   var range = max - min;
	   var mean = math.mean(row);
	   
	   //var min = 1;var max = 5;var range = 4;var mean = 3;
	   
	   if (inScaleFactors) {
		   var inMean = inScaleFactors[r][0];
		   var inRange = inScaleFactors[r][1];
		   var inLowest = inScaleFactors[r][2];
		   row = math.subtract(row,inMean);
		   row = inRange > 0 ? math.divide(row,inRange) : row;
		   
	   }
	   else {
		   
		row = math.subtract(row,mean);
		row = range > 0 ? math.divide(row,range) : row;
		
	   }
	   
	   var ind = math.index(r, math.range(0,cols));
	   if (cols == 1) {
		   var newVal = row.get([0]);
		   scaledMat =  math.concat(scaledMat,row,0); //math.concat(scaledMat,row.get([0]));  //math.subset(scaledMat,ind,row.get([0])); //expects scalar
		   // scaledMat.push(row.get([0]));
	   }
	   else {
	      //scaledMat = math.concat(scaledMat,row,0);    THIS LINE TOOK AGES in matrix form!!
		  scaledMat = scaledMat.concat(matrixToArray(math.flatten(row)));
	   }
	   scaleFactors.push([mean,range,min]);
   }
   
   console.log('ended scale loop');
   scaledMat = math.matrix(scaledMat); 
   scaledMat = math.reshape(scaledMat,mat.size());  //Need to reshape!!!
   
   return [scaledMat,scaleFactors];
   
   
   
 
 }
 
/**
 * scale factors indexes: 0-mean, 1-range, 2-lowest. If scaleFactors passed then uses these to scale, otherwise calcs scalefactors as well as scaling
 * @param mat
 * @returns {*}
 */
 function featureScaleOld(mat,inScaleFactors) {
	 
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
	   
	   if (inScaleFactors) {
		   var inMean = inScaleFactors[r][0];
		   var inRange = inScaleFactors[r][1];
		   var inLowest = inScaleFactors[r][2];
		   row = math.subtract(row,inMean);
		   row = inRange > 0 ? math.divide(row,inRange) : row;
		   
	   }
	   else {
		row = math.subtract(row,mean);
		row = range > 0 ? math.divide(row,range) : row;
	   }
	   
	   var ind = math.index(r, math.range(0,cols));
	   if (cols == 1) {
		   scaledMat = math.subset(scaledMat,ind,row.get([0])); //expects scalar
	   }
	   else {
	      scaledMat = math.subset(scaledMat,ind,row);
	   }
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
 /*
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
 */
 
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


function getDashboardInfo(mlParams,nn,iterNum,alpha,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg) {
	
	var d = 4; //dec places
	
	var dashInfo = '';
	
	dashInfo += 'Iter: ' +  iterNum +  ' Cost: ' + (math.sum(Cost) + math.sum(RegCost)) + ' (exReg: ' + math.sum(Cost).toFixed(3)  + ')' + ' Alpha: ' + alpha.toFixed(3) + '<br>';
	
	
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

function learnLoopDone(curr,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig,errMsg,finType) {
	
	//get current loop data	
	PrevMinus1Cost = cData.PrevMinus1Cost;
	PrevMinus1RegCost = cData.PrevMinus1RegCost; 
	prevMinus1CostSum = cData.prevMinus1CostSum;
	
	Cost = cData.Cost;
	RegCost = cData.RegCost;
	currCostSum = cData.currCostSum;

	PrevCost = cData.PrevCost;
	PrevRegCost = cData.PrevRegCost;
	prevCostSum = cData.prevCostSum;
	
	potentialConvAtIter = cData.potentialConvAtIter;
	potentialConvCostSum = cData.potentialConvCostSum;
	
	
	prevTheta = cData.prevTheta;
	prevThetaUnscaled = cData.prevThetaUnscaled;
	
	nn = cData.nn;
	
	Theta = cData.Theta;
	
	XUnscaled = cData.XUnscaled;
	ThetaUnscaled = cData.ThetaUnscaled;
	scaleFactors = cData.scaleFactors;
	
	n = cData.n;
	
	iters = cData.iters;
	costAr = cData.costAr;
	
	itersSparse = cData.itersSparse;
	costArSparse = cData.costArSparse;
	
	ThetaIdeal = cData.ThetaIdeal;
	IdealCost = cData.IdealCost;
	
	alpha = cData.alpha;
	
	pk = cData.pk;
	
// end get current loop data


    console.log('Cost: ' +  Cost + '\nTot cost: ' +  currCostSum); //(math.sum(Cost) + math.sum(RegCost)));
	
	//var errMsg = '';
	
	if (progCallback) {
		
		var dashInfo = getDashboardInfo(mlParams,nn,curr,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
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
			   progCallback('diagnosticDiv',' Model Cost: ' + currCostSum);
			}
		}
		
		else {
			if (mlParams.diagnosticsFlag) {
			   progCallback('diagnosticDiv','<br><br>Model h(Theta) = ' + math.subset(ThetaUnscaled,math.index(0,0)).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + math.subset(ThetaUnscaled,math.index(i,0)).toFixed(d) + 'x' + i); 
				}
					
				progCallback('diagnosticDiv','<br>Model Cost: ' + currCostSum);
			
				progCallback('diagnosticDiv','<br>(scaled:  Model h(Theta) = ' + Theta.subset(math.index(0,0)).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + Theta.subset(math.index(i,0)).toFixed(d) + 'x' + i);
				}
				progCallback('diagnosticDiv',')');
				progCallback('diagnosticDiv','<br>Alpha: ' +  mlParams.alpha) ;
			}

		}
		
	}	
	
 	
	return [costAr,iters,ThetaIdeal,IdealCost,X,Y,Theta,XUnscaled,ThetaUnscaled,scaleFactors,YOrig,costArSparse,itersSparse];
    
	
}


function learnLoop(curr,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig) {
	++curr;
	
/*
	if (pauseFlag) {
		
		break;
		
	}
*/	
	var errMsg = '';
	
	
//get current loop data	
	PrevMinus1Cost = cData.PrevMinus1Cost;
	PrevMinus1RegCost = cData.PrevMinus1RegCost; 
	prevMinus1CostSum = cData.prevMinus1CostSum;
	
	Cost = cData.Cost;
	RegCost = cData.RegCost;
	currCostSum = cData.currCostSum;

	PrevCost = cData.PrevCost;
	PrevRegCost = cData.PrevRegCost;
	prevCostSum = cData.prevCostSum;
	
	potentialConvAtIter = cData.potentialConvAtIter;
	potentialConvCostSum = cData.potentialConvCostSum;
	
	
	prevTheta = cData.prevTheta;
	prevThetaUnscaled = cData.prevThetaUnscaled;
	
	nn = cData.nn;
	
	Theta = cData.Theta;
	
	XUnscaled = cData.XUnscaled;
	ThetaUnscaled = cData.ThetaUnscaled;
	scaleFactors = cData.scaleFactors;
	
	n = cData.n;
	
	iters = cData.iters;
	costAr = cData.costAr;
	
	itersSparse = cData.itersSparse;
	costArSparse = cData.costArSparse;
	
	ThetaIdeal = cData.ThetaIdeal;
	IdealCost = cData.IdealCost;
	
	alpha = cData.alpha;
	
	pk = cData.pk;
	
// end get current loop data
	
	
	PrevMinus1Cost = math.clone(PrevCost);
	PrevMinus1RegCost = math.clone(PrevRegCost); 
	prevMinus1CostSum = prevCostSum;
	

	if (Cost) {
		PrevCost = math.clone(Cost);
		PrevRegCost = math.clone(RegCost);
		prevCostSum =  currCostSum; //math.sum(Cost) + math.sum(RegCost);
	}
	
	
	
	
	if (mlParams.module == 'neu') {
		nn.forward();
		Cost = nn.getCost('CM');
		RegCost = nn.getCost('RM');
		
	}
	else {
		var res =  costFunction(math.transpose(Theta),X,Y,mlParams.lambda,mlParams.module);
		Cost = res[0];
		RegCost = res[1];
		
	}

	
	currCostSum = math.sum(Cost) + math.sum(RegCost);
	
	
	console.log('iter: ' + curr);
	var counterUpdate = 2;
	var graphUpdate = 50;
	
	if (mlParams.useLineSearchDriver || mlParams.useConjugateGradientDriver) {
		counterUpdate = 1;
		
	}
	
	
	if (curr % counterUpdate == 0) {
		if (progCallback) {
			
			var dashInfo = getDashboardInfo(mlParams,nn,curr,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
			progCallback('rightBannerDiv',dashInfo,true);
			
		}
	}

	costAr.push(currCostSum);   //(math.sum(Cost) + math.sum(RegCost));
	iters.push(curr);


	if (curr % 50 == 0) {
		if (progCallback) {
			
			var costArRed,itersRed;
			
			costArSparse.push(currCostSum); //(math.sum(Cost) + math.sum(RegCost));
	        itersSparse.push(curr);
			
			if (costAr.length > 50) {
				//costArRed = costAr.slice(costAr.length - 500,costAr.length);
				//itersRed = iters.slice(iters.length - 50,iters.length);
				
				//costArRed = costAr.slice(costAr.length-50,costAr.length);
				//itersRed = iters.slice(iters.length-50,iters.length);
				
				
				// Thinned out costar: 
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
			

			if (curr == 0) {
				//progCallback('chart',null,true);
			}
			else {
			  progCallback('chart',[costArRed,itersRed,ThetaIdeal,IdealCost,X,Y,Theta,XUnscaled,ThetaUnscaled,scaleFactors,null,costArSparse,itersSparse]);
			}
		}
	
	}


	var blownThisIter = false;
	
	//Temporarily disable non-convergence test
	
	//if ((math.sum(Cost) + math.sum(RegCost)) > (prevCostSum + mlParams.convThreshold)) {
	if (currCostSum > (prevCostSum + mlParams.convThreshold)) {	
		
		//if ((math.sum(Cost) + math.sum(RegCost)) > prevMinus1CostSum) { //check if going up twice in a row, just in case small rounding error
		   blownThisIter = true;
		   errMsg = '<br>Non Convergence. Iter: ' + curr  + ' Alpha: ' + alpha.toFixed(3) + ' =>  trying smaller alpha';
		   if (progCallback) {
			   progCallback('rightBannerDiv',  getDashboardInfo(mlParams,nn,curr,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg),true);
			}
			
			if (mlParams.useBoldDriver) {
			
				Theta = prevTheta;
				// minTheta = prevMinTheta;
				ThetaUnscaled = prevThetaUnscaled;
				Cost = math.clone(PrevCost);
				RegCost = math.clone(PrevRegCost);
				currCostSum = prevCostSum;
				PrevCost = math.clone(PrevMinus1Cost);
				PrevRegCost = math.clone(PrevMinus1RegCost);
				prevCostSum = prevMinus1CostSum;

			}
		   if (mlParams.useBoldDriver) {
			  
				alpha = alpha * 0.5;
				if (mlParams.module === 'neu') {
					nn.alpha = alpha;
				}
				//continue;
			  
			  
		   }
		   else {	
			  
			  
			  //break; let go up if using constant alpha rate
		   }
		   
		   if (mlParams.useDownDriver) {
			    alpha = alpha * 0.9;
			   	if (mlParams.module === 'neu') {
					nn.alpha = alpha;
				}			   
		   }
		   
		//}
	}
	
	
	var convergedThisIter = false;
	
	if (blownThisIter) {
	}
	else {
		//if ((prevCostSum - (math.sum(Cost) + math.sum(RegCost)) >= 0) && (prevCostSum - (math.sum(Cost) + math.sum(RegCost)) <  mlParams.convThreshold)) { 
		if ( ((prevCostSum - currCostSum) >= 0) && ((prevCostSum - currCostSum) <  mlParams.convThreshold) ) { 
			console.log('Converged after: ' + curr);

			if (potentialConvAtIter == -1) {
				potentialConvAtIter = curr;
				potentialConvCostSum = prevCostSum;
			}
			else {
				if ((curr - potentialConvAtIter) > 20) { // allow 20 iterations leeway before declaring convergence
				    if (potentialConvCostSum - currCostSum < mlParams.convThreshold) {
				        convergedThisIter = true;
						errMsg = '<br>Converged after: ' + curr + ' iterations';
		             	if (progCallback) {
				            progCallback('rightBannerDiv',  getDashboardInfo(mlParams,nn,curr,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg),true);

			            }
					}
					else {
						potentialConvAtIter = -1;
		            	potentialConvCostSum = 9999999999999999;
					}
						
					//break;
				}
			}
			//break;
		}
		
		else {
			potentialConvAtIter = -1;
			potentialConvCostSum = 9999999999999999;
				
		}
		
		if (mlParams.useBoldDriver) {
			alpha = alpha * 1.01;
			if (mlParams.module === 'neu') {
				nn.alpha = alpha;
			}
		}
	}				
	
	//prevMinus1CostSum = prevCostSum;
	
	//prevCostSum = math.sum(Cost) + math.sum(RegCost);
	
	//prevRegCost = RegCost;
	
	prevTheta = Theta.clone();
//		prevMinTheta = minTheta.clone();
	prevThetaUnscaled = ThetaUnscaled.clone();

	var logisticFlag = (mlParams.module == 'log');
	
	if (mlParams.module == 'neu') {
		nn.backProp();
		if (mlParams.useLineSearchDriver) {
			var res = nn.wolfeLineSearch();
			alpha = res[0];
			nn.alpha = res[0];
			nn.updateTheta(res[1].x);
			
		}
		else if (mlParams.useConjugateGradientDriver) {
			var res = nn.conjugateGradientStep(nn.pk);
			if (res[0]) {
			   alpha = res[0];	
			   nn.alpha = res[0];
			   nn.updateTheta(res[1].x);
			   nn.pk = res[2];
			   pk = res[2];
			   
			}
			else {
				alpha = 1;
				nn.alpha = 1; //reset
				nn.pk = res[2];
				pk = res[2];
				
			}
			
		}
		else {
		    nn.updateTheta();
		}
		//nn.gradientCheck(); uncomment if checking gradient manually
		Theta = nn.unrollThetas();
	}
	else {
	   var res = gdUpdate(math.transpose(Theta),X,Y,alpha,mlParams.lambda,logisticFlag);
	   Theta = res[0];
	}
	
	
	if  (mlParams.diagnosticsFlag) {
		if (progCallback) {
		  //progCallback('diagnosticDiv','<br>Grad: ' + res[1]);  //uncomment if showing gradient per m
		  //progCallback('diagnosticDiv','<br>Theta: ' + Theta); //uncomment if showing theta per m
		}
	}
	
	
	
	if (mlParams.module == 'neu') {
		   //TODO Need to implement unscaling for neural network
		   ThetaUnscaled = Theta.clone();
	}
	else {
			if (mlParams.scalingFlag) {
				ThetaUnscaled  = thetaUnscale(Theta,scaleFactors);
			}
			else {
				ThetaUnscaled = Theta.clone();
			}
	}
			
			
	 
	//set up next loop data	
	cData.PrevMinus1Cost = PrevMinus1Cost;
	cData.PrevMinus1RegCost = PrevMinus1RegCost; 
	cData.prevMinus1CostSum = prevMinus1CostSum;
	
	cData.Cost = Cost;
	cData.RegCost = RegCost;
	cData.currCostSum = currCostSum;

	cData.PrevCost = PrevCost;
	cData.PrevRegCost = PrevRegCost;
	cData.prevCostSum = prevCostSum;
	
	cData.potentialConvAtIter = potentialConvAtIter;
	cData.potentialConvCostSum = potentialConvCostSum;
	
	
	cData.prevTheta = prevTheta;
	cData.prevThetaUnscaled = prevThetaUnscaled;
	
	cData.nn = nn;
	
	cData.Theta = Theta;
	
	cData.XUnscaled = XUnscaled;
	cData.ThetaUnscaled = ThetaUnscaled;
	cData.scaleFactors = scaleFactors;
	
	cData.n = n;
	
	cData.iters = iters;
	cData.costAr = costAr;
	
    cData.itersSparse = itersSparse;
	cData.costArSparse = costArSparse;
	
	cData.ThetaIdeal = ThetaIdeal;
	cData.IdealCost = IdealCost;
	
	cData.alpha = alpha;
	
	cData.pk = pk;
	
// end set up next loop data

	
	
	if ((curr >= maxIters) || pauseFlag || convergedThisIter) {
		console.log('learnloopdone');
		var finType = '';
		if (convergedThisIter) {
			finType = 'C';
		}
		else if (pauseFlag) {
			finType = 'P'
		}
		else {
			finType = 'F';
		}
		var res = learnLoopDone(curr,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig,errMsg,finType);
		if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
			var tst = res[2];
			var msg = {};
			msg.action = 'fin';
			msg.elToUpdate = 'outputBlog';
			msg.mess = '<br>finished';
			msg.costAr = res[0];//JSON.stringify(res[0]);
			msg.iters = res[1];//JSON.stringify(res[1]);
			msg.ThetaIdeal = JSON.stringify(res[2]);
			msg.IdealCost = JSON.stringify(res[3]);
			msg.X = JSON.stringify(res[4]);
			msg.Y = JSON.stringify(res[5]);
			msg.minTheta = JSON.stringify(res[6]);
			msg.XUnscaled = JSON.stringify(res[7]);
			msg.minThetaUnscaled = JSON.stringify(res[8]);
			msg.scaleFactors = res[9];//JSON.stringify(res[9]);
			msg.YOrig = JSON.stringify(res[10]);
			msg.costArSparse = res[11];
			msg.itersSparse = res[12];
            msg.finType = finType;
			//postMessage({'action':'fin','elToUpdate':'blog','mess':'<br>finished','minT':JSON.stringify(res[4])});	
			postMessage(msg);
			postMessage({'action':'progUp','elToUpdate':'outputBlog','mess':'<br>finished'});		
			if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum == mlParams.numLogClasses - 1)) {
				postMessage({'action':'multiClassFin'});
			}
		}			
		
	}	
	else {
		setTimeout(function() {
			learnLoop(curr,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig);
		},0);
	}
		
	
}


/**
 *
 * @param mlParams
 * @param progCallback
 * @returns {*}
 */
function learn(mlParams,X,Y,progCallback,continueData) {
  
   var minCost = null;
   var minReg = null;
   var minCostSum = 99999999999999999999;
 //  var minTheta = [];
 
   var PrevCost;
   var PrevRegCost;
   
   var PrevMinus1Cost;
   var PrevMinus1RegCost;
   
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
   
   var pk = null; //used by conjugate gradient
   
   
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
   var costAr = [];
   
   var itersSparse = [];
   var costArSparse = [];

    var maxIters = mlParams.maxIterations;

    if (continueData) {
	   iters = continueData[0];
	   costAr = continueData[1];
	   itersSparse = continueData[2];
	   costArSparse = continueData[3];
       if (continueData[4] === 'F') {
           maxIters+= iters.length; //if fully finished last time, then continues for another maxiters
       }
   }

   var iterNum = iters.length;
   
   var alpha = mlParams.alpha; 
   var lambda = mlParams.lambda;
   


    var prevCostSum = 9999999999999999999;
	var prevMinus1CostSum = 9999999999999999999;
	var currCostSum = 9999999999999999999;
	
	var Theta;
	
	var prevTheta, prevThetaUnscaled;
	
	
	var nn;
   
    if (mlParams.module == 'neu') {
		
		 var arch = (mlParams.architecture.length  == 0) ? [X.size()[0] - 1,X.size()[0] +1,Y.size()[0]] : mlParams.architecture;

         nn = new NeuralNetwork(arch,X,Y,XUnscaled,scaleFactors,mlParams.alpha,mlParams.lambda,mlParams.initTheta);
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
	
//	minTheta = Theta.clone();
	

	var ThetaUnscaled;
	if (mlParams.module == 'neu') {
		//TODO Need to implement unscaling for neural network
		ThetaUnscaled =Theta.clone();
	}
	
	else {
	
		if (mlParams.scalingFlag) {
			ThetaUnscaled = thetaUnscale(Theta,scaleFactors);
		}
		else {
			ThetaUnscaled = Theta.clone();
		}
	}
	
		
    var degrees = mlParams.degrees;//parseInt(elVal('degreesInput'));
			
	var errMsg = null;	
	
	var Cost,RegCost;
	
	var potentialConvAtIter = -1;
	
	
	var cData = {}; //current loop iteration data
	
	//set up loop curr data	
	cData.PrevMinus1Cost = PrevMinus1Cost;
	cData.PrevMinus1RegCost = PrevMinus1RegCost; 
	cData.prevMinus1CostSum = prevMinus1CostSum;
	
	cData.Cost = Cost;
	cData.RegCost = RegCost;
	cData.currCostSum = currCostSum;

	cData.PrevCost = PrevCost;
	cData.PrevRegCost = PrevRegCost;
	cData.prevCostSum = prevCostSum;
	
	cData.potentialConvAtIter = -1;
	cData.potentialConvCostSum = 99999999999999999;
	
	cData.prevTheta = prevTheta;
	cData.prevThetaUnscaled = prevThetaUnscaled;
	
	cData.nn = nn;
	
	cData.Theta = Theta;
	
	cData.XUnscaled = XUnscaled;
	cData.ThetaUnscaled = ThetaUnscaled;
	cData.scaleFactors = scaleFactors;
	
	cData.n = n;
	
	cData.iters = iters;
	cData.costAr = costAr;
	
	cData.itersSparse = itersSparse;
	cData.costArSparse = costArSparse;
	
	cData.ThetaIdeal = ThetaIdeal;
	cData.IdealCost = IdealCost;
	
	cData.alpha = mlParams.alpha;
	
	cData.pk = pk;
	
// end set up loop curr data
	
	learnLoop(iterNum,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig);
	
	/*	
	for (var i = 0;i < maxIters;++i) {
		
	
			if (pauseFlag) {
				
				break;
				
			}
 
            
			PrevMinus1Cost = math.clone(PrevCost);
			PrevMinus1RegCost = math.clone(PrevRegCost); 
			prevMinus1CostSum = prevCostSum;
			
	
			if (Cost) {
				PrevCost = math.clone(Cost);
			    PrevRegCost = math.clone(RegCost);
		    	prevCostSum = math.sum(Cost) + math.sum(RegCost);
			}
			
			
			
			
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
					
					var dashInfo = getDashboardInfo(mlParams,nn,i,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
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
			          progCallback('chart',[costArRed,itersRed,ThetaIdeal,IdealCost,X,Y,Theta,XUnscaled,ThetaUnscaled,scaleFactors]);
					}
				}
			
			}
		
		
			var blownThisIter = false;
			
			//Temporarily disable non-convergence test
			
			if ((math.sum(Cost) + math.sum(RegCost)) > (prevCostSum + mlParams.convThreshold)) {
				//if ((math.sum(Cost) + math.sum(RegCost)) > prevMinus1CostSum) { //check if going up twice in a row, just in case small rounding error
				   blownThisIter = true;
			       errMsg = '<br>Non Convergence. Iter: ' + i  + ' Alpha: ' + alpha.toFixed(3) + ' =>  trying smaller alpha';
				   if (progCallback) {
					   progCallback('rightBannerDiv',  getDashboardInfo(mlParams,nn,i,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg),true);
					}
					
					if (mlParams.useBoldDriver) {
					
						Theta = prevTheta;
						// minTheta = prevMinTheta;
						ThetaUnscaled = prevThetaUnscaled;
						Cost = math.clone(PrevCost);
						RegCost = math.clone(PrevRegCost);
						PrevCost = math.clone(PrevMinus1Cost);
						PrevRegCost = math.clone(PrevMinus1RegCost);
					}
				   if (mlParams.useBoldDriver) {
					  
					    alpha = alpha * 0.5;
						if (mlParams.module === 'neu') {
							nn.alpha = alpha;
						}
						//continue;
				      
                      
				   }
                   else {	
                      
					  
				      //break; let go up if using constant alpha rate
				   }
				//}
			}
			
			
			
			if (blownThisIter) {
			}
			else {
				if ((prevCostSum - (math.sum(Cost) + math.sum(RegCost)) >= 0) && (prevCostSum - (math.sum(Cost) + math.sum(RegCost)) <  mlParams.convThreshold)) { 
					console.log('Converged after: ' + i);
					errMsg = '<br>Converged after: ' + i + ' iterations';
					if (progCallback) {
						progCallback('rightBannerDiv',  getDashboardInfo(mlParams,nn,i,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg));
		
					}
					if (potentialConvAtIter == -1) {
						potentialConvAtIter = i;
					}
					else {
						if ((i - potentialConvAtIter) > 20) { // allow 20 iterations leeway before declaring convergence
							break;
						}
					}
					//break;
				}
				
				else {
					potentialConvAtIter = -1;
						
				}
				
				if (mlParams.useBoldDriver) {
			      	alpha = alpha * 1.01;
				    if (mlParams.module === 'neu') {
				    	nn.alpha = alpha;
				    }
				}
			}				
			
			//prevMinus1CostSum = prevCostSum;
			
			//prevCostSum = math.sum(Cost) + math.sum(RegCost);
			
			//prevRegCost = RegCost;
			
			prevTheta = Theta.clone();
	//		prevMinTheta = minTheta.clone();
			prevThetaUnscaled = ThetaUnscaled.clone();

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
			
			
			
			if (mlParams.module == 'neu') {
		           //TODO Need to implement unscaling for neural network
		           ThetaUnscaled = Theta.clone();
	        }
	        else {
	             	if (mlParams.scalingFlag) {
			            ThetaUnscaled  = thetaUnscale(Theta,scaleFactors);
	            	}
	            	else {
		             	ThetaUnscaled = Theta.clone();
					}
			}
				
				
	}

*/	
		
	
	

	
		
	/* end of loop stuff
	
	console.log('Cost: ' +  Cost + '\nTot cost: ' + (math.sum(Cost) + math.sum(RegCost)))	;
	
	if (progCallback) {
		
		var dashInfo = getDashboardInfo(mlParams,nn,i,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
		progCallback('rightBannerDiv',dashInfo,true);
 					
	}
	
	
	//var minThetaUnscaled;
	


	if (progCallback) {
		
		
			
		var d = 4;
		
		

		
		if (mlParams.module == 'neu') {
			if (mlParams.diagnosticsFlag) {
				
			   progCallback('diagnosticDiv','<br>Alpha: ' +  mlParams.alpha) ;
			   progCallback('diagnosticDiv',' Model Cost: ' + minCostSum);
			}
		}
		
		else {
			if (mlParams.diagnosticsFlag) {
			   progCallback('diagnosticDiv','<br><br>Model h(Theta) = ' + math.subset(ThetaUnscaled,math.index(0,0)).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + math.subset(ThetaUnscaled,math.index(i,0)).toFixed(d) + 'x' + i); 
				}
					
				progCallback('diagnosticDiv','<br>Model Cost: ' + minCostSum);
			
				progCallback('diagnosticDiv','<br>(scaled:  Model h(Theta) = ' + Theta.subset(math.index(0,0)).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + Theta.subset(math.index(i,0)).toFixed(d) + 'x' + i);
				}
				progCallback('diagnosticDiv',')');
				progCallback('diagnosticDiv','<br>Alpha: ' +  mlParams.alpha) ;
			}

		}
		
	}	
	
 	
	return [costAr,iters,ThetaIdeal,IdealCost,X,Y,Theta,XUnscaled,ThetaUnscaled,scaleFactors,YOrig];
	
	*/
    

}

function NeuralNetwork(architecture,X,Y,XUnscaled,scaleFactors,alpha,lambda,initTheta) {
	this.architecture = architecture;
	this.numLayers = architecture.length;
	this.numInputFeatures = architecture[0];
	this.numOutputs = architecture[architecture.length-1];
	this.numHiddenLayers = this.numLayers - 2;
	this.X = X;
	this.Y = Y;
	this.XUnscaled = XUnscaled;
	
	this.scaleFactors = scaleFactors;
	
	this.pk = null;
	
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
	
	/**
	* If ThVec is supplied (which is an unrolled Theta vector) then use this
	* otherwise roll Theta matrices based on initTheta
	
	**/
	
	this.rollThetas = function(ThVec) {
		
		
		
		var svdThis = this;
		
		var ThMats = [];
		
		var ThArUnrolled;
		
        if (ThVec) {
			ThArUnrolled = matrixToArray(ThVec);
		}
		else {
			ThArUnrolled = this.initTheta.split(' ');
			ThArUnrolled = ThArUnrolled.map(function(el) {
				return parseFloat(el);
			});
		}
		
		this.architecture.forEach(function(unitsThisLayer,i) {

     		if (i == svdThis.numLayers - 1) {
				
			}
			else {
			
				var thRows = unitsThisLayer + 1;
		    	var thCols = svdThis.architecture[i+1];
				var thAr = ThArUnrolled.splice(0,thRows * thCols);
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
	
	 this.getInputsForSingleM = function(m,d) {
		 var singleMArray = [];
		 if (this.layers[0].A) {
			 singleMArray = mCol(this.layers[0].A,m,true);
			 if (d == null) {
				return singleMArray; 
			 }
			 else {
				 return singleMArray.map(function(el) {
					 return el.toFixed(d);
				 });
			 }
			 
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
	 
	 this.unrollDerivs = function() {
		 
		 var unrolled = [];
		 for (var i = 0;i < this.layers.length - 1;++i) {
			 var Der = matrixToArray(this.layers[i].Derivs);
			 Der = math.flatten(Der);
			 unrolled = unrolled.concat(Der);
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

  


	};
	
	
	/**
	* If ThVec supplied, update directly based on that, else update based on  std grad descent update
	*/
	this.updateTheta = function(ThVec){
		
		var ThMats;
		
		if (ThVec) {
			ThMats = this.rollThetas(ThVec);
		}
		
		for (var lay = 0;lay < this.numLayers - 1;++lay) {
			if (ThMats) {
				this.layers[lay].updateTheta(this.alpha,ThMats[lay]);
			}
			else {
				this.layers[lay].updateTheta(this.alpha);
			}
		
        }

        this.forward();
		
	
	
	};
	
	
	this.conjugateGradientStep = function(pk) {
		    var params = null;
		
			var current = {};
		    var next = {};
		    current.x = this.unrollThetas();
		    current.fx = this.getCost('T');
		    current.fxprime = this.unrollDerivs();
			
			if (pk) {
				
			}
			else {
		       pk = math.multiply(current.fxprime,-1);
			}

		
		    var res = this.wolfeLineSearch(this.alpha,pk);
			var a = res[0];
			next = res[1];

            // todo: history in wrong spot?
			if (params) {
				if (params.history) {
					params.history.push({x: current.x.slice(),
										 fx: current.fx,
										 fxprime: current.fxprime.slice(),
										 alpha: a});
				}
			}

            if (!a) {
                // faiiled to find point that satifies wolfe conditions.
                // reset direction for next iteration
                pk = math.multiply(current.fxprime,-1);   //scale(pk, current.fxprime, -1);
				return[a,null,pk];

            } else {
                // update direction using Polakâ€“Ribiere CG method
                var yk = math.add(next.fxprime,math.multiply(current.fxprime,-1));     //weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

                var delta_k =    math.sum(math.dotMultiply(current.fxprime,current.fxprime));  //dot(current.fxprime, current.fxprime),
                    beta_k =     Math.max(0,math.sum(math.dotMultiply(yk,next.fxprime)) / delta_k);     //Math.max(0, dot(yk, next.fxprime) / delta_k);

                pk = math.add(math.multiply(pk,beta_k),math.multiply(next.fxprime,-1));     //weightedSum(pk, beta_k, pk, -1, next.fxprime);

				return [a,next,pk];
				/*
                temp = current;
                current = next;
                next = temp;
				*/
            }

			/*
            if (norm2(current.fxprime) <= 1e-5) {
                break;
            }
			*/
        

		if (params) {
			if (params.history) {
				params.history.push({x: current.x.slice(),
									 fx: current.fx,
									 fxprime: current.fxprime.slice(),
									 alpha: a});
			}
		}
	};
	
	


		
		

	
	
	this.wolfeLineSearch = function(a,pk) {
	/// searches along line 'pk' for a point that satifies the wolfe conditions
    /// See 'Numerical Optimization' by Nocedal and Wright p59-60
    /// f : objective function
    /// pk : search direction
    /// current: object containing current gradient/loss
    /// next: output: contains next gradient/loss
    /// returns a: step size taken
  //   function wolfeLineSearch(f, pk, current, next, a, c1, c2) {
	  
	    var current = {};
		var next = {};
		current.x = this.unrollThetas();
		current.fx = this.getCost('T');
		current.fxprime = this.unrollDerivs();
		if (pk) {
			
		}
		else {
		   pk = math.multiply(current.fxprime,-1);
		}
		//var a = this.alpha;
		var c1;
		var c2;
		
		var svdThis = this;
	  
		var phi0 = current.fx, phiPrime0 =  math.sum(math.dotMultiply(current.fxprime,pk)), //dot(current.fxprime, pk),
			phi = phi0, phi_old = phi0,
			phiPrime = phiPrime0,
			a0 = 0;

		a = a || 1;
		c1 = c1 || 1e-6;
		c2 = c2 || 0.1;

		function zoom(a_lo, a_high, phi_lo) {
			for (var iteration = 0; iteration < 16; ++iteration) {
				a = (a_lo + a_high)/2;
				next.x = math.add(current.x,math.multiply(pk,a));  //weightedSum(next.x, 1.0, current.x, a, pk);
			    svdThis.updateTheta(next.x);
			    phi = svdThis.getCost('T');
			    svdThis.backProp();       //phi = next.fx = f(next.x, next.fxprime);
			    next.fxprime = svdThis.unrollDerivs();
				phiPrime = math.sum(math.dotMultiply(next.fxprime,pk)); 
				svdThis.updateTheta(current.x);  //restore. Don't change in this routine, new value will be returned
				/*
				weightedSum(next.x, 1.0, current.x, a, pk);
				phi = next.fx = f(next.x, next.fxprime);
				phiPrime = dot(next.fxprime, pk);
				*/

				if ((phi > (phi0 + c1 * a * phiPrime0)) ||
					(phi >= phi_lo)) {
					a_high = a;

				} else  {
					if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
						return [a,next];
					}

					if (phiPrime * (a_high - a_lo) >=0) {
						a_high = a_lo;
					}

					a_lo = a;
					phi_lo = phi;
				}
			}

			return [0,next];
		}

		for (var iteration = 0; iteration < 10; ++iteration) {
			next.x = math.add(current.x,math.multiply(pk,a));  //weightedSum(next.x, 1.0, current.x, a, pk);
			svdThis.updateTheta(next.x);
			phi = svdThis.getCost('T');
			svdThis.backProp();       //phi = next.fx = f(next.x, next.fxprime);
			next.fxprime = svdThis.unrollDerivs();
			phiPrime = math.sum(math.dotMultiply(next.fxprime,pk));  //dot(next.fxprime, pk);
			svdThis.updateTheta(current.x);  //restore. Don't change in this routine, new value will be returned
			
			if ((phi > (phi0 + c1 * a * phiPrime0)) ||
				(iteration && (phi >= phi_old))) {
				return zoom(a0, a, phi_old);
			}

			if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
				return [a,next];
			}

			if (phiPrime >= 0 ) {
				return zoom(a, a0, phi);
			}

			phi_old = phi;
			a0 = a;
			a *= 2;
		}

		return [a,next];
		

		
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
		
		if (this.Y) { //N.B. will be no Y for predictions only
				var res = this.calcCost();
				this.Cost = res[0];
				this.RegCost = res[1];
		}
		
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
			var lay = new NNLayer(i+1,this.architecture[i],next,this.layers[i-1],ThMats[i],this.lambda);
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
 
 function NNLayer(layerNum,n,nextLayerN,prevLayer,InitThMat,lambda) {
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
     this.lambda = lambda;
	 
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
                this.Theta =  math.matrix(math.random([this.n + 1, this.nextLayerN],-0.2,0.2)); //was -0.5, 0.5 // -0.5,0.5)); //was 2  ///-1,1));
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

     this.calcRegDerivs = function() {
         var RegDeriv = math.map(this.Theta,function(el,ind) {
             if (ind[0] == 0) { //1st row
                 return 0;
             }
             else {
                 return el;
             }

         });

         RegDeriv = math.multiply(RegDeriv,this.lambda / this.A.size()[1]);

         return RegDeriv;

     };

     this.calcDerivs = function() {

      var ones = math.ones(1,this.A.size()[1]);
      this.AWithBias = math.concat(ones,this.A,0);

      this.Derivs = math.multiply(this.AWithBias,math.transpose(this.nextLayer.D));

      this.Derivs = math.multiply(this.Derivs,1 / this.A.size()[1]); //divide by m

      var RegDerivPart = this.calcRegDerivs();

      this.Derivs = math.add(this.Derivs,RegDerivPart);




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

           //this.D = math.matrix(matrixToArray(this.D,0)); //remove first row of 1s
		   this.D = mRemoveFirstRow(this.D); //vast improvement!

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


	 /** If ThMat supplied, update directly else use gd update
	 *
	 **/
	 
     this.updateTheta = function(alpha,ThMat) {
		 
		 if (ThMat) {
			this.Theta = ThMat;
		 }
		 else {
            this.DerivsAdj =  math.multiply(this.Derivs,alpha);

            this.Theta = math.subtract(this.Theta,this.DerivsAdj);
		 }

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