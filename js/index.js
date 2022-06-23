const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d")

canvas.width = 1500
canvas.height = 1000

// Now we're going to use the Canvas API to manipulate the HTML

c.fillRect(0,0, canvas.width,canvas.height)  // With this function we input the coordenates, the width and the height of a Rectangle


// In order to control the speed and the movements of the player, 
// it's required to create a function to animate the Objects

const gravity = 0.75

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:"./assets/Background.png",
})

const obelisk = new Sprite({
    position:{
        x:650,
        y:550
    },
    imageSrc:"./assets/FlyingObelisk.png",
    framesMax: 13
})

const player = new Fighter({
    position:{
        x:200,
        y:0
    },
    velocity:{
        x:0,
        y:10
    },
    color:"red",
    offset:{
        x:0,
        y:0
    },
    imageSrc:"./assets/Wizard/Idle.png",
    scale:3.5,
    framesMax:8,
    offset:{
        x:200,
        y:215
    },
    sprites:{
        idle:{
            imageSrc:"./assets/Wizard/Idle.png",
            framesMax:8
        },
        run:{
            imageSrc:"./assets/Wizard/Run.png",
            framesMax:8
        },
        jump:{
            imageSrc:"./assets/Wizard/Jump.png",
            framesMax:2
        },
        fall:{
            imageSrc:"./assets/Wizard/Fall.png",
            framesMax:2
        },
        attack1:{
            imageSrc:"./assets/Wizard/Attack1.png",
            framesMax:8
        },
        takehit:{
            imageSrc:"./assets/Wizard/TakeHit.png",
            framesMax:3
        }
    }
})

const enemy = new Fighter({
    position:{
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:10
    },
    color:"blue",
    offset:{
        x:0,
        y:0
    },
    imageSrc:"./assets/Warrior/Idle.png",
    scale:4,
    framesMax:10,
    offset:{
        x:50,
        y:37
    },
    sprites:{
        idle:{
            imageSrc:"./assets/Warrior/Idle.png",
            framesMax:10
        },
        run:{
            imageSrc:"./assets/Warrior/Run.png",
            framesMax:8
        },
        jump:{
            imageSrc:"./assets/Warrior/Jump.png",
            framesMax:3
        },
        fall:{
            imageSrc:"./assets/Warrior/Fall.png",
            framesMax:3
        },
        attack1:{
            imageSrc:"./assets/Warrior/Attack1.png",
            framesMax:7
        },
        takehit:{
            imageSrc:"./assets/Warrior/TakeHit.png",
            framesMax:3
        }
    }
})

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    }
}

decreaseTimer()

function playerSetup(){
    player.update()

    player.velocity.x = 0

    if(keys.a.pressed && lastKey === "a"){
        player.velocity.x = -5
        player.switchSprite("run")

    } else if(keys.d.pressed && lastKey === "d"){
        player.velocity.x = 5
        player.switchSprite("run")

    } else {
        player.switchSprite("idle")
    }

    if (player.velocity.y < 0){
        player.switchSprite("jump")
    } else if (player.velocity.y > 0){
        player.switchSprite("fall")
    }
}

function enemySetup(){
    enemy.update()

    enemy.velocity.x = 0

    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft"){
        enemy.velocity.x = -5
        enemy.switchSprite("run")

    } else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight"){
        enemy.velocity.x = 5
        enemy.switchSprite("run")

    } else {
        enemy.switchSprite("idle")
    }

    if (enemy.velocity.y < 0){
        enemy.switchSprite("jump")
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite("fall")
    }
    
}

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)

    background.update()
    obelisk.update()

    playerSetup()    
    enemySetup()

    // Detect Attack

    if (rectangularCollision({rect1: player, rect2: enemy}) && player.isAttacking
    ) {
        enemy.switchSprite("takehit")
        player.isAttacking = false 
        enemy.health -= 10
        document.querySelector("#enemyHealth").style.width = enemy.health + "%"
    }

    if (rectangularCollision({rect1: enemy,rect2: player}) && enemy.isAttacking
    ) {
        player.switchSprite("takehit")
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector("#playerHealth").style.width = player.health + "%"
    }

    // END GAME

    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerID})
    }

}

animate()

window.addEventListener("keydown", (event) => {
    switch(event.key){
    case "a":
        keys.a.pressed = true
        lastKey = "a"
        break

    case "d":
        keys.d.pressed = true
        lastKey = "d"
        break

    case "w":

        player.velocity.y = -20
        break
    
    case " ":
        player.attack()
        break

    case "ArrowRight":
        keys.ArrowRight.pressed = true
        enemy.lastKey = "ArrowRight"
        break

    case "ArrowLeft":
        keys.ArrowLeft.pressed = true
        enemy.lastKey = "ArrowLeft"
        break
    
    case "ArrowUp":
        enemy.velocity.y = -10
        
        break
    
    case "ArrowDown":
        enemy.attack()
        break
    
    }
})

window.addEventListener("keyup", (event) => {
    switch(event.key){
    case "d":
        keys.d.pressed = false
        break
    
    case "a":
        keys.a.pressed = false
        break
    
    case "ArrowRight":
        keys.ArrowRight.pressed = false
        break

    case "ArrowLeft":
        keys.ArrowLeft.pressed = false
        break
    }
})


var resetButton = document.getElementbyId('resetButton');

function reloadPage(){
   window.location.reload();
}