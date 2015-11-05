var renderer = PIXI.autoDetectRenderer(1200, 800,{backgroundColor : 0x1099bb});
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






// create road part from image, can be dragged to fit on map,
// dir defines where it points to that leads to another road,
// 0 is north, 1 is east, 2 is south, 3 is west, -1 is hell :)
var road_monster = createMapParts(selections_x,selections_y,'assets/spt_monster.png');
road_monster.dir = [-1];
var road_corner = createMapParts(selections_x,selections_y+100,'assets/spt_road_corner.png');
road_corner.dir = [0,3];
var road_end = createMapParts(selections_x,selections_y+200,'assets/spt_road_end.png');
road_end.dir = [2];
var road_straight = createMapParts(selections_x,selections_y+300,'assets/spt_road_straight.png');
road_straight.dir = [0,2];
var road_t = createMapParts(selections_x,selections_y+400,'assets/spt_road_t.png');
road_t.dir = [1,2,3];
var road_tree = createMapParts(selections_x,selections_y+500,'assets/spt_tree.png'); 
road_tree.dir = [];



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
var player_dir = 1;


stage.addChild(player);

animate();
function animate(){
  //show_msg(map);
  requestAnimationFrame(animate);
  renderer.render(stage);
}






// for Map Parts only
function onDragStart(event){
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.8;
    this.dragging = true;
    if(check_in_map(this.pos_x,this.pos_y)){
        map[this.pos_y*map_size+this.pos_x] = null;
    }
}

// for Map Parts only
function onDragEnd(){
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
    if(this.dragged != true){
        this.rotation+=Math.PI/2;
        turn_dir(this.dir);
    }
    this.pos_x = Math.floor(this.position.x / tile_size) - 1;
    this.pos_y = Math.floor(this.position.y / tile_size) - 1;
    this.dragged = false;
    if(check_in_map(this.pos_x,this.pos_y)){
        map[this.pos_y*map_size+this.pos_x] = this.dir;
    }
        
}

// for Map Parts only
function onDragMove(){
    if (this.dragging)
    {
        this.dragged = true;
        var newPosition = this.data.getLocalPosition(this.parent);
        // enter tiling region ( MAP )
        if(this.position.x > zero_x && this.position.x < zero_x+map_size*tile_size &&
          this.position.y > zero_y && this.position.y < zero_y+map_size*tile_size){

          this.position.x = newPosition.x - newPosition.x%tile_size+tile_size/2;
          this.position.y = newPosition.y - newPosition.y%tile_size+tile_size/4;

        // put it to where mouse is
        }else{

          this.position.x = newPosition.x;
          this.position.y = newPosition.y;
        }
    
    }
}

// for Map Parts only
function createMapParts(x,y,img){
  var tex_troad_straigh = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_troad_straigh);

  part.interactive = true;
  part.buttonMode = true;
  part.anchor.set(0.5);
  part.width = tile_size;
  part.height = tile_size;
  part.position.x = x;
  part.position.y = y;
  // to distinguish between turning road and dragging road 
  part.dragged = false;
  // position on map
  part.pos_x = -1;
  part.pos_y = -1;

  part
    // events for drag start
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    // events for drag end
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    // events for drag move
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);
  stage.addChild(part);
  return part;
}


// used for turning road
function turn_dir(dir){
  for(var i = 0; i < dir.length; i++){
    dir[i] ++;
    dir[i] %= 4;
  }
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

function createStartButton(x,y,img){
  var start_tex = PIXI.Texture.fromImage(img);
  var start_button = new PIXI.Sprite(start_tex);
  start_button.width = tile_size*2;
  start_button.height = tile_size;
  start_button.buttonMode = true;
  start_button.anchor.set(0.5);
  start_button.position.x = x;
  start_button.position.y = y;
  // make the button interactive...
  start_button.interactive = true;
  start_button
      // set the mousedown and touchstart callback...
      .on('mousedown', onButtonDown)
      .on('touchstart', onButtonDown)

      // set the mouseup and touchend callback...
      .on('mouseup', onButtonUp)
      .on('touchend', onButtonUp)
      .on('mouseupoutside', onButtonUp)
      .on('touchendoutside', onButtonUp)

      // set the mouseover callback...
      .on('mouseover', onButtonOver)

      // set the mouseout callback...
      .on('mouseout', onButtonOut)
      
  start_button.tap = null;
  start_button.click = null;
  // add it to the stage
  stage.addChild(start_button);
  return start_button;
}

function onButtonDown()
{
    this.isdown = true;
 //   player_move(1);
    this.alpha = 1;
}

/*
function onButtonUp()
{
    this.isdown = false;

    player_start();

    if (this.isOver){
    }
    else{
    }
}

*/

function onButtonOver()
{
    this.isOver = true;
    if (this.isdown){
        return;
    }
}

function onButtonOut()
{
    this.isOver = false;
    if (this.isdown){
        return;
    }
}
 


function player_move(dir){
  switch(dir) {
    case 0:
        player.y -= tile_size;
        player.pos_y -= 1;
        break;
    case 1:
        player.x += tile_size;
        player.pos_x += 1;
        break;
    case 2:
        player.y += tile_size;
        player.pos_y += 1;
        break;
    case 3:
        player.x -= tile_size;
        player.pos_x -= 1;
        break;
    default:
        //
  }
}







