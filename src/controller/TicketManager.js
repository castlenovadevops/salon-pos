
import DataManager from './datacontroller';
import axios from 'axios';
import config from '../config/config';
import * as Moment from 'moment';

export default  class EmployeeDataManager{  
    dataManager = new DataManager()
    props;
    
    constructor(props) {
        this.props = props
    } 

    async getAllTicketsPayment(businessid){ 
        return new Promise((resolve, reject) => {  
            axios.get(config.root+"ticket/payments/"+businessid).then(async res=>{  
                resolve(res.data); 
            })
        });
    }

    async getAllEmpCommission(businessid){ 
        return new Promise((resolve, reject) => {  
            axios.get(config.root+"ticket/empcommission/"+businessid).then(async res=>{  
                resolve(res.data); 
            })
        });
    }

    async getAllTickets(businessid){ 
        return new Promise((resolve, reject) => {  
            axios.get(config.root+"ticket/"+businessid).then(async res=>{  
                resolve(res.data); 
            })
        });
    }

    async getAllTicketServices(businessid){ 
        return new Promise((resolve, reject) => {  
            //console.log(config.root+"ticket/allservices/"+businessid)
            axios.get(config.root+"ticket/allservices/"+businessid).then(async res=>{  
                resolve(res.data); 
            })
        });
    }


    async getAllTicketServiceTaxes(businessid){ 
        return new Promise((resolve, reject) => {  
            //console.log(config.root+"ticket/alltaxes/"+businessid)
            axios.get(config.root+"ticket/alltaxes/"+businessid).then(async res=>{  
                resolve(res.data); 
            })
        });
    }

    async getTicketServices(ticket_id){

        axios.get(config.root+"ticket/services/list/"+ticket_id).then(async res=>{ 
            return await res; 
        })
    }


    async addServices(service){
       
        this.props.addServicesUpdates(service)
        const res =  axios.get(config.root+"inventory/services_tax_detail/"+service.id)
        return await res;

    }


