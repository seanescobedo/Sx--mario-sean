// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
            image: "mario",
            spritewidth: "64",
            spriteheight: "64",
            width: 64,
            height: 64,
            getShape: function(){
                return (new me.Rect(0, 0, 21, 56)).toPolygon();
        //^these numbers here can change your hitbox widtth & height^\\
            }
        }]);
    /*
     *#########################################################################
     *-------------------- Animations 4 Da Character -------------------------
     *#########################################################################
     */
        this.renderable.addAnimation("idle", [9]);
        this.renderable.addAnimation("smallWalk", [9, 10, 11, 10, 11, 10, 11], 80);
        
        this.renderable.setCurrentAnimation("idle");
        
        this.body.setVelocity(4, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    /*
     *#########################################################################
     * ---------------- Controls 2 Make Da Character Move --------------------
     *#########################################################################
     */
    update: function(delta){
        
        if(me.input.isKeyPressed("right")){
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //this.renderable.setCurrentAnimation("smallWalk");\\
            this.flipX(false);
        }   else if (me.input.isKeyPressed('left')) {
            // this flips the image around\\
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }
        else{
            this.body.vel.x = 0;
        }
        
              //always remember to over look your code\\

        //theres always a reason why your code doesn't work\\

        //look at what you did before your last edit or add on\\
        
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
     
        
        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                // he can jump ;P\\
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping as true if you press up\\
                this.body.jumping = true;
            }
 
        }
        
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(this.body.vel.x !== 0){
            if(!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        }else{
            this.renderable.setCurrentAnimation("idle");
        }
        
        //just making him walk fully takes up so much space lol\\
        
         this._super(me.Entity, "update", [delta]);
        return true;
    },
    
     collideHandler: function(response){
        
    }
    
});

  



/*
 *##############################################################################
 *---------------------------- Da Level Triggas -------------------------------
 *##############################################################################
 */
game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    /*
     *##########################################################################
     *--------------------------- Da Collisions -------------------------------
     *##########################################################################
     */
    onCollision: function(){
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
    
});

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
            image: "slime",
            spritewidth: "60",
            spriteheight: "28",
            width: 60,
            height: 28,
            getShape: function(){
                return (new me.Rect(0, 0, 60, 28)).toPolygon();
        //^these numbers here can change your hitbox widtth & height^\\
            }
        }]);  
    },
    
    update: function(delta){
        
    }
    
});