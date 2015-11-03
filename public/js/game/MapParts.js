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
function createMapParts(x,y,img, dir, counts){
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
  stage.addChild(part);
  return part;
}
