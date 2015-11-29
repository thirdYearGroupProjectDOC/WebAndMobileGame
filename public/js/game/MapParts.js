function toTilePos(n){
  // +1 because of start and end point
  return Math.floor(n / tile_size); 
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

// checking for relative position on game map
function check_in_map(x,y,name){ 
  if(name == 'end'){
    return x>=0 && x<map_size && y >=0 && y<map_size;
  }else{
    return x>=1 && x<map_size-1 && y >=1 && y<map_size-1;   
  }
}

// tiling map region, x, y are real position on canvas
function check_tiling_region(x,y,name){
  if(name == 'player'){
    return x > 0 && x < map_size*tile_size &&
            y > 0 && y < map_size*tile_size && 
            !(x > tile_size && x < (map_size-1)*tile_size &&
            y > tile_size && y < (map_size-1)*tile_size)

  } else if(name=='end'){
    return x > 0 && x < map_size*tile_size &&
            y > 0 && y < map_size*tile_size
  }else{
    return x > tile_size && x < (map_size-1)*tile_size &&
            y > tile_size && y < (map_size-1)*tile_size
  }
}

// for Map Parts only
function onDragStart(event){
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.started = true;
    this.alpha = 0.8;
    this.dragging = true;
    if(check_in_map(this.pos_x,this.pos_y,this.name)){
        map[this.pos_y*map_size+this.pos_x] = null;
        ROAD_ON_MAP_STAGE.removeChild(this);
        ROAD_STAGE.addChild(this);
    }
}

// for Map Parts only
function onDragEnd(){
  if(this.started){
      this.alpha = 1;
      this.dragging = false;

      // set the interaction data to null
      this.data = null;

      // click on piece will simply turn
      if(this.dragged != true){
          this.turn();
      }
      this.pos_x = toTilePos(this.x);
      this.pos_y = toTilePos(this.y);
      this.dragged = false;

      var gen = this.generator;
      // if the position is being possessed, go back
      if(map[this.pos_y*map_size+this.pos_x]!=null
        || (!check_tiling_region(this.x,this.y,this.name)
              &&this.x != gen.x&&this.y!=gen.y )){
          
          //if there was no active pieces, put one on the pile,
          // else just increase count and update;
          if(gen.count == 0){
            gen.count = 2;
            gen.gen();
          }else{
            gen.count ++;
            gen.update();
          }
          ROAD_STAGE.removeChild(this);
          delete(this);
      }else if(check_in_map(this.pos_x,this.pos_y,this.name)){
          map[this.pos_y*map_size+this.pos_x] = this.dir;
          ROAD_STAGE.removeChild(this);
          ROAD_ON_MAP_STAGE.addChild(this);
      }
    }

    this.started = false;
        
}

// for Map Parts only
function onDragMove(){
    if (this.dragging)
    {
        this.dragged = true;
        if(this.fresh){
          this.fresh = false;
          this.generator.gen();
        }
        var newPosition = this.data.getLocalPosition(this.parent);
        // enter tiling region ( MAP )
        if(check_tiling_region(newPosition.x,newPosition.y,this.name)){

          this.x = newPosition.x - newPosition.x%tile_size + tile_size/2;
          this.y = newPosition.y - newPosition.y%tile_size + tile_size/2;

          // end tile automatically change dir
          if(this.name=='end'){
            // can be optimised later
            if(toTilePos(this.x)==map_size-1){
              this.dir = [3];
              this.rotation = Math.PI/2;
              this.turn = 1;
            }else if(toTilePos(this.x)==0){
              this.dir = [1];
              this.rotation = Math.PI/2*3;
              this.turn = 3;
            }else if(toTilePos(this.y)==0){
              this.dir = [2];
              this.rotation = 0;
              this.turn = 0;
            }else if(toTilePos(this.y)==map_size-1){
              this.dir = [0];
              this.rotation = Math.PI/2*2;
              this.turn = 2;
            }
          }
        // put it to where mouse is
        }else{
          this.x = newPosition.x;
          this.y = newPosition.y;
        }
    
    }
}

// meant to be used for manage road pieces and show numbers available
// so using this would assume the piece will be activated 
// param : num is number of pieces, others is for constructing mapParts
function MapPartsGenerator(x,y,img,name,turn,num){
  // used by createMapParts function
  this.x = x;
  this.y = y;
  this.img = img;
  this.name = name;
  this.turn = turn;
  // number of parts
  if(num){
    this.count = num;
  }else{
    this.count = 1;
  }

  // add indicate to stage so it won't be activated by game_reset
  indicate = createMapParts(this.x,this.y,this.img,this.name,false,this.turn);
  ROAD_STAGE.removeChild(indicate);
  ROAD_INDICATOR_STAGE.addChild(indicate);

  var f = createMapParts(this.x,this.y,this.img,this.name,true,this.turn); 
  f.generator = this;
  

  var countTxt = new PIXI.Text(':'+this.count);
  countTxt.x = this.x + 35;
  countTxt.y = this.y;
  ROAD_STAGE.addChild(countTxt);

  this.gen = function(){
    // this is called when moving top pieces
    // when count is one, don't generate a new piece, 
    if(this.count > 1){
      var m = createMapParts(this.x,this.y,this.img,this.name,true,this.turn);
      m.generator = this;
      this.count --;
    }else{
      this.count = 0;
    }
    this.update();
  }
  
  this.update = function(){
    countTxt.setText(':'+this.count);
  }

}

/*
creating map pieces
@x , y: position on MAP_STAGE
@img : texture source
@name : used for getting directions, also for special uses e.g.
        end road piece can change dir depends on position
@counts : number of pieces can be picked from this position
@active : can be draged or not.
@turn : change start direction , simply turn "turn" times  
*/
function createMapParts(x,y,img, name, active, turn){
  var tex_troad_straigh = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_troad_straigh);
 
  part.interactive = active;
  part.buttonMode = true;
  part.anchor.set(0.5);
  part.width = tile_size;
  part.height = tile_size;
  part.position.x = x;
  part.position.y = y;
  // to distinguish between turning road and dragging road 
  part.dragged = false;
  // when it is being created, the piece is fresh,
  // used to maintain the counts for same type of piece
  part.fresh = true;
  part.started = false;
  // position on map
  part.pos_x = -1;
  part.pos_y = -1;
  part.name = name;
  part.dir = dir_dict[name];



  // these variables are only used for creating 
  // another road
  part.img = img;
  part.ox = x;
  part.oy = y;
  part.oturn = turn;

  // turn clockwise
  part.turn = function (){
    part.dir = turn_dir(part.dir);
    part.rotation += Math.PI/2;
  }

  for(var i = 0; i<turn; i ++){
    part.turn();
  }

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
    .on('touchmove', onDragMove);//haha
  ROAD_STAGE.addChild(part);
  
  return part;
}
