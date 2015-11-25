// tile size , depends on screen later
tile_size = 60;
// where the first road begin
zero_x = 80;
zero_y = 60;

// beginning point of selections of instruction buttons
selects_x = 500;
selects_y = 0;

// beginning point of instruction queue
var queue_x = 800;
var queue_y = 10;


// size of the actuall game size
var map_size = 5;
// for start and end point
map_size +=2;
var map = [];

// setting directions of road pieces according to image's default direction
dir_dict = {'monster':[-1], 'corner':[2,3], 'end':[2], 'straight':[1,3], 't':[1,2,3], 'tree':[]};
//inst_dict = {forward: 0, right: 1, left: 2};

function map_bg_init(){
	for (var j = 1; j < map_size-1; j++) {
	    for (var i = 1; i < map_size-1; i++) {
	        var bg = PIXI.Sprite.fromImage('assets/Newburg/floor1.png');
	        bg.x = tile_size * i;
	        bg.y = tile_size * j;
	        bg.height = tile_size;
	        bg.width = tile_size;
	        MAP_STAGE.addChild(bg);
	    };
	}
}

var msg_rec = 0;
// used for printing message on screen
function show_msg(msg){
    var spinningText = new PIXI.Text(msg, { font: 'bold 30px Arial', align: 'center', stroke: '#FFFFFF', strokeThickness: 5 });

    spinningText.anchor.set(0.5);
    spinningText.x = 500;
    spinningText.y = 100 + msg_rec*30;
    msg_rec ++;
    ERROR_STAGE.addChild(spinningText);
}


function game_reset(){

    player.x = tile_size/2;
    player.y = tile_size/2;
    player.pos_x = 0;
    player.pos_y = 0;
    player.face_dir = 1;
    turn_animation(player,player.face_dir);
    start = false;
    // road pieces can be moved again
    for(var i = 0; i < ROAD_STAGE.children.length; i++){
        ROAD_STAGE.children[i].interactive = true;
    }

    // restore instructions buttons's count
    for(var i = 0; i < INST_BUTTON_STAGE.children.length; i++){
      if(INST_BUTTON_STAGE.children[i].generator){

        INST_BUTTON_STAGE.children[i].generator.reset();
      }
      INST_BUTTON_STAGE.children[i].interactive = true;
    }

    ERROR_STAGE.removeChildren();
    
    start_button.interactive = true;
    INSTRUCT_STAGE.removeChildren();
    instQueue = [];
    instPointer = 0;
    step = 0;
}

// undo the most recent instruction
function stack_undo() {
  if(instPointer>0){
    instPointer--;
    instQueue[instPointer] = -1;

    cur = INSTRUCT_STAGE.children[instPointer]
    INSTRUCT_STAGE.removeChild(cur);
    cur.button.generator.count++;
    cur.button.generator.update();
  }
}

// reading instQueue instructions
function execute_inst_queue() {
    switch (instQueue[step].dir) {
	    case 0:
	        player_move(player.face_dir);
	        break;
	    case 1:
	        player.wait = tile_size/player.speed;
	        player.face_dir = (player.face_dir + 3) % 4;
	        show_msg(player.face_dir);
	        turn_animation(player,player.face_dir);
	        break;
	    case 2:
	        player.wait = tile_size/player.speed;
	        player.face_dir = (player.face_dir + 1) % 4;
	        turn_animation(player,player.face_dir);
	        break;
	    default:
	        break;
	    }
}

function on_map_boarder(x,y){
    return (x == 0 || x == map_size-1 || y == 0 || y == map_size-1);
}

function on_map_corner(x,y){
    var check_x = (x==0 || x==map_size-1);
    var check_y = (y==0 || y==map_size-1);
    return check_y&&check_x;

}