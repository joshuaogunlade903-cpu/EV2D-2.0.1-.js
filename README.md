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
//adjusting player size
player.texture.image.onload=()=>{
 player.texture.resize(w=20,h=40)
}
//writing text
player.texture.fillWithText("hello",w=100,h=100,"blue",font="30px Arial")

//every thing added to the game has a before render loop
player.beforeRender=(player,time,deltatime)=>{}
//clock api
Clock.register_once(func,delay)
Clock.register_loop(func)
Clock.remove_loop(func)
Clock.register_interval(func,delay)
Clock.remove_interval(func)
