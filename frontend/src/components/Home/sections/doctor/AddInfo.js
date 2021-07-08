import React from 'react';

function AddInfo({open,children}) 
{
    if(!open) return null;

    return(
        <div className="patient-info" style={{width:"80%",margin:"auto"}}>
            {children}
        </div>
    )
}

export default AddInfo