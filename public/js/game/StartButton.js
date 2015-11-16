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
   // player_move(1);
    this.alpha = 1;
}

function onButtonUp()
{
    this.isdown = false;


    start = true;

    if (this.isOver){
    }
    else{
    }
}

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
