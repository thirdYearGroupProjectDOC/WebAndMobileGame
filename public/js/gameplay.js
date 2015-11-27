var renderer = PIXI.autoDetectRenderer(1200, 800,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

console.log(levelData);//configuration of level in JSON format

$("#saveButton").click(function(event) { // when save button clicked
  event.preventDefault(); //prevent page from reload
  set_level_data();
  console.log(levelInfo);
  $.post( '/test',{author:'Sam',LevelInfo:JSON.stringify(levelInfo)}, function(data) { // post the parameter a2 to test.js
    alert(data); //alert the data after getting reply
  });
});

// create the root of the scene graph
var stage = new PIXI.Container();

// for messages
var ERROR_STAGE = new PIXI.Container();

// map base, put all tiles into one container
var MAP_STAGE = new PIXI.Container();
stage.addChild(MAP_STAGE);

// create background
map_bg_init();

// setting map to reletive zero position
MAP_STAGE.x = zero_x;
MAP_STAGE.y = zero_y;
// store map pieces to be selected
ROAD_STAGE = new PIXI.Container();
MAP_STAGE.addChild(ROAD_STAGE);
// store map pieces on map
ROAD_ON_MAP_STAGE = new PIXI.Container();
MAP_STAGE.addChild(ROAD_ON_MAP_STAGE);

ROAD_INDICATOR_STAGE = new PIXI.Container();
ROAD_STAGE.addChild(ROAD_INDICATOR_STAGE);


// create road part from image, can be dragged to fit on map,
// for detail of each parameter, see createMapParts&&generator in MapParts.js
var road_monster = new MapPartsGenerator(selects_x,selects_y,'assets/spt_monster.png','monster',0,3);
var road_corner = new MapPartsGenerator(selects_x,selects_y+tile_size*1.5,'assets/Newburg/road_turn.png','corner',0,3);
var road_end = new MapPartsGenerator(selects_x,selects_y+tile_size*3,'assets/spt_road_end.png','end',0,3);

var road_straight = new MapPartsGenerator(selects_x,selects_y+tile_size*4.5,'assets/Newburg/road_straight.png','straight',0,3);
var road_t = new MapPartsGenerator(selects_x,selects_y+tile_size*6,'assets/Newburg/road_t.png','t',0,3);
var road_tree = new MapPartsGenerator(selects_x,selects_y+tile_size*7.5,'assets/Newburg/rock.png','tree',0,3); 

// utility buttons, function defined in buttonfunctions.js
start_button = createButton(180,550,'assets/spt_inst_start.png',start_function);

//set_level_button = createButton(250,450,'assets/spt_inst_start.png',set_level_data);

//show_msg(levelData.data.player);



instruction_stage_button = createButton(180,500,'assets/spt_inst_start.png',to_instruction_part);
map_stage_button = createButton(180,460,'assets/spt_inst_start.png',to_map_part);
stage.removeChild(map_stage_button);


// create player
var player = Player();
// used in game reset
player.ox = player.pos_x;
player.oy = player.pos_y;
player.odir = player.face_dir;

if(!create_level){
  get_level_data(levelData.data);
}

// instructions waiting to be read
/* OLD
var instQueue = [];
var instPointer = 0;
*/

//  new
//var LinkedList = require('linkedlist');
var instQueue = new LinkedList();

var step = 0;

// stage for instructions stacks, not buttons
var INSTRUCT_STAGE = new PIXI.Container();
stage.addChild(INSTRUCT_STAGE);

INSTRUCT_STAGE.x = queue_x;
INSTRUCT_STAGE.y = queue_y;

//undo_button = createButton(700,200,'assets/undo.png',stack_undo);
reset_button = createButton(310,510,'assets/reset.png',game_reset);

var INST_BUTTON_STAGE = new PIXI.Container();
var INST_BUTTON_TXT_STAGE = new PIXI.Container();
INST_BUTTON_STAGE.addChild(INST_BUTTON_TXT_STAGE);


// new
var move_forward = new instructionGenerator(selects_x+250, 50,'assets/spt_inst_forward.png', 'forward', 3 );
var turn_right = new instructionGenerator(selects_x+250, 130, 'assets/spt_inst_right.png', 'right', 3);
var turn_left = new instructionGenerator(selects_x+250, 210, 'assets/spt_inst_left.png', 'left', 3);
stage.addChild(ERROR_STAGE);

graphics = new PIXI.Graphics();

graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0xFF00BB, 0.25);
graphics.drawRoundedRect(INSTRUCT_STAGE.x, INSTRUCT_STAGE.y, tile_size*2, tile_size, 15);
//graphics.drawRoundedRect, 250, 200, 120, 5);

graphics.endFill();

stage.addChild(graphics);
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


    // when player are moving or turning
    if((player.xmov != 0) || (player.ymov != 0) || (player.wait != 0)){
      instruction_animation();
    }

    //when one step is finished, read next instruction
    if (start && player.xmov == 0 && player.ymov == 0 
      && player.wait == 0 && instQueue.length != 0 && (count - store)>65) {
      store = count;
      execute_inst_queue();
      step++;
    }

    count += 1;
}


