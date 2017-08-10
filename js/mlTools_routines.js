

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
 * @param s standard deviation
 * @returns {number} random number  nornally distributed with mean 0, stddev s
 */

function randn_bm(s) {
	var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
	var v = 1 - Math.random();
	return s * Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}


var pauseFlag = false;

/**
* Removes first row of matrix, returns new matrix
*/

function mRemoveFirstRow(mat) {
	
	if (mlParams.useMathjs) {
		
	}
	else {
		//use math.js format matrix for this routine
		//mat = math.matrix(mat.toArray());
		var newMat = numeric.clone(mat);
		newMat.shift();

		return newMat;
	}
	
	var newMat = math.subset(mat,math.index(math.range(1,mat.size()[0]),math.range(0,mat.size()[1])));
	
	if (mlParams.useMathjs) {
		return newMat;
	}
	else {
		return matCreate(matrixToArray(newMat));
	}
	
	
}


/**
*Routines to perform matrix manipulation.
*  Abstracted here so the matrix library used can be changed
*
*/
function matCreate(ar) {

    var mat;
	
    if (mlParams.useMathjs) {
		mat = math.matrix(ar);
	}
	else {
	  mat = matClone(ar); // Numeric just uses arrays!
	}
	
	return mat;
}

function matClone(mat) {

    return numeric.clone(mat);
    /*
    var newArray = mat.map(function(row) {
        return row.slice(0);
    });

    return newArray;
    */

}

function matStringify(mat) {
    if (mat instanceof Array) {
        return numeric.clone(mat);
    }
    else {
        return JSON.stringify(mat);
    }
    
    
}

function matAddEpsilon(mat) {
    var addFunc = numeric.pointwise(['x[i]'],'if (x[i] == 0)  x[i] = 1e-20;ret[i] = x[i];');
    var Added = addFunc(mat);
    return Added;

}

function matZeroFirstRow(mat) {
	var newMat = numeric.clone(mat);
	for (var c = 0;c < matCols(mat);++c) {
		newMat[0][c] = 0;
	}
	return newMat;


}

function matAbs(mat) {
	return numeric.abs(mat);
}

function matNot(mat) {
	return numeric.not(mat);
}

function matFlip(mat) {
	//0 -> 1, anything else  -> 0 pointwise
	var flipFunc = numeric.pointwise(['x[i]'],'ret[i] = x[i] == 0 ? 1 :  0;');
    return flipFunc(mat);	
}

function matTranspose(mat) {
	var matT;
	
	if (mlParams.useMathjs) {
		matT = math.transpose(mat);
	}
	else {
	   matT = numeric.transpose(mat);
	}
	
	return matT;
}

function matSum(mat) {

    if (mlParams.useMathjs) {
       return math.sum(mat);
	}   else {
		
       return numeric.sum(mat);
	}	
}

function matInverse(mat) {

   if (mlParams.useMathjs) {
      return math.inv(mat);
   }   
   else {
	 return numeric.inv(mat);
	   
   }
	
}

function matRand(dim,stdDev) {

	     var Th = matOnes(dim[0],dim[1]);
		 Th = matMultiplyBy(Th,stdDev);
		 var randFunc = numeric.pointwise(['x[i]'],'var r = randn_bm(x[i]);ret[i]=r;');
		 Th = randFunc(Th);
		 return Th;
}

function matOtherLog(mat) {
    var logFunc = numeric.pointwise(['x[i]'],'var l = 1 - x[i];if (l == 0)  l = 1e-20;ret[i] = math.log(l);');
    var OtherLog = logFunc(mat);
    return OtherLog;

}
function matLog(mat) {
    var logFunc = numeric.pointwise(['x[i]'],'var l = x[i];if (l == 0)  l = 1e-20;ret[i] = math.log(l);');
    var Log = logFunc(mat);
    return Log;
}

function matConcat(mat1,mat2,dim) {
	if (mlParams.useMathjs) {
		return math.concat(mat1,mat2,dim);
	}
	else {
		if (dim == 0) {
			/*
			var newMat = mat1.clone();
			newMat.data = newMat.data.concat(mat2.data);
			newMat.rows = mat1.rows + mat2.rows;
			return newMat;
			*/
			var newMat = mat1.concat(mat2);
			return newMat;

			}
		else {
			return mat1; // col concat not implemented
		}
		
	}
	
}

/**
* return new matrix with only first newRows rows and newCols columns
*/
function matReduce(mat,newRows,newCols) {
	if (mlParams.useMathjs) {
		return math.subset(mat,math.index(math.range(0,newRows),math.range(0,newCols)));
	}
	else {

		var newMat = numeric.getBlock(mat,[0,0],[newRows - 1,newCols - 1]);
		return newMat;
		
		
	}
	
}

function matZeros(r,c) {
	if (mlParams.useMathjs) {
		return math.zeros(r,c);
	}
	else {
		return numeric.rep([r,c],0);
	}
    
}


function matOnes(r,c) {
	if (mlParams.useMathjs) {
		return math.ones(r,c);
	}
	else {
		return numeric.rep([r,c],1);		
	}
	
}

/**
 * assumes 1 dim array only as input
 * @param mat
 * @param dim
 */
function matReshape(mat,dim) {

    var rows = dim[0];
    var cols = dim[1];

    var newMat =  numeric.rep(dim,0);
    mat.forEach(function(el,i) {
       var r = Math.floor(i / cols);
       var c = i - (r * cols);
        newMat[r][c] = el;
    });
    return newMat;


}

/*
function matSum(mat) {
	if (mlParams.useMathjs) {
		return math.sum(mat);
	}
	else {
		return mat.getSum();	
	}
}
*/

function matGet(mat,r,c) {
	if (mlParams.useMathjs) {
		return mat.get([r,c]);
	}
	else {
		return mat[r][c];
	}
	
}

function matSet(mat,r,c,val) {
	 if (mlParams.useMathjs) {
		 mat.set([r,c],val);
	 }
	 else {
		 mat[r][c] = val;
	 }
}

function matCount(mat,x) {
//counts occurences of x in mat
    var count = 0;
    mat.forEach(function(row) {
        row.forEach(function(col) {
           if (col == x) {
               ++count;
           }
        });
    });
    return count;
}

function matFlatten(mat) {

    var Flattened = [].concat.apply([], mat);
    return Flattened;

}

function matSubtract(mat1,mat2) {
	if (mlParams.useMathjs) {
		return math.subtract(mat1,mat2);
	}
	else {
		return numeric.sub(mat1,mat2);
	}
}

function matAdd(mat1,mat2) {
	if (mlParams.useMathjs) {
		return math.add(mat1,mat2);
	}
	else {
		return numeric.add(mat1,mat2);
	}
	
}

function matPow(mat,p) {
    return numeric.pow(mat,p);

}

function matSqrt(mat) {
    return numeric.sqrt(mat);

}

function matSquare(mat) {
	if (mlParams.useMathjs) {
		return math.square(mat);
	}
	else {
		return matDotMultiply(mat,mat);
	}
	
}
function matMultiply(mat1,mat2) {
	
	if (mlParams.useMathjs) {
		return math.multiply(mat1,mat2);
		
	}
	else {
		return numeric.dot(mat1,mat2);
	}
}

function matDotMultiply(mat1,mat2) {
	
	if (mlParams.useMathjs) {
		return math.dotMultiply(mat1,mat2);
	}
	else {
		return numeric.mul(mat1,mat2);
	}
}

function matMultiplyBy(mat1,x) {
	if (mlParams.useMathjs) {
		return math.multiply(mat1,x);
	}
	else {
        var MultAr = numeric.rep(numeric.dim(mat1),x);
		return numeric.mul(mat1,MultAr);
	}
}

function matPredict(mat) {
    var predFunc = numeric.pointwise(['x[i]'], 'ret[i] = x[i] > 0.5 ? 1 : 0;');
    var Pred = predFunc(mat);
    return Pred;

}

