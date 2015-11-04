var renderer = PIXI.autoDetectRenderer(1200, 800,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

// size of the actuall game size
var map_size = 5;
var map = [];
for(var i = 0; i<map_size*map_size; i++){
    map[i] = null;
}

// tile size , depends on screen later
var tile_size = 80;
// where the first road begin
var zero_x = 80;
var zero_y = 60;

var selections_x = 600;
var selections_y = 50;

// create the root of the scene graph
var stage = new PIXI.Container();
// map base, put all tiles into one container
var MAP_STAGE = new PIXI.Container();

stage.addChild(MAP_STAGE);
// create background
for (var j = 0; j < map_size; j++) {
    for (var i = 0; i < map_size; i++) {
        var bg = PIXI.Sprite.fromImage('assets/background.png');
        bg.x = tile_size * i;
        bg.y = tile_size * j;
        bg.height = tile_size;
        bg.width = tile_size;
        MAP_STAGE.addChild(bg);
    };
};
MAP_STAGE.x = zero_x;
MAP_STAGE.y = zero_y;






// create road part from image, can be dragged to fit on map,
// dir defines where it points to that leads to another road,
// 0 is north, 1 is east, 2 is south, 3 is west, -1 is hell :)
var road_monster = createMapParts(selections_x,selections_y,'assets/spt_monster.png');
road_monster.dir = [-1];
var road_corner = createMapParts(selections_x,selections_y+100,'assets/spt_road_corner.png');
road_corner.dir = [0,3];
var road_end = createMapParts(selections_x,selections_y+200,'assets/spt_road_end.png');
road_end.dir = [2];
var road_straight = createMapParts(selections_x,selections_y+300,'assets/spt_road_straight.png');
road_straight.dir = [0,2];
var road_t = createMapParts(selections_x,selections_y+400,'assets/spt_road_t.png');
road_t.dir = [1,2,3];
var road_tree = createMapParts(selections_x,selections_y+500,'assets/spt_tree.png'); 
road_tree.dir = [];



// create start button
start_button = createStartButton(180,550,'assets/spt_inst_start.png');

var player_tex = PIXI.Texture.fromImage('assets/spt_boy.png');
var player = new PIXI.Sprite(player_tex);
player.x = zero_x;
player.y = zero_y;
player.width = tile_size;
player.height = tile_size;
player.pos_x = 0;
player.pos_y = 0;
var player_dir = 1;


stage.addChild(player);

animate();
function animate(){
  //show_msg(map);
  requestAnimationFrame(animate);
  renderer.render(stage);
}






// for Map Parts only
function onDragStart(event){
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.8;
    this.dragging = true;
    if(check_in_map(this.pos_x,this.pos_y)){
        map[this.pos_y*map_size+this.pos_x] = null;
    }
}

// for Map Parts only
function onDragEnd(){
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
    if(this.dragged != true){
        this.rotation+=Math.PI/2;
        turn_dir(this.dir);
    }
    this.pos_x = Math.floor(this.position.x / tile_size) - 1;
    this.pos_y = Math.floor(this.position.y / tile_size) - 1;
    this.dragged = false;
    if(check_in_map(this.pos_x,this.pos_y)){
        map[this.pos_y*map_size+this.pos_x] = this.dir;
    }
        
}

// for Map Parts only
function onDragMove(){
    if (this.dragging)
    {
        this.dragged = true;
        var newPosition = this.data.getLocalPosition(this.parent);
        // enter tiling region ( MAP )
        if(this.position.x > zero_x && this.position.x < zero_x+map_size*tile_size &&
          this.position.y > zero_y && this.position.y < zero_y+map_size*tile_size){

          this.position.x = newPosition.x - newPosition.x%tile_size+tile_size/2;
          this.position.y = newPosition.y - newPosition.y%tile_size+tile_size/4;

        // put it to where mouse is
        }else{

          this.position.x = newPosition.x;
          this.position.y = newPosition.y;
        }
    
    }
}

// for Map Parts only
function createMapParts(x,y,img){
  var tex_troad_straigh = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_troad_straigh);

  part.interactive = true;
  part.buttonMode = true;
  part.anchor.set(0.5);
  part.width = tile_size;
  part.height = tile_size;
  part.position.x = x;
  part.position.y = y;
  // to distinguish between turning road and dragging road 
  part.dragged = false;
  // position on map
  part.pos_x = -1;
  part.pos_y = -1;

  part
    // events for drag start
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    // events for drag end
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    // events for drag move
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);
  stage.addChild(part);
  return part;
}


