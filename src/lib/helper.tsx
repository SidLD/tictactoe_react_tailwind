export const jsonDataHeader = () => {
    return { headers: { "x-access-token": localStorage.getItem('token'), "Content-Type": "application/json" } }
}

export const formDataHeader = () => {
    return { headers: { "x-access-token": localStorage.getItem('token'), "Content-Type": "multipart/form-data" } }
}