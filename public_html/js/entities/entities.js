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
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("bigIdle", [9]);
        this.renderable.addAnimation("bigStarIdle", [12]);
        this.renderable.addAnimation("smallWalk", [0, 1, 2, 1, 2, 1, 2] , 80);
        this.renderable.addAnimation("bigWalk", [9, 10, 11, 10, 11, 10, 11], 80);
        this.renderable.addAnimation("bigStarWalk", [12, 13, 14, 13, 14, 13, 11], 80);
        
        this.renderable.setCurrentAnimation("idle");
        
        
        //this variable determines whether mario has hit the mushroom
        this.big = false;
        this.bigStar = false;
        
        //the first number sets speed on x axis, second on y axis
        this.body.setVelocity(3, 20);
        
        //The screen(viewport) follows this character's position(pos) on both x and y axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    /*
     *#########################################################################
     * ---------------- Controls 2 Make Da Character Move --------------------
     *#########################################################################
     */
    update: function(delta){
        
        //check if right button is pressed
        if(me.input.isKeyPressed("right")){
            
            //adds the speed set in the setVelocity method above to our current position and multiplies by timer.tick to make animation smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //This line says to unflip the image if it has been flipped
            this.flipX(false);
        }   else if (me.input.isKeyPressed('left')) {
            // this flips the image around\\
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }
        else{
            this.body.vel.x = 0;
        }
        
        
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
        
        if(!this.big){
            if(this.body.vel.x !== 0){
                if(!this.renderable.isCurrentAnimation("smallWalk")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            }else{
                this.renderable.setCurrentAnimation("idle");
            }
        }else{
             if(this.body.vel.x !== 0){
                if(!this.renderable.isCurrentAnimation("bigWalk")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
                }
            }else{
                this.renderable.setCurrentAnimation("bigIdle");
            }
            if(this.body.vel.x !== 0){
                if(!this.renderable.isCurrentAnimation("bigStarWalk")) {
                    this.renderable.setCurrentAnimation("bigStarWalk");
                    this.renderable.setAnimationFrame();
                }
            }else{
                this.renderable.setCurrentAnimation("bigStarIdle");
            }
        }
        
        //just making him walk fully takes up so much space lol\\
        
         this._super(me.Entity, "update", [delta]);
        return true;
    },
    
     collideHandler: function(response){
         //ydif is the difference in position between mario and whatever he hit so we can see if Mario jumped on something
         var ydif = this.pos.y - response.b.pos.y;
         console.log(ydif);
         
        if(response.b.type === 'badguy'){
            if(ydif <= -43){
                response.b.alive = false;
            }else if(response.b.alive){
                if(this.big){
                    this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;    
                }else if(this.bigStar){
                    this.bigStar = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;    
                }
                 else{
                    me.state.change(me.state.MENU);
                }
            }
        }else if(response.b.type === 'mushroom'){
            this.big = true;
            me.game.world.removeChild(response.b);
            
        }
             if (response.b.type === 'star'){
                this.bigStar = true;
                me.game.world.removeChild(response.b);

            }
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
            spritewidth: "64",
            spriteheight: "64",
            width: 64,
            height: 64,
            getShape: function(){
                return (new me.Rect(0, 0, 64, 64)).toPolygon();
        //^these numbers here can change your hitbox widtth & height^\\
            }
        }]);  
    
    this.spritewidth = 60;
    var width = settings.width;
    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - this.spritewidth;
    this.pos.x = x + width - this.spritewidth;
    this.updateBounds();
    
    this.alwaysUpdate = true;
    
    this.walkLeft = false;
    this.alive = true;
    this.type = "badguy";
    
    //this.renderable.addAnimation("run", [0, 1, 2], 80);
    //this.renderable.setCurrentAnimation("run");
    
    this.body.setVelocity(2, 6);
    },
    
    update: function(delta){
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(this.alive){
            if(this.walkLeft && this.pos.x <= this.startX){
                this.walkLeft = false;
            }else if(!this.walkLeft && this.pos.x >= this.endX){
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            //We are adding an amount to our current position. 
            //But, to determine whether we add a positive or negative amount we check whether this.walkLeft is true.
            //If this.walkLeft is true, we do the code to the left of the :, otherwise we do the code to the right. 
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body. accel.x * me.timer.tick;
        }else{
            me.game.world.removeChild(this);
        }
        
        this._super(me.Entity, "update", [delta]);
        return true;  
    },
    
    collideHandler: function(){
        
    }
    
});

game.Mushroom = me.Entity.extend({
    init: function(x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
            image: "mushroom",
            spritewidth: "64",
            spriteheight: "64",
            width: 64,
            height: 64,
            getShape: function(){
                return (new me.Rect(0, 0, 64, 64)).toPolygon();
                this.body.setVelocity(1, 6);
        //^these numbers here can change your hitbox widtth & height^\\
            }
        }]);
    
     me.collision.check(this);
     this.type = "mushroom";
    }
    });
    
    game.Star = me.Entity.extend({
    init: function(x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
            image: "star",
            spritewidth: "64",
            spriteheight: "64",
            width: 64,
            height: 64,
            getShape: function(){
                return (new me.Rect(0, 0, 64, 64)).toPolygon();
        //^these numbers here can change your hitbox widtth & height^\\
            }
        }]);
    
     me.collision.check(this);
     this.type = "star";
    }
    });