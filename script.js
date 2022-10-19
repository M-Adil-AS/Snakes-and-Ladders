let turn = 'red'
let stopEvent = false
document.querySelector('#red').style.marginLeft = '0vmin'
document.querySelector('#red').style.marginTop = '0vmin'
document.querySelector('#blue').style.marginLeft = '0vmin'
document.querySelector('#blue').style.marginTop = '0vmin'
boxNumbers()

document.addEventListener('keydown',async(e)=>{
    if(e.keyCode=='83' && !stopEvent){
        stopEvent = true
        let diceNum = await roll()
        let isOutOfRange = checkRange(diceNum)
        await new Promise(resolve => setTimeout(resolve, 400))      //before run or if out of range
        if(!isOutOfRange){
            await run(diceNum)
            await new Promise(resolve => setTimeout(resolve, 400))      //after run
        }
        let wonBy = checkWin()
        if(wonBy=='none'){
            changeTurn()
            stopEvent = false
        }
    }
})

function checkWin(){
    if(marginTop()==-88.2 && marginLeft()==0){
        document.querySelector('#p_turn').innerHTML = `${turn} player wins!`
        new Audio('win.mp3').play()
        return turn
    }    
    else{
        return 'none'
    }
}

function checkRange(diceNum){
    let isOutOfRange = false
    if(marginTop()==-88.2 && (marginLeft()+Number((diceNum*-9.8).toFixed(1)))<0){
        isOutOfRange = true
    }
    return isOutOfRange
}

function changeTurn(){
    if(turn=='blue'){
        document.querySelector('#p_turn').innerHTML = "Red player's turn"
        turn = 'red'
    }
    else if(turn=='red'){
        document.querySelector('#p_turn').innerHTML = "Blue player's turn"
        turn = 'blue'
    }
}

function run(diceNum){
    return new Promise(async(resolve,reject)=>{
        for(i=1; i<=diceNum; i++){
            let direction = getDirection()
            await move(direction)
        }
        await checkLaddersAndSnakes()
        resolve()
    })
}

function checkLaddersAndSnakes(){
    return new Promise(async(resolve,reject)=>{
        let froms = [[9.8,0],[49,-9.8],[0,-49],[58.8,-58.8],[39.2,-19.6],[78.4,-29.4],[88.2,-49],[29.4,-68.6],[19.6,-49],[88.2,-9.8],[68.6,-58.8],[9.8,-49],[39.2,-68.6],[29.4,-19.6],[58.8,-88.2],[9.8,-88.2],[78.4,-88.2],[88.2,-39.2]]
        let tos = [[19.6,-19.6],[58.8,-29.4],[9.8,-68.6],[68.6,-78.4],[29.4,-39.2],[68.6,-49],[78.4,-68.6],[19.6,-88.2],[39.2,-58.8],[68.6,-19.6],[39.2,-29.4],[19.6,-29.4],[49,-58.8],[49,0],[49,-68.6],[19.6,-68.6],[88.2,-68.6],[88.2,-19.6]]
        for(let i=0; i<tos.length; i++){
            if(marginLeft()==froms[i][0] && marginTop()==froms[i][1]){
                new Audio('move.mp3').play()
                document.querySelector(`#${turn}`).style.marginLeft = `${tos[i][0]}vmin`
                document.querySelector(`#${turn}`).style.marginTop = `${tos[i][1]}vmin`
                await new Promise(resolve => setTimeout(resolve, 400))
                break
            }
        }
        resolve()
    })
}

function move(direction){
    return new Promise(async(resolve,reject)=>{
        new Audio('move.mp3').play()
        if(direction=='up'){
            document.querySelector(`#${turn}`).style.marginTop = String(marginTop() - 9.8) + 'vmin'
        }
        else if(direction=='right'){
            document.querySelector(`#${turn}`).style.marginLeft = String(marginLeft() + 9.8) + 'vmin'
        }
        else if(direction=='left'){
            document.querySelector(`#${turn}`).style.marginLeft = String(marginLeft() - 9.8) + 'vmin'
        }
        await new Promise(resolve => setTimeout(resolve, 400))
        resolve()
    })
}

function getDirection(){
    let direction 
    if((marginLeft()==88.2 && ((((marginTop()*10)%(-19.6*10))/10)==0)) || (marginLeft()==0 && ((((marginTop()*10)%(-19.6*10))/10)!=0))){
        direction = 'up'
    }
    else if((((marginTop()*10)%(-19.6*10))/10)==0){
        direction = 'right'
    }
    else{
        direction = 'left'
    }
    return direction
}

function marginLeft(){
    return Number(document.querySelector(`#${turn}`).style.marginLeft.split('v')[0])
}

function marginTop(){
    return Number(document.querySelector(`#${turn}`).style.marginTop.split('v')[0])
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