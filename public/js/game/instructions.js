// text counter for instruction button
function inst_button(x,y,count){
  this.count = count;
  this.max = count;
  this.x = x;
  this.y = y;

  var countTxt = new PIXI.Text(':'+count);
  countTxt.x = this.x + tile_size+ 45;
  countTxt.y = this.y;
  INST_BUTTON_TXT_STAGE.addChild(countTxt);

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