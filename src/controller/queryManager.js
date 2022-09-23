import DataManager from "./datacontroller"; 
import Moment from 'moment';  
import moment from "moment"; 

export default class QueryManager extends DataManager{

    dataManager = new DataManager();
    constructor(props){
        super(props);
    } 
    async saveTableData(obj) {
        return new Promise((resolve, reject) => {
            var keys = '';
            var values = ''
            Object.keys(obj.data).forEach((val, i) => {
                if (obj.data[val] !== undefined) {
                    if (i > 0) {
                        keys += ",";
                        values += ",";
                    }
                    keys += val;
                    values += (typeof obj.data[val] === 'string' ? (val !== 'password' ? `'${obj.data[val].replace("'", "''").trim()}'` : `'${obj.data[val]}'`) : `${obj.data[val]}`)
                }
            }); 
            const sqlQuery = `INSERT INTO ` + obj.table_name + `(` + keys + `) values(` + values + `)`;
             this.dataManager.saveData(sqlQuery).then(res => {
                 this.dataManager.getData("select * from tosync_tables where table_name='" + obj.table_name + "'").then(res1 => {
                    if (res1.length > 0 || obj.table_name === 'tosync_tables' || obj.data.sync_status === 1) {
                        resolve(res)
                    }
                    else {
                        this.saveTableData({ table_name: 'tosync_tables', data: { table_name: obj.table_name, created_on: new Date().toISOString() } }).then(r => {
                            resolve(res)
                        });
                    }
                })
            })
        });
    }


    async updateTableData(obj) {
        return new Promise((resolve, reject) => {
            var sqlQuery = `UPDATE ` + obj.table_name + ` set `;
            Object.keys(obj.data).forEach((val, i) => {
                if (obj.data[val] !== undefined) {
                    if (i > 0) {
                        sqlQuery += ",";
                    }
                    sqlQuery += val + "=" + (typeof obj.data[val] === 'string' ? (val !== 'password' ? `'${obj.data[val].replace("'", "''").trim()}'` : `md5('${obj.data[val]}')`) : `${obj.data[val]}`)
                }
            });
            if (typeof obj.query_value === 'string') {
                sqlQuery += " where " + obj.query_field + "='" + obj.query_value + "'";
            }
            else {
                sqlQuery += " where " + obj.query_field + "=" + obj.query_value;
            } 
            this.dataManager.saveData(sqlQuery).then(res => {
                this.dataManager.getData("select * from tosync_tables where table_name='" + obj.table_name + "'").then(res => {
                    if (res.length > 0 || obj.table_name === 'tosync_tables'  || obj.data.sync_status === 1) {
                        resolve(res)
                    }
                    else {
                        this.saveTableData({ table_name: 'tosync_tables', data: { table_name: obj.table_name, created_on: new Date().toISOString() } }).then(r => {
                            resolve(res)
                        });
                    }
                })
            })
        });
    }  

    getDate(){
        return Moment().format('YYYY-MM-DD HH:mm:ss');
    }

    getUserId(){ 
        var udetail = window.localStorage.getItem('employeedetail');
        var userdetail = { id: 0 };
        if (udetail !== undefined && udetail !== null) {
            userdetail = JSON.parse(udetail);
        }
        return userdetail.id;
    }

    getBusinessId(){ 
        var bdetail = window.localStorage.getItem('businessdetail');
        var businessdetail = { id: 0 };
        if (bdetail !== undefined && bdetail !== null) {
            businessdetail = JSON.parse(bdetail);
        }
        return businessdetail.id;
    }


    getBatches(){
        var sql = `select * from ticketbatches where businessId=`+this.getBusinessId()+` order by created_at desc`;
        console.log(sql)
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    } 

    createBatch(mode='auto'){
        return new Promise(async (resolve) => {
            window.api.getSyncUniqueId().then(syn=>{
                var sync_id = syn.syncid;
                this.getBatches().then(batches=>{  
                    var batchname = "Batch-";
                    batchname = batchname+(batches.length+1)
                    var batchinput = {
                        batchName: batchname,
                        created_at: this.getDate(),
                        created_by: this.getUserId(),
                        sync_status: 0,
                        sync_id: sync_id,
                        mode: mode,
                        businessId: this.getBusinessId(),
                    }
                    this.createBatchId(batchinput, resolve);
                })
                
            })
        });
    }

