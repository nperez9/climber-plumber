/*! For license information please see main.08ce063b255e306af453.bundle.js.LICENSE.txt */
(()=>{var e,s={738:(e,s,t)=>{"use strict";t(260);const i=window.location.href.includes("localhost");var a;!function(e){e.Walk="walk",e.Idle="idle",e.Jump="jump"}(a||(a={}));const r={idle:3,walk:[0,1,2],jump:2};var l,o;!function(e){e.Barrel="barrel",e.Block="block",e.Gorilla="gorilla",e.Ground="ground",e.Platform="platform",e.Fire="fire",e.Player="player",e.Backgorund="background"}(l||(l={})),l.Block,function(e){e.One="ONE"}(o||(o={})),l.Block,l.Block,l.Block,l.Block,l.Ground;class n extends Phaser.GameObjects.Text{constructor(e){super(e,10,10,"",{color:"#FFF",fontSize:"28px"}),e.add.existing(this),this.setOrigin(0)}update(){i&&this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)}}const h=e=>Math.round(100*(e+Number.EPSILON))/100;class c extends Phaser.Scene{fpsText;screenWidth;screenHeigth;endgame=!1;player;velocity=150;jumpForce=600;goal;platforms;fires;barrels;cursors;levelData;constructor(){super({key:"MainScene"})}setupLevel(){this.add.sprite(0,0,l.Backgorund).setOrigin(0),this.platforms=this.physics.add.staticGroup(),this.levelData.platforms.map((({x:e,y:s,key:t,numTiles:i})=>{let a;if(i>1){const{width:o,height:n}=(l=t,{width:(r=this).textures.get(l).get(0).width,height:r.textures.get(l).get(0).height});a=this.add.tileSprite(e,s,i*o,n,t)}else a=this.add.sprite(e,s,t);var r,l;a.setOrigin(0,0),this.physics.add.existing(a,!0),this.platforms.add(a)}))}setupFireEnemies(){this.fires=this.physics.add.group({allowGravity:!1,immovable:!1}),this.levelData.fireEnemies.map((({x:e,y:s})=>{const t=this.add.sprite(e,s,l.Fire).setOrigin(0,1);t.anims.play("burn"),this.fires.add(t),i&&(t.setInteractive(),this.input.setDraggable(t),this.input.on("drag",((e,s,t,i)=>{s.x=t,s.y=i,console.log("Fire Drag",h(t),h(i))})))}))}setupPlayer(){const{x:e,y:s}=this.levelData.player;this.player=this.physics.add.sprite(e,s,l.Player,3),this.player.body.setCollideWorldBounds(!0);const t=this.levelData.goal;this.goal=this.physics.add.sprite(t.x,t.y,l.Gorilla).setOrigin(0,1)}setupCursor(){this.cursors=this.input.keyboard.createCursorKeys(),i&&this.input.on("pointerdown",(e=>{const{x:s,y:t}=e;console.info(h(s),h(t))}))}setupSpawner(){this.barrels=this.physics.add.group({bounceY:.1,bounceX:1,collideWorldBounds:!0});const{spawner:e}=this.levelData;this.time.addEvent({delay:e.interval,loop:!0,callbackScope:this,callback:()=>{console.info("barrels pooling",this.barrels.getChildren().length);const s=this.barrels.get(this.goal.x,this.goal.y,l.Barrel).setOrigin(1,1);s.setActive(!0),s.setVisible(!0),s.body.enable=!0,s.setVelocityX(e.speed),this.time.addEvent({delay:e.lifespan,repeat:0,callbackScope:this,callback:()=>{this.barrels.killAndHide(s),s.body.enable=!1}})}})}create(){this.fpsText=new n(this).setDepth(100),this.levelData=this.cache.json.get(o.One),this.screenWidth=this.levelData.world.width,this.screenHeigth=this.levelData.world.height,this.physics.world.bounds.width=this.screenWidth,this.physics.world.bounds.height=this.screenHeigth,this.setupLevel(),this.setupFireEnemies(),this.setupPlayer(),this.setupCursor(),this.setupSpawner(),this.cameras.main.setBounds(0,0,this.screenWidth,this.screenHeigth),this.cameras.main.startFollow(this.player),this.endgame=!1,this.physics.add.collider(this.platforms,[this.player,this.goal,this.barrels]),this.physics.add.overlap(this.player,[this.fires,this.barrels],this.restartGame,null,this),this.physics.add.overlap(this.player,this.goal,this.winGame,null,this)}update(){this.endgame?this.stopMan():(this.fpsText.update(),this.movePlayer())}restartGame(e,s){this.cameras.main.fade(200),this.endgame=!0,this.cameras.main.on("camerafadeoutcomplete",(()=>{this.scene.restart()}))}winGame(){this.endgame||this.cameras.main.flash(300),this.endgame=!0,this.cameras.main.on("cameraflashcomplete",(()=>{this.scene.start("WinScene")}))}movePlayer(){const e=this.player.body.blocked.down||this.player.body.touching.down;this.cursors.left.isDown?(this.player.body.setVelocityX(-this.velocity),this.player.flipX=!1,this.player.anims.isPlaying||this.player.anims.play(a.Walk)):this.cursors.right.isDown?(this.player.body.setVelocityX(this.velocity),this.player.flipX=!0,this.player.anims.isPlaying||this.player.anims.play(a.Walk)):this.stopMan(),(this.cursors.space.isDown||this.cursors.up.isDown)&&e&&this.player.body.setVelocityY(-this.jumpForce),e||(this.player.anims.stop(),this.player.setFrame(r.jump))}stopMan(){this.player.body.setVelocityX(0),this.player.anims.stop(a.Walk),this.player.setFrame(r.idle)}}class p extends Phaser.Scene{constructor(){super({key:"PreloadScene"})}preload(){this.load.image(l.Barrel,"assets/sprites/barrel.png"),this.load.image(l.Block,"assets/sprites/block.png"),this.load.image(l.Gorilla,"assets/sprites/gorilla.png"),this.load.image(l.Ground,"assets/sprites/ground.png"),this.load.image(l.Platform,"assets/sprites/platform.png"),this.load.image(l.Backgorund,"assets/sprites/background.png"),this.load.spritesheet(l.Fire,"assets/spritesheets/fire_spritesheet.png",{frameWidth:20,frameHeight:21,margin:1,spacing:1}),this.load.spritesheet(l.Player,"assets/spritesheets/player_spritesheet.png",{frameWidth:28,frameHeight:30,margin:1,spacing:1}),this.load.json(o.One,"assets/levels/level1.json")}create(){this.anims.create({key:"burn",frames:this.anims.generateFrameNames(l.Fire,{frames:[0,1]}),frameRate:4,repeat:-1}),this.anims.create({key:a.Walk,frames:this.anims.generateFrameNames(l.Player,{frames:r.walk}),frameRate:12,yoyo:!0,repeat:-1}),this.scene.start("MainScene")}}class d extends Phaser.Scene{constructor(){super({key:"WinScene"})}retryText;cursors;create(){const e=this.sys.game.config.height,s={color:"#FFF",fontSize:"28px",fontFamily:"sans-serif"};this.add.text(10,e/2,"You Won!!",s).setDepth(1500).setOrigin(0,1),this.add.text(10,e/2+40,"Thanks for playing",s).setDepth(1500).setOrigin(0,1),this.retryText=this.add.text(10,e/2+100,"Tap here to play again",{...s,fontSize:"34px"}).setDepth(1500).setOrigin(0,1).setInteractive({useHandCursor:!0}).on("pointerdown",this.startGame.bind(this)).on("pointerover",(()=>this.retryText.setStyle({fill:"#f39c12"}))).on("pointerout",(()=>this.retryText.setStyle({fill:"#FFF"}))),this.cursors=this.input.keyboard.createCursorKeys()}update(e,s){this.cursors.space.isDown&&this.startGame()}startGame(){this.scene.start("MainScene")}}const u={type:Phaser.AUTO,backgroundColor:"#111",scale:{parent:"phaser-game",mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:360,height:620},scene:[p,c,d],pixelArt:!0,physics:{default:"arcade",arcade:{debug:i,gravity:{y:1e3}}}};window.addEventListener("load",(()=>{new Phaser.Game(u)}))},204:()=>{console.log("%c %c %c %c %c Built using phaser-project-template %c https://github.com/yandeu/phaser-project-template","background: #ff0000","background: #ffff00","background: #00ff00","background: #00ffff","color: #fff; background: #000000;","background: none")}},t={};function i(e){var a=t[e];if(void 0!==a)return a.exports;var r=t[e]={exports:{}};return s[e].call(r.exports,r,r.exports,i),r.exports}i.m=s,e=[],i.O=(s,t,a,r)=>{if(!t){var l=1/0;for(c=0;c<e.length;c++){for(var[t,a,r]=e[c],o=!0,n=0;n<t.length;n++)(!1&r||l>=r)&&Object.keys(i.O).every((e=>i.O[e](t[n])))?t.splice(n--,1):(o=!1,r<l&&(l=r));if(o){e.splice(c--,1);var h=a();void 0!==h&&(s=h)}}return s}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[t,a,r]},i.o=(e,s)=>Object.prototype.hasOwnProperty.call(e,s),(()=>{var e={179:0};i.O.j=s=>0===e[s];var s=(s,t)=>{var a,r,[l,o,n]=t,h=0;if(l.some((s=>0!==e[s]))){for(a in o)i.o(o,a)&&(i.m[a]=o[a]);if(n)var c=n(i)}for(s&&s(t);h<l.length;h++)r=l[h],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return i.O(c)},t=self.webpackChunkclimbler_plumber=self.webpackChunkclimbler_plumber||[];t.forEach(s.bind(null,0)),t.push=s.bind(null,t.push.bind(t))})(),i.O(void 0,[216],(()=>i(738)));var a=i.O(void 0,[216],(()=>i(204)));a=i.O(a)})();