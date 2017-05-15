

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
  var rows = math.size(mat).valueOf()[0];
  for (var i = 0;i < rows;++i) {

	 if (i == rNum) {
		 continue;
	 }

     var row = mRow(mat,i);
	 var arEntry = [];
	 row.forEach(function(el,j) {
		if (j == cNum) {

		}
		else {
			arEntry.push(el);
		}
	 });
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
		  return [matrix.get([index])];
	  }
	
	  else {
		  	  if (retAsArray) {
				 return matrix._data;
			 }
			 else {
				 return matrix;
			 }
	  }
		  
	  

  }  
  var rows = math.size(matrix).valueOf()[0];
  var elements = math.subset(matrix, math.index(math.range(0,rows),index));
  if (retAsArray) {
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
  }
  else {
     return elements;
  
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
	
	accMatrix.forEach(function(el) {
		if (el == 0) {
			++correctNum;
		}
	});
	
	return [accMatrix,correctNum,Y.size()[0]];
	
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
function gdUpdate(Theta,X,Y,alpha,lambda,logisticFlag) {
    var Derivs = derivs(Theta,X,Y,lambda,logisticFlag);
	var adjDerivs = math.multiply(Derivs,alpha);
	var ThetaUpdated = math.subtract(Theta,adjDerivs);
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
 
function derivs(Theta,X,Y,lambda,logisticFlag) {
  
    var Xt = math.transpose(X);

	var errs = err(Theta,X,Y,logisticFlag);
    var Derivs = math.multiply(X,errs);
  
    var sz = Y.size();
    var m = sz[0];
	
	var RegPart = math.multiply(Theta,lambda);
	RegPart.set([0],0); // don't regularise theta0
	
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
				
		RegCost.set([0],0); //don't regularise theta0
		
		return RegCost;
	
}

/**
 *
 * @param Xt
 * @param Theta
 * @param Y
 * @param logisticFlag
 * @returns {*}
 */

function costFunction(Theta,X,Y,lambda,logisticFlag) {
	
	     var Cost;
		 
		 var m = Y.size()[0];
		 
		 if (logisticFlag) {
			 var H = h(Theta,X,logisticFlag);
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
	 
	    for (var i = 0;i < Y.size()[0];++i) {
			   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
				     var yVal  = YFactored.get([i]);
		             if (yVal == mlParams.currClassNum + 1) { //input class y vals are one based 
		                   yVal = 1;
		             }
		             else {
			               yVal = 0;
		             }
					 YFactored.set([i],yVal); //math.set(YFactored,[i],yVal);
					 
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
 A = math.multiply(A,Y);
 
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
			var ThetaUnscaledEntry =  Theta.subset(math.index(a)) / scaleFactors[a][1];
			ThetaUnscaled.push(ThetaUnscaledEntry);
			constAdj += (scaleFactors[a][0] * -1) / scaleFactors[a][1] * Theta.subset(math.index(a));
	}

	ThetaUnscaled.unshift(Theta.subset(math.index(0)) + constAdj);
	return math.matrix(ThetaUnscaled);


}

/**
 *
 * @param mlParams
 * @param progCallback
 * @returns {*}
 */
function learn(mlParams,X,Y,scaleFactors,progCallback) {
  
   var minCost = null;
   var minReg = null;
   var minCostSum = 99999999999999999999;
   var minTheta = [];
   
   var degrees = mlParams.degrees; //parseInt(elVal('degreesInput'));

   var res = featureScale(X);
   var XUnscaled = X;
   X = res[0];
   var scaleFactors = res[1];
   
   var YOrig = Y;
   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
	   Y = factorYForOneVsAll(mlParams,YOrig); 
   }
  
   var Xt = math.transpose(X);
   
   var m = Y.size()[0];
   var n = X.size()[0] -1;
   
   var logisticFlag = (mlParams.module == 'log');
   
   
   if (progCallback) {
       progCallback('outputBlog','<br>----------------------------------------------------------------------------------------');  
	   if (mlParams.diagnosticsFlag) {
          progCallback('diagnosticDiv',	'<br>-----------');   
	   }
       if (mlParams.numLogClasses > 2) {
		progCallback('outputBlog','<br>Training class: ' + (mlParams.currClassNum + 1));
	   }	   
	}
	
 
   var ThetaIdea,IdealCost;
   if ((mlParams.solveAnalytically) && (mlParams.module == 'reg')) {
       ThetaIdeal = solveAnalytically(math.transpose(XUnscaled),Y);
	   var d = 4;
	   if (progCallback) {
	        progCallback('outputBlog','<br>Ideal h(Theta) = ' +  math.subset(ThetaIdeal,math.index(0)).toFixed(d)); 
	    
            for (var i = 1;i < n+1;++i) {
			  progCallback('outputBlog',' + ' +  math.subset(ThetaIdeal,math.index(i)).toFixed(d) + 'x' + i); 
	        }
		}
	  IdealCost =  costFunction(ThetaIdeal,XUnscaled,Y,0,logisticFlag)[0];    //zero lambda
	  if (progCallback) {
	       progCallback('outputBlog','<br> Ideal Cost: ' + math.sum(IdealCost));
	      
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
		 return parseFloat(el);
	});
	
	
	var degrees = mlParams.degrees;//parseInt(elVal('degreesInput'));

	var Theta = math.matrix(startTheta);
	minTheta = Theta.clone();
		
		
	for (var i = 0;i < maxIters;++i) {
 
			var res =  costFunction(Theta,X,Y,lambda,logisticFlag);
			var Cost = res[0];
			var RegCost = res[1];
			
			++iterNum;
			
			if (i % 50 == 0) {
				if (progCallback) {
					progCallback('rightBannerDiv','Iter: ' + i + ' Cost: ' + (math.sum(Cost) + math.sum(RegCost)),true);
					var acc = accuracy(minTheta,X,Y);
					
					if (mlParams.numLogClasses > 2) {
						progCallback('rightBannerDiv','<br>Training class: ' + (mlParams.currClassNum + 1));
					}
					else {
						progCallback('rightBannerDiv','<br>');
					}
                    var perc  = (acc[1] / acc[2] * 100);
					progCallback('rightBannerDiv',' Accuracy: ' + acc[1] + '/' + acc[2] + ' (' + perc.toFixed(4) + '%)');
					
				}
			}
		//	if (i % 50 == 0) {
				costAr.push(math.sum(Cost) + math.sum(RegCost));
			 
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
					

					var minThetaUnscaled;
					if (mlParams.scalingFlag) {
					    minThetaUnscaled = thetaUnscale(minTheta,scaleFactors);
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
				  
			      progCallback('diagnosticDiv','<br><br> Iter: ' + i + ' Cost: ' +  (math.sum(Cost) + math.sum(RegCost)) );
				}
			}	
			
			
			
			if ((math.sum(Cost) + math.sum(RegCost)) > prevCost) {
				if ((math.sum(Cost) + math.sum(RegCost)) > prevMinus1Cost) { //check if going up twice in a row, just in case small rounding error
				   if (progCallback) {
				      progCallback('outputBlog','<br>Non Convergence. Try smaller alpha. ' + i + ' iterations');
					}
				   break;
				}
			}
			
			
			if ((prevCost - (math.sum(Cost) + math.sum(RegCost)) >= 0) && (prevCost - (math.sum(Cost) + math.sum(RegCost)) <  mlParams.convThreshold)) { 
				console.log('Converged after: ' + i);
				if (progCallback) {
				    progCallback('outputBlog','<br>Converged after: ' + i + ' iterations');
				}
				break;
			}	
			
			prevMinus1Cost = prevCost;
			
			prevCost = math.sum(Cost) + math.sum(RegCost);

			var res = gdUpdate(Theta,X,Y,alpha,lambda,logisticFlag);
			Theta = res[0];
			
			if  (mlParams.diagnosticsFlag) {
			    if (progCallback) {
				  progCallback('diagnosticDiv','<br>Grad: ' + res[1]);
				  progCallback('diagnosticDiv','<br>Theta: ' + Theta);
				}
			}

			if ( (math.sum(Cost) + math.sum(RegCost)) < minCostSum) {
				minCost = Cost;
				minReg = RegCost;
				minCostSum = math.sum(Cost) + math.sum(RegCost);
				minTheta = Theta;
			}
		
	}
	
	console.log('Cost: ' +  Cost + '\nTot cost: ' + (math.sum(Cost) + math.sum(RegCost)))	;
	
	if (progCallback) {
		progCallback('rightBannerDiv','Iter: ' + i + ' Cost: ' + (math.sum(Cost) + math.sum(RegCost)),true);
		var acc = accuracy(Xt,minTheta,Y);

		if (mlParams.numLogClasses > 2) {
		   progCallback('rightBannerDiv','<br>Training class: ' + (mlParams.currClassNum + 1));
		}
	    else {
		   progCallback('rightBannerDiv','<br>');
	    }
        var perc  = (acc[1] / acc[2] * 100);
	    progCallback('rightBannerDiv',' Accuracy: ' + acc[1] + '/' + acc[2] +  ' (' + perc.toFixed(4) + '%)');

      
					
	}
	
	
	var minThetaUnscaled;
    if (mlParams.scalingFlag) {
          minThetaUnscaled  = thetaUnscale(minTheta,scaleFactors);
	}
	else {
		minThetaUnscaled = minTheta.clone();
		
	}
	

	if (progCallback) {
		var g = minThetaUnscaled.get([0]);
		var h = math.subset(minThetaUnscaled,math.index(0));
		
		var gg = parseFloat(g);
		var aa = math.format(g,8);
		var bb = parseFloat(aa);
				
		var cc = h.toFixed(2);
		
		var d = 4;
		

	   progCallback('outputBlog','<br><br>Model h(Theta) = ' + math.subset(minThetaUnscaled,math.index(0)).toFixed(d));
  		for (var i = 1;i < n+1;++i) {
		   progCallback('outputBlog',' + ' + math.subset(minThetaUnscaled,math.index(i)).toFixed(d) + 'x' + i); //;minThetaUnscaled[i] + 'x' + i);
		}
			
	    progCallback('outputBlog','<br>Model Cost: ' + minCostSum);
	
		progCallback('outputBlog','<br>(scaled:  Model h(Theta) = ' + minTheta.subset(math.index(0)).toFixed(d));
	    for (var i = 1;i < n+1;++i) {
		   progCallback('outputBlog',' + ' + minTheta.subset(math.index(i)).toFixed(d) + 'x' + i);
		}
		progCallback('outputBlog',')');
			   progCallback('outputBlog','<br>Alpha: ' +  mlParams.alpha) ;

	}	
	
 	
	return [costAr,iters,ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors,YOrig];
    

}

function NeuralNetwork(architecture,X,Y,randomTheta) {
	this.architecture = architecture;
	this.numLayers = architecture.length;
	this.numInputFeatures = architecture[0];
	this.numOutputs = architecture[architecture.length-1];
	this.numHiddenLayers = this.numLayers - 2;
	this.X = X;
	this.Y = Y;
	this.randomTheta = randomTheta;
	
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
	
	this.forward = function() {
		
		for (var j = 0;j < this.layers.length;++j) {
			if (j == 0) { 
				this.layers[j].X = this.X;
				this.layers[j].A = math.matrix(matrixToArray(this.X,0)); //remove first row of 1s
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
				console.log(this.layers[j].singleMs());
			//}
			
		}
		
		//this.layers[this.layers.length - 1].X = math.clone(this.layers[this.layers.length - 2].A);

		
		
	};
	
	this.init = function() {
		
				

		for (var i = 0;i < this.numLayers;++i) {
			var next = i == this.numLayers -1 ? -1 : this.architecture[i+1];
			var lay = new NNLayer(i+1,this.architecture[i],next,this.layers[i-1],randomTheta);
			this.layers.push(lay);
			if (i == 0) {
				lay.X = this.X;
			}
			if (i == this.numLayers - 1) {
				lay.Y = this.Y;
			}
			
		}
		
	};
	
	this.init();
		
	
}
 
 function NNLayer(layerNum,n,nextLayerN,prevLayer,randomTheta) {
	 this.layerNum = layerNum;
	 this.n = n;
	 this.nextLayerN = nextLayerN;
	 this.Theta = null;
	 this.X = null; //input
	 this.Z = []; //intermediate
	 this.A = []; //output
	 this.prevLayer = prevLayer;
	 
	 
	 this.toString = function() {
	 return 'Layer num: ' + this.layerNum  + ' Features: ' + n + '\nTheta: ' + this.Theta + '\nX In: ' + this.X +  '\nZ: ' + this.Z + '\nA Out: ' + this.A;
	 };
	 
	 
	 this.init = function() {
		 
		 if (this.nextLayerN == -1) {
			 this.Theta = [];
		 }
		 else {

			if (randomTheta) {
                this.Theta =  math.matrix(math.random([this.n + 1, this.nextLayerN],-1,1));
			}
            else {			
		        this.Theta =  math.zeros(this.n + 1, this.nextLayerN);
			}
		 }
		 
		 /*
		 if (this.X.size()[0] == this.n + 1)  {
			 
		 }
		 else {
			 console.log('Error: num rows of X does not match architecture');
		 }
		 */
		 
		 
			 
		 
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
			 return 0;
		 }


		 var ins = mCol(this.A,m,true,true);
		 if (this.A.size().length == 1) {
			 return ins[0];
		 }
		 else {
			 return uNum == 0 ? 1 : ins[uNum - 1];

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