 importScripts('math.min.js');
 importScripts('mlTools_routines.js');
 importScripts('linear-algebra.min.js');
 importScripts('numeric-1.2.6.min.js');


 postMessage('Hello from worker');	
 //var inp = '1 2\n3 4\n4 5\n5 7';
 var inp = '224 895\n300 716\n310 667\n349 1111\n460 1450\n696 1638\n393 1150\n566 1657\n985 2540\n1109 2740\n710 1810\n828 3080\n948 2000';

 mlParams = {};
 

 var Matrix;
 var Vector;
 var l = linearAlgebra();
 Matrix = linearAlgebra().Matrix;
 Vector = linearAlgebra().Vector;
 
 
 /**
  *
  * @param elToUpdate
  * @param mess
  * @param clearFlag
  */
 function progUpdateBackground(elToUpdate,mess,clearFlag) {
	 
	    if (elToUpdate == 'chart') {
			
			if (!clearFlag) {
			
				var msg = {};
				msg.action = 'chartUp';
				msg.elToUpdate = 'chart';
				msg.costAr = mess[0];//JSON.stringify(res[0]);
				msg.iters = mess[1];//JSON.stringify(res[1]);
				msg.ThetaIdeal = JSON.stringify(mess[2]);
				msg.IdealCost = JSON.stringify(mess[3]);
				//msg.X = JSON.stringify(mess[4]); // No longer return this
				msg.Y = JSON.stringify(mess[5]);
				msg.minTheta = JSON.stringify(mess[6]);
				//msg.XUnscaled = JSON.stringify(mess[7]); // No longer return this
				msg.minThetaUnscaled = JSON.stringify(mess[8]);
				//msg.scaleFactors = mess[9];//JSON.stringify(res[9]); // No longer return this
				//msg.YOrig = JSON.stringify(mess[10]); // No longer return this
				msg.costArSparse = mess[11];
				msg.itersSparse = mess[12];
				msg.costArCV = mess[13];
				postMessage(msg);
			}
			else {
				var msg = {};
				msg.action = 'chartInit';
				postMessage(msg);
			}
				
		}
		else {
	       postMessage({'action':'progUp','elToUpdate':elToUpdate,'mess':mess,'clearFlag':clearFlag});
		}

 }	 
 
 
 // return [ThetaIdeal,IdealCost,X,Y,minTheta,XUnscaled,minThetaUnscaled,scaleFactors];

 /**
  *
  * @param inMsg
  */

 self.onmessage = function (inMsg) {
    switch (inMsg.data.action) {
		
		case 'Pause':
		
			 pauseFlag = true;
			 
		     break;
			 
        case 'Go':
		    console.log('params in worker: ' + inMsg.data.params.input);
            //var res = learn_background(inp,0.01,10,'0 0',1,true,true,false,0.00000001,msg.data.params);
			/*
			inMsg.data.mlData.X.__proto__ = math.matrix.prototype;
			inMsg.data.mlData.Y.__proto__ = math.matrix.prototype;
			
			*/
			
			mlParams.useMathjs = inMsg.data.params.useMathjs; //temporary - mlParams is not available in background
			
			pauseFlag = false;
			
			var X;
			if (inMsg.data.params.scalingFlag) {
				if (inMsg.data.params.useMathjs) {
					X = math.matrix(inMsg.data.mlData.XScaled._data);
				}
				else {
					X = matCreate(inMsg.data.mlData.XScaled.data);
				}
			}
			else {
				if (inMsg.data.params.useMathjs) {
					X = math.matrix(inMsg.data.mlData.X._data);
				}
				else {
					X = matCreate(inMsg.data.mlData.X.data);
				}
			}
			var Y;
			
			if (inMsg.data.params.useMathjs) {
				Y = math.matrix(inMsg.data.mlData.Y._data);
			}
			else {
				Y = matCreate(inMsg.data.mlData.Y.data);
			}
			
			var continueData = inMsg.data.continueData;
			var XUnscaled;
			if (inMsg.data.params.useMathjs) {
				XUnscaled = math.matrix(inMsg.data.mlData.X._data);
			}
			else {
				XUnscaled = matCreate(inMsg.data.mlData.X.data);
			}
			
			var Xcv;
			if (inMsg.data.mlData.Xcv) {
				if (inMsg.data.params.useMathjs) {
					Xcv = math.matrix(inMsg.data.mlData.Xcv._data);
				}
				else {
					Xcv = matCreate(inMsg.data.mlData.Xcv.data);
				}
			}
			
			var Ycv;
			if (inMsg.data.mlData.Ycv) {
				if (inMsg.data.params.useMathjs) {
					Ycv = math.matrix(inMsg.data.mlData.Ycv._data);
				}
				else {
					Ycv = matCreate(inMsg.data.mlData.Ycv.data);
				}
			}
			
			var res = learn(inMsg.data.params,X, Y, progUpdateBackground,continueData,inMsg.data.mlData.scaleFactors,XUnscaled,Xcv,Ycv);
			/*
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
			//postMessage({'action':'fin','elToUpdate':'blog','mess':'<br>finished','minT':JSON.stringify(res[4])});	
			postMessage(msg);
            postMessage({'action':'progUp','elToUpdate':'outputBlog','mess':'<br>finished'});		
	        if ((inMsg.data.params.module == 'log') && (inMsg.data.params.numLogClasses > 2) && (inMsg.data.params.currClassNum == inMsg.data.params.numLogClasses - 1)) {
                postMessage({'action':'multiClassFin'});
			}	
            */			
            break;
        default:
            throw 'no aTopic on incoming message to ChromeWorker';
    }
}
 