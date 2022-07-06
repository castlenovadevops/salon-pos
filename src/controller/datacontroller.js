export default class DataManager{
    getData(sql){
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }  
    saveData(sql){
        return new Promise(async (resolve) => {
            await window.api.saveData(sql).then(results=>{
                resolve(results); 
            });
        });
    } 
}