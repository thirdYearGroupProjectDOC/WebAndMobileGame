// function for startButton
function start_function() {
  start = true;

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

/*var levelInfo = {
  id: 1,
  data: {
  "author": "Sam",
  "title": "Easy Level",
  "description": "This is an entry level",


  "dimen": 5,
  "start":[{"Coor":[1,0], "Dir":[1]}],
  "end":[{"Coor":[5,6], "Dir":[3]}],

  "straight": 5,
  "endPoint": 5,
  "threeWay": 5,
  "turn": 5,
  
  "snake":[{"Coor":"2,2", "Dir":"0"}],
  "tree":[{"Coor":"3,3", "Dir":"0"}],
  "player":[1,2]

}};
*/
function get_level_data(data){
	player.pos_x = data.player[0];
	player.pos_y = data.player[0];
	player.x = player.pos_x*tile_size;
	player.y = player.pos_y*tile_size;
	
}

function set_level_data(){
	levelInfo = {
	  id: 1,
	  data: {
	  "author": "Sam",
	  "title": "Easy Level",
	  "description": "This is an entry level",

	  "player":[1,2]

	}};
}