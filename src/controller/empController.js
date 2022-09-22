import DataManager from "./datacontroller"; 
import QueryManager from "./queryManager"; 
import config from "../config/config";
import axios from "axios";
import TicketController from "./TicketController";
export default class EmpController extends DataManager{
    
        mastertables= [ 
            {
                name: "staff_clockLog",
                tablename: 'staff_clockLog',
                progressText: "Synchronizing Logs...",
                progresscompletion: 10,
                url:'',
                syncurl:'/employee/synclog'
            },
            {
                name: "users",
                tablename: 'users',
                progressText: "Synchronizing Staffs...",
                progresscompletion: 10,
                url: window.localStorage.getItem('businessdetail') !== null && window.localStorage.getItem('businessdetail') !== undefined && window.localStorage.getItem('businessdetail') !== '' ? config.root + "/employee/" + JSON.parse(window.localStorage.getItem('businessdetail')).id :'',
                syncurl:'/inventory/category/saveorupdate'
            },

            {
                name: "default_commission",
                tablename: 'default_commission',
                progressText: "Synchronizing Commission...",
                progresscompletion: 10,
                url: window.localStorage.getItem('businessdetail') !== null && window.localStorage.getItem('businessdetail') !== undefined && window.localStorage.getItem('businessdetail') !== '' ?  config.root + `/settings/default_commission/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id : '',
                syncurl:''
            } ,

            {
                name: "default_discount_division",
                tablename: 'default_discount_division',
                progressText: "Synchronizing Discount Division...",
                progresscompletion: 10,
                url: window.localStorage.getItem('businessdetail') !== null && window.localStorage.getItem('businessdetail') !== undefined && window.localStorage.getItem('businessdetail') !== '' ?  config.root + `/settings/default_discount/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id : '',
                syncurl:''
            } ,

            {
                name: "employee_salary",
                tablename: 'employee_salary',
                progressText: "Synchronizing Salary Division...",
                progresscompletion: 10,
                url: window.localStorage.getItem('businessdetail') !== null && window.localStorage.getItem('businessdetail') !== undefined && window.localStorage.getItem('businessdetail') !== '' ?  config.root + `/settings/employee_salary/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id : '',
                syncurl:''
            } ,
        ] 
    ticketController = new TicketController();
    constructor(props){
        super(props); 
    }

    syncEmployee(){
        return  new Promise(async (resolve) => {
            this.syncLog(resolve);
        });
    }

    syncLog(resolve){
        this.getData(`select * from  staff_clockLog where sync_status=0`).then(res=>{  
            if(res.length > 0){
                this.syncIndividualDataToServer(0, res, 0, this.mastertables, resolve);
            }
            else{ 
                this.saveData(`delete from tosync_tables where table_name='staff_clockLog'`).then(res=>{ 
                    this.syncAllData(1, resolve);
                });
            }
        })
    }

    syncIndividualDataToServer(idx, res, syncindex, synctabledata, resolve){
        if(idx< res.length){ 
            var synctable = synctabledata[syncindex];   
            var input = res[idx];
            console.log(`syncinput`,input);
            input["sync_status"] = 1;
            delete input["id"];
            delete input["syncedid"];
            axios.post(config.root+synctable.syncurl, input).then(res=>{ 
                this.saveData(`update `+synctable.tablename+` set sync_status=1 where sync_id='`+input["sync_id"]+`'`).then(r=>{
                    this.syncLog(resolve);
                })
            }).catch(err=>{      
            })
        }
        else{
            this.syncAllData(1, resolve);
        }
    }

    syncAllData(mindex, resolve) {
        if (mindex < this.mastertables.length) {
            var tbldata =  this.mastertables[mindex];
            axios.get(tbldata.url).then((res) => {
                var data = res.data["data"];
                if (data instanceof Array) { 
                    this.syncIndividualEntry(mindex, 0, data, tbldata, resolve)
                }
            })
        } 
        else{
            resolve({msg:"Synced successfully."})
        }
    }
    
    syncIndividualEntry(mindex, idx, data, tbldata, resolve) {
        if (idx < data.length) {
            var input = data[idx];  
            if(tbldata.tablename === 'employee_salary'){
                delete input["firstName"];
                delete input["lastName"];
            }
            this.saveData(`delete from ` + tbldata.tablename+ ` where (sync_status=1 and sync_id='`+input.sync_id+`') or id =`+input.id).then(res => {
                input["sync_id"] = input["sync_id"] !== null && input["sync_id"] !== undefined ? input["sync_id"] : input["id"];
                input["sync_status"] = 1;
                this.ticketController.saveData({ table_name: tbldata.name, data: input }).then(r => {
                    this.syncIndividualEntry(mindex, idx + 1, data, tbldata, resolve);
                })
            })     
        }
        else {
            this.syncAllData(mindex + 1, resolve)
        }
    }

}