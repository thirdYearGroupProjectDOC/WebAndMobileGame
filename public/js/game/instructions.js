
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


/*

*/
// create undo instruction



function createUndoButton(x,y,img){
  var undo_tex = PIXI.Texture.fromImage(img);
  var undo_button = new PIXI.Sprite(undo_tex);
  undo_button.width = 65;
  undo_button.height = 65;
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

  instPointer--;
  instQueue[instPointer] = -1;

  cur = INSTRUCT_STAGE.children[instPointer]
  INSTRUCT_STAGE.removeChild(cur);
  cur.button.generator.count++;
  cur.button.generator.update();
}

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
      INST_BUTTON_STAGE.children[i].interactive = true;
    }

    ERROR_STAGE.removeChildren();
    
    start_button.interactive = true;
    INSTRUCT_STAGE.removeChildren();
    instQueue = [];
    instPointer = 0;
    step = 0;
}

function inst_button(x,y,count){
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


// create a button with drop-down menu, i.e. loop start button
function createDropDownInstructions(x,y,img,inst) {
  var instruct_tex = PIXI.Texture.fromImage(img);
  var instruction = new PIXI.Sprite(instruct_tex);

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
  INST_BUTTON_STAGE.addChild(loopTimeText);
  
  //used for update text value
  instruction.loopTime = loopTimeText;
  
  // drop down menu container
  var drop = new PIXI.Container();
  drop.x = INST_BUTTON_STAGE.x;
  drop.y = INST_BUTTON_STAGE.y;
  drop.instButt = instruction;
  instruction.con = drop;
  INST_BUTTON_STAGE.addChild(drop);
  
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
      txt.wrapper = this.con;
      this.con.addChild(txt);
    }
  } else {
    this.menuShown = false;
  }
}

function dropDownTxtClicked() {
  this.wrapper.instButt.menuShown = false;
  this.wrapper.instButt.loopTime.setText(this.repeat_time);
  this.wrapper.removeChildren();
}
