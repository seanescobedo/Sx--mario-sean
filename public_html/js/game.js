
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	
	// Run on page load.
	"onload" : function () {
	//making the game show up usin' the whole screen width\\
	if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, 1.0)) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug panel\\
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.\\
        /*
         *######################################################################
         *------------------------- Da Game Statez -----------------------------
         *######################################################################
         */
	"loaded" : function () {
            //adding him again\\
                me.pool.register("mario", game.PlayerEntity, true);
                me.pool.register("BadGuy", game.BadGuy);
                me.pool.register("mushroom", game.Mushroom);
                me.pool.register("star", game.Star);
                
                
                me.pool.register("levelTrigger", game.LevelTrigger);
               
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
              //me.state.set(me.state.GAMEOVER, new game.GameOverScreen());
                

		// me.state changes what state you can go in\\
		me.state.change(me.state.MENU);
	}
};
