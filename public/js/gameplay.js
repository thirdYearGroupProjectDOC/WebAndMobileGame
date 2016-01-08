var renderer = PIXI.autoDetectRenderer(1600, 800,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

verified = false;

console.log(levelData);//configuration of level in JSON format

$("#saveButton").click(function(event) { // when save button clicked
  if(verified){
    set_level_data();
    console.log(levelInfo);
    $.post( '/test',{author:'Sam',LevelInfo:JSON.stringify(levelInfo)}, function(data) { // post the parameter a2 to test.js
      alert('succesfully created level!'); //alert the data after getting reply
    });
    // prevent game board becomes invalid again
    LevelInfo = null;
  }else{
    alert('veryfy level first');   
  }
});


$("#verifyButton").click(function(event) { // when save button clicked
  if(validation()){
    verified = true;
    alert('The road is valid! \n you can now publish the level ');
  }else{
    verified = false;
    alert('Can\'t find valid road :( ');   
  }
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

//the road pieces underneath each generater, 
ROAD_INDICATOR_STAGE = new PIXI.Container();
ROAD_STAGE.addChild(ROAD_INDICATOR_STAGE);


// for setting numbers of road pieces
pieces = {corner:25, straight:25, t:25 };
// create road part from image, can be dragged to fit on map,
// for detail of each parameter, see createMapParts&&generator in MapParts.js
if(create_level){
  var road_monster = new MapPartsGenerator(selects_x + tile_size*2,selects_y+tile_size*1.5 ,
    'assets/spt_monster.png','monster',0,25);
  var road_tree = new MapPartsGenerator(selects_x + tile_size*2,selects_y+tile_size*3,
    'assets/Newburg/rock.png','tree',0,25);
  var road_end = new MapPartsGenerator(selects_x + tile_size*2,selects_y+tile_size*4.5,
    'assets/spt_road_end.png','end',0,25);

}else{
  pieces = levelData.data.pieces;
}

var road_corner = new MapPartsGenerator(selects_x ,selects_y+tile_size*1.5,
  'assets/Newburg/road_turn.png','corner',0,pieces.corner);
var road_straight = new MapPartsGenerator(selects_x,selects_y+tile_size*3,
  'assets/Newburg/road_straight.png','straight',0,pieces.straight);
var road_t = new MapPartsGenerator(selects_x,selects_y+tile_size*4.5,
  'assets/Newburg/road_t.png','t',0,pieces.t);

// create player
var player = Player();


//DIVIDE FUNCTIONALITIES
if (create_level) {
  stage.removeChild(INST_BUTTON_STAGE);
  clear_button = createButton(selects_x+tile_size*2,selects_y+tile_size*7,
    'assets/map_clear.png', map_clear);
} else {
  var y = zero_y+tile_size*map_size+tile_size*0.6;

  get_level_data(levelData.data);
  // STAGE TRANSFORM BUTTON
  instruction_stage_button = createButton(zero_x+tile_size,y,
    'assets/next.png',to_instruction_part,1);
  map_stage_button = createButton(zero_x+tile_size,y,
    'assets/previous.png',to_map_part,1);
  stage.removeChild(map_stage_button);
  //RESET BUTTON 
  reset_road_button = createButton(zero_x+tile_size*4,y,'assets/map_clear.png',road_reset);
  reset_game_button = createButton(zero_x+tile_size*4.7,y,'assets/stop_button.png',game_reset,1);
  stage.removeChild(reset_game_button);
  reset_inst_button = createButton(zero_x+tile_size*6,y,'assets/inst_clear.png',inst_reset,1);
  stage.removeChild(reset_inst_button);
  //START BUTTON
  start_button = createButton(zero_x+tile_size*3,y,'assets/spt_inst_start.png',start_function);
  stage.removeChild(start_button);
  
  // speed change button
  speed_button = createButton(zero_x+tile_size*7.5,y,
    'assets/spt_speed_button.png',speed_times_two,1,speed_reset);

  //START FRAME
  var start_frame_tex = PIXI.Texture.fromImage('assets/execute_frame.png');
  var start_frame = new PIXI.Sprite(start_frame_tex);
  start_frame.x = start_button.x;
  start_frame.y = start_button.y;
  start_frame.height = tile_size;
  start_frame.width = tile_size*2;;
  start_frame.anchor.set(0.5);
}

// executing instructions from this list
var instQueue = new LinkedList();


var step = null;


var INST_BUTTON_STAGE = new PIXI.Container();
var INST_BUTTON_TXT_STAGE = new PIXI.Container();
INST_BUTTON_STAGE.addChild(INST_BUTTON_TXT_STAGE);
INST_BUTTON_STAGE.x = inst_x;
INST_BUTTON_STAGE.y = inst_y;


// stage for instructions stacks, not buttons
var INSTRUCT_STAGE = new PIXI.Container();
INST_BUTTON_STAGE.addChild(INSTRUCT_STAGE);

INST_INDICATOR_STAGE = new PIXI.Container();
INST_BUTTON_STAGE.addChild(INST_INDICATOR_STAGE);

// message that has a button, click on button will destroy this msg board
MSG_BOARD_STAGE = new PIXI.Container();
MSG_BOARD_STAGE.x = 300;
MSG_BOARD_STAGE.y = 300;
stage.addChild(MSG_BOARD_STAGE);

// instructions
var move_forward = new instructionGenerator(0, tile_size,'assets/spt_inst_forward.png', inst_dict.forward, 9 );
var turn_right = new instructionGenerator(0, tile_size*2+5, 'assets/spt_inst_right.png', inst_dict.right, 9);
var turn_left = new instructionGenerator(0, tile_size*3+5*2, 'assets/spt_inst_left.png', inst_dict.left, 9);
var for_end = new instructionGenerator(0, tile_size*4+5*3, 'assets/spt_inst_repeat_end.png', inst_dict.for_end, 9);
var for_loop = new instructionGenerator(0, tile_size*5+5*4, 'assets/spt_inst_repeat_time.png', inst_dict.for_loop, 9);


stage.addChild(ERROR_STAGE);

// indicater for user to put instructions
nxt_pos = new PIXI.Graphics();

nxt_pos.lineStyle(2, 0xFF00FF, 1);
nxt_pos.beginFill(0xFF00BB, 0.25);
nxt_pos.drawRoundedRect(0, 0, tile_size*2, tile_size/2, 15);
nxt_pos.endFill();


// indicater of execution of instructions
var inst_frame = new PIXI.Sprite(start_frame_tex);
inst_frame.height = tile_size/2;
inst_frame.width = tile_size*2;;
inst_frame.anchor.set(0.5);
//stage.addChild(inst_frame);


//stage.addChild(graphics);
// boolean for start executing instructions
var execute = false;
// for slower step animation
count = 0;
// store count,
// used for set time intervel between read instructions
store = 0;
// intervel between reading instructions
// size/speed is the time each instruction takes
var intervel = tile_size/player.speed + 5;

// current instruction, last instruction
// cur_inst is currently updated at every instruction onInstEnd method
cur_inst = null;
last_inst = null;
for_start = null;
for_end = null;

// this text is used for getting run time updated values, for debugging purpose only
var text = new PIXI.Text(' ');
text.x= 300;
text.y= 100;
stage.addChild(text);





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

    //read instructions if player not moving and there are instructions to read,
    // count- store can be used to set time intervels 
    if (execute && player.xmov == 0 && player.ymov == 0 && cur_inst != null
          && player.wait == 0 && instQueue.length != 0 && (count - store)>65) {
      store = count;

      INST_BUTTON_STAGE.addChild(inst_frame);
      inst_frame.x = cur_inst.value.x;
      inst_frame.y = cur_inst.value.y;
      /*text.text = cur_inst.value.inst + ', queue: ' + instQueue.length
             +' player.xmov '+ player.xmov +' player.ymov ' + player.ymov;*/
      execute_inst_queue();

    }

    if(execute){
      if(count % 10 == 0){
        start_frame.tint = Math.random()* 0xF1FFFF;
      }
    }else{
      INST_BUTTON_STAGE.removeChild(inst_frame);
    }

    //congratulation message
    if(on_map_boarder(player.pos_x,player.pos_y) &&
        (player.pos_x!=player.ox ||
        player.pos_y!=player.oy) &&
        player.xmov==0 &&
        player.ymov==0 ){
      show_msg_board('congratulations!');

    }


    /*else{
      show_msg(start);
      show_msg(instQueue.length);
    }*/

    count += 1;
}