    generaterandomString(length) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength)).trim();
        }

        return result;
    }


    createBatchId(batchinput, resolve){ 
        var randomid = this.generaterandomString(10); 
        this.dataManager.getData(`select * from ticketbatches where batchId='`+randomid+`'`).then(bat=>{
            if(bat.length > 0){
                this.createBatchId(batchinput, resolve);
            }
            else{
                batchinput.batchId = randomid;
                this.saveTableData({table_name:'ticketbatches', data: batchinput}).then(res=>{
                    resolve({response:res, data: batchinput});
                })
            }
        })
    }
    

    updateBatchId(batchid){
        return new Promise(async (resolve) => {
            var sql = `update ticket set batchId='`+batchid+`' where (batchId is null or batchId='') and paid_status='paid' and sync_id in (select ticketref_id from ticket_payment where pay_mode='card')`;   
            this.saveData(sql).then(r=>{
                resolve(r)
            })
        });
    } 


    getBatchReports(fromdate, todate){ 
        return new Promise(async (resolve) => {
            var sql = `select b.*,(select count(sync_id) from ticket where batchId=b.sync_id) as ticketCount  from ticketbatches as b where b.businessId=`+this.getBusinessId()+` and DATE(b.created_at) between DATE('`+moment(fromdate).format("YYYY-MM-DD")+`') and DATE('`+moment(todate).format("YYYY-MM-DD")+`')`;
            // if(moment(fromdate).format("YYYY-MM-DD") === moment(todate).format("YYYY-MM-DD"))  {
            //     sql = `select * from ticketbatches where businessId=`+this.getBusinessId()+` and DATE(created_at)= DATE('`+fromdate+`')`;
            // } 
            console.log(sql)
            this.getData(sql).then(r=>{
                resolve(r)
            })
        });
    }

    getClosedTicketForBatch(){ 
        return new Promise(async (resolve) => {
            var sql = `select * from  ticket where paid_status='paid' and sync_id in (select ticketref_id from ticket_payment where pay_mode='card') and (batchId is null or batchId='')`;   
            this.getData(sql).then(r=>{
                resolve(r)
            })
        });
    }

    getBatchTickets(batchid){
        return new Promise(async (resolve) => {
            var sql = `select t.*,tp.ticket_amt, tp.paid_at, tp.pay_mode, tp.card_type from ticket as t join ticket_payment as tp on tp.ticketref_id=t.sync_id and tp.pay_mode='card' where t.batchId='`+batchid+`'`;   
            this.getData(sql).then(r=>{
                this.getPaymentMethods(0, r, [],resolve)
            })
        });
    } 

    getPaymentMethods(idx, tickets, response, resolve){
        if(idx<tickets.length){
            var obj = tickets[idx];
            var sql = `select * from ticket_payment where ticketref_id='`+obj.sync_id+`'`;   
            this.getData(sql).then(r=>{
                obj['payments'] = r;
                response.push(obj);
                this.getPaymentMethods(idx+1, tickets, response ,resolve)
            })
        }
        else{
            resolve(response);
        }
    }

    getEmployeeName(id){
        return new Promise(async (resolve) => {
            var sql = `select * from users where id=`+id;   
            this.getData(sql).then(r=>{
                this.getPaymentMethods(0, r, [],resolve)
            })
        });
    }

    checkDefaultSettings(){
        return  new Promise(async (resolve) => {
            this.getData(`select * from default_commission where businessId=`+this.getBusinessId()).then(res=>{
                if(res.length > 0){
                    this.getData(`select * from users`).then(eres=>{
                        if(eres.length > 0){ 
                            this.getData(`select * from users where id not in (select employeeId from employee_salary where businessId=`+this.getBusinessId()+`)`).then(esres=>{
                                console.log(`select * from users where id not in (select employeeId from employee_salary where businessId=`+this.getBusinessId()+`)`)
                                console.log(esres)
                                if(esres.length > 0){
                                    resolve({status:400,msg:"Please set the employee commission settings and continue."})
                                }
                                else{
                                    resolve({status:200});
                                }
                            })
                        }
                        else{
                            resolve({status:400,msg:"Please set the employee commission settings and continue."})
                        }
                    })
                }
                else{
                    resolve({status:400,msg:"Please set the default commission settings and continue."});
                }
            })
        });
    }


    getPayments(tid){
        return  new Promise(async (resolve) => {
            this.getData(`select * from ticket_payment where ticketref_id='`+tid+`'`).then(res=>{
                resolve(res);
            });
        });
    }
}