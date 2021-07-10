import React from 'react'
import img from './../../../../images/img4.svg'

export default function Working() {
    return (
        <div style={{height:"100%",overflow:"hidden",transform:"translateY(50%)"}}>
            <center>
                <img height="250px" src={img}/><br />
                <h3 style={{fontFamily:"jokerman",fontStyle:"italic",color:"green"}}>Under Construction</h3>
            </center>
        </div>
    )
}
