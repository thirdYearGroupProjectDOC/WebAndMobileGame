var renderer = PIXI.autoDetectRenderer(1200, 800,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

console.log(levelData);//configuration of level in JSON format

$("#saveButton").click(function(event) { // when save button clicked
  event.preventDefault(); //prevent page from reload
  set_level_data();
  console.log(levelInfo);
  $.post( '/test',{author:'Sam',LevelInfo:JSON.stringify(levelInfo)}, function(data) { // post the parameter a2 to test.js
    alert('succesfully created level!'); //alert the data after getting reply
  });
  // prevent game board becomes invalid again
  LevelInfo = null;
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




//set_level_button = createButton(250,450,'assets/spt_inst_start.png',set_level_data);

//show_msg(levelData.data.player);




// create player
var player = Player();
// used in game reset
player.ox = player.pos_x;
player.oy = player.pos_y;
player.odir = player.face_dir;


//DIVIDE FUNCTIONALITIES
if (create_level) {
  stage.removeChild(INST_BUTTON_STAGE);
  clear_button = createButton(210,510,'assets/map_clear.png', map_clear);
} else {
  get_level_data(levelData.data);
  // STAGE TRANSFORM BUTTON
  instruction_stage_button = createButton(180,460,'assets/to_inst.png',to_instruction_part);
  map_stage_button = createButton(180,460,'assets/to_map.png',to_map_part);
  stage.removeChild(map_stage_button);
  //RESET BUTTON
  reset_button = createButton(310,510,'assets/reset.png',game_reset);
  //START BUTTON
  start_button = createButton(180,550,'assets/spt_inst_start.png',start_function);
  //START FRAME
  var start_frame_tex = PIXI.Texture.fromImage('assets/execute_frame.png');
  var start_frame = new PIXI.Sprite(start_frame_tex);
  start_frame.x = start_button.x;
  start_frame.y = start_button.y;
  start_frame.height = tile_size;
  start_frame.width = tile_size*2;;
  start_frame.anchor.set(0.5);
  stage.addChild(start_frame);
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

// new
var move_forward = new instructionGenerator(0, 50,'assets/spt_inst_forward.png', inst_dict.forward, 3 );
var turn_right = new instructionGenerator(0, 130, 'assets/spt_inst_right.png', inst_dict.right, 3);
var turn_left = new instructionGenerator(0, 210, 'assets/spt_inst_left.png', inst_dict.left, 3);
var for_loop = new instructionGenerator(0, 280, 'assets/spt_inst_repeat_time.png', inst_dict.for_loop, 3);
var for_end = new instructionGenerator(0, 350, 'assets/spt_inst_repeat_end.png', inst_dict.for_end, 3);


stage.addChild(ERROR_STAGE);


/*
graphics = new PIXI.Graphics();

graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0xFF00BB, 0.25);
graphics.drawRoundedRect(inst_x+tile_size*3, inst_y+tile_size/2, tile_size*2, tile_size, 15);
//graphics.drawRoundedRect, 250, 200, 120, 5);

graphics.endFill();*/
//stage.addChild(INST_BUTTON_STAGE);



var inst_frame = new PIXI.Sprite(start_frame_tex);
inst_frame.height = tile_size;
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

    //when one step is finished, read next instruction
    // before merge to master
/*
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
*/

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
      start_frame.tint = Math.random()* 0xF1FFFF;
    }else{
      INST_BUTTON_STAGE.removeChild(inst_frame);
    }


    
    /*else{
      show_msg(start);
      show_msg(instQueue.length);
    }*/

    count += 1;
}


