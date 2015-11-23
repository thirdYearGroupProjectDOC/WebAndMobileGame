// single linked list
function LinkedList(){  

  this.head = null;
  this.tail = null;
  this.length = 0;

}

LinkedList.prototype.push = function(val){
    var node = {
       value: val,
       next: null
    }
    // empty list
    if(!this.head){
      this.head = node;    
      this.tail = node;  
    } else {
      this.tail.next = node;
      this.tail = node; 
    }
    this.length ++;
}

LinkedList.prototype.remove = function(val){
  var current = this.head;
  if(this.length == 0){
    return -1;
  }

  //find match at head
  if(current.value == val){
     this.head = current.next;     
  }
  else{
    var previous = current;
    
    while(current.next){
      //find in the middle
      if(current.value == val){
        previous.next = current.next;          
        break;
      }
      previous = current;
      current = current.next;
    }
    //find in the tail
    if(current.value == val){
      previous.next == null;
      this.tail = previous;
    }
  }
  this.length--;
  return 0;

}  



