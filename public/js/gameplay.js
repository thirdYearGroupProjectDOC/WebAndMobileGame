var renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

// size of the actuall game size
var map_size = 5;
var map = [];
for(var i = 0; i<map_size*map_size; i++){
    map[i] = null;
}

// tile size , depends on screen later
var tile_size = 80;
// where the first road begin
var zero_x = 80;
var zero_y = 60;

var selections_x = 600;
var selections_y = 50;

// create the root of the scene graph
var stage = new PIXI.Container();
// map base, put all tiles into one container
var MAP_STAGE = new PIXI.Container();

stage.addChild(MAP_STAGE);
// create background
for (var j = 0; j < map_size; j++) {
    for (var i = 0; i < map_size; i++) {
        var bg = PIXI.Sprite.fromImage('assets/background.png');
        bg.x = tile_size * i;
        bg.y = tile_size * j;
        bg.height = tile_size;
        bg.width = tile_size;
        MAP_STAGE.addChild(bg);
    };
};
MAP_STAGE.x = zero_x;
MAP_STAGE.y = zero_y;

dir_dict = {'monster':[-1], 'corner':[0,3], 'end':[2], 'straight':[0,2], 't':[1,2,3], 'tree':[]};

// create road part from image, can be dragged to fit on map,
// dir defines where it points to that leads to another road,
// 0 is north, 1 is east, 2 is south, 3 is west, -1 is hell :)
var road_monster = createMapParts(selections_x,selections_y,'assets/spt_monster.png',dir_dict['monster'],0);
var road_corner = createMapParts(selections_x,selections_y+100,'assets/spt_road_corner.png',dir_dict['corner'],1);
var road_end = createMapParts(selections_x,selections_y+200,'assets/spt_road_end.png',dir_dict['end'],0);
var road_straight = createMapParts(selections_x,selections_y+300,'assets/spt_road_straight.png',dir_dict['straight'],0);
var road_t = createMapParts(selections_x,selections_y+400,'assets/spt_road_t.png',dir_dict['t'],0);
var road_tree = createMapParts(selections_x,selections_y+500,'assets/spt_tree.png',dir_dict['tree'],0); 


// create start button
start_button = createStartButton(180,550,'assets/spt_inst_start.png');

var player_tex = PIXI.Texture.fromImage('assets/spt_boy.png');
var player = new PIXI.Sprite(player_tex);
player.x = zero_x;
player.y = zero_y;
player.width = tile_size;
player.height = tile_size;
player.pos_x = 0;
player.pos_y = 0;

stage.addChild(player);

animate();
function animate(){
  show_msg(map);
  requestAnimationFrame(animate);
  renderer.render(stage);
}

// used for turning road
function turn_dir(dir){
  res = [];
  for(var i = 0; i < dir.length; i++){
    if(dir[i]>=0){
      res[i] = dir[i]+1;
      res[i] %= 4;
    }
  }
  return res;
}

// used for printing message on screen
function show_msg(msg){
    var spinningText = new PIXI.Text(msg, { font: 'bold 60px Arial', fill: '#cc00ff', align: 'center', stroke: '#FFFFFF', strokeThickness: 6 });

    // setting the anchor point to 0.5 will center align the text... great for spinning!
    spinningText.anchor.set(0.5);
    spinningText.position.x = 310;
    spinningText.position.y = 200;
    stage.addChild(spinningText);
}

// checking for relative position om game map
function check_in_map(x,y){
    return x>=0 && x<map_size && y >=0 && y<map_size;
}

/* @dir is the direction player moves, 0 notrh and clockwise inc
*  first check whether the road player stands on has this dir
*  then check boundries  
*/
function player_move(dir){
  if(map[player.pos_x+player.pos_y*map_size].indexOf(dir)!=-1){
	  switch(dir) {
		case 0:
		    if(player.pos_y == 0) break;
        player.y -= tile_size;
		    player.pos_y -= 1;
		    break;
		case 1:
            if(player.pos_x == map_size-1) break;
		    player.x += tile_size;
		    player.pos_x += 1;
		    break;
		case 2:
            if(player.pos_y == map_size-1) break;
		    player.y += tile_size;
		    player.pos_y += 1;
		    break;
		case 3:
            if(player.pos_x ==0 ) break;
		    player.x -= tile_size;
		    player.pos_x -= 1;
		    break;
		default:
		    //
	  }
  }
}
