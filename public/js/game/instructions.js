
// defines distance bwtween generator ( pile of instructions)
// and where the execution stack lives
gap = tile_size * 1.5;
// length of instructions on a single column 
limit = 12; 

inst_gap_h = 18;

//check if it is in the instruction region
function check_inst_region(x,y){

    // cauculate the region depends on queue length
    var x_ = (Math.floor(instQueue.length/limit))*(tile_size + inst_gap_h) *2;
    var y_ = instQueue.length ;
    
    var x_pos = Math.floor((x - gap + inst_gap_h)/(tile_size*2 + inst_gap_h));

    if(x_pos > Math.floor(instQueue.length/limit) ){
      y_ = Math.floor(instQueue.length%limit)+1;
    }

    var res = (x > gap) && (x < gap+tile_size*2 + x_ )&&
          (y > tile_size/2) &&
          (y < tile_size/4+(tile_size/2+instQueue.gap)*(y_+1));
    if(res){
      //show_msg('x :' +x+ 'y: '+y);
    }
    return res;
}


function to_Inst_pos(x,y){

  // calculate x displacement
  var xp = Math.floor((x - gap + inst_gap_h) / (tile_size*2 + inst_gap_h));
  //show_msg(Math.floor( x - gap));
  return ( xp * limit +  Math.floor((y + tile_size/4 )/(tile_size/2 + instQueue.gap) ) -1) ;
}


function onInstDragStart(event){

    this.data = event.data;
    this.started = true;
    this.alpha = 0.8;
    this.dragging = true;

    this.dragged = false;
    /*
    INSTRUCT_STAGE.addChild(this);
    INST_BUTTON_STAGE.remove(this);
*/
}

function onInstDragEnd(event){

  if(this.started){
    this.dragging = false;
    this.started = false;
    this.alpha = 1;
  
  INST_BUTTON_STAGE.removeChild(nxt_pos);

  // this.fresh would prevent changing loop time after moved
  if(!this.dragged){
    // used only for loop and if instruction
    if (this.loop_txt!=null&&this.menuShown == false) {
      this.menuShown = true;

      var font = 20;
      var x0 = 0;
      var y0 = 45;
      if(this.x != this.generator.x && this.y != this.generator.y){
        x0 = tile_size+10;
        y0 = 0;
      }

      var box = new PIXI.Graphics();

      box.lineStyle(2, 0xFFFF0B, 1);
      box.beginFill(0xFFFF0B, 0.85);
      //                  x0,  y0,  width,  height, round)
      box.drawRoundedRect(x0-5, y0, font+5, 9*font, 5);
      box.endFill();
      this.drop_down.addChild(box);

      for (var i = 0; i < 9; i++) {
        var txt = new PIXI.Text(i+1, {font: '20px bold'});
        txt.x = x0;
        txt.y = y0+ i * font;
        txt.interactive = true;
        txt.value = i + 1;
        txt.on('mousedown', dropDownTxtClicked);
        txt.on('touchstart', dropDownTxtClicked);
        txt.drop_parent = this.drop_down;
        this.drop_down.addChild(txt);
      }

    } else {
      this.menuShown = false;
      this.drop_down.removeChildren();
    }
  }

  // drag instruction piece to outside will make it be returned to deck
  if((!check_inst_region(this.x,this.y)
      && this.x!=this.generator.x && this.y != this.generator.y
      )|| to_Inst_pos(this.x, this.y) > instQueue.length ){
    if (this.generator.count == 0) {
          this.generator.count = 2;
          this.generator.gen();
    } else {
        this.generator.count ++;
        this.generator.update();
    }
    INST_BUTTON_STAGE.removeChild(this);
    INST_BUTTON_STAGE.removeChild(this.loop_txt);
    this.drop_down.removeChildren();    
    delete(this);
  }

  cur_inst = instQueue.head;
//  show_msg('get here: execute: '+execute);
  }
}


