var player_right = PIXI.Texture.fromImage('assets/Newburg/monkey/right.png');
var player_left = PIXI.Texture.fromImage('assets/Newburg/monkey/left.png');
var player_back = PIXI.Texture.fromImage('assets/Newburg/monkey/back.png');
var player_front = PIXI.Texture.fromImage('assets/Newburg/monkey/front.png');

// 'Constructer for player'
function Player(){
	var player =  new PIXI.Sprite(player_right);
	// position and size
	player.x = tile_size*1;
	player.y = tile_size*1;
	player.width = tile_size;
	player.height = tile_size;

	// position on map, only descrete numbers
	player.pos_x = 1;
	player.pos_y = 1;
	player.face_dir = 1;

	// used in main loop for moving on canvas
	player.xmov = 0;
	player.ymov = 0;
	player.speed = tile_size/60;
	player.wait = 0;

	MAP_STAGE.addChild(player);
	return player;
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

  var on_road = false;
  var has_path = false;
  if(map[cur] && map[cur].indexOf(dir)!=-1){
    on_road = true;
  }
  if(map[dst] && map[dst].indexOf(op)!=-1){
    has_path = true;
  }

  // check road condition
  if(dst<map_size*map_size && on_road
    && has_path){
  	/*those value assigned are used for walking animation*/
    player.xmov = xmov*tile_size;
    player.ymov = ymov*tile_size;

    player.pos_x += xmov;
    player.pos_y += ymov;

  }else{
    show_msg('wrong direction!!');
    if(!on_road){
      show_msg('wrong direction on current road');
    }
    if(!has_path){
      show_msg('no road to your destination');
    }
    
    // pause the game!
    start = false;
    start_button.interactive = false;

  }
}

// changing sprite for now
function turn_animation(player,dir){
  switch(dir){
    case 0:
        player.texture = player_back;
        break;
    case 1:
        player.texture = player_right;
        break;
    case 2:
        player.texture = player_front;
        break;
    case 3:
        player.texture = player_left;
        break;
    default:
        break;
  }
  
}