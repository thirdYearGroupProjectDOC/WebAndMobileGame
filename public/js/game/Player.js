var player_right = PIXI.Texture.fromImage('assets/Newburg/monkey/right.png');
var player_left = PIXI.Texture.fromImage('assets/Newburg/monkey/left.png');
var player_back = PIXI.Texture.fromImage('assets/Newburg/monkey/back.png');
var player_front = PIXI.Texture.fromImage('assets/Newburg/monkey/front.png');

// 'Constructer for player'
function Player(){
	var player =  new PIXI.Sprite(player_right);
  //used in checking tiling
  player.name = 'player';
  player.anchor.set(0.5);
  if(create_level){
    player.interactive = true;
  }
  player
    .on('mousedown', playerDragStart)
    .on('touchstart', playerDragStart)
    // events for drag end
    .on('mouseup', playerDragEnd)
    .on('mouseupoutside', playerDragEnd)
    .on('touchend', playerDragEnd)
    .on('touchendoutside', playerDragEnd)
    // events for drag move
    .on('mousemove', playerDragMove)
    .on('touchmove', playerDragMove);
  

	// position and size
	player.x = tile_size/2;
	player.y = tile_size/2;
	player.width = tile_size;
	player.height = tile_size;

	// position on map, only descrete numbers
	player.pos_x = 0;
	player.pos_y = 0;
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


function playerDragStart(event){
    this.data = event.data;
    this.started = true;
    this.alpha = 0.8;
    this.dragging = true;
}

function playerDragEnd(){
  if(this.started){
      this.alpha = 1;
      this.dragging = false;
      // set the interaction data to null
      this.data = null;

      if(!check_tiling_region(this.x,this.y,this.name)){
        this.x = tile_size/2;
        this.y = tile_size/2;
      }

      this.pos_x = toTilePos(this.x);
      this.pos_y = toTilePos(this.y);
    }

    this.started = false;
        
}

function playerDragMove(){
  if (this.dragging)
    {
        this.dragged = true;
        
        var newPosition = this.data.getLocalPosition(this.parent);
        // enter tiling region ( MAP )
        if(check_tiling_region(this.x,this.y,this.name)){

          this.x = newPosition.x - newPosition.x%tile_size + tile_size/2;
          this.y = newPosition.y - newPosition.y%tile_size + tile_size/2;

        // put it to where mouse is
        }else{
          this.x = newPosition.x;
          this.y = newPosition.y;
        }
    
    }
}