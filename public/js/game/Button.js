function createButton(x,y,img,func){
  var start_tex = PIXI.Texture.fromImage(img);
  var button = new PIXI.Sprite(start_tex);
  button.width = tile_size*2;
  button.height = tile_size;
  button.buttonMode = true;
  button.anchor.set(0.5);
  button.position.x = x;
  button.position.y = y;
  // make the button interactive...
  button.interactive = true;

  button.func = func;

  button
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
      
  button.tap = null;
  button.click = null;
  // add it to the stage
  stage.addChild(button);
  return button;
}

function onButtonDown()
{
    this.isdown = true;
    this.alpha = 1;

    this.func();
    
}

function onButtonUp()
{
    this.isdown = false;
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