function onInstDragMove(){
    if (this.dragging)
    {
        this.dragged = true;
        if(this.fresh){
          this.fresh = false;
          this.generator.gen();
        }
        var newPosition = this.data.getLocalPosition(this.parent);
        if(check_inst_region(newPosition.x,this.y)){


          var x_ = Math.floor((newPosition.x-gap+inst_gap_h)/((tile_size*2 + inst_gap_h))) ;

          this.x = gap+ tile_size+ (tile_size*2+ inst_gap_h)*x_ ;//newPosition.x - newPosition.x % (tile_size) + tile_size;
          this.y = newPosition.y ;//- newPosition.y%tile_size + tile_size/2;

          // find position to insert in
          var temp_pos = to_Inst_pos(this.x,this.y);
          //remove and insert => update position
          if(instQueue.contain(this)){
            instQueue.remove(this);
          }
          if(temp_pos <= instQueue.length +1){
            instQueue.insert(temp_pos,this);
          }
          
          
        }else{
          // remove, if not find , nothing happens
          instQueue.remove(this);
          this.x = newPosition.x;
          this.y = newPosition.y;
        }

        //update pixel position based on instQueue
        instQueue.update();
        if(instQueue.length == 0){

          INST_BUTTON_STAGE.addChild(nxt_pos);
          nxt_pos.x = gap;
          // uncomment if need the indicater when instqueue longer than 1
          nxt_pos.y = tile_size/4 ;//+ (tile_size+instQueue.gap)*(instQueue.length);
 
        }else{
          INST_BUTTON_STAGE.removeChild(nxt_pos);
        }

        // drop down menu and looptime text follow instructions
        if(this.loop_txt!=null){
          // container moves with parent
          this.drop_down.x = this.x;
          this.drop_down.y = this.y;
          // remove current drop down menu
          this.drop_down.removeChildren();
          this.menuShown = false;
          
          // loop time text follow instructions
          this.loop_txt.x = this.x;
          // minus text' fonts size by half
          this.loop_txt.y = this.y-10;
        }

    }
}






//create instruction button
function instructionGenerator(x,y,img,inst,num){
  // used by createMapParts function
  this.x = x;
  this.y = y;
  this.img = img;
  this.inst = inst;
  // number of parts
  if(num){
    this.count = num;
  }else{
    this.count = 1;
  }

  indicate = createInstructionParts(this.x,this.y,this.img,0,false);
  INST_BUTTON_STAGE.removeChild(indicate);
  INST_INDICATOR_STAGE.addChild(indicate);

  var f = createInstructionParts(this.x,this.y,this.img,this.inst,true); 
  f.generator = this;


  var countTxt = new PIXI.Text(':'+this.count);
  countTxt.x = this.x + tile_size+5;
  countTxt.y = this.y;
  INST_BUTTON_STAGE.addChild(countTxt);

  this.gen = function(){
    // this is called when moving top pieces
    // when count is one, don't generate a new piece, 
    if(this.count > 1){
      var m = createInstructionParts(this.x,this.y,this.img,this.inst,true);
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

function createInstructionParts(x,y,img, inst, active){
  var tex_instruct = PIXI.Texture.fromImage(img);
  var part = new PIXI.Sprite(tex_instruct);
  // so it appear before loop count or if statement
  INST_BUTTON_STAGE.addChild(part); 

  part.interactive = active;
  part.buttonMode = true;
  part.anchor.set(0.5);
  part.width = tile_size*2;
  part.height = tile_size/2;
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
  part.inst = inst;


  part
    // events for drag start
    .on('mousedown', onInstDragStart)
    .on('touchstart', onInstDragStart)
    // events for drag end
    .on('mouseup', onInstDragEnd)
    .on('mouseupoutside', onInstDragEnd)
    .on('touchend', onInstDragEnd)
    .on('touchendoutside', onInstDragEnd)
    // events for drag move
    .on('mousemove', onInstDragMove)
    .on('touchmove', onInstDragMove);//haha
  
  if(inst==inst_dict.for_loop){

    var drop = new PIXI.Container();
    drop.x = part.x;
    drop.y = part.y;
    INST_BUTTON_STAGE.addChild(drop);
    part.drop_down = drop;
    drop.button_parent = part;

    // indicate drop down menu
    part.menuShown = false;
    // text to indicate loop time
    part.o_loop_count = 3;
    part.loop_count = 3;
    var countTxt = new PIXI.Text(''+part.loop_count);
    countTxt.width *= 0.8;
    countTxt.height *= 0.8;
    countTxt.x = part.x - 5;//
    countTxt.y = part.y - 5;
    part.loop_txt = countTxt;
    INST_BUTTON_STAGE.addChild(countTxt);
    //INST_BUTTON_STAGE.swapChildren(countTxt,part);
    part.dec = function(){
      if(this.loop_count>0){
        this.loop_count--;
        this.loop_txt.setText(''+this.loop_count); 

//        show_msg('in dec:'+this.loop_count)
        return 0;
      }else{
        return -1;
      }
    }
    
  }

  return part;
}

function dropDownTxtClicked() {
  var b_parent = this.drop_parent.button_parent;
  b_parent.menuShown = false;
  b_parent.loop_txt.setText(this.value);
  b_parent.loop_count = this.value;
  b_parent.o_loop_count = this.value;
  
  this.drop_parent.removeChildren();
}
