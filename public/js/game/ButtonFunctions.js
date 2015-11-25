// function for startButton
start_function = function(){
  start = true;

    // disable road pieces and instruction buttons
    for(var i = 0; i < ROAD_STAGE.children.length; i++){
        ROAD_STAGE.children[i].interactive = false;

    }
    for(var i = 0; i < INST_BUTTON_STAGE.children.length; i++){
        INST_BUTTON_STAGE.children[i].interactive = false;
    }
}

to_map_part = function(){
  stage.removeChild(INST_BUTTON_STAGE);
} 


to_instruction_part = function(){
  stage.addChild(INST_BUTTON_STAGE);
} 