    async getCustomerList(){
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            return await axios.get(config.root+"customer/"+businessdetail["id"])
          
        }
    }

    async getCategoryList(){        
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            return await  axios.get(config.root+"inventory/activecategory/"+businessdetail["id"])
        }
    }

    async getServices(category_id){
       
        return await  axios.get(config.root+"inventory/services/"+category_id)
    }


    async saveEditTicket(isEdit,input){
        

        return await this.saveEditTicketToLocal(isEdit,input)
    }

   
    async deleteTicket(input) {
        var sql = `UPDATE ticket
        SET isDelete = 1
        WHERE id = '`+input["id"]+`'`;
        this.dataManager.saveData(sql)  
    }


    async saveTax(idx, input){
        var sql = "insert into ticketservice_taxes(ticket_id, ticketservice_id, tax_id, tax_value, tax_type, tax_calculated, isActive, sync_status, sync_id,ticketref_id, serviceref_id) values("+input["ticket_id"]+", "+input["ticketservice_id"]+", "+input["tax_id"]+",'"+input["tax_value"]+"','"+input["tax_type"]+"','"+input["tax_calculated"]+"', 1,"+(input["sync_status"] != undefined ? input["sync_status"] : 1)+",'"+input["sync_id"]+"','"+input["ticketref_id"]+"','"+input["serviceref_id"]+"')";
        if(input["id"] != undefined){
            sql = "insert into ticketservice_taxes(id,ticket_id, ticketservice_id, tax_id, tax_value, tax_type, tax_calculated, isActive, sync_status, sync_id,ticketref_id, serviceref_id) values("+input["id"]+","+input["ticket_id"]+", "+input["ticketservice_id"]+", "+input["tax_id"]+",'"+input["tax_value"]+"','"+input["tax_type"]+"','"+input["tax_calculated"]+"', 1,1,'"+input["sync_id"]+"','"+input["ticketref_id"]+"','"+input["serviceref_id"]+"')";
        } 
        //console.log("SAVE TAX::::::::", sql) 
        return this.dataManager.saveData(sql)   
        
    }

    
    async saveEditTicketToLocal(isEdit,input) {
        // //////console.log("input:",input)
        const ticket_code = input['ticket_code']
        var customer_id = input['customer_id'] 
        if(input['customer_id'] === undefined) {
            customer_id = ""
        }
        
        const technician_id = input['technician_id']
        const services = input['services']

        const type = input['type']
        const subtotal = input['subtotal']
        const discounts = input['discounts']
        const paid_status = input['paid_status']
       
        const businessId = input['businessId']
        const total_tax = input['total_tax']
        const grand_total = input['grand_total']
        const notes = input['notes']

        const isDelete = input['isDelete']
        const tips_totalamt = input['tips_totalamt']
        const tips_type = input['tips_type']
        const tips_percent = input['tips_percent']

        const discount_id = input['discount_id']
        const discount_type = input['discount_type']
        const discount_value = input['discount_value']
        const discount_totalamt = input['discount_totalamt']

         const created_by = input['created_by'] 
         const created_at =  Moment().format('YYYY-MM-DDTHH:mm:ss')
         const updated_by = input['updated_by'] 
         const updated_at = Moment().format('YYYY-MM-DDTHH:mm:ss')
         const url = 'ticket/saveorupdate/'
         const input1 = JSON.stringify(input)
         const method = 'post'
         let sync_status = 0 
         
        if(!isEdit) { 
            /** insert sql query */
            var sql = `insert into ticket(ticket_code,customer_id,technician_id,services,type,subtotal,discounts,paid_status,created_at,created_by,
                updated_at,updated_by, businessId,total_tax, grand_total,notes, isDelete,tips_totalamt,tips_type,tips_percent, discount_id,
                discount_type,discount_value,discount_totalamt
                ,url,input,method,sync_status, sync_id
                ) values('`
                +ticket_code+`','`
                +customer_id+`','`
                +technician_id+`','`
                +services+`','`
                +type+`','`
                +subtotal+`','`
                +discounts+`','`
                +paid_status+`','`
                +created_at+`','`
                +created_by+`','`
                +updated_at+`','`
                +updated_by+`','`
                +businessId+`','`
                +total_tax+`','`
                +grand_total+`','`
                +notes+`','`
                +isDelete+`','`
                +tips_totalamt+`','`
                +tips_type+`','`
                +tips_percent+`','`
                +discount_id+`','`
                +discount_type+`','`
                +discount_value+`','`
                +discount_totalamt+`','`
                +url+`','`
                +input1+`','`
                +method+`','`
                +sync_status+`','`+(input["sync_id"] != undefined ? input["sync_id"] : '')+`')`;
                //console.log(sql);
            const res  = this.dataManager.saveData(sql)
            return res
        }
        else {
            var employeedetail = window.localStorage.getItem('employeedetail');
            var detail = JSON.parse(employeedetail)
          

             /** UPDATE sql query */
            var usql = `UPDATE ticket  SET sync_status = 1, updated_at='`+ Moment().format('YYYY-MM-DDTHH:mm:ss')+`', updated_by='`+detail.id+`' WHERE ticket_code = '`+ticket_code+`'`
            this.dataManager.saveData(usql) 
        } 
     }

     getUnsyncedCount() {
        this.dataManager.getData("select * from ticket where sync_status=0").then(response =>{
            if (response instanceof Array) {
                return response.length
            } 
        }) 
     }

     async saveTicketServiceNotes(input){
        this.dataManager.saveData(`update ticketservice_requestnotes set isActive=0 where ticket_id='`+input["ticket_id"]+`' and service_id= '`+input["service_id"]+`'`).then(r=>{
            var sql = `insert into ticketservice_requestnotes(ticket_id, service_id, notes, addedby, addedat, isActive, sync_status, sync_id, ticketref_id, serviceref_id) values('`+input["ticket_id"]+`', '`+input["service_id"]+`', '`+input["notes"]+`', `+input["addedby"]+`, '`+
            
            Moment().format('YYYY-MM-DDTHH:mm:ss') 
            +`', 1,1,'`+input["sync_id"]+`','`+input["ticketref_id"]+`','`+input["serviceref_id"]+`' )`;
            // if(input["id"]!==undefined){
            //     sql = `update ticketservice_requestnotes set ticket_id=`+input["ticket_id"]+`, service_id=`+input["service_id"]+`, notes='`+input["notes"]+`', addedby=`+input["addedby"]+`, addedat='`
                
            //     +Moment().format('YYYY-MM-DDTHH:mm:ss') +
                
            //     `', isActive=1 where id=`+input["id"];
            // }
            const res  = this.dataManager.saveData(sql)
            return res
        })
     }


     async saveTicketPayment(payment_input){

        const ticket_id = payment_input['ticket_id']
        const pay_mode = payment_input['pay_mode']
        const payment_status = payment_input['payment_status']
        const paid_at = payment_input['paid_at']
        const created_at = payment_input['created_at']
        const created_by = payment_input['created_by']
        const updated_at = payment_input['updated_at']
        const updated_by = payment_input['updated_by'] 
        const ticket_amt = payment_input['ticket_amt'] 
        const notes = payment_input['notes'] 
        const card_type = payment_input['card_type'] 

    
        var sql = `insert into ticket_payment(ticket_id,pay_mode,payment_status,paid_at,created_at,created_by,updated_at,updated_by,
            ticket_amt,notes,card_type, sync_status, sync_id, ticketref_id, isActive
        ) values('`
            +ticket_id+`','`
            +pay_mode+`','`
            +payment_status+`','`
            +paid_at+`','`
            +created_at+`','`
            +created_by+`','`
            +updated_at+`','`
            +updated_by+`','`
            
            +ticket_amt+`','`
            +notes+`','`
            +card_type+`',1,'`+payment_input["sync_id"]+`','`+payment_input["ticketref_id"]+`',1)`;
            //console.log("PAYMENT:::::;")
            //console.log(sql)
            const res  = this.dataManager.saveData(sql)
            return res
     }

     async saveTicketService(input) {
        const ticket_id = input['ticket_id']
        const service_id = input['service_id']
        const service_cost = input['service_cost'] 
        //console.log("saveTicketService",input)
        const employee_id = input['employee_id']
        const service_quantity = input['service_quantity']
        const istax_selected = input['istax_selected']
        const isActive = input['isActive']
       
        const tips_amount = input['tips_amount']
        const discount_id = input['discount_id']
        const discount_type = input['discount_type']
        const discount_value = input['discount_value']

        const total_discount_amount = input['total_discount_amount']
       
         const created_by = input['created_by'] 
         const created_at = Moment().format('YYYY-MM-DDTHH:mm:ss')
         const updated_at = Moment().format('YYYY-MM-DDTHH:mm:ss')
         const sync_id = input["sync_id"] != undefined ? input["sync_id"] :'';
         const ticketref_id = input["ticketref_id"] != undefined ? input["ticketref_id"] :'';
       
         if(input["id"] !== undefined){
            var sqlid = `insert or REPLACE into ticket_services( syncedid,ticket_id,service_id,service_cost,employee_id,service_quantity,istax_selected,isActive,created_at,created_by,
                tips_amount,discount_id, discount_type,discount_value, total_discount_amount,isSpecialRequest, process,previousticketid, updated_at, sync_status, sync_id, ticketref_id, perunit_cost
                ) values( '`+input["id"]+`','` 
                +ticket_id+`','`
                +service_id+`','`
                +service_cost+`','` 
                +employee_id+`','`
                +service_quantity+`','`
                +istax_selected+`','`
                +isActive+`','`
                +created_at+`','`
                +created_by+`','`
               
                +tips_amount+`','`
                +discount_id+`','`
                +discount_type+`','`
                +discount_value+`','`
                
                +total_discount_amount+`',`+input["isSpecialRequest"]+`,'` 
                +(input["process"] ? input["process"] : '')+`','` 
                +(input["previousticketid"] ? input["previousticketid"] : '')+`','`+updated_at+`',
                '1','`+sync_id+`','`+ticketref_id+`','` 
                +(input["perunit_cost"] ? input["perunit_cost"] : '')+`')`; 
                var resid = this.dataManager.saveData(sqlid)  
                //console.log("transfering new");
                //console.log(sqlid);
                return resid;    
         }
         else{
        var sql = `insert into ticket_services(ticket_id,service_id,service_cost,employee_id,service_quantity,istax_selected,isActive,created_at,updated_at,created_by,
            tips_amount,discount_id, discount_type,discount_value, total_discount_amount,isSpecialRequest, process,previousticketid, sync_status, sync_id, ticketref_id, perunit_cost
            ) values('`
            
            +ticket_id+`','`
            +service_id+`','`
            +service_cost+`','` 
            +employee_id+`','`
            +service_quantity+`','`
            +istax_selected+`','`
            +isActive+`','`
            +created_at+`','`
            +updated_at+`','`
            +created_by+`','`
           
            +tips_amount+`','`
            +discount_id+`','`
            +discount_type+`','`
            +discount_value+`','`
            
            +total_discount_amount+`',`+input["isSpecialRequest"]+`,'` 
            +(input["process"] ? input["process"] : '')+`','` 
            +(input["previousticketid"] ? input["previousticketid"] : '')+`', 0,'`+sync_id+`','`+ticketref_id+`','` 
            +(input["perunit_cost"] ? input["perunit_cost"] : '')+`')`;
            //console.log("transfering");
            //console.log(sql);
            var res = this.dataManager.saveData(sql)  
            return res;    
        }     
     }

     async saveTicketEmployeeCommission(input) {

        // //////console.log("saveTicketEmployeeCommission",input['ticket_id'])
        const employeeId = input['employeeId']
        const businessId = input['businessId']
        const ticket_id = input['ticket_id'] || 0
        const ticket_serviceId = input['ticket_serviceId'] || 0
        const cash_type_for = input['cash_type_for']
        const cash_amt = input['cash_amt']
        const created_by = input['created_by'] 
         const created_at =  Moment().format('YYYY-MM-DDTHH:mm:ss')
         const updated_by = input['updated_by'] 
         const updated_at =  Moment().format('YYYY-MM-DDTHH:mm:ss')
         this.dataManager.getData("select * from employee_commission_detail where cash_type_for='"+cash_type_for+"'  and  employeeId = "+employeeId+" and cash_type_for='"+input['cash_type_for']+"' and ticketref_id='"+input['ticketref_id']+"' and ticketserviceref_id='"+input['ticketserviceref_id']+"'").then((res)=> {
            
             if (res instanceof Array) {
                //console.log("saveTicketEmployeeCommission",res.length)
                if(res.length>0) {
                    var sqlQuery = `UPDATE  employee_commission_detail set `
                    Object.keys(input).forEach((val, i) => {
                        if(i > 0){
                            sqlQuery  +=",";
                        }
                        sqlQuery += val +"= '"+input[val]+"'"
                    });
                    sqlQuery += " where cash_type_for='"+cash_type_for+"' and  employeeId = "+employeeId+"  and ticket_serviceId='"+ticket_serviceId+"' and  ticket_id ='"+ticket_id+"'";  
                    ////console.log(sqlQuery)
                    const res  = this.dataManager.saveData(sqlQuery)
                    return res 
                }
                else {
                    var sql = `insert into employee_commission_detail(employeeId,businessId,ticket_id,ticket_serviceId,cash_type_for,cash_amt,
                        created_by,created_at, updated_by,updated_at, sync_status, sync_id, ticketref_id, ticketserviceref_id
                        ) values('`
                        
                        +employeeId+`','`
                        +businessId+`','`
                        +ticket_id+`','`
                        +ticket_serviceId+`','`
                        +cash_type_for+`','`
                        +cash_amt+`','`
                        +created_by+`','`
                        +created_at+`','`
                        +updated_by+`','`
                        +updated_at+`', 1,'`+input["sync_id"]+`','`+input["ticketref_id"]+`','`+input["ticketserviceref_id"]+`')`;////console.log("SQL:::",sql)
                    
                    const res  = this.dataManager.saveData(sql)
                    return res
                }
             } 
         })
       
     }

     async updateTicketTransfer(input){
        var syncid = input["sync_id"];
        delete input["id"];
        var sqlQuery = `UPDATE  ticket set `
        Object.keys(input).forEach((val, i) => {
            if(i > 0){
                sqlQuery  +=",";
            }
            // sqlQuery += val +"="+(typeof input[val] == 'string' ? (val != 'password' ? `'${input[val]}'` : `md5('${input[val]}')`) : `${input[val]}`)
        
            sqlQuery += val +"= '"+input[val]+"'"
        });
        sqlQuery += ", sync_status=0 where  sync_id = '"+syncid+"'";   
        this.dataManager.saveData(sqlQuery)
     }

     async updateTicket(input) {
        var sqlQuery = `UPDATE  ticket set `
        Object.keys(input).forEach((val, i) => {
            if(i > 0){
                sqlQuery  +=",";
            }
            // sqlQuery += val +"="+(typeof input[val] == 'string' ? (val != 'password' ? `'${input[val]}'` : `md5('${input[val]}')`) : `${input[val]}`)
        
            sqlQuery += val +"= '"+input[val]+"'"
        });
        sqlQuery += ", sync_status=0 where  id = '"+input["id"]+"'";   
        this.dataManager.saveData("delete from  ticket_services  where ticket_id='"+input["id"]+"'").then(r=>{ 
            this.dataManager.saveData("delete from employee_commission_detail where ticket_id='"+input["id"]+"'").then(e=>{
                this.dataManager.saveData("delete from  ticketservice_requestnotes  where ticket_id='"+input["id"]+"'").then(s=>{
                    this.dataManager.saveData('delete from  ticketservice_taxes  where ticket_id='+input["id"]).then(res=>{
                            this.dataManager.saveData(sqlQuery)
                    });
                })
            })
        })
        // //////console.log("updateTicket::",sqlQuery,input);
    }

    async updateTicketService(identifier, input) {
        
        var sqlQuery = `UPDATE  ticket_services  set `
        const identifier1= input["id"] 
        delete input["id"]
        Object.keys(input).forEach((val, i) => {
            if(i > 0){
                sqlQuery  +=",";
            }
            sqlQuery +=  val +"= '"+input[val]+"'"
        });
        sqlQuery += " where id = '"+identifier1+"'  and ticketref_id= '"+input['ticketref_id']+"'" 
        // //////console.log("updateTicketService::",identifier,input);
        //console.log("updateTicketService:: sqlQuery::",sqlQuery);
        this.dataManager.saveData(sqlQuery)
    }

    async updateTicketCancelService(identifier, input) {
        
        var sqlQuery = `UPDATE  ticket_services set `
        const identifier1= input["id"] 
        delete input["id"]
        Object.keys(input).forEach((val, i) => {
            if(i > 0){
                sqlQuery  +=",";
            }
            sqlQuery +=  val +"= '"+input[val]+"'"
        });
        sqlQuery += " where id = '"+identifier1+"'"  
        this.dataManager.saveData(sqlQuery)
    }


    async saveorUpdateTicketService(input) {
        ////console.log("saveorUpdateTicketService",input)
        if(input["uniquId"]!==undefined) {
            this.updateTicketService("",input)
        }

        else {
            this.saveTicketService(input)
            ////console.log("add service")
        }
       
    }

    


    async syncTicket() { 
        // //console.log("syync called")
        var employeedetail = window.localStorage.getItem('employeedetail');
        var detail = JSON.parse(employeedetail)
        var thisobj = this;
        this.dataManager.getData("select * from ticket where sync_status=0").then((response)=>{
            if(response !== undefined && response !== null){
                ////console.log("syncing",response.length)
                if(response.length > 0){
                    thisobj.syncIndividualTicket(0,  response, detail)
                }
                else{
                    
                }
            }
        }); 
    }

    

    async syncIndividualTicket(i, tickets, detail){
        if(i < tickets.length){
            var input = {};
            var ticketdata = Object.assign({}, tickets[i]);
            var url = ticketdata.url;
            delete ticketdata.url;
            var ticketid =  tickets[i].id;
            delete ticketdata.id;
            delete ticketdata.input;
            delete ticketdata.method;
            delete ticketdata.sync_status;
            delete ticketdata.pay_mode;
            delete ticketdata.services;
            input = Object.assign({},ticketdata);
            if(ticketdata.syncedId !== undefined && ticketdata.syncedId !== null){
                input["id"] = ticketdata.syncedId
            }
            delete ticketdata.syncedId;
            delete input['isDelete']; 
            delete input['syncedId'];
            input["isDelete"] = ticketdata.isDelete === undefined || ticketdata.isDelete === 'undefined' ? 0 : ticketdata.isDelete;
            //console.log("##########")
            //console.log(ticketdata);

            // input["created_at"] = Moment(ticketdata.created_at).format('YYYY-MM-DD HH:MM:ss')
            // input["updated_at"] = Moment(ticketdata.updated_at).format('YYYY-MM-DD HH:MM:ss') 
            //console.log(input);
            //console.log("##########")
            let apiRes = axios.post(config.root+url, input)
            var thisobj = this;
            apiRes.then( async (res)=> { 
                var syncticketid = res.data.data.ticketid;
                this.dataManager.getData("select * from ticket_services where isActive=1 and ticket_id="+syncticketid).then((response)=>{
                    if(response !== undefined && response !== null){
                        if(response.length > 0){ thisobj.syncTicketService(i, 0, tickets, response, ticketid, detail, res.data.data.ticketid);
                        }
                        else{
                            thisobj.updateSyncedTicket(i, tickets, ticketid, detail, res.data.data.ticketid)
                        }
                    }
                    else{
                        thisobj.updateSyncedTicket(i, tickets, ticketid, detail, res.data.data.ticketid)
                    }
                }); 

                // thisobj.dataManager.saveData("update employee_commission_detail set ticket_id="+syncticketid+" where ticket_id="+ticketid).then(res1=>{ 
                //     thisobj.dataManager.saveData("update ticketservice_taxes set ticket_id="+syncticketid+" where ticket_id="+ticketid).then(res2=>{
                //         thisobj.dataManager.saveData("update ticketservice_requestnotes set ticket_id="+syncticketid+"  where ticket_id="+ticketid).then(res2=>{
                //             thisobj.dataManager.saveData("update ticket_services set ticket_id="+res.data.data.ticketid+" where ticket_id="+ticketid).then(ree=>{
                //                 thisobj.dataManager.saveData("update ticket_payment set ticket_id="+res.data.data.ticketid+" where ticket_id="+ticketid).then(ree=>{
                                        
                // //console.log("ticketsaved",res.data.data.ticketid);
                // //console.log("select * from ticket_services where isActive=1 and ticket_id="+syncticketid)
                //                     this.dataManager.getData("select * from ticket_services where isActive=1 and ticket_id="+syncticketid).then((response)=>{
                //                         if(response !== undefined && response !== null){
                //                             if(response.length > 0){ thisobj.syncTicketService(i, 0, tickets, response, ticketid, detail, res.data.data.ticketid);
                //                             }
                //                             else{
                //                                 thisobj.updateSyncedTicket(i, tickets, ticketid, detail, res.data.data.ticketid)
                //                             }
                //                         }
                //                         else{
                //                             thisobj.updateSyncedTicket(i, tickets, ticketid, detail, res.data.data.ticketid)
                //                         }
                //                     }); 

                //                 });
                //             });
                //         });
                //     });
                // }) 
            });
        }
        else{
            // ipcRenderer.send('synced');
        }
    }

    syncTicketService(i,j, tickets,services, ticketid, detail, syncticketid){
        //console.log("servuice syncing", services)
        var thisobj = this;
        if(j < services.length){
            var input = Object.assign({},services[j]); 
            delete input["id"];
            input["ticket_id"]=syncticketid;
            delete input["category_id"];
            delete input["perunit_cost"];
            // input["created_at"] =  Moment(services[j].created_at).format('ddd DD MMM hh:mm a')
            // input["updated_at"] = Moment(services[j].updated_at).format('ddd DD MMM hh:mm a') 
            //console.log(services[j])
            input["created_at"] =services[j].created_at.replace("T"," ").replace("Z","") //Moment(services[j].created_at).format('YYYY-MM-DD HH:MM:ss')
            input["updated_at"] = services[j].updated_at !== null && services[j].updated_at !== 'null' && services[j].updated_at !== undefined ? services[j].updated_at.replace("T"," ").replace("Z","") : '';//Moment(services[j].updated_at).format('YYYY-MM-DD HH:MM:ss') 
            //console.log(input)
            delete input["syncedid"];
            let apiRes = axios.post(config.root+"ticket/service/saveorupdate", input)
            apiRes.then( async (res)=> { 
                var data = res.data.data; 
                thisobj.dataManager.saveData("update ticket_services set syncedid="+data.insertId+" where id = "+services[j].id).then(ree=>{
                    thisobj.dataManager.saveData("update employee_commission_detail set ticket_id="+syncticketid+",ticket_serviceid="+data.insertId+" where ticket_id="+syncticketid+" and ticket_serviceid="+services[j].id).then(res1=>{ 
                        thisobj.dataManager.saveData("update ticketservice_taxes set ticket_id="+syncticketid+", ticketservice_id="+data.insertId+" where ticket_id="+syncticketid+" and ticketservice_id="+services[j].id).then(res2=>{
                            thisobj.dataManager.saveData("update ticketservice_requestnotes set ticket_id="+syncticketid+", ticketservice_id="+data.insertId+" where ticket_id="+syncticketid+" and ticketservice_id="+services[j].id).then(res2=>{
                            
                                thisobj.dataManager.getData("select * from ticketservice_requestnotes where ticket_id="+syncticketid+" and service_id="+data.insertId).then((response)=>{
                                    if(response.length > 0){
                                        var notesinput = Object.assign({},response[0]);
                                        delete notesinput["id"];
                                        notesinput["ticket_id"]=syncticketid;
                                        let apiResnotes = axios.post(config.root+"ticket/service/saveorupdatenotes", notesinput);
                                        apiResnotes.then(res=>{ 
                                            thisobj.syncTicketService(i, j+1, tickets, services, ticketid, detail, syncticketid);
                                        })
                                    }
                                    else{
                                        thisobj.syncTicketService(i, j+1, tickets, services, ticketid, detail, syncticketid);
                                    }
                                });     
                                
                            });
                        });
                    })
                })      
            });
        }
        else{

            //console.log("select * from ticketservice_taxes where ticket_id="+syncticketid);
            thisobj.dataManager.getData("select * from ticketservice_taxes where ticket_id="+syncticketid).then((response)=>{ 
                this.syncTicketTaxes(i,0, tickets,response, ticketid, detail, syncticketid);
            });
        }
    } 

    syncTicketTaxes(i,j, tickets,taxes, ticketid, detail, syncticketid){
        //console.log("syncing tax", taxes.length)
        if(j < taxes.length){
            var input = Object.assign({},taxes[j]);   
            //console.log("tax Input:::;", input);
            let apiRes = axios.post(config.root+"ticket/tax/saveorupdate", input)
            var thisobj = this;
            apiRes.then( async (res)=> { 
                thisobj.syncTicketTaxes(i, j+1, tickets, taxes, ticketid, detail, syncticketid);
            });
        }
        else{
            this.syncTicketPayment(i, tickets, ticketid, detail, syncticketid);
        }
    }
    
    syncTicketPayment(i, tickets, ticketid, detail, syncticketid){
        var thisobj = this;
        this.dataManager.getData("select * from ticket_payment where ticket_id="+syncticketid).then((response)=>{
            ////console.log('paymentcalling', response);
            if(response.length > 0){
                var payinput = Object.assign({},response[0]);
                payinput["ticket_id"]=syncticketid;
                delete payinput["id"];
                // payinput["created_at"] = Moment(response[0].created_at).format('ddd DD MMM hh:mm a') 
                // payinput["updated_at"] = Moment(response[0].updated_at).format('ddd DD MMM hh:mm a') 
                payinput["created_at"] = response[0].created_at.replace("T"," ").replace("Z","") //Moment(response[0].created_at).format('YYYY-MM-DD HH:MM:ss')
                payinput["updated_at"] = response[0].updated_at.replace("T"," ").replace("Z","") // Moment(response[0].updated_at).format('YYYY-MM-DD HH:MM:ss') 
                let apiRespayment = axios.post(config.root+"ticket/payment/saveorupdate", payinput);
                apiRespayment.then(res=>{
                    thisobj.syncempCommission(i, tickets, ticketid, detail, syncticketid);
                })
            }
            else{
                thisobj.syncempCommission(i, tickets, ticketid, detail, syncticketid);
            }
        });
        // thisobj.syncempCommission(i, tickets, ticketid, detail, syncticketid);
    }


    syncempCommission(i, tickets, ticketid, detail, syncticketid){
        var thisobj = this;
        this.dataManager.getData("select * from employee_commission_detail where ticket_id="+syncticketid).then((response)=>{
            if(response.length > 0){
               thisobj.syncCommission(0, response,i, tickets, ticketid, detail, syncticketid)
            }
            else{
                this.updateSyncedTicket(i, tickets, ticketid, detail, syncticketid);
            }
        });
    }

    syncCommission(j, commission, i, tickets, ticketid, detail, syncticketid){
        if(j < commission.length){
            var thisobj = this;
            var payinput = Object.assign({},commission[j]);
            payinput["ticket_id"]=syncticketid;
            // payinput["created_at"] = Moment(commission[j].created_at).format('ddd DD MMM hh:mm a')  
            // payinput["updated_at"] = Moment(commission[j].updated_at).format('ddd DD MMM hh:mm a') 

            payinput["created_at"] = commission[j].created_at.replace("T"," ").replace("Z","") //Moment(commission[j].created_at).format('YYYY-MM-DD HH:MM:ssss')
            payinput["updated_at"] = commission[j].updated_at.replace("T"," ").replace("Z","") //Moment(commission[j].updated_at).format('YYYY-MM-DD HH:MM:ss') 
            delete payinput["id"];
            let apiResnotes = axios.post(config.root+"employee_commission/save", payinput);
            apiResnotes.then(res=>{
                thisobj.syncCommission(j+1, commission, i, tickets, ticketid, detail, syncticketid);
            })
        }
        else{
            this.updateSyncedTicket(i, tickets, ticketid, detail, syncticketid);
        }
    }


    updateSyncedTicket(i, tickets, ticketid, detail, syncticketid){
        var sql = `UPDATE ticket
                SET sync_status = 1,  updated_by='`+detail.id+`', syncedId='`+syncticketid+`' WHERE id = '`+ticketid+`'`  
                ////console.log(sql)
        this.dataManager.saveData(sql).then(r=>{ 
            this.syncTicket()
            // this.syncIndividualTicket(i+1, tickets, detail)
        })
    }

}