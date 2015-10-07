Array.prototype.diff = function(a) {
  for(var i = 0; i < this.length; i++){
    if(this[i].name !== a[i].name){
      return this[i];
    }
  }
};
