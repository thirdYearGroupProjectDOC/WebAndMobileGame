
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

   //for (var i=0; i<instructionsQueuePointer; i++) {
       INSTRUCT_STAGE.children[step].alpha = 0.5;
       switch (instructionsQueue[step]) {
        case 0:
            player_move(player_dir);
            break;
        case 1:
            player_dir = (player_dir + 3) % 4;
            break;
        case 2:
            player_dir = (player_dir + 1) % 4;
            break;

        default:
            break;
       }
 //  }

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

    if (instructionsQueuePointer > 0) {
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

   instructionsQueuePointer--;
   instructionsQueue[instructionsQueuePointer] = -1;
   INSTRUCT_STAGE.removeChild(INSTRUCT_STAGE.children[instructionsQueuePointer]);

}

// create reset button



function createResetButton(x,y,img){
  var reset_tex = PIXI.Texture.fromImage(img);
  var reset_button = new PIXI.Sprite(reset_tex);
  reset_button.width = tile_size*2;
  reset_button.height = tile_size;
  reset_button.buttonMode = true;
  reset_button.position.x = x;
  reset_button.position.y = y;
  // make the button interactive...
  reset_button.interactive = true;
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

   player.x = 0;
   player.y = 0;
   player.pos_x = 0;
   player.pos_y = 0;
   player_dir = 1;
   player.isWalking = false;
   player.aim_x = 0;
   player.aim_y = 0;
  // player.xmov = 0;
  // player.ymov = 0;

   for (var i = instructionsQueuePointer - 1; i >= 0; i--) {
       instructionsQueue[i] = -1;
       INSTRUCT_STAGE.removeChild(INSTRUCT_STAGE.children[i]);

   }
   instructionsQueuePointer = 0;
   step = 0;
}



// create instructions

function createInstructions(x,y,img) {

  var instruct_tex = PIXI.Texture.fromImage(img);
  var instruction = new PIXI.Sprite(instruct_tex);


  if (img == 'assets/spt_inst_right.png') {
     instruction.dir = 2;
  } else if (img =='assets/spt_inst_forward.png') {
    instruction.dir = 0;
  } else if (img =='assets/spt_inst_left.png') {
    instruction.dir = 1;
  }

  instruction.width = tile_size*2;
  instruction.height = tile_size/2;
  instruction.buttonMode = true;
  instruction.interactive = true;
  instruction.position.x = x;
  instruction.position.y = y;
  
  
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
   stage.addChild(instruction); 
   return instruction;
}

function instructionButtonDown() {
   this.down = true;
}

function instructionButtonUp() {
   this.down = false;
   instructionsQueue[instructionsQueuePointer] = this.dir;
   instructionsQueuePointer++;

   //put instruction symbol in the stack
   if (this.dir == 2) {
      instr = PIXI.Sprite.fromImage('assets/spt_inst_right.png');
      
   } else if (this.dir == 0) {
      instr = PIXI.Sprite.fromImage('assets/spt_inst_forward.png');
   } else if (this.dir == 1) {
      instr = PIXI.Sprite.fromImage('assets/spt_inst_left.png');
   }

      instr.x = 50;
      instr.y = 50*(instructionsQueuePointer-1);
      instr.height = tile_size/2;
      instr.width = tile_size*2;
      INSTRUCT_STAGE.addChild(instr);

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

