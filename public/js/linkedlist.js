

// single linked list
function LinkedList(){  
  this.head = null;
  this.length = 0;
  // used to define the tiny gap between instructions, so it looks nicer
  this.gap = 2;
}

// push to back of the list
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

// remove first node has value val,
// if not find, nothing happends
LinkedList.prototype.remove = function(val){
  var current = this.head;
  if(!current){
    return -1;
  }
  //find at head
  if(current.value == val){
    this.head = current.next;
    this.length--;
    return 0;     
  } else{
    var previous = current;
    
    while(current.next){
      //middle
      if(current.value == val){
        previous.next = current.next; 
        this.length--;
        return 0;
      }
      previous = current;
      current = current.next;
    }
    //tail
    if(current.value == val){
      previous.next == null;
      this.length--;
      return 0;
    }
  } 

}  

LinkedList.prototype.clear = function(){
    // not sure how to collect garbages in js
    /*var h = this.head;

    while (h) {
      h = h.next;
      var t = h;
      delete t;
    }*/
    this.head = null;
    this.length = 0;
    return 0;
}

// getter function , provide position, get node
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

// return true if has node with value val
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

// insert into pos with node with value val
LinkedList.prototype.insert = function(pos,val){
  var node = {
       value: val,
       next: null
  }
  //can't insert into before head or after tail
  if(pos < 0 || (pos > this.length)){
    return;
  }

  if(pos == 0 ){
    node.next = this.head;
    this.head = node;
  }else {
    var parent = this.at(pos-1);
    var child = this.at(pos);
    parent.next = node;
    node.next = child;

  }
  this.length++;
}

// used only for instructions! shouldn't be a function call 
// belong to linkedlist, may change later
// update pixel position depends on position in linkedlist
LinkedList.prototype.update = function(){
  var i = 0;
  var cur = this.head;

  var limit = 12;


  while(cur!=null&&cur.value!=null){
    cur.value.x = gap + tile_size + (Math.floor(i/limit)) *(tile_size+inst_gap_h) *2 ;
    cur.value.y = (i%limit+1)*(tile_size/2+this.gap);
    // drop down menu and looptime text follow instructions
    if(cur.value.loop_txt!=null){
      cur.value.loop_txt.x = cur.value.x;
      cur.value.loop_txt.y = cur.value.y-10;
      cur.value.drop_down.x = cur.value.x;
      cur.value.drop_down.y = cur.value.y;
       
    }
    cur = cur.next;
    i++;
  }

}

