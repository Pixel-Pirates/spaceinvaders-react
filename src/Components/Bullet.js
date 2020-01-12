import React from 'react'
import Entinity from './Entinity'

function Bullet({x, y})
{
    return ( <Entinity x={x} y={y} src={"./shot.jpg"} width={8} height={16} /> )
}

export default Bullet
