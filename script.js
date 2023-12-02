let players = []            //playerTokens
addPlayers()
let activePlayer = players[0]    //activePlayerToken
let stopCallback = false

players.forEach((player)=>{
    player.style.marginLeft = '3%'
    player.style.marginTop = '93%'
    player.style.background = player.getAttribute('id')
    player.box = 1
})

document.addEventListener('keydown', async(e)=>{
    if(e.keyCode=='83' && !stopCallback){
        stopCallback = true
        let diceNum = await roll()
        let willBeOutOfRange = checkRange(diceNum)
        await new Promise(resolve => setTimeout(resolve, 400))      //before run or after out of range
        
        if(!willBeOutOfRange){
            await run(diceNum)
            await new Promise(resolve => setTimeout(resolve, 400))      //after run
        }
        
        let wonBy = await checkWin()
        changeActivePlayer()
        
        if(wonBy!='none'){
            manageWinner(wonBy)
            if(players.length==1){
                document.querySelector('#p_turn').innerHTML = 'Game Ends!'
                document.querySelector('#winnersList-box').insertAdjacentHTML('beforeend',`<p>${document.querySelector('#winnersList').querySelectorAll('p').length+1}   ${players[0].getAttribute('id')}</p>`)
            }
            else{stopCallback = false}
        }
        else{
            stopCallback = false
        }
    }
})

function manageWinner(wonBy){
    let indexOfWinner = players.indexOf(wonBy)
    players.splice(indexOfWinner,1)
    document.querySelector('#winnersList-box').insertAdjacentHTML('beforeend',`<p>${document.querySelector('#winnersList').querySelectorAll('p').length+1}   ${wonBy.getAttribute('id')}</p>`)
}

function checkWin(){
    return new Promise(async(resolve,reject)=>{
        if(activePlayer.box == 100){
            document.querySelector('#p_turn').innerHTML = `Winner No.${document.querySelector('#winnersList').querySelectorAll('p').length+1}: ${activePlayer.getAttribute('id')}`
            new Audio('win.mp3').play()
            await new Promise(resolve => setTimeout(resolve, 2000)) 
            resolve(activePlayer)
        }
        else{
            resolve('none')
        }
    })
}

function addPlayers(){
    let no_of_players
    while(!(no_of_players>=2 && no_of_players<6)){
        no_of_players = prompt("How many players? (2-5)")
    }
    
    for(let i=0; i<5; i++){
        (i<no_of_players) ? players.push(document.querySelectorAll('.players')[i]) : document.querySelectorAll('.players')[i].style.opacity = 0
    }
}

function roll(){
    return new Promise(async(resolve,reject)=>{
        let diceNum = Math.floor(Math.random() * 6) + 1
        let values = [[0,-360],[-180,-360],[-180,270],[0,-90],[270,180],[90,90]]
        new Audio('diceRoll.mp3').play()
        document.querySelector('#cube_inner').style.transform = 'rotateX(360deg) rotateY(360deg)'
        await new Promise(resolve => setTimeout(resolve, 750))
        document.querySelector('#cube_inner').style.transform = `rotateX(${values[diceNum-1][0]}deg) rotateY(${values[diceNum-1][1]}deg)`
        await new Promise(resolve => setTimeout(resolve, 750))
        resolve(diceNum)
    })
}

function run(diceNum){
    return new Promise(async(resolve,reject)=>{
        for(let i = 1; i<=diceNum; i++){
            let direction = getDirection()
            await move(direction)
        }
        await checkLaddersAndSnakes()
        resolve()
    })
}

function move(direction){
    return new Promise(async(resolve,reject)=>{
        new Audio('move.mp3').play()
        if(direction=='up'){
            activePlayer.style.marginTop = String(marginTop() - 10) + '%'
        }
        else if(direction=='right'){
            activePlayer.style.marginLeft = String(marginLeft() + 10) + '%'
        }
        else if(direction=='left'){
            activePlayer.style.marginLeft = String(marginLeft() - 10) + '%'
        }

        activePlayer.box += 1
        await new Promise(resolve => setTimeout(resolve, 400))
        resolve()
    })
}

function changeActivePlayer(){
    let indexOfActive = players.indexOf(activePlayer)
    activePlayer = (indexOfActive+1==players.length) ? players[0] : players[indexOfActive+1]
    document.querySelector('#p_turn').innerHTML = `${activePlayer.getAttribute('id')} player's turn`
}

function getDirection(){
    if(activePlayer.box % 10 == 0){
        return 'up'
    }
    else if(Math.floor(activePlayer.box/10) % 2 == 0){
        return 'right'
    }
    else{
        return 'left'
    }
}

function checkLaddersAndSnakes(){
    return new Promise(async(resolve,reject)=>{
        let snakes = [{from: 24, to:6},{from: 50, to:30},{from: 59, to:38},{from: 68, to:36},{from: 76, to:66},{from: 92, to:71},{from: 94, to:75},{from: 99, to:78}]
        let ladders = [{from: 2, to:23},{from: 11, to:28},{from: 15, to:34},{from: 25, to:44},{from: 32, to:53},{from: 51, to:72},{from: 58, to:65},{from: 60, to:79},{from: 67, to:88},{from: 77, to:98}]
        let objects = [...snakes, ...ladders]

        for(let i=0; i<objects.length; i++){
            if(activePlayer.box == objects[i].from){
                new Audio('move.mp3').play()
                activePlayer.box = objects[i].to
                activePlayer.style.marginLeft = (Math.floor(activePlayer.box/10) % 2 == 0) ? `${(((activePlayer.box-1) % 10) * 10) + 3}%` : `${93 - (((activePlayer.box-1) % 10) * 10)}%`
                activePlayer.style.marginTop = `${(Math.floor((100 - activePlayer.box) / 10) * 10) + 3}%`
                await new Promise(resolve => setTimeout(resolve, 400))
                break
            }
        }
        resolve()
    })
}

function checkRange(diceNum){
    return (activePlayer.box + diceNum > 100) ? true : false
}

function marginLeft(){
    return Number(activePlayer.style.marginLeft.split('%')[0])
}

function marginTop(){
    return Number(activePlayer.style.marginTop.split('%')[0])
}