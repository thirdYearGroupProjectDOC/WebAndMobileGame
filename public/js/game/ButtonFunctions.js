// function for startButton
function start_function(){
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


// gather information and make it ready to sent to server
function set_level_data(){

  if(!validation()){
    show_msg('not valid road, can\'t save');
    return;
  }

  map_to_pass = [];
  for(i = 0; i<ROAD_ON_MAP_STAGE.children.length; i++){
    r = ROAD_ON_MAP_STAGE.children[i];
    if(r.name =='monster' || r.name =='tree'){
      map_to_pass[r.pos_x+map_size*r.pos_y] = { x:r.x,
                                                y:r.y,
                                                img:r.img,
                                                name:r.name};
    }
  }

	levelInfo = {
	  id: 1,
	  data: {
	  "author": "Sam",
	  "title": "Easy Level",
	  "description": "This is an entry level",
    "player": {x:player.pos_x, y:player.pos_y, face_dir:player.face_dir},
    "map":map_to_pass

	}};
}

// resolve data from server and construct the game board
function get_level_data(data){
  player.pos_x = data.player.x;
  player.pos_y = data.player.y;
  player.face_dir = data.player.face_dir;
  player.x = player.pos_x *tile_size+tile_size/2;
  player.y = player.pos_y *tile_size+tile_size/2;
  turn_animation(player,player.face_dir);
  show_msg('get_level_data: ' + data.map.length);
  for(i = 0; i < data.map.length; i++){
    if(m = data.map[i]){
      createMapParts(m.x, m.y, m.img, m.name, false,0);
    }
  }

}

function validation(){

  if(on_map_corner(player.pos_x,player.pos_y)){
    return false;
  }
  
  var cur = player.pos_y*map_size+player.pos_x;
  
  var dir = map[cur][0];

  //player not on any map position
  if(dir==null){
    //show_msg('not on map pieces');
    return false;
  }
  var xmov = (2-dir)*dir%2;
  var ymov = (dir-1)*(1-dir%2);

  var p = {x:player.pos_x, y:player.pos_y};
  p.x += xmov;
  p.y += ymov;
  return find_road(p,dir);

  show_msg('valid');
  return true;
}

function find_road(p,dir){
  //show_msg('in find road');

  show_msg( p.x + ':'+ p.y);
  var xmov = (2-dir)*dir%2;
  var ymov = (dir-1)*(1-dir%2);

  dirs = map[p.x + p.y*map_size];
  p.x += xmov;
  p.y += ymov;
  // get dirs available in new position

  show_msg(dirs);
  //opsite direction
  var op = (dir)//%4;

  //player not on any map position
  if(dir==null||dirs==null){
    //show_msg('not on map ');
    return false;
  }

  if(on_map_boarder(p.x,p.y)){
    //show_msg('find!');
    return true;
  }
  // remove the dir just come from
  show_msg('op: '+op+' dir:'+dir);
  var index = dirs.indexOf(op);
  if(index > -1){
    dirs.splice(index,1);
    show_msg(dirs);
  }

  if(dirs==[]){
    //show_msg('no road to go');
    return false;
  }else{
    res = false;
    //show_msg('in recursion: dir length:'+dirs.length);
    for(var i = 0; i < dirs.length; i++){
      res = res || find_road(p,dirs[i]);
    }
  }

  show_msg(dirs);
  return res;
}
