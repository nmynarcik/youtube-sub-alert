Array.prototype.diff = function(a) {
	var notFound = true;	
outerLoop:
	  for(var i = 0; i < this.length; i++){
		  notFound = true;		  
innerLoop:
		  for(var j=0; j< a.length; j++){			  
			  if(this[i].name === a[j].name){				
				notFound=false;		
				break innerLoop;
			  }			
		  }
		  if(notFound){
			  console.log("did not find this name in old subs: " +this[i].name);
			return this[i];				
		}
	  }	
};
