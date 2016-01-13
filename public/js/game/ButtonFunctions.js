// function for startButton
function start_function(){
    execute = true;

    //step = instQueue.head;

    // disable road pieces and instruction buttons
    for(var i = 0; i < ROAD_STAGE.children.length; i++){
        ROAD_STAGE.children[i].interactive = false;
    }

    for(var i = 0; i < INST_BUTTON_STAGE.children.length; i++){
        INST_BUTTON_STAGE.children[i].interactive = false;
    }

    // when executing instructions, can't go back and change road
    speed_button.interactive = false;
    map_stage_button.interactive = false;
    reset_inst_button.interactive = false;
}


function to_map_part(){
  MAP_STAGE.addChild(ROAD_STAGE);
  stage.removeChild(INST_BUTTON_STAGE);
  for(i=0; i < ROAD_ON_MAP_STAGE.children.length;i++){
    var p = ROAD_ON_MAP_STAGE.children[i];
    if(! p.never_active){
      p.interactive = true;
    }
  }
  stage.addChild(reset_road_button);
  stage.removeChild(reset_inst_button);
  stage.removeChild(reset_game_button);
  stage.addChild(instruction_stage_button);
  stage.removeChild(map_stage_button);
  stage.removeChild(start_button);
  stage.removeChild(start_frame);
} 


function to_instruction_part() {
  stage.addChild(INST_BUTTON_STAGE);
  stage.setChildIndex(INST_BUTTON_STAGE,1);
  MAP_STAGE.removeChild(ROAD_STAGE);
  for(i=0; i < ROAD_ON_MAP_STAGE.children.length;i++){
  	ROAD_ON_MAP_STAGE.children[i].interactive = false;
  }
  stage.addChild(reset_inst_button);
  stage.addChild(reset_game_button);
  stage.removeChild(reset_road_button);
  stage.addChild(map_stage_button);
  stage.removeChild(instruction_stage_button);
  stage.addChild(start_button);
  stage.addChild(start_frame);
} 

function map_clear() {
    player.pos_x = player.ox;
    player.pos_y = player.oy;
    player.x = tile_size/2 + tile_size*player.pos_x;
    player.y = tile_size/2 + tile_size*player.pos_y;
    player.face_dir = player.odir;
    turn_animation(player,player.face_dir);

    ERROR_STAGE.removeChildren();

    for (var i = ROAD_ON_MAP_STAGE.children.length - 1; i >= 0; i--) {
      var piece = ROAD_ON_MAP_STAGE.children[i];
      if(piece.generator.count == 0){
            piece.generator.count = 2;
            piece.generator.gen();
          }else{
            piece.generator.count ++;
            piece.generator.update();
          }
      map[piece.pos_y*map_size+piece.pos_x] = null;
      ROAD_ON_MAP_STAGE.removeChild(piece);
    };
    
}


function road_reset() {
    player.pos_x = player.ox;
    player.pos_y = player.oy;
    player.x = tile_size/2 + tile_size*player.pos_x;
    player.y = tile_size/2 + tile_size*player.pos_y;
    player.face_dir = player.odir;
    turn_animation(player,player.face_dir);

    for (var i = ROAD_ON_MAP_STAGE.children.length - 1; i >= 0; i--) {
      var piece = ROAD_ON_MAP_STAGE.children[i];
      if(piece.generator.count == 0){
            piece.generator.count = 2;
            piece.generator.gen();
          }else{
            piece.generator.count ++;
            piece.generator.update();
          }
      map[piece.pos_y*map_size+piece.pos_x] = null;
      ROAD_ON_MAP_STAGE.removeChild(piece);
    };


}


function inst_reset() {

    //clear instQueue
      var cur = instQueue.head;
      while (cur != null) {
        //add 1 back to instruction count
        if (cur.value.generator.count == 0) {
          cur.value.generator.count = 2;
          cur.value.generator.gen();
        } else {
          cur.value.generator.count ++;
          cur.value.generator.update();
        }
        //remove this instruction
        INST_BUTTON_STAGE.removeChild(cur.value);
        INST_BUTTON_STAGE.removeChild(cur.value.loop_txt);
        instQueue.remove(cur.value);
        cur = cur.next;
        
      }

}


// player going back to original position&direction, 
// makes everyting interactive again
function game_reset(){

    player.pos_x = player.ox;
    player.pos_y = player.oy;
    player.x = tile_size/2 + tile_size*player.pos_x;
    player.y = tile_size/2 + tile_size*player.pos_y;
    player.xmov = 0;
    player.ymov = 0;

    player.face_dir = player.odir;
    turn_animation(player,player.face_dir);

    execute = false;
    map_stage_button.interactive = true;
    reset_inst_button.interactive = true;
    speed_button.interactive = true;

    cur_inst = instQueue.head;

    // road pieces can be moved again
    for(var i = 0; i < ROAD_STAGE.children.length; i++){
        ROAD_STAGE.children[i].interactive = true;
    }

    // restore instructions buttons's count
    for(var i = 0; i < INST_BUTTON_STAGE.children.length; i++){
      var c = INST_BUTTON_STAGE.children[i];
      c.interactive = true;
    }

    // reset the text& value of the loop instructions
    var temp_cur = instQueue.head;
    while(temp_cur!=null&&temp_cur.value!=null){
        //show_msg('hh');
        var inst = temp_cur.value;
        if(inst.loop_count!=null){
            inst.loop_count = inst.o_loop_count;
            inst.loop_txt.setText(inst.loop_count);
        }
        temp_cur = temp_cur.next;
    }

    // remove all error messages
    ERROR_STAGE.removeChildren();

    start_button.interactive = true;
    //instQueue.clear();
    step = 0;
}

function speed_times_two(){

  player.speed = 5;
  intervel = tile_size/player.speed + 5;
}

function speed_reset(){
  player.speed = 2;
  intervel = tile_size/player.speed + 5;
}