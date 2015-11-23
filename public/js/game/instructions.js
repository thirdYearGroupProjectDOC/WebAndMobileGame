
/*
function onButtonUp()
{
    this.isdown = false;

    player_start();

    if (this.isOver){
    }
    else{
    }
}

*/
/* OLD
function player_start() {
       switch (instQueue[step].dir) {
        case 0:
            player_move(player_dir);
            break;
        case 1:
            player.wait = tile_size/player.speed;
            player_dir = (player_dir + 3) % 4;
            break;
        case 2:
            player.wait = tile_size/player.speed;
            player_dir = (player_dir + 1) % 4;
            break;


        default:
            break;
       }

}
*/

/*

*/
// create undo instruction


/* WE DON'T NEED UNDO ANYMORE
function createUndoButton(x,y,img){
  var undo_tex = PIXI.Texture.fromImage(img);
  var undo_button = new PIXI.Sprite(undo_tex);
  undo_button.width = tile_size*2 - 15;
  undo_button.height = tile_size/2;
  undo_button.buttonMode = true;
  undo_button.position.x = x;
  undo_button.position.y = y;
  // make the button interactive...
  undo_button.interactive = true;
  undo_button
      // set the mousedown and touchstart callback...
      .on('mousedown', undoButtonDown)
      .on('touchstart', undoButtonDown)

      // set the mouseup and touchend callback...
      .on('mouseup', undoButtonUp)
      .on('touchend', undoButtonUp)
      .on('mouseupoutside', undoButtonUp)
      .on('touchendoutside', undoButtonUp)

      // set the mouseover callback...
      .on('mouseover', undoButtonOver)

      // set the mouseout callback...
      .on('mouseout', undoButtonOut)
      
  undo_button.tap = null;
  undo_button.click = null;
  // add it to the stage
  stage.addChild(undo_button);
  return undo_button;
}



function undoButtonDown()
{
    this.isdown = true;
 //   player_move(1);
    this.alpha = 1;
}

function undoButtonUp()
{
    this.isdown = false;

    if (instPointer > 0) {
    stack_undo();
   }

    if (this.isOver){
    }
    else{
    }
}

function undoButtonOver()
{
    this.isOver = true;
    if (this.isdown){
        return;
    }
}

function undoButtonOut()
{
    this.isOver = false;
    if (this.isdown){
        return;
    }
}


// undo the most recent instruction
function stack_undo() {

  //if last instruction is repeat, we only decrement its count
  if (instQueue[instPointer-1].dir == 3) {
    if (instQueue[instPointer-1].count > 1) {
      instQueue[instPointer-1].count--;
      instQueue[instPointer-1].repeatCount.setText(instQueue[instPointer-1].count);
      instQueue[instPointer-1].button.generator.count++;
      instQueue[instPointer-1].button.generator.update();
      
    } else {
      instPointer--;
      instQueue[instPointer] = -1;
      INSTRUCT_STAGE.removeChild(INSTRUCT_STAGE.children[instPointer]);
      instPointer--;
      instQueue[instPointer] = -1;
      INSTRUCT_STAGE.removeChild(INSTRUCT_STAGE.children[instPointer]);
    }
  } else {

  instPointer--;
  instQueue[instPointer] = -1;

  cur = INSTRUCT_STAGE.children[instPointer];
  INSTRUCT_STAGE.removeChild(cur);
  cur.button.generator.count++;
  cur.button.generator.update();
  }
}

*/


// create reset button
function createResetButton(x,y,img){
  var reset_tex = PIXI.Texture.fromImage(img);
  var reset_button = new PIXI.Sprite(reset_tex);
  reset_button.width = tile_size*2;
  reset_button.height = tile_size;
  reset_button.x = x;
  reset_button.y = y;
  // make the button interactive...
  reset_button.interactive = true;
  reset_button.buttonMode = true;

  reset_button
      // set the mousedown and touchstart callback...
      .on('mousedown', resetButtonDown)
      .on('touchstart', resetButtonDown)

      // set the mouseup and touchend callback...
      .on('mouseup', resetButtonUp)
      .on('touchend', resetButtonUp)
      .on('mouseupoutside', resetButtonUp)
      .on('touchendoutside', resetButtonUp)

      // set the mouseover callback...
      .on('mouseover', resetButtonOver)

      // set the mouseout callback...
      .on('mouseout', resetButtonOut)
      
  reset_button.tap = null;
  reset_button.click = null;
  // add it to the stage
  stage.addChild(reset_button);
  return reset_button;
}


