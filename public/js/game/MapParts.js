function toTilePos(n){
  // +1 because of start and end point
  return Math.floor(n / tile_size); 
}

// checking for relative position om game map
function check_in_map(x,y,name){ 
  if(name == 'end'){
    return x>=0 && x<map_size && y >=0 && y<map_size;
  }else{
    return x>=1 && x<map_size-1 && y >=1 && y<map_size-1;   
  }
}

// tiling map region, x, y are real position on canvas
function check_tiling_region(x,y,name){
  if(name=='end'){
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
    if(check_in_map(this.pos_x,this.pos_y)){
        map[this.pos_y*map_size+this.pos_x] = null;
    }
}

// for Map Parts only
function onDragEnd(){
  if(this.started){
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

      if(map[this.pos_y*map_size+this.pos_x]!=null){
          this.pos_x = -1;
          this.pos_y = -1;
          this.x = this.ox;
          this.y = this.oy;
  //        map[this.pos_y*map_size+this.pos_x] = null;
      }else if(check_in_map(this.pos_x,this.pos_y)){
          map[this.pos_y*map_size+this.pos_x] = this.dir;
      }
    }

    this.started = false;
        
}

// for Map Parts only
function onDragMove(){
    if (this.dragging)
    {
      	if(this.counts>0){
      	  this.counts--;
      	  a = createMapParts(this.ox, this.oy, this.img, this.odir, 0);
          MAP_STAGE.swapChildren(a,player);
      	} 
        this.dragged = true;
        var newPosition = this.data.getLocalPosition(this.parent);
        // enter tiling region ( MAP )
        if(check_tiling_region(this.x,this.y,this.name)){

          this.x = newPosition.x - newPosition.x%tile_size + tile_size/2;
          this.y = newPosition.y - newPosition.y%tile_size + tile_size/2;

          // end tile automatically change dir
          if(this.name=='end'){
            // can be optimised later
            if(toTilePos(this.x)==map_size-1){
              this.dir = [3];
              this.rotation = Math.PI/2;
            }else if(toTilePos(this.x)==0){
              this.dir = [1];
              this.rotation = Math.PI/2*3;
            }else if(toTilePos(this.y)==0){
              this.dir = [2];
              this.rotation = 0;
            }else if(toTilePos(this.y)==map_size-1){
              this.dir = [0];
              this.rotation = Math.PI/2*2;
            }
          }

        // put it to where mouse is
        }else{

          this.x = newPosition.x;
          this.y = newPosition.y;
        }
    
    }
}

// for Map Parts only
function createMapParts(x,y,img, name, counts){
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
  part.started = false;
  // position on map
  part.pos_x = -1;
  part.pos_y = -1;
  part.name = name;
  part.dir = dir_dict[name];
  part.counts = counts;

  // these variables are only used for creating 
  // another road
  part.img = img;
  part.ox = x;
  part.oy = y;
  part.odir = this.dir;

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
