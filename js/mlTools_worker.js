 importScripts('math.min.js');
 importScripts('mlTools_routines.js');  	
 
	
 postMessage('Hello from worker');	
 //var inp = '1 2\n3 4\n4 5\n5 7';
 var inp = '224 895\n300 716\n310 667\n349 1111\n460 1450\n696 1638\n393 1150\n566 1657\n985 2540\n1109 2740\n710 1810\n828 3080\n948 2000';
 
 
 function progUpdateBackground(elToUpdate,mess,clearFlag) {
	 
	    if (elToUpdate == 'chart') {
			
			
			var msg = {};
			msg.action = 'chartUp';
			msg.elToUpdate = 'chart';
			msg.costAr = mess[0];//JSON.stringify(res[0]);
			msg.iters = mess[1];//JSON.stringify(res[1]);
			msg.ThetaIdeal = JSON.stringify(mess[2]);
			msg.IdealCost = JSON.stringify(mess[3]);
			msg.X = JSON.stringify(mess[4]);
			msg.Y = JSON.stringify(mess[5]);
			msg.minTheta = JSON.stringify(mess[6]);
			msg.XOrig = JSON.stringify(mess[7]);
			msg.adjTh = mess[8];//JSON.stringify(res[8]);
			msg.scaleFactors = mess[9];//JSON.stringify(res[9]);
			postMessage(msg);
		}
		else {
	       postMessage({'action':'progUp','elToUpdate':elToUpdate,'mess':mess,'clearFlag':clearFlag});
		}

 }	 
 
 
 // return [ThetaIdeal,IdealCost,X,Y,minTheta,XOrig,adjTh,scaleFactors];

 self.onmessage = function (msg) {
    switch (msg.data.action) {
        case 'Go':
		    console.log('params in worker: ' + msg.data.params.input);
            //var res = learn_background(inp,0.01,10,'0 0',1,true,true,false,0.00000001,msg.data.params); 
			var res = learn(msg.data.params,progUpdateBackground);
			var tst = res[2];
			var msg = {};
			msg.action = 'fin';
			msg.elToUpdate = 'blog';
			msg.mess = '<br>finished';
			msg.costAr = res[0];//JSON.stringify(res[0]);
			msg.iters = res[1];//JSON.stringify(res[1]);
			msg.ThetaIdeal = JSON.stringify(res[2]);
			msg.IdealCost = JSON.stringify(res[3]);
			msg.X = JSON.stringify(res[4]);
			msg.Y = JSON.stringify(res[5]);
			msg.minTheta = JSON.stringify(res[6]);
			msg.XOrig = JSON.stringify(res[7]);
			msg.adjTh = res[8];//JSON.stringify(res[8]);
			msg.scaleFactors = res[9];//JSON.stringify(res[9]);
			//postMessage({'action':'fin','elToUpdate':'blog','mess':'<br>finished','minT':JSON.stringify(res[4])});	
			postMessage(msg);
            postMessage({'action':'progUp','elToUpdate':'blog','mess':'<br>finished'});			
            break;
        default:
            throw 'no aTopic on incoming message to ChromeWorker';
    }
}
 