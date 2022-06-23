function rectangularCollision({rect1,rect2}){
    return( 
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width && 
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y && 
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

// Fight Ended
function determineWinner({player,enemy,timerID}){
    clearTimeout(timerID)
    document.querySelector("#displayText").style.display = "flex"
    document.querySelector("#reset").style.display = "flex"
    if (player.health === enemy.health){
    document.querySelector("#displayText").innerHTML = "Tie"
    } else if (player.health > enemy.health) {
        document.querySelector("#displayText").innerHTML = "Player 1 wins!"
    } else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = "Player 2 wins!"
    }
}


// Timer Manager
let timer = 60
let timerID
function decreaseTimer(){
    if (timer > 0){
        timerID = setTimeout(decreaseTimer,1000);timer--;
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0){
        determineWinner({player,enemy,timerID})
    }
}