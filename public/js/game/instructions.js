// defines distance bwtween generator ( pile of instructions)
// and where the execution stack lives
var gap = tile_size * 3;

//check if it is in the instruction region
function check_inst_region(x,y,length){

     var res = (x > gap) && (x < gap+tile_size*2) &&
            (y > tile_size/2) &&
            (y < tile_size/2+tile_size*(length+1));
      if(res){
        //show_msg('x :' +x+ 'y: '+y);
      }
      return res;
}


function to_Inst_pos(y){

   return ( Math.floor((y + tile_size/2)/tile_size)-1);
}


function onInstDragStart(event){

    this.data = event.data;
    this.started = true;
    this.alpha = 0.8;
    this.dragging = true;
    /*
    INSTRUCT_STAGE.addChild(this);
    INST_BUTTON_STAGE.remove(this);
*/
}

function onInstDragEnd(event){

  if(this.started){
    this.dragging = false;
    this.started = false;
    this.alpha = 1;
  }

  // drag instruction piece to outside will make it be returned to deck
  if(!check_inst_region(this.x,this.y,instQueue.length)
      && this.x!=this.generator.x && this.y != this.generator.y){
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

  cur_inst = instQueue.head;
//  show_msg('get here: execute: '+execute);
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
        if(check_inst_region(newPosition.x,this.y,instQueue.length)){
          //show_msg('h');
          this.x = gap+tile_size;//newPosition.x - newPosition.x % (tile_size) + tile_size;
          this.y = newPosition.y ;//- newPosition.y%tile_size + tile_size/2;

          // find position to insert in
          var temp_pos = to_Inst_pos(this.y);
          //remove and insert => update position
          if(instQueue.contain(this)){
            instQueue.remove(this);
          }
          instQueue.insert(temp_pos,this);
          
        }else{
          // remove, if not find , nothing happens
          instQueue.remove(this);
          this.x = newPosition.x;
          this.y = newPosition.y;
        }
        //update pixel position based on instQueue
        instQueue.update();
    }
}






//create instruction button
function instructionGenerator(x,y,img,inst,num){
  // used by createMapParts function
  this.x = x;
  this.y = y;
  this.img = img;
  this.inst = inst;
  // number of parts
  if(num){
    this.count = num;
  }else{
    this.count = 1;
  }

  indicate = createInstructionParts(this.x,this.y,this.img,this.inst,false);
  indicate.indicate = true;

  var f = createInstructionParts(this.x,this.y,this.img,this.inst,true); 
  f.generator = this;


  var countTxt = new PIXI.Text(':'+this.count);
  countTxt.x = this.x + 60;
  countTxt.y = this.y;
  INST_BUTTON_STAGE.addChild(countTxt);

  this.gen = function(){
    // this is called when moving top pieces
    // when count is one, don't generate a new piece, 
    if(this.count > 1){
      var m = createInstructionParts(this.x,this.y,this.img,this.inst,true);
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

function createInstructionParts(x,y,img, inst, active){
  var tex_instruct = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_instruct);
  // so it appear before loop count or if statement
  INST_BUTTON_STAGE.addChild(part);

  part.interactive = active;
  part.buttonMode = true;
  part.anchor.set(0.5);
  part.width = tile_size*2;
  part.height = tile_size;
  part.position.x = x;
  part.position.y = y;
  // to distinguish between turning road and dragging road 
  part.dragged = false;
  // when it is being created, the piece is fresh,
  // used to maintain the counts for same type of piece
  part.fresh = true;
  part.started = false;
  // position on map
  part.pos_x = -1;
  part.pos_y = -1;
  part.inst = inst;


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
  
  if(inst==inst_dict.for_loop){
    this.loop_count = 3;
    var countTxt = new PIXI.Text(':'+this.loop_count);
    countTxt.width *= 0.8;
    countTxt.height *= 0.8;
    countTxt.x = part.x - 5 ;//
    countTxt.y = part.y - 5;
    INST_BUTTON_STAGE.addChild(countTxt);

    
  }

  return part;
}


/*
<<<<<<< HEAD
function instructionButtonUpOutside() {
   this.down = false;
} 

function instructionButtonDown() {
   this.down = true;
}

// text counter for drop_down_button
function inst_drop_down_button(x,y,count) {
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
    var ib = createDropDownInstructions(this.x,this.y,img,inst);
    ib.generator = this;
  }
}

// create a button with drop-down menu, i.e. loop start button
function createDropDownInstructions(x,y,img,inst) {
  var instruct_tex = PIXI.Texture.fromImage(img);
  var instruction = new PIXI.Sprite(instruct_tex);
  var drop = new PIXI.Container();
  drop.x = INST_BUTTON_STAGE.x;
  drop.y = INST_BUTTON_STAGE.y;

  instruction.menuShown = false;
  instruction.dir = inst;

  instruction.width = tile_size*2;
  instruction.height = tile_size/2;
  instruction.buttonMode = true;
  instruction.interactive = true;
  instruction.x = x;
  instruction.y = y;

  // default repeat time 
  // this variable is used for executing instrructions.
  instruction.repeat_time = 3;
  var loopTimeText = new PIXI.Text(instruction.repeat_time);
  loopTimeText.width *= 0.8;
  loopTimeText.height *= 0.8;
  loopTimeText.x = instruction.x + 55;
  loopTimeText.y = instruction.y + 5;
  
  INST_BUTTON_STAGE.addChild(instruction); 
  drop.addChild(loopTimeText);
  
  //used for update text value
  instruction.loopTime = loopTimeText;
  
  drop.button_parent = instruction;
  instruction.drop_down = drop;
  stage.addChild(drop);
  
  instruction
    .on('mousedown', instructionButtonDown)
    .on('touchstart', instructionButtonDown)

      // set the mouseup and touchend callback...
    .on('mouseup', instructionDropDownButtonUp)
    .on('touchend', instructionButtonUp)

    .on('mouseupoutside', instructionButtonUpOutside)
    .on('touchendoutside', instructionButtonUpOutside)

      // set the mouseover callback...
    .on('mouseover', instructionButtonOver)

      // set the mouseout callback...
    .on('mouseout', instructionButtonOut);


  instruction.tap = null;
  instruction.click = null; 
   
   return instruction;
}


function instructionDropDownButtonUp() {
  if (this.menuShown == false) {
    this.menuShown = true;
    for (var i = 0; i < 9; i++) {
      var txt = new PIXI.Text(i+1, {font: '20px bold'});
      txt.x = this.x + 50;
      txt.y = this.y + 30+ (i+1)*20;
      txt.interactive = true;
      txt.repeat_time = i + 1;
      txt.on('mousedown', dropDownTxtClicked);
      txt.on('touchstart', dropDownTxtClicked);
      txt.drop_parent = this.drop_down;
      this.drop_down.addChild(txt);
    }
  } else {
    this.menuShown = false;
  }
}

function dropDownTxtClicked() {
  var b_parent = this.drop_parent.button_parent;
  b_parent.menuShown = false;
  b_parent.loopTime.setText(this.repeat_time);
  this.drop_parent.removeChildren();
  this.drop_parent.addChild(b_parent.loopTime);
}


function instruction_animation(){
  var cur = instQueue[step-1];
  var last = instQueue[step-2];

  //move up and scale
  cur.y -= 1;
  cur.height += 1;
  cur.x -= 0.5;
  cur.width += 1;
  
  // random changing color, need better animation here
  if(count % 5 == 0){
    cur.tint = Math.random()* 0xF1FFFF;
  }

  // last instruction restore to original size
  if(last){
    last.height -= 1;
    last.width -= 1;
    last.x += 0.5;
  }
}

*/