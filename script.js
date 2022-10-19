let activePlayer = 'red'    //activePlayerToken
let players = []            //playerTokens
let stopCallback = false
addPlayers()
boxNumbers()
players.forEach((player)=>{
    document.querySelector(`#${player}`).style.marginLeft = '0vmin'
    document.querySelector(`#${player}`).style.marginTop = '0vmin'
})

document.addEventListener('keydown',async(e)=>{
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
                document.querySelector('#winnersList').insertAdjacentHTML('beforeend',`<p>${document.querySelector('#winnersList').querySelectorAll('p').length+1}   ${players[0]}</p>`)
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
    document.querySelector('#winnersList').insertAdjacentHTML('beforeend',`<p>${document.querySelector('#winnersList').querySelectorAll('p').length+1}   ${wonBy}</p>`)
}

function checkWin(){
    return new Promise(async(resolve,reject)=>{
        if(marginTop()==-88.2 && marginLeft()==0){
            document.querySelector('#p_turn').innerHTML = `Winner No.${document.querySelector('#winnersList').querySelectorAll('p').length+1}: ${activePlayer}`
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
        (i<no_of_players)?players.push(document.querySelectorAll('.players')[i].id):document.querySelectorAll('.players')[i].style.opacity = 0
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
            document.querySelector(`#${activePlayer}`).style.marginTop = String(marginTop() - 9.8) + 'vmin'
        }
        else if(direction=='right'){
            document.querySelector(`#${activePlayer}`).style.marginLeft = String(marginLeft() + 9.8) + 'vmin'
        }
        else if(direction=='left'){
            document.querySelector(`#${activePlayer}`).style.marginLeft = String(marginLeft() - 9.8) + 'vmin'
        }
        await new Promise(resolve => setTimeout(resolve, 400))
        resolve()
    })
}

function changeActivePlayer(){
    let indexOfActive = players.indexOf(activePlayer)
    activePlayer = (indexOfActive+1==players.length)?players[0]:players[indexOfActive+1]
    document.querySelector('#p_turn').innerHTML = `${activePlayer} player's turn`
}

function getDirection(){
    if((marginLeft()==88.2 && ((((marginTop()*10)%(-19.6*10))/10)==0)) || (marginLeft()==0 && ((((marginTop()*10)%(-19.6*10))/10)!=0))){
        return 'up'
    }
    else if((((marginTop()*10)%(-19.6*10))/10)==0){
        return 'right'
    }
    else{
        return 'left'
    }
}

function checkLaddersAndSnakes(){
    return new Promise(async(resolve,reject)=>{
        let froms = [[9.8,0],[49,-9.8],[0,-49],[58.8,-58.8],[39.2,-19.6],[78.4,-29.4],[88.2,-49],[29.4,-68.6],[19.6,-49],[88.2,-9.8],[68.6,-58.8],[9.8,-49],[39.2,-68.6],[29.4,-19.6],[58.8,-88.2],[9.8,-88.2],[78.4,-88.2],[88.2,-39.2]]
        let tos = [[19.6,-19.6],[58.8,-29.4],[9.8,-68.6],[68.6,-78.4],[29.4,-39.2],[68.6,-49],[78.4,-68.6],[19.6,-88.2],[39.2,-58.8],[68.6,-19.6],[39.2,-29.4],[19.6,-29.4],[49,-58.8],[49,0],[49,-68.6],[19.6,-68.6],[88.2,-68.6],[88.2,-19.6]]
        for(let i=0; i<tos.length; i++){
            if(marginLeft()==froms[i][0] && marginTop()==froms[i][1]){
                new Audio('move.mp3').play()
                document.querySelector(`#${activePlayer}`).style.marginLeft = `${tos[i][0]}vmin`
                document.querySelector(`#${activePlayer}`).style.marginTop = `${tos[i][1]}vmin`
                await new Promise(resolve => setTimeout(resolve, 400))
                break
            }
        }
        resolve()
    })
}

function checkRange(diceNum){
    return (marginTop()==-88.2 && (marginLeft()+Number((diceNum*-9.8).toFixed(1)))<0)?true:false
}

function boxNumbers(){
    let boxes = document.querySelectorAll('.box')
    boxes.forEach((box,i)=>{
        if(String(i).length==1 || (String(i).length==2 && Number(String(i)[0]))%2==0){
            box.innerHTML = 100-i
        }
        else{
            box.innerHTML = Number(`${9-Number(String(i)[0])}${String(i)[1]}`)+1
        }
    })
}

function marginLeft(){
    return Number(document.querySelector(`#${activePlayer}`).style.marginLeft.split('v')[0])
}

function marginTop(){
    return Number(document.querySelector(`#${activePlayer}`).style.marginTop.split('v')[0])
}