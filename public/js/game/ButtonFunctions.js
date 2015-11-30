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
}


function to_map_part(){
  MAP_STAGE.addChild(ROAD_STAGE);
  stage.removeChild(INST_BUTTON_STAGE);
  for(i=0; i < ROAD_ON_MAP_STAGE.children.length;i++){
  	ROAD_ON_MAP_STAGE.children[i].interactive = true;
  }
  stage.addChild(instruction_stage_button);
  stage.removeChild(map_stage_button);
} 


function to_instruction_part() {
  stage.addChild(INST_BUTTON_STAGE);
  MAP_STAGE.removeChild(ROAD_STAGE);
  for(i=0; i < ROAD_ON_MAP_STAGE.children.length;i++){
  	ROAD_ON_MAP_STAGE.children[i].interactive = false;
  }
  stage.addChild(map_stage_button);
  stage.removeChild(instruction_stage_button);
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