function resetButtonDown()
{
    this.isdown = true;
 //   player_move(1);
    this.alpha = 1;
}

function resetButtonUp()
{
    this.isdown = false;

    game_reset();

    if (this.isOver){
    }
    else{
    }
}

function resetButtonOver()
{
    this.isOver = true;
    if (this.isdown){
        return;
    }
}

function resetButtonOut()
{
    this.isOver = false;
    if (this.isdown){
        return;
    }
}


//reset the game except road pieces
function game_reset() {


    player.x = tile_size;
    player.y = tile_size;
    player.pos_x = 1;
    player.pos_y = 1;
    player_dir = 1;
    start = false;
    // road pieces can be moved again
    for(var i = 0; i < ROAD_STAGE.children.length; i++){
        ROAD_STAGE.children[i].interactive = true;
    }

    // restore instructions buttons's count
    for(var i = 0; i < INST_BUTTON_STAGE.children.length; i++){
      INST_BUTTON_STAGE.children[i].generator.reset();
    }

    INSTRUCT_STAGE.removeChildren();
    /*  OLD
    instQueue = [];
    instPointer = 0;
    */
    instId = 0;
    step = 0;

}


/* OLD
function inst_count(x,y,count){
  this.count = count;
  this.max = count;
  this.x = x;
  this.y = y;

  var countTxt = new PIXI.Text(':'+count);
  countTxt.x = this.x + tile_size+ 45;
  countTxt.y = this.y;
  stage.addChild(countTxt);

  this.update = function(){
    countTxt.setText(':'+this.count);
  }

  this.reset = function(){
    this.count = this.max;
    this.update();
  }

  this.gen = function(img,inst){
    var ib = createInstructions(this.x,this.y,img,inst);
    ib.generator = this;
  }
}

*/

/* OLD

// create instructions button
function createInstructions(x,y,img,inst) {

  var instruct_tex = PIXI.Texture.fromImage(img);
  var instruction = new PIXI.Sprite(instruct_tex);

  instruction.dir = inst;


  instruction.width = tile_size*2;
  instruction.height = tile_size/2;
  instruction.buttonMode = true;
  instruction.interactive = true;
  instruction.x = x;
  instruction.y = y;
  
  instruction
    .on('mousedown', instructionButtonDown)
    .on('touchstart', instructionButtonDown)

      // set the mouseup and touchend callback...
    .on('mouseup', instructionButtonUp)
    .on('touchend', instructionButtonUp)

    .on('mouseupoutside', instructionButtonUpOutside)
    .on('touchendoutside', instructionButtonUpOutside)

      // set the mouseover callback...
    .on('mouseover', instructionButtonOver)

      // set the mouseout callback...
    .on('mouseout', instructionButtonOut);


  instruction.tap = null;
  instruction.click = null; 
   INST_BUTTON_STAGE.addChild(instruction); 
   return instruction;
}

function instructionButtonDown() {
   this.down = true;
}

function instructionButtonUp() {
  this.down = false;
  if(this.generator.count>0){
    // dec count and update text
    this.generator.count--;
    this.generator.update();

    //put instruction symbol in the stack
    if (this.dir == 2) {
      instr = PIXI.Sprite.fromImage('assets/spt_inst_right.png');
    } else if (this.dir == 0) {
      instr = PIXI.Sprite.fromImage('assets/spt_inst_forward.png');
    } else if (this.dir == 1) {
      instr = PIXI.Sprite.fromImage('assets/spt_inst_left.png');

    } else if (this.dir == 3) {
      if (instPointer>0 && instQueue[instPointer-1].dir == 3) {
        //if last instruction is repeat, then increment the repeating times
        instQueue[instPointer-1].count++;
        instQueue[instPointer-1].repeatCount.setText(instQueue[instPointer-1].count);
        return;

      } else {
        //create a new repeat instruction and repeat count
        instr = PIXI.Sprite.fromImage('assets/spt_inst_repeat_time.png');
        instr.count = 1;
        instr.repeatCount = new PIXI.Text(instr.count);
        instr.repeatCount.x = 200;
        instr.repeatCount.y = tile_size + 50*(instPointer);
        INSTRUCT_STAGE.addChild(instr.repeatCount);
      }
      
    }

      instr.dir = this.dir;
      instr.x = 50;
      instr.y = tile_size + 50*(instPointer);
      instr.height = tile_size/2;
      instr.width = tile_size*2;
      // used for undo button, inc instruction count
      instr.button = this;

      instQueue[instPointer] = instr;
      instPointer++;
      INSTRUCT_STAGE.addChild(instr);
  }else{
    // TODO: add another stage for error messages
    show_msg('hahaha');
  }
}



function instructionButtonUpOutside() {
   this.down = false;
} 


function instructionButtonOver() {
  this.isOver = true;
    if (this.isdown){
        return;
    }
}

function instructionButtonOut()
{
    this.isOver = false;
    if (this.isdown){
        return;
    }
}
*/


