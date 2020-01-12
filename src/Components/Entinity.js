import React from 'react'
import {game} from '../globals'

const MAX_X = 100
const MAX_Y = 100


function Entinity({x = 0, y = 0, src = null, width = null, height = null})
{
     if (x > MAX_X)
        throw `Entinity - x prop (${x}) must be less than or equal to ${MAX_X}`
    if (y > MAX_Y)
        throw `Entinity - y prop (${y}) must be less than or equal to ${MAX_Y}`
    

    var leftLocation = (window.innerWidth)*(x/MAX_X) - (width/2);
    var bottomLocation = (window.innerHeight)*(y/MAX_Y);
    
    var styling =
    {
        bottom   : `${bottomLocation}px`,
        left     : `${leftLocation}px`,
        width    : `${width}px`,
        height   : `${height}px`,
        position : "absolute"
    }

    return ( 
        <img style={styling} src={src} />
        )
}

export default Entinity
