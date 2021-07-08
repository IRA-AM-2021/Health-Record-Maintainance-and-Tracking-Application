
let uniqId=()=>{
    let uniq=()=>{
       return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }
    let id=uniq() + uniq() + uniq() + uniq();
    return id;
}

let doctoruniqId=()=>{
    let uniq=()=>{
       return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }
    let id=uniq() + uniq() + uniq();
    return id;
}

let doctorPassword=()=>{
    let paswd=()=>{
       return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }
    let id=paswd() + paswd();
    return id;
}

let patientID=()=>{
    let uniq=()=>{
       return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }
    let id=uniq() + uniq() + uniq();
    return id;
}

export { uniqId, doctoruniqId, doctorPassword, patientID };