// new instruction buttons 
// followed by map parts

//check if it is in the instruction region
function check_inst_region(x){
     return x > 890 && x < 1010;
}

function onInstDragStart(event){
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.started = true;
    this.alpha = 0.8;
    this.dragging = true;
    if (check_inst_region(this.x)) {
       
       var current = instQueue.head;
       while (current.value != this && current != null) {
          current = current.next; 
       } 
       while (current.next != null) {
         current.next.value.y -= tile_size;
          current = current.next;
       }
       instQueue.remove(this);
    }


}

function onInstDragEnd(){
  if(this.started){
      this.alpha = 1;
      this.dragging = false;

      // set the interaction data to null
      this.data = null;

      this.pos_x = toTilePos(this.x);
      this.pos_y = toTilePos(this.y);
      this.dragged = false;

      //when it is put in the instruction region
      if (check_inst_region(this.x)){
         this.x = 950;
         this.y = 50 + getLength(instQueue) * tile_size;
         instQueue.push(this);
      } else {
        if (this.generator.count == 0) {
          this.generator.count = 2;
          this.generator.gen();
        } else {
        this.generator.count ++;
        this.generator.update();
      }
        INST_BUTTON_STAGE.removeChild(this);
        delete(this);
      
      }
/*
      // if the position is being possessed, go back
      if(map[this.pos_y*map_size+this.pos_x]!=null){
          var gen = this.generator;
          //if there was no active pieces, put one on the pile,
          // else just increase count and update;
          if(gen.count == 0){
            gen.count = 2;
            gen.gen();
          }else{
            gen.count ++;
            gen.update();
          }
          ROAD_STAGE.removeChild(this);
          delete(this);
      }else if(check_in_map(this.pos_x,this.pos_y,this.name)){
          map[this.pos_y*map_size+this.pos_x] = this.dir;
      }
      */
    }

    this.started = false;
        
}


function onInstDragMove(){
    if (this.dragging)
    {
        this.dragged = true;
        if(this.fresh){
          this.fresh = false;
          this.generator.gen();
        }
        var newPosition = this.data.getLocalPosition(this.parent);
          this.x = newPosition.x;
          this.y = newPosition.y;

        //when enter the instruction region

        if (check_inst_region(this.x) && this.y > 50 && this.y < (50 + getLength(instQueue) * tile_size)) {
           
              var posn = (this.y - 50) % tile_size + 1;
              var current = instQueue.head;
            for (i = 0; i < posn; i++) {
              current = current.next;
            }
            while (current != null) {
              current.value.y += tile_size;
              current = current.next;
            }

        } 
        // enter tiling region ( MAP )
        
      /*  if(check_tiling_region(this.x,this.y,this.name)){

          this.x = newPosition.x - newPosition.x%tile_size + tile_size/2;
          this.y = newPosition.y - newPosition.y%tile_size + tile_size/2;


          // end tile automatically change dir
          if(this.name=='end'){
            // can be optimised later
            if(toTilePos(this.x)==map_size-1){
              this.dir = [3];
              this.rotation = Math.PI/2;
            }else if(toTilePos(this.x)==0){
              this.dir = [1];
              this.rotation = Math.PI/2*3;
            }else if(toTilePos(this.y)==0){
              this.dir = [2];
              this.rotation = 0;
            }else if(toTilePos(this.y)==map_size-1){
              this.dir = [0];
              this.rotation = Math.PI/2*2;
            }
          }
        // put it to where mouse is
        }else{ 
          */
          
        
        /*
        }
*/
    
    }

}





