var renderer = PIXI.autoDetectRenderer(1200, 800,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

// size of the actuall game size
var map_size = 5;
// for start and end point
map_size +=2;
var map = [];
for(var i = 0; i<Math.pow(map_size,2); i++){
    map[i] = null;
}

// tile size , depends on screen later
var tile_size = 60;
// where the first road begin
var zero_x = 80;
var zero_y = 60;

var selects_x = 500;
var selects_y = 0;

// create the root of the scene graph
var stage = new PIXI.Container();
// map base, put all tiles into one container
var MAP_STAGE = new PIXI.Container();

stage.addChild(MAP_STAGE);

// create background
for (var j = 1; j < map_size-1; j++) {
    for (var i = 1; i < map_size-1; i++) {
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

// setting directions of road pieces according to image's default direction
// for detail and usage see the comments below
dir_dict = {'monster':[-1], 'corner':[0,3], 'end':[2], 'straight':[0,2], 't':[1,2,3], 'tree':[]};


ROAD_STAGE = new PIXI.Container();
MAP_STAGE.addChild(ROAD_STAGE);


// create road part from image, can be dragged to fit on map,
// for detail of each parameter, see createMapParts&&generator in MapParts.js
var road_monster = new MapPartsGenerator(selects_x,selects_y,'assets/spt_monster.png','monster',0,3);
var road_corner = new MapPartsGenerator(selects_x,selects_y+tile_size*1.5,'assets/spt_road_corner.png','corner',0,3);
var road_end = new MapPartsGenerator(selects_x,selects_y+tile_size*3,'assets/spt_road_end.png','end',0,3);
var road_straight = new MapPartsGenerator(selects_x,selects_y+tile_size*4.5,'assets/spt_road_straight.png','straight',0,3);
var road_t = new MapPartsGenerator(selects_x,selects_y+tile_size*6,'assets/spt_road_t.png','t',0,3);
var road_tree = new MapPartsGenerator(selects_x,selects_y+tile_size*7.5,'assets/spt_tree.png','tree',0,3); 

// create start button
start_button = createStartButton(180,550,'assets/spt_inst_start.png');

// create player
var player_tex = PIXI.Texture.fromImage('assets/spt_boy.png');
var player = new PIXI.Sprite(player_tex);
// position and size

player.x = tile_size*1;
player.y = tile_size*1;

player.width = tile_size;
player.height = tile_size;

// position on map, only descrete numbers
player.pos_x = 1;
player.pos_y = 1;
var player_dir = 1;
player.isWalking = false;

// used in main loop for moving on canvas
player.xmov = 0;
player.ymov = 0;
player.speed = tile_size/60;
player.wait = 0;

MAP_STAGE.addChild(player); 


// instructions waiting to be read
/* OLD
var instQueue = [];
var instPointer = 0;
*/

//  new
//var LinkedList = require('linkedlist');
var instQueue = new LinkedList();

var step = null;

var instId = 0;

// stage for instructions stacks, not buttons
var INSTRUCT_STAGE = new PIXI.Container();

stage.addChild(INSTRUCT_STAGE);


// create instruction background
/*
for (var j = 1; j < 10; j++) {
        var instbg = PIXI.Sprite.fromImage('assets/background.png');
        instbg.x = 150;
        instbg.y = tile_size * j;
        instbg.height = tile_size;
        instbg.width = tile_size*2;
        INSTRUCT_STAGE.addChild(instbg);
    };
*/

var queue_x = 890;
var queue_y = 30;

INSTRUCT_STAGE.x = queue_x;
INSTRUCT_STAGE.y = queue_y;

/*
var instruct_region_x = 890;
var instruct_region_y = 30;
*/
//undo_button = createUndoButton(700,250,'assets/undo.png');
reset_button = createResetButton(310,510,'assets/reset.png');

var INST_BUTTON_STAGE = new PIXI.Container();
stage.addChild(INST_BUTTON_STAGE);


// new
var move_forward = new instructionGenerator(selects_x+250, 50,'assets/spt_inst_forward.png', "forward", 3 );
var turn_right = new instructionGenerator(selects_x+250, 130, 'assets/spt_inst_right.png', "right", 3);
var turn_left = new instructionGenerator(selects_x+250, 210, 'assets/spt_inst_left.png', "left", 3);


// boolean for start executing instructions
var start = false;
// for slower step animation
var count = 0;
// store count,
// used for set time intervel between read instructions
var store = 0;
// intervel between reading instructions
// size/speed is the time each instruction takes
var intervel = tile_size/player.speed + 5;

animate();
function animate(){
    player.x += player.speed*Math.sign(player.xmov);
    player.y += player.speed*Math.sign(player.ymov);
    player.xmov = Math.sign(player.xmov) * (Math.abs(player.xmov)-player.speed);
    player.ymov = Math.sign(player.ymov) * (Math.abs(player.ymov)-player.speed);
    
    if(player.wait != 0){
      player.wait --;
    }

    requestAnimationFrame(animate);
    renderer.render(stage);

    //when one step is finished, read next instruction
    if (start && step != null && player.xmov == 0 && player.ymov == 0  && player.wait == 0 && 
  //    instQueue.length != 0 &&
       count - store>65) {
      store = count;
      player_start();
      step = step.next;
      

      // while executing instructions, can't move road pieces,
      // can only be set back by reset button
      for(var i = 0; i < MAP_STAGE.children.length; i++){
        ROAD_STAGE.children[i].interactive = false;
      }

    }
    
    count += 1;
}



// used for printing message on screen
function show_msg(msg){
    var spinningText = new PIXI.Text(msg, { font: 'bold 60px Arial', fill: '#cc00ff', align: 'center', stroke: '#FFFFFF', strokeThickness: 6 });

    spinningText.anchor.set(0.5);
    spinningText.x = 500+Math.random()*200;
    spinningText.y = 200+Math.random()*200;
    stage.addChild(spinningText);
}



/* @dir is the direction player moves, 0 notrh and clockwise inc
*  first check whether the road player stands on has this dir
*  then check boundries
*/
function player_move(dir){

  // get direction!
  // can only be +1, -1
  var xmov = (2-dir)*dir%2;
  var ymov = (dir-1)*(1-dir%2);

  var cur = player.pos_y*map_size+player.pos_x;
  var dst = (player.pos_y+ymov)*map_size + player.pos_x+xmov;

  //opsite direction
  var op = (dir+2)%4;
  // check road condition
  if(dst<map_size*map_size && map[cur].indexOf(dir)!=-1
    && map[dst].indexOf(op)!=-1){

    player.xmov = xmov*tile_size;
    player.ymov = ymov*tile_size;



    player.pos_x += xmov;
    player.pos_y += ymov;

  }
  

  player.aim_x += xmov*tile_size;
  player.aim_y += ymov*tile_size;

}


