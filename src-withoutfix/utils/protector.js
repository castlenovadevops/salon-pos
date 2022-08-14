const loggeduser = 'employeedetail';
const syncedbusiness = 'businessdetail';

export const logout = () => {
    localStorage.removeItem(loggeduser);
}

export const isBusinessSynced = () => {  
    if (localStorage.getItem(syncedbusiness)) {
        return true;
    } 
    return false;
}

export const isUserLogged = () => {
    if (localStorage.getItem(syncedbusiness) && localStorage.getItem(loggeduser)) {
        return true;
    } 
    return false;
}
