const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

// Now we're going to use the Canvas API to manipulate the HTML

c.fillRect(0,0, canvas.width,canvas.height)  // With this function we input the coordenates, the width and the height of a Rectangle


// In order to control the speed and the movements of the player, 
// it's required to create a function to animate the Objects

const gravity = 0.5
class Sprite{
    constructor({position,velocity,color,offset}){
        this.position = position
        this.velocity = velocity
        this.stamina = {
            position: {
                x:20,
                y:40
            },
            value:200,
            width:100,
            height:5
        }
        this.gotStamina = true
        this.lastKey
        this.height = 150
        this.width = 50
        this.attackBox = {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
    }

    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)

        // Attack Box
        if (this.isAttacking){
            c.fillStyle = "green"
            c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        }

        if(this.gotStamina){
            c.fillStyle = "blue"
            c.fillRect(this.stamina.position.x,this.stamina.position.y,this.stamina.width,this.stamina.height)            
        }
    }

    // file:///C:/Users/juani/OneDrive/Documentos/Programación/Maquetación/JavaScript%20-%20Curso/Fight-Game/index.html

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {this.isAttacking = false},100)
    }

    updateStamina(){
        if (!this.gotStamina){
            setTimeout(()=>{
                this.stamina += 10
            }, 1000)
        } else {

        }
    }
}

const player = new Sprite({
    position:{
        x:0,
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
    }
})

const enemy = new Sprite({
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
        x:-50,
        y:0
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

function rectangularCollision({rect1,rect2}){
    return( 
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width && 
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y && 
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    if(keys.a.pressed && lastKey === "a"){
        player.velocity.x = -5
    } else if(keys.d.pressed && lastKey === "d"){
        player.velocity.x = 5
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft"){
        enemy.velocity.x = -5
    } else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight"){
        enemy.velocity.x = 5
    }

    // Detect Attack

    if (rectangularCollision({rect1: player, rect2: enemy}) && player.isAttacking
    ) {
        player.isAttacking = false 
        console.log("player attack")
        document.querySelector("#enemyHealth").style.width = "20%"
    }

    if (rectangularCollision({rect1: enemy,rect2: player}) && enemy.isAttacking
    ) {
        enemy.isAttacking = false
        console.log("enemy attack")
        document.querySelector("#playerHealth").style.width = "20%"
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
        player.velocity.y = -4
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
        enemy.velocity.y = -4
        break
    
    case "ArrowDown":
        enemy.isAttacking = true
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