//create instruction button
function instructionGenerator(x,y,img,name,num){
  // used by createMapParts function
  this.x = x;
  this.y = y;
  this.img = img;
  this.name = name;
  // number of parts
  if(num){
    this.count = num;
  }else{
    this.count = 1;
  }

  indicate = createInstructionParts(this.x,this.y,this.img,this.name,false, instId);
  instId ++;

  var f = createInstructionParts(this.x,this.y,this.img,this.name,true, instId); 
  instId ++;
  f.generator = this;


  var countTxt = new PIXI.Text(':'+this.count);
  countTxt.x = this.x + 60;
  countTxt.y = this.y;
  INST_BUTTON_STAGE.addChild(countTxt);

  this.gen = function(){
    // this is called when moving top pieces
    // when count is one, don't generate a new piece, 
    if(this.count > 1){
      var m = createInstructionParts(this.x,this.y,this.img,this.name,true, instId);
      instId ++; 
      m.generator = this;
      this.count --;
    }else{
      this.count = 0;
    }
    this.update();
  }
  
  this.update = function(){
    countTxt.setText(':'+this.count);
  }

}


function createInstructionParts(x,y,img, name, active, idnum){
  var tex_instruct = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_instruct);
 
  part.interactive = active;
  part.buttonMode = true;
  part.anchor.set(0.5);
  part.width = tile_size*2;
  part.height = tile_size;
  part.position.x = x;
  part.position.y = y;
  part.idnumber = idnum;
  // to distinguish between turning road and dragging road 
  part.dragged = false;
  // when it is being created, the piece is fresh,
  // used to maintain the counts for same type of piece
  part.fresh = true;
  part.started = false;
  // position on map
  part.pos_x = -1;
  part.pos_y = -1;
  part.name = name;
  //part.dir = dir_dict[name];

  // these variables are only used for creating 
  // another road
  //part.img = img;
  //part.ox = x;
  //part.oy = y;


  part
    // events for drag start
    .on('mousedown', onInstDragStart)
    .on('touchstart', onInstDragStart)
    // events for drag end
    .on('mouseup', onInstDragEnd)
    .on('mouseupoutside', onInstDragEnd)
    .on('touchend', onInstDragEnd)
    .on('touchendoutside', onInstDragEnd)
    // events for drag move
    .on('mousemove', onInstDragMove)
    .on('touchmove', onInstDragMove);//haha
  INST_BUTTON_STAGE.addChild(part);
  
  return part;
}


// single linked list
function LinkedList(){  
  this.head = null;
}

LinkedList.prototype.push = function(val){
    var node = {
       value: val,
       next: null
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
  }

  LinkedList.prototype.remove = function(val){
    var current = this.head;
    //case-1
    if(current.value == val){
       this.head = current.next;     
    }
    else{
      var previous = current;
      
      while(current.next){
        //case-3
        if(current.value == val){
          previous.next = current.next;          
          break;
        }
        previous = current;
        current = current.next;
      }
      //case -2
      if(current.value == val){
        previous.next == null;
      }
    }
      

  }  


  function findLoopStart(sll){
    var slow = sll.head,
        fast = sll.head;
    while(slow && fast){
       slow = slow.next;
 
       //if hits null, then there is no loop
       if(!fast.next){
          return null;
       }
 
       fast = fast.next.next;
       if(slow == fast){
           slow = sll.head;
           while(slow != fast){
              slow = slow.next;
              fast = fast.next;
           }
           return slow;
       }
   }
}

  function getLength(sll){
   var head = sll.head,
       current = head,
       pointer = head,
       anotherPtr,
       len = 0;
    //use the previously written function
    var loopStartNode = findLoopStart(sll);
    if(!loopStartNode){
       while(current){
          current= current.next;
          len++;
       }
       return len;
    }
    else{       
       anotherPtr = loopStartNode;
       while(pointer != anotherPtr){
          len += 2;
          pointer = pointer.next;
          anotherPtr = anotherPtr.next;          
       }
       return len;
    }
}
        
