
let enableSite=()=>{

    let isAvailable=localStorage.getItem('JAM_DISPLAY_CONTENT')

    return  isAvailable ? isAvailable : 'Default'
}

export {enableSite}