

// single linked list
function LinkedList(){  
  this.head = null;
  this.length = 0;
}

LinkedList.prototype.push = function(val){
    var node = {
       value: val,
       next: null,
       down: false
    }
    if(!this.head){
      this.head = node;      
    }
    else{
      current = this.head;
      while(current.next){
        current = current.next;
      }
      current.next = node;
    }
    this.length++;
}

LinkedList.prototype.remove = function(val){
  var current = this.head;
  if(!current){
    return -1;
  }
  //find at head
  if(current.value == val){
     this.head = current.next;     
  }
  else{
    var previous = current;
    
    while(current.next){
      //middle
      if(current.value == val){
        previous.next = current.next;          
        break;
      }
      previous = current;
      current = current.next;
    }
    //tail
    if(current.value == val){
      previous.next == null;
    }
  }
  
  this.length--;
  return 0;

}  

LinkedList.prototype.at = function(position) {
    var currentNode = this.head;
    var length = this.length;
    var count = 0;
    // 1st use-case: an invalid position
    if (length == 0 || position < 0 || position >= length) {
        return -1;
    }
 
    // 2nd use-case: a valid position
    while (count < position) {
        currentNode = currentNode.next;
        count++;
    }
 
    return currentNode;
}

LinkedList.prototype.move_down = function(position) {
    var currentNode = this.at(position);

    if(!currentNode.down){
      while(currentNode){
        currentNode.down = true;
        currentNode.value.y += tile_size;
        currentNode = currentNode.next;
      }
    }
}


// move up 
LinkedList.prototype.move_restore= function() {
    var currentNode = this.head;

    while(currentNode){
      if(currentNode.down){
        currentNode.down = false;
        currentNode.value.y -= tile_size;
      }
      currentNode = currentNode.next;
    }
  
}



LinkedList.prototype.settle = function(){
  var cur = this.head;
  while(cur){
    cur.down = false;
    cur = cur.next;
  }

}

LinkedList.prototype.contain = function(val){
  var current = this.head;
  while(current){
    if(current.value == val){
      return true;
    }else{
      current = current.next;
    }

  }

  return false;
}

LinkedList.prototype.insert = function(pos,val){
  var node = {
       value: val,
       next: null
  }

  if(pos == 0 ){
    node.next = this.head;
    this.head = node;
  }else{
    var parent = this.at(pos-1);
    var child = this.at(pos);
    parent.next = node;
    node.next = child;

  }
  this.length++;
}

