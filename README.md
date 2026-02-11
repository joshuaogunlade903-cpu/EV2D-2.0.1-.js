how to use ev2d will be posted soon

Basic use:
//starts the engine
game=new EV2DEngine()
//adjusts game to fit screen
game.optimize()
//game loop
function loop(){
 game.render()
 requestAnimationFrame(loop)
}
loop()
//adding entity
player=Entity()
game.add(player)
//adjusting player position or rotation 
player.position=vec2(2,4)
player.position.x=10
player.rotation=70
//adjusting player texture
player.texture.fillWithColor("blue",width=100,height=100)
//changing player to image
player.texture.changeURL("path-to-image")