function matIsVector(mat) {
      if (mlParams.useMathjs) {
		  return  (mat.size().length == 1);
		  
     }
	 else {
		 if (mat instanceof Matrix) {
			 return false;
		 }
		 else {
             if (mat[0] instanceof Array) {
                 return false;
             }
             else {
                 return true;
             }
		 }
		 
	 }
}

function matRows(mat) {
	
	if (mlParams.useMathjs) {
		return mat.size()[0];
	}
	else {
		return mat.length;
	}
}

function matCols(mat) {
	
	if (mlParams.useMathjs) {
		return mat.size()[1];
	}
	else {
	   return mat[0].length;
	}
}

/**
 *
 * @param mat
 * @param rNum rownum to remove, optional
 * @param cNum colnum to remove, optional
 * @returns {Array}
 */
function matrixToArray(mat,rNum,cNum) {
   //No longer allows excluding rows or cols
    return matClone(mat);

   /*
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
  
  return ar
  */

}

/**
 *
 * @param matrix
 * @param index
 * @param retAsArray
 * @returns {*} matrix or array
 */
function mRow(matrix, index,retAsArray,assumeRowVector) {
	

    var mat = numeric.getBlock(matrix,[index,0],[index,matCols(matrix)-1]);
    
    if (retAsArray) { 
        //flatten
        return mat[0];
    }
    else {
        return mat;
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

    var mat = numeric.getBlock(matrix,[0,index],[matRows(matrix)-1,index]);

    if (retAsArray) {
        //flatten and return as row
        return matTranspose(mat)[0];
    }
    else {
        return mat;
    }
  
}

// ML routines

/**
 *
 * @param In
 * @returns {Matrix}
 */
function sigmoid(In) {
	var Out;
	
	if (mlParams.useMathjs) {

		Out = math.map(In,function(el) {
			
			var exp = Math.pow(Math.E,el * -1);	
			return  1 / (1 + exp);
			
		});
	}
	else {
		//Out = In.sigmoid();
        var sigm = numeric.pointwise(['x[i]'], 'var exp = Math.pow(Math.E,x[i] * -1);ret[i] = 1 / (1 + exp);');
        Out = sigm(In);

	}
	
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
	
	var accMatrix =  matSubtract(Y,pred);
	
	var correctNum = 0;
	
	var prec = null;
    var recall = null;
    var f1Score = null;
	
	//accMatrix.forEach(function(el) {
    /*
	var dummy = accMatrix.map(function(el) {	
		if (el == 0) {
			++correctNum;
		}
		return el;
	});
	*/
    correctNum = matCount(accMatrix,0);
	
	return [correctNum,matCols(Y),prec,recall,f1Score,accMatrix];
	
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
	//return math.map(H,function(el) {

    /*
	return H.map(function(el) {	
		return el >= 0.5 ? 1 : 0;
	});
	*/
    return matPredict(H);
	
	
}

/**
 *
 * @param Xt
 * @param Theta
 * @param logisticFlag
 * ZRet is a return parameter (array) holding Z in first element
 * @returns {*}
 */
function h(Theta,X,logisticFlag,ZRet) {
	if (logisticFlag) {
		var Z = matMultiply(matTranspose(Theta),X); //math.multiply(Theta,X);
		if (ZRet) {
		  ZRet[0] = Z; //return Z
		}
		return sigmoid(Z);
	}
    else {	
        return matMultiply(matTranspose(Theta),X); //math.multiply(Theta,X);
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
    return matSubtract(h(Theta,X,logisticFlag),Y);

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
    return matSquare(err(Theta,X,Y,logisticFlag));
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
function gdUpdate(ThetaT,X,Y,alpha,lambda,useMomentumFlag,useRMSPropFlag,useAdamFlag,Momentum,RMSProp,logisticFlag) {
    var Derivs = derivs(ThetaT,X,Y,lambda,logisticFlag);
	
	var adjDerivs;

	var newMomentum;
	if ((useMomentumFlag) || (useAdamFlag)) {
		
		if (Momentum) {
			newMomentum = matAdd(matMultiplyBy(Derivs,0.1),matMultiplyBy(Momentum,0.9));
		}
		else {
			newMomentum = matClone(Derivs); //first time
		}	
	}
	
	
	if (useMomentumFlag) {
	
		adjDerivs = matMultiplyBy(newMomentum,alpha);
	}
		
	else if ((useRMSPropFlag) || (useAdamFlag))	 {
		    var newRMSProp;
			if (RMSProp) {
				newRMSProp = matAdd(matMultiplyBy(matDotMultiply(Derivs,Derivs),0.1),matMultiplyBy(RMSProp,0.9));
			}
			else {
				newRMSProp = matClone(Derivs); //first time
				newRMSProp = matDotMultiply(newRMSProp,newRMSProp);
			}
            var newRMSPropSqrtInv =  matSqrt(newRMSProp);
            newRMSPropSqrtInv = matAddEpsilon(newRMSPropSqrtInv);
            newRMSPropSqrtInv = matPow(newRMSPropSqrtInv,-1);
            newRMSPropSqrtInv = matMultiplyBy(newRMSPropSqrtInv,alpha);

			//var newRMSPropSqrtInv = newRMSProp.map(function(el) {
			//	return alpha / Math.sqrt(el);
			//});
			adjDerivs = useAdamFlag ? matDotMultiply(newMomentum,newRMSPropSqrtInv) : matDotMultiply(Derivs,newRMSPropSqrtInv);
	}	
	else {
	   adjDerivs = matMultiplyBy(Derivs,alpha);
	}		
		
	
		
	var ThetaUpdated = matSubtract(matTranspose(ThetaT),adjDerivs);
	return [ThetaUpdated,Derivs,newMomentum,newRMSProp];
	
	
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
  
    var Xt = matTranspose(X); //math.transpose(X);
	
	var Th = matTranspose(ThetaT);

	var errs = err(Th,X,Y,logisticFlag);
    var Derivs = matMultiply(X,matTranspose(errs));
  
    //var sz = Y.size();
    //var m = sz[1];
	var m = matCols(Y);
	
	var RegPart = matMultiplyBy(Th,lambda);
		
	//RegPart.set([0,0],0); // don't regularise theta0
	if (mlParams.useMathjs) {	
				RegPart.set([0,0],0); //don't regularise theta0
	}
	else  {
        matSet(RegPart,0,0,0);
        /*
			RegPart = RegPart.eleMap(function(el,row,col) {
				if ((row == 0) && (col == 0)) {
					return 0;
				}
				else {
					return el;
				}
			});
			*/
	}


	
	
	Derivs = matAdd(Derivs,RegPart);
    Derivs = matMultiplyBy(Derivs,1 / m);
   
    return Derivs;
    
}

/**
* cost of regularisation term
*/
function regCost(Theta,lambda,m) {
		var RegCost = matSquare(Theta);
		RegCost = matMultiplyBy(RegCost,(lambda / (2 * m)));
			
		if (mlParams.useMathjs) {	
				RegCost.set([0,0],0); //don't regularise theta0
		}
		else {
            /*
			RegCost = RegCost.eleMap(function(el,row,col) {
				if ((row == 0) && (col == 0)) {
					return 0;
				}
				else {
					return el;

				}
			});
			*/
            matSet(RegCost,0,0,0);
		}
			
		
				
				
		
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
		 if (matIsVector(Y)) { //vector
		    m = matRows(Y); //Y.size()[0];
		 }
		 else {
			m =  matCols(Y); //Y.size()[1];
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
			 
			 
			 //var LogH = math.map(H,function(el) {

            LogH =  matLog(H);
             /*
			var LogH = H.map(function(el) {	 
				 if (el == 0) {
					 return math.log(1e-20);
				 }
				 else {
				   return math.log(el);
				 }
			 });
			 */
			 
			 var Cost1 = matDotMultiply(Y,LogH); //math.dotMultiply(Y,LogH);
             Cost1 = matMultiplyBy(Cost1,-1); //math.multiply(Cost1,-1);			 

			 //var OtherLogH = math.map(H,function(el) {

             var OtherLogH = matOtherLog(H);
             /*
		     var OtherLogH = H.map(function(el) {	 
				 if (1 - el == 0) {
					 return math.log(1e-20);
				 }
				 else {
				     return math.log(1 - el);
				 }
			 });
			 */
			 
			 //var OtherY = math.map(Y,function(el) {
             var OtherY = matMultiplyBy(Y,-1);
             OtherY = matAdd(OtherY,1);
             /*
			 var OtherY = Y.map(function(el) {	 
				 return 1 - el;
			 });
			 */
			 
			 var Cost2 = matDotMultiply(OtherY,OtherLogH); //math.dotMultiply(OtherY,OtherLogH);
			 
			 var RegCost = regCost(Theta,lambda,m);
			 
			 return [matMultiplyBy((matSubtract(Cost1,Cost2)),1 / m),RegCost];
			 
		 }
		 else {
            var SqErrCost = sqErr(Theta,X,Y);
			
			var RegCost = regCost(Theta,lambda,m);
			
		    Cost = matMultiplyBy(SqErrCost,1 / (2 * m));   
		 }
         var	 costSum = matSum(Cost) + matSum(RegCost);
		 
         return [Cost,RegCost];

 }

 /**
 * scale factors indexes: 0-mean, 1-range, 2-lowest. If scaleFactors passed then uses these to scale, otherwise calcs scalefactors as well as scaling
 * @param mat
 * @returns {*}
 */
 function featureScale(mat,inScaleFactors) {
	 
   //var scaledMat = math.subset(mat,math.index(0,math.range(0,mat.size()[1]))); //mRow(mat,0); 
   var scaledMat = []; // =  matrixToArray(math.flatten(mRow(mat,0)));
   
   
   var rows = matRows(mat); //mat.size()[0];
   var cols = matCols(mat); //mat.size()[1];
   var scaleFactors = [];
   scaleFactors.push([1,0,1]);
   console.log('starting scale loop');

   var row = [];
   
  // mat.forEach(function(el,ind) {


   //var dummy = mat.eleMap(function(el,r,c) {
   for (var r = 0;r < matRows(mat);++r ) {
       //var ind = [r,c];
   
       
	   /*
	   if (ind[1] == 0) {
		   row = [el];
	   }
	   else {
		   row.push(el);
	   }
	   */
       var row = mRow(mat,r,true);
	   
	   //if (ind[1] == matCols(mat)  - 1){
		   
		   
		   if (r == 0) { //first row
		   
		   }
		   else {
		   
	   
			   //for (var r = 1;r < rows;++r) {
			   //don't scale 1st feature, ie r = 0, as this is always 1
			
			   //var row = mRow(mat,r);
			   
			   var min = math.min(row);
			   var max = math.max(row);
			   var range = max - min;
			   var mean = math.mean(row);
			   
			   scaleFactors.push([mean,range,min]);
		   
		   
			   }
	   //}
	   
	  //return el;
	   
		      
		   
	   
   }
   
  
   
   
   //scaledMat = mat.map(function(el,ind) {
	//scaledMat = mat.eleMap(function(el,row,col) {
    for (var r = 0;r < matRows(mat);++r) {

          //var ind = [row, col];
          //var r = ind[0];

          var newEl;

          var min, max, range, mean, lowest;

          var row = mRow(mat,r,true);

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
              scaledMat.push(row);
          }
          else {
            var scaledRow = [];
            for (var c = 0;c < matCols(mat);++c) {
                var el = row[c];
                newEl = el - mean;
                newEl = (range > 0) ? newEl / range : newEl;

                //return newEl;
                scaledRow.push(newEl);
            }
            scaledMat.push(scaledRow);
          }


	   
	}
	   
  
   
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
 
 /**
 *
 */ 
function crossValidateOrTest(testFlag,X,Y,ThetaUnrolled,mlType,scaleFactors,arch,lambda) {

    if (X == null){
		return [0,''];
	}
	
	var costCVExReg = 0;
	
	var res = featureScale(X,scaleFactors);
	var XScaled = res[0];

//      applyInput();
	 
	  var predAr = [];
	  
	  if (mlType === 'neu') {
		  
     	  var ThAr = matrixToArray(ThetaUnrolled);
		  var ThStr = arrayToString(ThAr);
	  
		  var mlNNCV = new NeuralNetwork(arch,XScaled,Y,X,scaleFactors,0,lambda,ThStr);
		  mlNNCV.forward();
		  
		  var A = mlNNCV.layers[mlNNCV.layers.length - 1].A;
	
		  
		  var predStr = '';
		 
		  for (i = 0;i < matCols(A);++i) {
			  predStr = '';
			  for (var r = 0;r < matRows(A);++r) {
				  predStr += matGet(A,r,i).toFixed(3);
				  if (r < matRows(A) - 	1) {
					 predStr += ' ';
				  }			  
			  }
			  predAr.push(predStr);
			  
		  }
		  
		  var res = mlNNCV.checkAccuracy();
		  var perc = res[0] / res[1] * 100;
		  
		  costCVExReg = matSum(mlNNCV.getCost('C'));

          var str = (testFlag === 'C') ? 'CV Cost: ' : 'Test Cost: ';
		  str += mlNNCV.getCost('T') + '(exReg: ' + costCVExReg.toFixed(3)  + ')' +  ' Acc: '  + res[0] + '/' + res[1] + ' ' + perc.toFixed(3) + '%';
//		  el('cvBannerDiv').innerHTML = str;  //+ mlNNCV.getCost('T') + '(exReg: ' + matSum(mlNNCV.getCost('C')).toFixed(3)  + ')' +  ' Acc: '  + res[0] + '/' + res[1] + ' ' + perc.toFixed(3) + '%';
          //updateLog(str + mlNNCV.getCost('T') + '(exReg: ' + matSum(mlNNCV.getCost('C')).toFixed(3)  + ')' +  ' Acc: '  + res[0] + '/' + res[1] + ' ' + perc.toFixed(3) + '%');	
		  return [costCVExReg,str];
	  }
	  
	  else {

		
		var P;
		if (mlParams.module === 'log') {
		   P =  predict(ThetaUnrolled,XScaled); 
		}
		else {
		  P = h(ThetaUnrolled,XScaled);	
		}
		
		predAr = mRow(P,0,true);
		predAr = predAr.map(function(el) {
			return el.toFixed(3);
		});
		
		var res = costFunction(ThetaUnrolled,XScaled,Y,lambda,mlType);
		costCVExReg = matSum(res[0]);
		var totCVCost   = matSum(res[0]) + matSum(res[1]);
		
		var str = (testFlag === 'C') ? 'CV Cost: ' : 'Test Cost: ';
		str += totCVCost + '(exReg: ' + costCVExReg.toFixed(3)  + ')'  // + ' Acc: '  + res[0] + '/' + res[1] + ' ' + perc.toFixed(3) + '%';
		//el('cvBannerDiv').innerHTML = str;  //+ mlNNCV.getCost('T') + '(exReg: ' + matSum(mlNNCV.getCost('C')).toFixed(3)  + ')' +  ' Acc: '  + res[0] + '/' + res[1] + ' ' + perc.toFixed(3) + '%';
        //updateLog(str + mlNNCV.getCost('T') + '(exReg: ' + matSum(mlNNCV.getCost('C')).toFixed(3)  + ')' +  ' Acc: '  + res[0] + '/' + res[1] + ' ' + perc.toFixed(3) + '%');	
		return [costCVExReg,str];
        
		
		
	  }
	  
		  
		  
	  
	
}

 
 function factorYForOneVsAll(mlParams, Y) {
	 
	    var YFactored = matClone(Y);
	 
	    for (var i = 0;i < matCols(Y);++i) {
			   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
				     var yVal  =  matGet(YFactored,0,i); //YFactored.get([0,i]);
		             if (yVal == mlParams.currClassNum + 1) { //input class y vals are one based 
		                   yVal = 1;
		             }
		             else {
			               yVal = 0;
		             }
					 matSet(YFactored,0,i,yVal); //YFactored.set([0,i],yVal); //math.set(YFactored,[i],yVal);
					 
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
  
   retu	rn [X,Y, XUnscaled,scaleFactors,YOrig];   
 
 }
 */
 
 function solveAnalytically(X,Y) {
 
 var Xt = matTranspose(X); //math.transpose(X);

 var A = matMultiply(Xt,X); //math.multiply(Xt,X);
 
 A = matInverse(A); //math.inv(A);
 
 A = matMultiply(A,Xt); //math.multiply(A,Xt);
 
 A = matMultiply(A,matTranspose(Y)); //math.multiply(A,math.transpose(Y));
 
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
	
	var n = matRows(Theta) - 1;
	
	var firstElements = [];

    /*
	var dummy = Theta.eleMap(function(el,row,col) {
		if (col == 0) {
			firstElements.push(el);
		}
		
		return el;
	});
	*/
    firstElements = mCol(Theta,0,true);
	
	for (var a = 1;a < n+1;++a) {
			//var ThetaUnscaledEntry =  Theta.subset(math.index(a,0)) / scaleFactors[a][1];
			var ThetaUnscaledEntry =  firstElements[a] / scaleFactors[a][1];
			ThetaUnscaled.push(ThetaUnscaledEntry);
			constAdj += (scaleFactors[a][0] * -1) / scaleFactors[a][1] *  firstElements[a]; //Theta.subset(math.index(a,0));
	}

	//ThetaUnscaled.unshift(Theta.subset(math.index(0,0)) + constAdj);
	ThetaUnscaled.unshift(firstElements[0] + constAdj);
	
	ThetaUnscaled = ThetaUnscaled.map(function(el) {
		return [el];
	});
	return matCreate(ThetaUnscaled); //math.matrix(ThetaUnscaled);


}


function getDashboardInfo(mlParams,nn,iterNum,alpha,minTheta,minThetaUnscaled,X,Y,n,Cost,RegCost,errMsg) {
	
	var d = 4; //dec places
	
	var dashInfo = '';
	
	dashInfo += 'Epoch: ' +  iterNum +  ' Cost: ' + (matSum(Cost) + matSum(RegCost)) + ' (exReg: ' + matSum(Cost).toFixed(3)  + ')' + ' Alpha: ' + alpha.toFixed(3) + '<br>';
	
	
	if ((mlParams.module === 'log') && (mlParams.numLogClasses > 2)) {
		dashInfo += 'Training class: ' + (mlParams.currClassNum + 1);
		
	}
	
	
	if ((mlParams.module == 'log') || (mlParams.module == 'neu')) {
		var num = 0;var dem = 1;
		
		if (mlParams.module == 'log') {
			var acc = accuracy(minTheta,X,Y);
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
		   var firstElements = mCol(minThetaUnscaled,0,true);
		   
			dashInfo += '<br>Model h(Theta) = ' +  firstElements[0].toFixed(d); //math.subset(minThetaUnscaled,math.index(0,0)).toFixed(d);
			
			for (var i = 1;i < n+1;++i) {
			     dashInfo += ' + ' + firstElements[i].toFixed(d) + 'x' + i; //math.subset(minThetaUnscaled,math.index(i,0)).toFixed(d) + 'x' + i;
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
	
	Momentum = cData.Momentum;
	RMSProp = cData.RMSProp;
	
	n = cData.n;
	
	iters = cData.iters;
	costAr = cData.costAr;
	costArCV = cData.costArCV;
	
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
			   progCallback('diagnosticDiv','<br><br>Model h(Theta) = ' + matGet(ThetaUnscaled,0,0).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + matGet(ThetaUnscaled,i,0).toFixed(d) + 'x' + i); 
				}
					
				progCallback('diagnosticDiv','<br>Model Cost: ' + currCostSum);
			
				progCallback('diagnosticDiv','<br>(scaled:  Model h(Theta) = ' + matGet(Theta,0,0).toFixed(d));
				for (var i = 1;i < n+1;++i) {
				   progCallback('diagnosticDiv',' + ' + matGet(Theta,i,0).toFixed(d) + 'x' + i);
				}
				progCallback('diagnosticDiv',')');
				progCallback('diagnosticDiv','<br>Alpha: ' +  mlParams.alpha) ;
			}

		}
		
	}	
	
 	
	return [costAr,iters,ThetaIdeal,IdealCost,X,Y,Theta,XUnscaled,ThetaUnscaled,scaleFactors,YOrig,costArSparse,itersSparse,costArCV];
    
	
}


function learnLoop(curr,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig,Xcv,Ycv) {
	++curr;
	
/*
	if (pauseFlag) {
		
		break;
		
	}
*/	
	var errMsg = '';
	
	
	if (progCallback && (mlParams.useConjugateGradientDriver || mlParams.sgdFlag)) {
		progCallback('subProgressDiv','Start epoch',true);
	}

	
	
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
	
	Momentum = cData.Momentum;
	RMSProp = cData.RMSProp;
	
	n = cData.n;
	
	iters = cData.iters;
	costAr = cData.costAr;
	costArCV = cData.costArCV;
	
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
	
	
	if (progCallback && (mlParams.useConjugateGradientDriver || mlParams.sgdFlag)) {
		progCallback('subProgressDiv','Calcing cost',true);
	}
	
	if (mlParams.module == 'neu') {
		nn.forward();
		Cost = nn.getCost('CM');
		RegCost = nn.getCost('RM');
		
	}
	else {
		var res =  costFunction(Theta,X,Y,mlParams.lambda,mlParams.module);
		Cost = res[0];
		RegCost = res[1];
		
	}

	
	currCostSum = matSum(Cost) + matSum(RegCost);
	
	
	
	
	console.log('iter: ' + curr);
	var counterUpdate = 2;
	var graphUpdate = 10;
	
	if ((mlParams.useLineSearchDriver || mlParams.useConjugateGradientDriver) || mlParams.sgdFlag) {
		counterUpdate = 1;
		
	}
	
	var cvRes = [];
		
	if (mlParams.module === 'neu') {
		cvRes = crossValidateOrTest('C',Xcv,Ycv,nn.unrollThetas(),mlParams.module,nn.scaleFactors,nn.architecture,nn.lambda);
	
	}
	else {
		cvRes = crossValidateOrTest('C',Xcv,Ycv,Theta,mlParams.module,scaleFactors,null,mlParams.lambda);
	}
	
	if (curr % counterUpdate == 0) {
		
		
	  	if (progCallback) {
		   if (mlParams.useConjugateGradientDriver || mlParams.sgdFlag) {
		      progCallback('subProgressDiv','Getting dashinfo',true);
	       }
			
			var dashInfo = getDashboardInfo(mlParams,nn,curr,alpha,Theta,ThetaUnscaled,X,Y,n,Cost,RegCost,errMsg);
			progCallback('rightBannerDiv',dashInfo,true);
				
		}
		
		var str;
		
		if (mlParams.useConjugateGradientDriver) {
		      progCallback('subProgressDiv','Cross validating',true);
	    }
		
	
		progCallback('cvBannerDiv',cvRes[1],true);
		progCallback('logDiv',dashInfo + ' \n' + cvRes[1]); //console.log('str: ' + str);
	}

	costAr.push(currCostSum);   //(math.sum(Cost) + math.sum(RegCost));
	iters.push(curr);
	costArCV.push(cvRes[0]);


	if (curr % graphUpdate == 0) {
		if (progCallback) {
			
		   if (mlParams.useConjugateGradientDriver || mlParams.sgdFlag) {
		      progCallback('subProgressDiv','Prepare graph update',true);
	       }
			
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
			  progCallback('chart',[costArRed,itersRed,ThetaIdeal,IdealCost,X,Y,Theta,XUnscaled,ThetaUnscaled,scaleFactors,null,costArSparse,itersSparse,costArCV]);
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
	
	prevTheta = matClone(Theta); //Theta.clone();
//		prevMinTheta = minTheta.clone();
	prevThetaUnscaled = matClone(ThetaUnscaled);

	var logisticFlag = (mlParams.module == 'log');
	
	var Xsvd,Ysvd,nnsvd, XTAr, YTAr; //used for SGD
	var numBatches;
	
	if (mlParams.sgdFlag) {
		XTAr = matrixToArray(matTranspose(X));
		YTAr = matrixToArray(matTranspose(Y));
		numBatches = matCols(X) % mlParams.sgdBatchSize == 0 ? matCols(X)  / mlParams.sgdBatchSize : Math.ceil(matCols(X)  / mlParams.sgdBatchSize);
		Xsvd = matClone(X);
		Ysvd = matClone(Y);
	}
	else {
		numBatches = 1;
	}
	
	for (var b = 0;b < numBatches;++b) {
		var bPl = b + 1;
		
		if (numBatches == 1) {
			
			
		}
		else {
			
			if ((progCallback) && (mlParams.sgdFlag)) {
				progCallback('subProgressDiv','Batch ' + bPl + ' Start',true);
			}
			
			var thisBatchFrom = b * mlParams.sgdBatchSize;
			var thisBatchTo   = (b+1) * mlParams.sgdBatchSize;
			X = matTranspose(matCreate(XTAr.slice(thisBatchFrom,thisBatchTo)));
			Y = matTranspose(matCreate(YTAr.slice(thisBatchFrom,thisBatchTo)));
		}
		
		if (mlParams.module == 'neu') {
			nn.backProp();
			if (mlParams.useLineSearchDriver) {
				var res = nn.wolfeLineSearch();
				alpha = res[0];
				nn.alpha = res[0];
				nn.updateTheta(res[1].x);
				
			}
			else if (mlParams.useConjugateGradientDriver) {
				if (progCallback) {
					progCallback('subProgressDiv','Batch ' + bPl + ' Start conj',true);
				}
						
				var res = nn.conjugateGradientStep(nn.pk,bPl,mlParams.useMomentumDriver,mlParams.useRMSPropDriver);
		
				if (progCallback) {
					progCallback('subProgressDiv','Batch ' + bPl + ' End conj',true);
				}	
				
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
				nn.updateTheta(null,mlParams.useMomentumDriver,mlParams.useRMSPropDriver,mlParams.useAdamDriver);
			}
			//nn.gradientCheck(); uncomment if checking gradient manually
			Theta = nn.unrollThetas();
		}
		else {
		   var res = gdUpdate(matTranspose(Theta),X,Y,alpha,mlParams.lambda,mlParams.useMomentumDriver,mlParams.useRMSPropDriver,mlParams.useAdamDriver,Momentum,RMSProp,logisticFlag);
		   Theta = res[0];
		   Momentum = res[2];
		   RMSProp = res[3];
		}
		
		if (numBatches == 1) {
			
			
		}
		else {
			
			if ((progCallback) && (mlParams.sgdFlag)) {
				progCallback('subProgressDiv','Batch ' + bPl + ' End',true);
			}
		}
	}
	
	if (mlParams.sgdFlag) { //restore full set
		X = Xsvd;
		Y = Ysvd;
	}
	
	
	if  (mlParams.diagnosticsFlag) {
		if (progCallback) {
		  //progCallback('diagnosticDiv','<br>Grad: ' + res[1]);  //uncomment if showing gradient per m
		  //progCallback('diagnosticDiv','<br>Theta: ' + Theta); //uncomment if showing theta per m
		}
	}
	
	
	
	if (mlParams.module == 'neu') {
		   //TODO Need to implement unscaling for neural network
		   ThetaUnscaled = matClone(Theta);
	}
	else {
			if (mlParams.scalingFlag) {
				ThetaUnscaled  = thetaUnscale(Theta,scaleFactors);
			}
			else {
				ThetaUnscaled = matClone(Theta);
			}
	}
	
	
	if (progCallback && (mlParams.useConjugateGradientDriver || mlParams.sgdFlag)) {
		progCallback('subProgressDiv','End epoch',true);
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
	
	cData.Momentum = Momentum;
	cData.RMSProp = RMSProp;
	
	cData.nn = nn;
	
	cData.Theta = Theta;
	
	cData.XUnscaled = XUnscaled;
	cData.ThetaUnscaled = ThetaUnscaled;
	cData.scaleFactors = scaleFactors;
	
	cData.n = n;
	
	cData.iters = iters;
	cData.costAr = costAr;
	cData.costArCV = costArCV;
	
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
			msg.ThetaIdeal = matStringify(res[2]); //JSON.stringify(res[2]);
			msg.IdealCost = matStringify(res[3]); //JSON.stringify(res[3]);
			//msg.X = JSON.stringify(res[4]); //No longer return this
			msg.Y = matStringify(res[5]); //JSON.stringify(res[5]);
			msg.minTheta = matStringify(res[6]); //JSON.stringify(res[6]);
			//msg.XUnscaled = JSON.stringify(res[7]); //No longer return this
			msg.minThetaUnscaled = matStringify(res[8]); //JSON.stringify(res[8]);
			//msg.scaleFactors = res[9];//JSON.stringify(res[9]); //No longer return this
			//msg.YOrig = JSON.stringify(res[10]); No longer return this
			msg.costArSparse = res[11];
			msg.itersSparse = res[12];
			msg.costArCV = res[13];
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
			learnLoop(curr,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig,Xcv,Ycv);
		},0);
	}
		
	
}


/**
 *
 * @param mlParams
 * @param progCallback
 * @returns {*}
 */
function learn(mlParams,X,Y,progCallback,continueData,scaleFactors,XUnscaled,Xcv,Ycv) {
  
   var minCost = null;
   var minReg = null;
   var minCostSum = 99999999999999999999;
 //  var minTheta = [];
 
   var PrevCost;
   var PrevRegCost;
   
   var PrevMinus1Cost;
   var PrevMinus1RegCost;
   
   var degrees = mlParams.degrees; //parseInt(elVal('degreesInput'));

   //var scaleFactors;  //now passed in
   
   //var XUnscaled = X; //now passed in
   
   //if (mlParams.scalingFlag) {
	  
	  
    /*	  
    var res = featureScale(X);
    scaleFactors = res[1];
	
	if (mlParams.scalingFlag) {
		 X = res[0];
	}
	*/
	  
  // }
   
   
   var YOrig = Y;
   if ((mlParams.module == 'log') && (mlParams.numLogClasses > 2) && (mlParams.currClassNum > -1)) {
	   Y = factorYForOneVsAll(mlParams,YOrig); 
   }
  
   var Xt = matTranspose(X); //math.transpose(X);
   
   var m = matCols(Y); //Y.size()[1];
   var n = matRows(X) -1;
   
   var logisticFlag = (mlParams.module == 'log');
   
   var pk = null; //used by conjugate gradient
   
   
   if (progCallback) {
 	   if (mlParams.diagnosticsFlag) {
          progCallback('diagnosticDiv',	'<br>-----------');   
	   }
	
	}
	
 
   var ThetaIdeal,IdealCost;
   if ((mlParams.solveAnalytically) && (mlParams.module == 'reg')) {
       ThetaIdeal = solveAnalytically(matTranspose(XUnscaled),Y);
	   var d = 4;
	   if (progCallback) {
		   if (mlParams.diagnosticsFlag) {
	           progCallback('diagnosticDiv','<br>Ideal h(Theta) = ' +  matGet(ThetaIdeal,0,0).toFixed(d)); 
	    
               for (var i = 1;i < n+1;++i) {
			      progCallback('diagnosticDiv',' + ' +  matGet(ThetaIdeal,i,0).toFixed(d) + 'x' + i); 
	           }
		   }
		}
	  IdealCost =  costFunction(ThetaIdeal,XUnscaled,Y,0,mlParams.module)[0];    //zero lambda
	  if (progCallback) {
		   if (mlParams.diagnosticsFlag) { 
	          progCallback('diagnosticDiv','<br> Ideal Cost: ' + matSum(IdealCost));
		   }
	      
		}   
   }
   else {
	   IdealCost = matCreate([0,0]); //math.matrix([0,0]);
	   ThetaIdeal = matCreate([0,0]); //math.matrix([0,0]);
		
   }
   
   
   
   var iters = [];
   var costAr = [];
   var costArCV = [];
   
   var itersSparse = [];
   var costArSparse = [];

    var maxIters = mlParams.maxIterations;

    if (continueData) {
	   iters = continueData[0];
	   costAr = continueData[1];
	   itersSparse = continueData[2];
	   costArSparse = continueData[3];
       if (continueData[5] === 'F') {
           maxIters+= iters.length; //if fully finished last time, then continues for another maxiters
       }
	   costArCV = continueData[4];
   }

   var iterNum = iters.length;
   
   var alpha = mlParams.alpha; 
   var lambda = mlParams.lambda;
   


    var prevCostSum = 9999999999999999999;
	var prevMinus1CostSum = 9999999999999999999;
	var currCostSum = 9999999999999999999;
	
	var Theta;
	
	var prevTheta, prevThetaUnscaled;
	
	var Momentum, RMSProp;
	
	
	var nn;
   
    if (mlParams.module == 'neu') {
		
		 var arch = (mlParams.architecture.length  == 0) ? [matRows(X) - 1,matRows(X)+1,matRows(Y)] : mlParams.architecture;

         nn = new NeuralNetwork(arch,X,Y,XUnscaled,scaleFactors,mlParams.alpha,mlParams.lambda,mlParams.initTheta,progCallback);
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

		Theta = matCreate(startTheta); //math.matrix(startTheta);
	}
	
//	minTheta = Theta.clone();
	

	var ThetaUnscaled;
	if (mlParams.module == 'neu') {
		//TODO Need to implement unscaling for neural network
		ThetaUnscaled = matClone(Theta);
	}
	
	else {
	
		if (mlParams.scalingFlag) {
			ThetaUnscaled = thetaUnscale(Theta,scaleFactors);
		}
		else {
			ThetaUnscaled = matClone(Theta);		}
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
	
	cData.Momentum = Momentum;
	cData.RMSProp = RMSProp;
	
	cData.n = n;
	
	cData.iters = iters;
	cData.costAr = costAr;
	cData.costArCV = costArCV;
	
	cData.itersSparse = itersSparse;
	cData.costArSparse = costArSparse;
	
	cData.ThetaIdeal = ThetaIdeal;
	cData.IdealCost = IdealCost;
	
	cData.alpha = mlParams.alpha;
	
	cData.pk = pk;
	
// end set up loop curr data
	
	learnLoop(iterNum,maxIters,mlParams,X,Y,progCallback,continueData,cData,YOrig,Xcv,Ycv);
	
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

function NeuralNetwork(architecture,X,Y,XUnscaled,scaleFactors,alpha,lambda,initTheta,progCallback) {
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
    
    this.isVisual = false;
    if (matRows(this.X) == 785) {
        //assume MNIST
        this.isVisual = true;
    }
	
	this.randomTheta = true;
	
	this.initTheta = initTheta;

	if ((initTheta) && (initTheta.length > 0)) {
		this.randomTheta = false;
	}
		
		
	this.progCallback = progCallback;	
	
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
			if (mlParams.useMathjs) {
			   ThArUnrolled = matrixToArray(ThVec); //actually a vector
			}
			else {
			   ThArUnrolled = mCol(ThVec,0,true); //ThVec.data[0];  //actually a 1 dim row matrix (or is it col matrix?)
			}
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
				var thMat;
				if (mlParams.useMathjs) {
					thMat = math.matrix(thAr);
					thMat = math.reshape(thMat,[thRows,thCols]);
				}
				else {

					//thMat = Matrix.reshapeFrom(thAr,thRows,thCols);
                    thMat = matReshape(thAr,[thRows,thCols]);
					
				}
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

        if (matRows(Y) == 1) { //binary
            //P.forEach(function(el,i) {
			var PRow = mRow(P,0,true); //only 1 row in binary	
			//var dummy = P.eleMap(function(el,r,c) {
            PRow.forEach(function(el,c) {
				var r = 0;
			   //var ind = [r,c];

               if ((el == 0)  && (matGet(Y,r,c) == 0)) {
                   PosNeg.push([0,0,1,0]); // true neg
               }
               else if ((el == 0)  && (matGet(Y,r,c) == 1)) {
                   PosNeg.push([0,0,0,1]); // false neg
               }
               else if ((el == 1)  && (matGet(Y,r,c) == 0)) {
                    PosNeg.push ([0,1,0,0]); // false pos
                }
                else  {
                    PosNeg.push([1,0,0,0]); // true pos
                }

				return el;
            });

            var PosNegSum = matMultiply(matOnes(1,matCols(Y)),PosNeg);

            if (matGet(PosNegSum,0,0) + matGet(PosNegSum,0,1) == 0) {
                prec = 0;
            }
            else {
                prec = matGet(PosNegSum,0,0) / (matGet(PosNegSum,0,0) +  matGet(PosNegSum,0,1));
            }

            if (matGet(PosNegSum,0,0) + matGet(PosNegSum,0,3) == 0) {
                recall = 0;
            }
            else {
                recall = matGet(PosNegSum,0,0) / (matGet(PosNegSum,0,0) + matGet(PosNegSum,0,3));
            }

            if (prec + recall == 0) {
                f1Score = 0;
            }
            else {
                f1Score = 2 * prec * recall / (prec + recall);

            }

        }
		
		
		var D = matSubtract(P,Y);
		
/*		
		var AbsD = D.map(function(el) {
				return Math.abs(el);
		        });
*/				
		  	
		var AbsD = matAbs(D);
		
		var onesM = matOnes(1,matRows(AbsD));
		
		Prod = matMultiply(onesM,AbsD);
			
		var Prod = matFlip(Prod);
		
		
		
		/*
		Prod = Prod.map(function(el) {
			return el == 0 ? 1 : 0;
	    });
		*/
		//Prod = matFlip(Prod);
		
		var numCorrect = matSum(Prod);
		
		
		/*
		Prod = Prod.map(function(el) {
			return el == 0 ? 1 : 0;
	    });
		*/
		//Prod = matFlip(Prod);
		
		return [numCorrect,matCols(Y),prec,recall,f1Score,AbsD]; //math.reshape(Prod,[1,matRows(Prod)])];
		
		
		
		
	};
	
	this.predict = function() {
		var A = this.layers[this.layers.length -1].A;
		var Y = this.Y;
		
		
		
		var P;
		
		if (this.numOutputs == 1) {
			
			/*
			P = A.map(function(el) {
				return el > 0.5 ? 1 : 0;
			});
			*/
			P = matPredict(A);
			
		}
		else  {
			var Maxvals;
			if (mlParams.useMathjs) {
				Maxvals = math.max(A,0);
			}
			else {
				Maxvals = math.max(A,0);
				Maxvals = matCreate([Maxvals]);
			}
			
			var colNum = 0;
			
			var P = matZeros(matRows(A),matCols(A));
			
		    //P = A.eleMap(function(el,r,c) {
			for (var r = 0;r < matRows(A);++r) {	
			  for(var c = 0;c < matCols(A);++c) {
				var el = matGet(A,r,c);  
				//var ind = [r,c];
					
				if (el == matGet(Maxvals,0,c)) {
					el = 1;
				}
				else {
					el = 0;
				}
				/*
				if (colNum == A.size()[1] - 1) {
					colNum = 0;
				}
				else {
					++colNum;
				}
				*/
				
				matSet(P,r,c,el);
			  }
			
					
			}
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
						 
					    return this.Cost; //return matrixToArray(this.Cost);
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
					return this.RegCost; //return matrixToArray(this.RegCost);
				}
				else {
					return [];
				}

                break;				
		
				 
		    default: //TODO
				if ((this.RegCost) && (this.Cost)) {
					 var costSum = matSum(this.Cost);
					 var regSum =  matSum(this.RegCost);
				     return (costSum + regSum); 
				}
				 else {
					return [];
				}
			  
			     break;		
		}				 

				 
				 
			

  
		 
	 };
	 
	 
	 
	 
	 this.unrollThetas = function(excludeBias) {
		 //unroll all Thetas into a vector (returned as 1 dim array)
		 
		 //If excludeBias is true, sets all bias theta values to zero (so not included in regularised cost
 		 //TODO !! 
		 
		 var unrolled = [];
		 for (var i = 0;i < this.layers.length - 1;++i) {
			 var Th = matrixToArray(this.layers[i].Theta);
			 if (excludeBias) {
                 Th = matZeroFirstRow(Th);
                 /*
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
			    */
			 }
			 
			 Th	 = matFlatten(Th);
			 unrolled = unrolled.concat(Th);
			 
		 }
		 if (mlParams.useMathjs) {
			return  unrolled;
		 }
		 else {
			//var mat = Matrix.reshapeFrom(unrolled,unrolled.length,1);
			var mat = matTranspose([unrolled]);
			return mat;
				//matCreate(unrolled);
		 }
		 
	 };
	 
	 this.unrollDerivs = function() {
		 
		 var unrolled = [];
		 for (var i = 0;i < this.layers.length - 1;++i) {
			 var Der = matrixToArray(this.layers[i].Derivs);
			 Der = math.flatten(Der);
			 unrolled = unrolled.concat(Der);
		 }
		 
		 if (mlParams.useMathjs) {
			return  math.matrix(unrolled);
		 }
		 else {
			var mat = Matrix.reshapeFrom(unrolled,unrolled.length,1);
			return mat;
				//matCreate(unrolled);
		 }		 
		 //return math.matrix(unrolled);
		 
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
	this.updateTheta = function(ThVec,useMomentumDriver,useRMSPropDriver,useAdamDriver){
		
		var ThMats;
		
		if (ThVec) {
			ThMats = this.rollThetas(ThVec);
		}
		
		for (var lay = 0;lay < this.numLayers - 1;++lay) {
			if (ThMats) {
				this.layers[lay].updateTheta(this.alpha,ThMats[lay]);
			}
			else {
				this.layers[lay].updateTheta(this.alpha,null,useMomentumDriver,useRMSPropDriver,useAdamDriver);
			}
		
        }

        this.forward();
		
	
	
	};
	
	
	this.conjugateGradientStep = function(pk,batchNum,useMomentumDriver,useRMSPropDriver) {
		    var params = null;
		
			var current = {};
		    var next = {};
		    current.x = this.unrollThetas();
		    current.fx = this.getCost('T');
		    current.fxprime = this.unrollDerivs();
			
			if (pk) {
				
			}
			else {
		       pk = matMultiplyBy(current.fxprime,-1);
			}

		
		    var res = this.wolfeLineSearch(this.alpha,pk,batchNum,useMomentumDriver);
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
                pk = matMultiplyBy(current.fxprime,-1);   //scale(pk, current.fxprime, -1);
				return[a,null,pk];

            } else {
                // update direction using Polakâ€“Ribiere CG method
                var yk = matAdd(next.fxprime,matMultiplyBy(current.fxprime,-1));     //weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

                var delta_k =    matSum(matDotMultiply(current.fxprime,current.fxprime));  //dot(current.fxprime, current.fxprime),
                    beta_k =     Math.max(0,matSum(matDotMultiply(yk,next.fxprime)) / delta_k);     //Math.max(0, dot(yk, next.fxprime) / delta_k);

                pk = matAdd(matMultiplyBy(pk,beta_k),matMultiplyBy(next.fxprime,-1));     //weightedSum(pk, beta_k, pk, -1, next.fxprime);

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
	
	


		
		

	
	
	this.wolfeLineSearch = function(a,pk,batchNum,useMomentumDriver) {
	/// searches along line 'pk' for a point that satifies the wolfe conditions
    /// See 'Numerical Optimization' by Nocedal and Wright p59-60
    /// f : objective function
    /// pk : search direction
    /// current: object containing current gradient/loss
    /// next: output: contains next gradient/loss
	
	// batchNum just used to output progress - indicates sgd batch within an epoch
	
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
		   pk = matMultiplyBy(current.fxprime,-1);
		}
		
		if (batchNum == null) {
			batchNum = 0;
		}
		
		//var a = this.alpha;
		var c1;
		var c2;
		
		var svdThis = this;
	  
		var phi0 = current.fx, phiPrime0 =  matSum(matDotMultiply(current.fxprime,pk)), //dot(current.fxprime, pk),
			phi = phi0, phi_old = phi0,
			phiPrime = phiPrime0,
			a0 = 0;

		a = a || 1;
		c1 = c1 || 1e-6;
		c2 = c2 || 0.1;

		function zoom(a_lo, a_high, phi_lo,parentIter,parentBatchNum) {
			for (var iteration = 0; iteration < 16; ++iteration) {
				a = (a_lo + a_high)/2;
				next.x = matAdd(current.x,matMultiplyBy(pk,a));  //weightedSum(next.x, 1.0, current.x, a, pk);
			    svdThis.updateTheta(next.x,useMomentumDriver);
			    phi = svdThis.getCost('T');
				if (svdThis.progCallback) {
					svdThis.progCallback('subProgressDiv','Batch ' + parentBatchNum + ' B/p Iter: ' + parentIter + ' Zoom: ' + iteration + ' &alpha; ' + a.toFixed(4),true);
				}
			    svdThis.backProp();       //phi = next.fx = f(next.x, next.fxprime);
			    next.fxprime = svdThis.unrollDerivs();
				phiPrime = matSum(matDotMultiply(next.fxprime,pk)); 
				svdThis.updateTheta(current.x,useMomentumDriver);  //restore. Don't change in this routine, new value will be returned
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
			next.x = matAdd(current.x,matMultiplyBy(pk,a));  //weightedSum(next.x, 1.0, current.x, a, pk);
			svdThis.updateTheta(next.x,useMomentumDriver);
			phi = svdThis.getCost('T');
			if (this.progCallback) {
			    progCallback('subProgressDiv','Batch ' + batchNum + ' B/p Iter: ' + iteration + ' &alpha; ' + a.toFixed(4),true);
			}
			
			svdThis.backProp();       //phi = next.fx = f(next.x, next.fxprime);
			next.fxprime = svdThis.unrollDerivs();
			phiPrime = matSum(matDotMultiply(next.fxprime,pk));  //dot(next.fxprime, pk);
			svdThis.updateTheta(current.x,useMomentumDriver);  //restore. Don't change in this routine, new value will be returned
			
			if ((phi > (phi0 + c1 * a * phiPrime0)) ||
				(iteration && (phi >= phi_old))) {
				return zoom(a0, a, phi_old,iteration,batchNum);
			}

			if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
				return [a,next];
			}

			if (phiPrime >= 0 ) {
				return zoom(a, a0, phi,iteration,batchNum);
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
				this.layers[j].X = matClone(this.layers[j-1].A);
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
		this.layers[0].A =  mRemoveFirstRow(this.X); //math.matrix(matrixToArray(this.X,0)); //remove first row of 1s
		
		
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
				lay.A = mRemoveFirstRow(this.X);   //math.matrix(matrixToArray(this.X,0)); //remove first row of 1s
				
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
	 
	 this.Momentum = null;
	 this.RMSProp = null;
	 
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
                 var nIn = this.n + 1;
                 var nOut = this.nextLayerN + 1;
                 var rqdVariance = 2 / (nIn + nOut);
                 var rqdStdDev = math.sqrt(rqdVariance);
				 /*
                 var thMat = matZeros(this.n + 1, this.nextLayerN);
                 thMat = thMat.map(function (el) {
                     return randn_bm(rqdStdDev);
                 });
				 */
				 var thMat = matRand([this.n + 1, this.nextLayerN],rqdStdDev);

                 //Use Xavier initialisation:

                 //if (mlParams.useXavierInit) {
                 this.Theta = thMat;
                 // }
                 //else {

                 //Use random init
                 //this.Theta = math.matrix(math.random([this.n + 1, this.nextLayerN], -0.2, 0.2)); //was -0.5, 0.5 // -0.5,0.5)); //was 2  ///-1,1));
                 //}
                 /*
                  else {
                  this.Theta =  math.zeros(this.n + 1, this.nextLayerN);
                  }
                  */
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

     this.calcRegDerivs = function() {
        // var RegDeriv = math.map(this.Theta,function(el,ind) {
	
	    /*
		var RegDeriv = this.Theta.eleMap(function(el,r,c) {
			var ind = [r,c];
             if (ind[0] == 0) { //1st row
                 return 0;
             }
             else {
                 return el;
             }

         });
		 */
		 var RegDeriv = matClone(this.Theta);
		 matSet(RegDeriv,0,0,0);

         RegDeriv = matMultiplyBy(RegDeriv,this.lambda / matCols(this.A)); 

         return RegDeriv;

     };

     this.calcDerivs = function() {

      var ones = matOnes(1,matCols(this.A)); //math.ones(1,this.A.size()[1]);
      this.AWithBias = matConcat(ones,this.A,0); //math.concat(ones,this.A,0);

      this.Derivs = matMultiply(this.AWithBias,matTranspose(this.nextLayer.D)); //math.multiply(this.AWithBias,math.transpose(this.nextLayer.D));

      this.Derivs = matMultiplyBy(this.Derivs, 1 / matCols(this.A)); //math.multiply(this.Derivs,1 / this.A.size()[1]); //divide by m

      var RegDerivPart = this.calcRegDerivs();

      this.Derivs = matAdd(this.Derivs,RegDerivPart);




     };


     this.calcDeltas = function()  {
       if (this.isOutputLayer()) {
           this.D = matSubtract(this.A, this.Y); //math.subtract(this.A,this.Y);
       }
       else {
           this.D = matMultiply(this.Theta,this.nextLayer.D);  //math.multiply(this.Theta,this.nextLayer.D);
           var ones = matOnes(1,matCols(this.A)); //math.ones(1,this.A.size()[1]);
           this.AWithBias = matConcat(ones,this.A,0); //math.concat(ones,this.A,0);
           this.AComplement = matSubtract(matOnes(matRows(this.AWithBias),matCols(this.AWithBias)),this.AWithBias); //math.subtract(math.ones(math.size(this.AWithBias)),this.AWithBias);
           this.prime = matDotMultiply(this.AWithBias,this.AComplement); //math.dotMultiply(this.AWithBias,this.AComplement);
           this.D = matDotMultiply(this.D,this.prime); //math.dotMultiply(this.D,this.prime);

           //this.D = math.matrix(matrixToArray(this.D,0)); //remove first row of 1s
		   this.D = mRemoveFirstRow(this.D); //vast improvement!

       }



     };


     this.isOutputLayer = function() {
         return this.nextLayerN == -1;

     };

	 
	 
	 this.initApproxGrads = function() {
		 
		this.ApproxGrads = this.Theta.clone();
		this.ApproxGrads = this.ApproxGrads.map(function(el) {
			return 0;
		});
	
		 
		 
	 };


	 /** If ThMat supplied, update directly else use gd update
	 *
	 **/
	 
     this.updateTheta = function(alpha,ThMat,useMomentumDriver,useRMSPropDriver,useAdamDriver) {
		 
		 if (ThMat) {
			this.Theta = ThMat;
		 }
		 else {
			 
			if (useMomentumDriver || useAdamDriver) {
				if (this.Momentum) {
					this.Momentum = matAdd(matMultiplyBy(this.Derivs,0.1),matMultiplyBy(this.Momentum,0.9));
				}
				else { //first time
				   this.Momentum = matClone(this.Derivs);
				
				}
			}
			
			var newRMSPropSqrtInv;
			
			if (useRMSPropDriver || useAdamDriver) {
							
				
				if (this.RMSProp) {
					this.RMSProp = matAdd(matMultiplyBy(matDotMultiply(this.Derivs,this.Derivs),0.1),matMultiplyBy(this.RMSProp,0.9));
				}
				else { //first time
					this.RMSProp = matClone(this.Derivs); //first time
					this.RMSProp = matDotMultiply(this.RMSProp,this.RMSProp);
				}
				
				var newRMSPropSqrtInv =  matSqrt(this.RMSProp);
                newRMSPropSqrtInv = matAddEpsilon(newRMSPropSqrtInv);
                newRMSPropSqrtInv = matPow(newRMSPropSqrtInv,-1);
                //newRMSPropSqrtInv = matMultiplyBy(newRMSPropSqrtInv,alpha);
				/*
				newRMSPropSqrtInv = this.RMSProp.map(function(el) {
					return el == 0 ? 0  : 1 / Math.sqrt(el);
				});
				*/
			}
				
				
			if (useMomentumDriver) {
				this.DerivsAdj =  matMultiplyBy(this.Momentum,alpha);
			}
			else if (useRMSPropDriver) {
				this.DerivsAdj = matMultiplyBy(this.Derivs,alpha);
				this.DerivsAdj = matDotMultiply(this.DerivsAdj,newRMSPropSqrtInv);
			}
			else if (useAdamDriver) {
				this.DerivsAdj = matMultiplyBy(this.Momentum,alpha);
				this.DerivsAdj = matDotMultiply(this.DerivsAdj,newRMSPropSqrtInv);			
			}
            else {			
				this.DerivsAdj =  matMultiplyBy(this.Derivs,alpha);
			}

            this.Theta = matSubtract(this.Theta,this.DerivsAdj);
		 }

     };
	 
	 this.adjustThetaApprox = function(alpha) {
		 this.ApproxGrads = matMultiplyBy(this.ApproxGrads,alpha);
		 
		 this.Theta = matSubtract(this.Theta,this.ApproxGrads);
		 
	 };
	 
	 
	 this.getThetaForUnitToUnit = function(un1,un2) {
		var thVal;

		if (matIsVector(this.Theta)) {
			//thVal = this.Theta.get([un1]);
			//not implemented
		}
		 else {
			thVal =  matGet(this.Theta,un1,un2); //this.Theta.get([un1, un2]);
		}
		 
		 return thVal;
		 
	 };
	 
	 this.getAForSingleM = function(m,uNum) {
		 //get An for training example m for this layer
		 if (this.A) {

		 }
		 else {
			 if (uNum == null) {
				 return [];

			 }
			 else {

				 return '-';
			 }

		 }


		 var ins = mCol(this.A,m,true,true);

		 if (uNum == null) {
			 return ins;
		 }

		 if (matIsVector(this.A)) {
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

		 if (uNum == null) {
			 return outs;
		 }

		 if (matRows(this.Y)  == 1) {
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
		 var ones = matOnes(1,matCols(this.X));
		 
		 
		 this.X = matConcat(ones,this.X,0);
	 
	 };
	 
	 
	 this.forward = function() {
		 var ZRet = [];
		// this.Z = h(math.transpose(this.prevLayer.Theta),this.X,false); //this.X = prev layer A with bias 1s added
		 this.A = h(this.prevLayer.Theta,this.X,true,ZRet);
		 this.Z = ZRet[0];
		 
	 };
	 
	 this.init();
	 
	 
 }