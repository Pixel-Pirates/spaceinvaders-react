import React from 'react';
import './App.css';
import Fighter from './Components/Fighter';
import {game} from './globals'
import Invader from './Components/Invader';
import Bullet from './Components/Bullet';


const FIGHTER_SPEED = 0.5

function fighterCollided(fighter, bullet)
{
  //fighter 100x85
  const FIGHTER_WIDTH = 100
  const FIGHTER_HEIGHT = 85

  var width = (FIGHTER_WIDTH/window.innerWidth)*100
  var height = (FIGHTER_HEIGHT/window.innerHeight)*100
  var topLeft = {
    x : fighter.x - width/2,
    y : fighter.y + height/2
  }
  var bottomRight = {
    x : fighter.x + width/2,
    y : fighter.y - height/2
  }

  if ((topLeft.x < bullet.x && bottomRight.x > bullet.x) && 
      (topLeft.y > bullet.y && bottomRight.y <bullet.y))
    return true

  return false
}

function invaderCollided(invader, bullet)
{
  //invader 50x34
  const INVADER_WIDTH = 50
  const INVADER_HEIGHT = 34

  var width = (INVADER_WIDTH/window.innerWidth)*100
  var height = (INVADER_HEIGHT/window.innerHeight)*100
  var topLeft = {
    x : invader.x - width/2,
    y : invader.y + height/2
  }
  var bottomRight = {
    x : invader.x + width/2,
    y : invader.y - height/2
  }

  if ((topLeft.x < bullet.x && bottomRight.x > bullet.x) && 
      (topLeft.y > bullet.y && bottomRight.y <bullet.y))
    return true

  return false
}


class App extends React.Component
{
  state = {
    fighter : {
      movingLeft : false,
      movingRight : false
    },
    fighterX: 50,
    bullet: {
      active: false,
      x : null,
      y : null
    },
    invaderBomb : {
      active: false,
      x : null,
      y : null
    },
    invaders: [

    ],

    score : 0,

    moveCount : 60,
    currentCount : 0
  }

  componentDidMount()
  {
    let app = this

    window.onkeypress = (event) =>
    {
      //handle keypress
      if (event.code == "KeyA")
        this.setState({fighter: {movingLeft: true}})
        //newFighterX -= FIGHTER_SPEED
      else if (event.code == "KeyD")
        //newFighterX += FIGHTER_SPEED
        this.setState({fighter: {movingRight: true}})
      else if (event.code == "Space" && !app.state.bullet.active)
          app.setState({bullet : {active: true, x : app.state.fighterX, y : 10}})
    }

    window.onkeyup = (event) =>
    {
      //handle keypress
      if (event.code == "KeyA")
        this.setState({fighter: {movingLeft: false}})
        //newFighterX -= FIGHTER_SPEED
      else if (event.code == "KeyD")
        //newFighterX += FIGHTER_SPEED
        this.setState({fighter: {movingRight: false}})
    }

    this.spawnEntities()

    setInterval(this.tick.bind(this), 16)
  }

  tick = () =>
  {
    var {bullet, invaders, score, currentCount, moveCount, invaderBomb, fighterX} = this.state
    
    //Fighter bullet logic
    if (bullet.active)
    {
      //moving on bullet
      var active = true
      var newY = bullet.y
      newY += 1

      if (newY > 100)
        active = false
      
      //check for collid

      for (var index = 0; index < invaders.length; index++)
      {
        if (invaders[index].alive && invaderCollided(invaders[index], bullet))
        {
          active = false
          invaders[index].alive = false  
          score += 10
        }
      }

      this.setState({ "score": score, "bullet" : { "y" : newY, "x" : bullet.x, "active": active } })
    }
    
    //invader movement logic
    currentCount++
    if (currentCount >= moveCount)
    {
      currentCount = 0
      var shiftNeeed = false

      invaders.map((invader) =>
      {
        if (invader.alive)
          invader.x += 1
        
        if (invader.x > 90)
          shiftNeeed = true

        return invader
      })

      if (shiftNeeed)
      {
        invaders.map((invader) =>
          {
            invader.x -= 20
            invader.y -= 5
            return invader
          })
      }

    }
    this.setState({ "currentCount" : currentCount })

    //invader bomb logic
    if (invaderBomb.active)
    {
      //move bomb
      var active = true
      var newY = invaderBomb.y
      newY -= 1

      if (newY < 0)
        active = false
      
      //check for collid with player
      if (fighterCollided({x: fighterX, y: 0}, invaderBomb))
      {
        this.reset()
      }
      
      
      
      this.setState({invaderBomb : {
        active: active,
        x : invaderBomb.x,
        y : newY
      }})
    }
    
    else
    {
      //shoot bomb

      var activeShooters = []
     // console.log("-------------START-------------")
      for (var i = 1; i <= 6; i++) //1 to 6
      {
        for (var j = 3; j >= 1; j--) //3 to 1
        {
          var invaderIndex = (6*j) - i
          var invader = invaders[invaderIndex]
          //console.log("invaderIndex", invaderIndex)
          //console.log("i", i)
          //console.log("j", j)

          if (invader.alive)
          {
            //console.log(`${invaderIndex} - (${i}, ${j})`)
            //console.log("invader", invader)
            activeShooters.push(invader)
            break
          }
        }
      }
      //console.log("-------END-------")

      //console.log("activeShooters", activeShooters)

      var randomInvader = activeShooters[Math.floor(Math.random()*activeShooters.length)]
      this.setState({invaderBomb : {
        active: true,
        x : randomInvader.x,
        y : randomInvader.y
      }})
    }


    var newFighterX = this.state.fighterX
    
    if (this.state.fighter.movingLeft)
    {
      newFighterX -= FIGHTER_SPEED
    }

    else if (this.state.fighter.movingRight)
    {
      newFighterX += FIGHTER_SPEED
    }

    //correct x value if it's over
    if (newFighterX < 0)
    newFighterX = 0
  else if (newFighterX > 100)
    newFighterX = 100
  
  //set fighterx value if it's changed
  if (this.state.fighterX != newFighterX)
    this.setState({fighterX: newFighterX})
  }

  reset = () =>
  {
    this.setState({"fighterX" : 50, "score": 0, "bullet": {"active": false}, "invaderBomb": {"active": false}})
    this.spawnEntities()
  }

  spawnEntities = () =>
  {
    var invaders = []
    var id = 0

    for (var yIndex = 0; yIndex < 3; yIndex++)
    {
      for (var xIndex = 0; xIndex < 6; xIndex++)
      {
        invaders.push({
          id : id++,
          x  : xIndex*10 + 10,
          y  : (9 - yIndex)*10,
          alive : true
        })
      }
    }

    this.setState({"invaders": invaders})
  }

  render()
  {
    const {bullet, fighterX, invaders, score, invaderBomb} = this.state
    return (
      <div>
        <p style={{"padding-left": "50px"}}>{score}</p>
        {bullet.active ? <Bullet x={bullet.x} y={bullet.y} /> : null}

        {invaderBomb.active ? <Bullet x={invaderBomb.x} y={invaderBomb.y} /> : null}

        {invaders.map((inv, index) =>
        {
          if (inv.alive)
            return <Invader x={inv.x} y={inv.y} />
        })}
        <Fighter x={fighterX} />
      </div>
    )
  }
}

export default App;
