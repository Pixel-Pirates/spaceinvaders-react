import React from 'react'
import {game} from '../globals'
import Entinity from './Entinity'

const MAX_X = 100


function Fighter({x = 0})
{
     return (
         <Entinity x={x} y={0} src={"./fighter.jpg"} width={100} height={85}/>
     )
}

export default Fighter
