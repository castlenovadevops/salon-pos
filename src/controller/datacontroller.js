import config from '../config/config';


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

    getAppVersion(){
        if(config.root.indexOf('localhost:8080/api/v1')!== -1){
            return 'Version Local';
        }
        else if(config.root.indexOf('api.demo.castlenova.net/api/v1')!== -1){
            return 'Version Beta';
        }
        else if(config.root.indexOf('api.ci.dev.castlenova.net/api/v1')!== -1){
            return 'Version Development';
        }
    }
}