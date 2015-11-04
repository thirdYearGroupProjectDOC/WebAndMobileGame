function toTilePos(n){
  return Math.floor(n / tile_size);
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
        this.dir=turn_dir(this.dir);
    }
    this.pos_x = toTilePos(this.x);
    this.pos_y = toTilePos(this.y);
    this.dragged = false;
    if(check_in_map(this.pos_x,this.pos_y)){
        map[this.pos_y*map_size+this.pos_x] = this.dir;
    }
        
}

// for Map Parts only
function onDragMove(){
    if (this.dragging)
    {
      	if(this.counts>0){
      	  this.counts--;
      	  createMapParts(this.ox, this.oy, this.img, this.odir, 0);
      	} 
        this.dragged = true;
        var newPosition = this.data.getLocalPosition(this.parent);
        // enter tiling region ( MAP )
        if(this.x > 0 && this.x < map_size*tile_size &&
          this.y > 0 && this.y < map_size*tile_size){

          this.x = newPosition.x - newPosition.x%tile_size + tile_size/2;
          this.y = newPosition.y - newPosition.y%tile_size + tile_size/2;
          index = toTilePos(this.x)+toTilePos(this.y)*map_size;
          if(map[index]!=null){
            this.x+= tile_size;
            this.y+= tile_size;
          }

        // put it to where mouse is
        }else{

          this.x = newPosition.x;
          this.y = newPosition.y;
        }
    
    }
}

// for Map Parts only
function createMapParts(x,y,img, dir, counts){
  var tex_troad_straigh = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_troad_straigh);
 
  // these variables are only used for creating 
  // another road
  part.img = img;
  part.ox = x;
  part.oy = y;
  part.odir = dir;

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
  part.dir = dir;
  part.counts = counts;

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
  MAP_STAGE.addChild(part);
  return part;
}