// used for turning road
function turn_dir(dir){
  for(var i = 0; i < dir.length; i++){
    dir[i] ++;
    dir[i] %= 4;
  }
}

// used for printing message on screen
function show_msg(msg){
    var spinningText = new PIXI.Text(msg, { font: 'bold 60px Arial', fill: '#cc00ff', align: 'center', stroke: '#FFFFFF', strokeThickness: 6 });

    // setting the anchor point to 0.5 will center align the text... great for spinning!
    spinningText.anchor.set(0.5);
    spinningText.position.x = 310;
    spinningText.position.y = 200;
    stage.addChild(spinningText);
}

// checking for relative position om game map
function check_in_map(x,y){
    return x>=0 && x<map_size && y >=0 && y<map_size;
}

function createStartButton(x,y,img){
  var start_tex = PIXI.Texture.fromImage(img);
  var start_button = new PIXI.Sprite(start_tex);
  start_button.width = tile_size*2;
  start_button.height = tile_size;
  start_button.buttonMode = true;
  start_button.anchor.set(0.5);
  start_button.position.x = x;
  start_button.position.y = y;
  // make the button interactive...
  start_button.interactive = true;
  start_button
      // set the mousedown and touchstart callback...
      .on('mousedown', onButtonDown)
      .on('touchstart', onButtonDown)

      // set the mouseup and touchend callback...
      .on('mouseup', onButtonUp)
      .on('touchend', onButtonUp)
      .on('mouseupoutside', onButtonUp)
      .on('touchendoutside', onButtonUp)

      // set the mouseover callback...
      .on('mouseover', onButtonOver)

      // set the mouseout callback...
      .on('mouseout', onButtonOut)
      
  start_button.tap = null;
  start_button.click = null;
  // add it to the stage
  stage.addChild(start_button);
  return start_button;
}

function onButtonDown()
{
    this.isdown = true;
 //   player_move(1);
    this.alpha = 1;
}

function onButtonUp()
{
    this.isdown = false;

    player_start();

    if (this.isOver){
    }
    else{
    }
}

function onButtonOver()
{
    this.isOver = true;
    if (this.isdown){
        return;
    }
}

function onButtonOut()
{
    this.isOver = false;
    if (this.isdown){
        return;
    }
}

function player_start() {

   for (var i=0; i<instructionsQueuePointer; i++) {
       switch (instructionsQueue[i]) {
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
   }

}


function player_move(dir){
  switch(dir) {
    case 0:
        player.y -= tile_size;
        player.pos_y -= 1;
        break;
    case 1:
        player.x += tile_size;
        player.pos_x += 1;
        break;
    case 2:
        player.y += tile_size;
        player.pos_y += 1;
        break;
    case 3:
        player.x -= tile_size;
        player.pos_x -= 1;
        break;
    default:
        //
  }
}






// belows are edited by Zhuofan

var instructionsQueue = [];
for(var i = 0; i<map_size*map_size*2; i++){
    instructionsQueue[i] = -1;
}
var instructionsQueuePointer = 0;

var INSTRUCT_STAGE = new PIXI.Container();

stage.addChild(INSTRUCT_STAGE);


var queue_x = 800;
var queue_y = 10;

INSTRUCT_STAGE.x = queue_x;
INSTRUCT_STAGE.y = queue_y;


// aboves are edited by Zhuofan

// create undo instruction
undo_button = createUndoButton(700,200,'assets/undo.png');

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

reset_button = createResetButton(350,500,'assets/reset.png');

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

   player.x = zero_x;
   player.y = zero_y;
   player.pos_x = 0;
   player.pos_y = 0;
   player_dir = 1;

   for (var i = instructionsQueuePointer - 1; i >= 0; i--) {
       instructionsQueue[i] = -1;
       INSTRUCT_STAGE.removeChild(INSTRUCT_STAGE.children[i]);

   }
   instructionsQueuePointer = 0;
}





// create instructions
var turn_left = createInstructions(selections_x+100, 10,'assets/spt_inst_left.png');
var turn_right = createInstructions(selections_x+100, 60,'assets/spt_inst_right.png');
var move_forward = createInstructions(selections_x+100, 110,'assets/spt_inst_forward.png');


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

