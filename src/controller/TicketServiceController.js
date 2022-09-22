import DataManager from './datacontroller';
import Moment from 'moment';  
import { QueryFunctions } from '../pages/Dashboard/ticket/ticketcommon/functions';  

export default class TicketServiceController {
    dataManager = new DataManager()
    queryManager = new QueryFunctions();

    async saveData(obj) {
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

            // const sqlQuery = `INSERT INTO `+obj.table_name+`(`+Object.keys(obj.data).join(',')+`) VALUES (` + Object.keys(obj.data).map(val => ((typeof obj.data[val] == 'string') ? `'${obj.data[val].replace("'","''").trim()}'` :  `${obj.data[val] !== undefined ? obj.data[val] : ''}`)).join(',')+`)`;
            const sqlQuery = `INSERT INTO ` + obj.table_name + `(` + keys + `) values(` + values + `)`;
            //console.log("INSERT::::", sqlQuery);
            // window.api.invoke('log', "INSERT::: "+sqlQuery);
            this.dataManager.saveData(sqlQuery).then(res => {
                ////////console.log(res); 
                this.dataManager.getData("select * from tosync_tables where table_name='" + obj.table_name + "'").then(res1 => {
                    if (res1.length > 0 || obj.table_name === 'tosync_tables' || obj.data.sync_status === 1) {
                        resolve(res)
                    }
                    else {
                        this.saveData({ table_name: 'tosync_tables', data: { table_name: obj.table_name, created_on: new Date().toISOString() } }).then(r => {
                            resolve(res)
                        });
                    }
                })
            })
        });
    }


    async updateData(obj) {
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
            //console.log("UPDATE:::::",sqlQuery);
            // window.api.invoke('log', "UPDATE::: "+sqlQuery);
            this.dataManager.saveData(sqlQuery).then(res => {
                this.dataManager.getData("select * from tosync_tables where table_name='" + obj.table_name + "'").then(res => {
                    if (res.length > 0 || obj.table_name === 'tosync_tables'  || obj.data.sync_status === 1) {
                        this.updateTicketRefTables(obj, res, resolve)
                    }
                    else {
                        this.saveData({ table_name: 'tosync_tables', data: { table_name: obj.table_name, created_on: new Date().toISOString() } }).then(r => {
                            this.updateTicketRefTables(obj, res, resolve)
                        });
                    }
                })
            })
        });
    }  

    updateTicketRefTables(obj, res, resolve) {
        if (obj.table_name === 'ticket') {
                    //console.log("CALLING UPDATE TICKET");
        window.api.invoke('log', 'updateTicketRefTables'+JSON.stringify(obj)).then(r => {

        })
            //console.log(obj);
            this.updateData({ table_name: 'ticket_services', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value:obj.data.sync_id}).then(r => {

                this.updateData({ table_name: 'ticketservice_taxes', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                    this.updateData({ table_name: 'ticketservice_requestnotes', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                        this.updateData({ table_name: 'ticket_payment', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                            this.updateData({ table_name: 'employee_commission_detail', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {
                                resolve(res)
                            })
                        })
                    })
                })
            })
        }
        else {
            resolve(res)
        }
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


    async saveTicket(data){
        var thisobj = this;
        //console.log(data);
        return new Promise(async (resolve) => {
            var sql = `select * from ticket where sync_id='`+data.ticketDetail.sync_id+`'`;
            await window.api.getData(sql).then(results=>{
                if(results.length > 0){
                    var savedData = results[0];
                    var ticketid = data.ticketDetail.sync_id;
                    if(!data.isPaidOnOpen){
                        thisobj.updateData({ table_name: 'ticket_services', data: { isActive:2, sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                            thisobj.updateData({ table_name: 'ticketservice_taxes', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid}).then(r => {
                                thisobj.updateData({ table_name: 'ticketservice_requestnotes', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid}).then(r => {
                                    // thisobj.updateData({ table_name: 'ticket_payment', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                                        thisobj.updateData({ table_name: 'employee_commission_detail', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid }).then(r => {
                                            thisobj.saveTicketDetail(data, resolve, savedData)
                                        });
                                    // });
                                });
                            });
                        })
                    }
                    else{
                        thisobj.saveTicketDetail(data, resolve, savedData)
                    }
                }
                else{  
                    var ticket_input = {
                        ticket_code: data.ticketDetail.ticket_code,
                        customer_id: data.customer_detail.id,
                        sync_id: data.ticketDetail.sync_id,
                        sync_status:0,
                        technician_id: data.ticketowner.id,
                        subtotal: data.price.subTotal || 0,
                        discounts: data.price.discountAmount || 0,
                        paid_status : '',
                        created_at: this.getDate(),
                        updated_at: this.getDate(),
                        created_by : this.getUserId(),
                        updated_by: this.getUserId(),
                        businessId: this.getBusinessId(),
                        total_tax: data.price.taxAmount || 0,
                        grand_total : data.price.grandTotal || 0, 
                        isDelete: 0,
                        tips_totalamt : data.price.tipsAmount || '',
                        tips_type: data.price.tipsType || '',
                        tips_percent: data.price.tipsPercent || 0,
                        discount_id: data.price.ticketDiscount.discount_id || '',
                        discount_type: data.price.ticketDiscount.discount_type || '',
                        discount_value: data.price.ticketDiscount.discount_value || '',
                        discount_totalamt : data.price.ticketDiscount.discount_totalamt || 0,
                        notes: data.ticketDetail.notes || ''
                    }

                    thisobj.saveData({table_name:'ticket', data:ticket_input}).then(r=>{ 
                        resolve({status:200, msg:"Ticket saved successfully."})
                    }); 
                }
            });
        });  
    } 

    saveTicketDetail(input, resolve, savedData){ 
        var ticket_input = {
            ticket_code: savedData.ticket_code,
            customer_id: input.customer_detail.id,
            sync_id: savedData.sync_id,
            sync_status:0,
            technician_id: input.ticketowner.id, 
            subtotal: input.price.subTotal || 0,
            discounts: input.price.discountAmount || 0,
            paid_status : input.ticketDetail.paid_status || '', 
            updated_at: this.getDate(), 
            updated_by: this.getUserId(),
            businessId: this.getBusinessId(),
            total_tax: input.price.taxAmount || 0,
            grand_total : input.price.grandTotal || 0, 
            isDelete: 0,
            tips_totalamt : input.price.tipsAmount || 0,
            tips_type: input.price.tipsType || '',
            tips_percent: input.price.tipsPercent || 0,
            discount_id: input.price.ticketDiscount.discount_id || '',
            discount_type: input.price.ticketDiscount.discount_type || '',
            discount_value: input.price.ticketDiscount.discount_value || '',
            discount_totalamt : input.price.ticketDiscount.discount_totalamt || 0,
            notes: input.ticketDetail.notes ||''
        }

        this.updateData({table_name:'ticket', data: ticket_input, query_field:'sync_id', query_value:savedData.sync_id}).then(r=>{
            var obj = Object.assign({}, input);
            obj.ticketref_id = ticket_input.sync_id; 
            resolve({status:200, msg:"Ticket saved successfully."})
        });
    }

    async saveTicketServices(input){
        return new Promise(async (resolve) => {
            this.saveTicketService(0, input, resolve);
        });
    }

    saveTicketService(idx, input, resolve){ 
        //console.log(input, idx);
        console.log("SAVE TICKET SERVICE ::::: ", idx)
        if(idx < input.services_taken.length){
            var services = input.services_taken;
            var service = services[idx]; 
            var thisobj = this;
            window.api.getSyncUniqueId().then(csyn => {
                var syncid = csyn.syncid;
                var service_input = {
                    sync_id: syncid,
                    sync_status:0,
                    ticketref_id: input.ticketref_id,
                    service_id: service.servicedetail.id,
                    service_cost: service.subtotal,
                    employee_id: service.employee_id,
                    created_at: this.getDate(),
                    updated_at: this.getDate(),
                    created_by : this.getUserId(),
                    updated_by: this.getUserId(), 
                    service_quantity: service.qty,
                    isActive:1,
                    tips_amount: service.tips_amount,
                    discount_id: service.discount.discount_id !== undefined ? service.discount.discount_id  : '',
                    discount_type: service.discount.discount_type !== undefined ? service.discount.discount_type  : '',
                    discount_value: service.discount.discount_value !== undefined ? service.discount.discount_value  : '',
                    total_discount_amount: service.discountamount,
                    isSpecialRequest: service.isSpecialRequest,
                    process: service.process,
                    previousticketid : service.previousticketid !== undefined ? service.previousticketid : '',
                    perunit_cost: service.perunit_cost,
                    sort_number: service.sort_number
                }
                
                this.saveData({table_name: 'ticket_services', data: service_input}).then(res=>{ 
                    var obj = Object.assign({}, input);
                    obj.serviceref_id = syncid;
                    //console.log("SERVICE SAVE")
                    //console.log(obj)
                    thisobj.saveTicketServiceRequestNotes(idx, obj, resolve);
                })
            });
        }
        else{
            this.saveTicketDiscountCommission(idx, input, resolve)
        }
    }


    saveTicketServiceRequestNotes(idx, input, resolve){
        // window.api.invoke("log", "REQUEST NOTES :::: "+JSON.stringify(input))
         
        var thisobj = this;
        var service = input.services_taken[idx];
        if(service.requestNotes !== ''){
            var requestnotesinput = {
                notes: service.requestnotes || '', 
                addedby: this.getUserId(),
                ticketref_id: input.ticketref_id,
                serviceref_id: input.serviceref_id,
                isActive: 1
            }
            window.api.getSyncUniqueId().then(syun => {
                input["sync_id"] = syun.syncid;
                input["sync_status"] = 0;
                thisobj.saveData({ table_name: 'ticketservice_requestnotes', data: requestnotesinput }).then(r => { 
                    thisobj.saveServiceTaxes(idx, input, resolve)
                })
            });
        }
        else{
            this.saveServiceTaxes(idx, input, resolve)
        }
    }

    saveServiceTaxes(idx, input, resolve){ 
        this.saveServiceTax(0, idx, input, resolve)
    }

    saveServiceTax(tidx, idx, input, resolve){
        var thisobj = this;
        var service = Object.assign([], input.services_taken[idx]); 
        //console.log(input);
        if(tidx < service.taxes.length){
            var taxobj = service.taxes[tidx];
            window.api.getSyncUniqueId().then(syun => {
                var sync_id = syun.syncid;
                var tax_input = {
                    sync_id: sync_id,
                    sync_status:0,
                    ticketref_id: input.ticketref_id,
                    serviceref_id: input.serviceref_id,
                    isActive : 1,
                    tax_id: taxobj.id,
                    tax_type: taxobj.tax_type,
                    tax_value: taxobj.tax_value,
                    tax_calculated : taxobj.tax_calculated 
                }
                thisobj.saveData({table_name:'ticketservice_taxes', data:tax_input}).then(res=>{
                    thisobj.saveServiceTax(tidx+1, idx, input, resolve);
                })
            });
        }   
        else{
            var obj = Object.assign({}, input); 
            thisobj.saveTicketServiceCommissions(idx, obj, resolve);
        }
    }

    saveTicketServiceCommissions(idx, input, resolve){  
        this.saveServiceOwnerCommission(idx, input, resolve)
    } 

    saveServiceOwnerCommission(idx, input, resolve){
        var thisobj = this;
        var service = input.services_taken[idx];
        window.api.invoke('log', 'SERVICE:::::: '+ JSON.stringify(service))
        if(service.servicedetail.producttype === 'service'){
            // Service Commission Calculation for owner for ticket services - Start 
            this.queryManager.getOwnerDetail().then(own => { 
                var ownerid = 0;
                if (own.length > 0)
                    ownerid = own[0].id; 

                    this.queryManager.getDefaultCommission(this.getBusinessId()).then(comm=>{
                        var commissiondetail= comm.length > 0 ? comm[0] : {owner_percentage:100, emp_percentage: 0 };

                        this.queryManager.getEmployeeCommission(service.employee_id, this.getBusinessId()).then(empcomm=>{
                            if(empcomm.length > 0){
                                commissiondetail = empcomm[0];
                            } 
                            window.api.invoke("log", "COMMISSIONDETAIL ::: "+ JSON.stringify(commissiondetail));
                            //console.log(commissiondetail)
                            // Service Commission Calculation for Employee & owner for ticket services - Start
                            window.api.getSyncUniqueId().then(syndata => {
                                var csyncid = syndata.syncid; 
                                var per_amt =  (service.qty * service.perunit_cost) * (commissiondetail.owner_percentage/100);
                                                
                                window.api.invoke("log", "OWNERCOMMSION ::: "+ per_amt);
                                var emp_input = {
                                    employeeId: ownerid,
                                    businessId: this.getBusinessId(), 
                                    cash_type_for: 'ownercommission',
                                    cash_amt: per_amt,
                                    created_at: this.getDate(),
                                    created_by: this.getUserId(),
                                    updated_at: this.getDate(),
                                    updated_by: this.getUserId(),
                                    ticketref_id: input.ticketref_id,
                                    ticketserviceref_id: input.serviceref_id,
                                    sync_status: 0,
                                    sync_id: csyncid + "ownercommission",
                                    isActive:1,
                                    totalamount:service.qty * service.perunit_cost,
                                    owner_percent:commissiondetail.owner_percentage,
                                    emp_percent:commissiondetail.emp_percentage
                                }   
                                thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                                    this.saveServiceEmpCommission(idx, input, resolve);
                                }) 
                            })

                        })

                    })
            });
        }
        else if(service.servicedetail.producttype !== 'service'){
            this.queryManager.getOwnerDetail().then(own => { 
                var ownerid = 0;
                if (own.length > 0)
                    ownerid = own[0].id;
                
                    // Service Commission Calculation for Employee & owner for ticket services - Start
                    window.api.getSyncUniqueId().then(syndata => {
                        var csyncid = syndata.syncid; 
                        var per_amt =  service.qty * service.perunit_cost;
                                        
                        var emp_input = {
                            employeeId: ownerid,
                            businessId: this.getBusinessId(), 
                            cash_type_for: 'product',
                            cash_amt: per_amt,
                            created_at: this.getDate(),
                            created_by: this.getUserId(),
                            updated_at: this.getDate(),
                            updated_by: this.getUserId(),
                            ticketref_id: input.ticketref_id,
                            ticketserviceref_id: input.serviceref_id,
                            sync_status: 0,
                            sync_id: csyncid + "product",
                            isActive:1,
                            totalamount:service.qty * service.perunit_cost,
                            owner_percent:100,
                            emp_percent:0
                        }   
                        thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                            this.saveServiceDiscountCommission(idx, input, resolve)
                        }) 
                    })
            });
        }
    }

    saveServiceEmpCommission(idx, input, resolve){
        var thisobj = this;
        var service = input.services_taken[idx];
        if(service.servicedetail.producttype === 'service'){
            // Service Commission Calculation for Employee for ticket services - Start  

            this.queryManager.getDefaultCommission(this.getBusinessId()).then(comm=>{
                var commissiondetail= comm.length > 0 ? {owner_percentage:comm[0].owner_percentage, emp_percentage: comm[0].emp_percentage } : {owner_percentage:100, emp_percentage: 0 };

                this.queryManager.getEmployeeCommission(service.employee_id, this.getBusinessId()).then(empcomm=>{
                    if(empcomm.length > 0){
                        commissiondetail =  {owner_percentage:empcomm[0].owner_percentage, emp_percentage: empcomm[0].employee_percentage };
                    } 

                    window.api.invoke('log', '450: SERVICE COMMISSION START'+ ((service.qty +"---"+ service.perunit_cost+"---"+commissiondetail.emp_percentage)));
                    // Service Commission Calculation for Employee & owner for ticket services - Start
                    window.api.getSyncUniqueId().then(syndata => {
                        var csyncid = syndata.syncid; 
                        var per_amt =  (service.qty * service.perunit_cost) * (commissiondetail.emp_percentage/100); 
                        var emp_input = {
                            employeeId: service.employee_id,
                            businessId: this.getBusinessId(), 
                            cash_type_for: 'service',
                            cash_amt: per_amt,
                            created_at: this.getDate(),
                            created_by: this.getUserId(),
                            updated_at: this.getDate(),
                            updated_by: this.getUserId(),
                            ticketref_id: input.ticketref_id,
                            ticketserviceref_id: input.serviceref_id,
                            sync_status: 0,
                            sync_id: csyncid + "service",
                            isActive:1,
                            totalamount:service.qty * service.perunit_cost,
                            owner_percent:commissiondetail.owner_percentage,
                            emp_percent:commissiondetail.emp_percentage
                        }   
                        thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                            this.saveServiceTipsCommission(idx, input, resolve)
                        }) 
                    })

                })

            }) 
        }
    }

    saveServiceTipsCommission(idx, input, resolve){ 
        var thisobj = this;
        var service = input.services_taken[idx];
        if(service.tips_amount > 0){
            // Tips Calculation for Employee for ticket services - Start
            window.api.getSyncUniqueId().then(syndata => {
                var csyncid = syndata.syncid; 
                var per_amt =  service.tips_amount; 
                var emp_input = {
                    employeeId: service.employee_id,
                    businessId: this.getBusinessId(), 
                    cash_type_for: 'tips',
                    cash_amt: per_amt,
                    created_at: this.getDate(),
                    created_by: this.getUserId(),
                    updated_at: this.getDate(),
                    updated_by: this.getUserId(),
                    ticketref_id: input.ticketref_id,
                    ticketserviceref_id: input.serviceref_id,
                    sync_status: 0,
                    sync_id: csyncid + "tips",
                    isActive:1, 
                }   
                thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                    this.saveServiceDiscountCommission(idx, input, resolve)
                }) 
            })
        }
        else{
            this.saveServiceDiscountCommission(idx, input, resolve)
        }
    }


    saveServiceDiscountCommission(idx, input, resolve){
        var thisobj = this;
        var service = input.services_taken[idx];
        if(service.discountamount > 0){
            // Discount Calculation for Employee for ticket services - Start
            var discountid = service.discount.discount_id;
            this.queryManager.getDiscountDetail(discountid).then(res=>{
                var discountdetail = res.length > 0 ? res[0] : {owner_division: 50, emp_division:50};
                if(discountdetail.division_type === 'owner'){
                    thisobj.saveServiceDiscountOwnerDivision(idx, input, resolve);
                }
                else if(discountdetail.division_type === 'employee'){
                    thisobj.saveServiceDiscountEmpDivision(idx, input, resolve);
                }
                else{
                    thisobj.saveServiceDiscountOwnerEmpDivision(idx, input, resolve, discountdetail);
                }
            }) 
        }
        else{
           this.saveTicketService(idx+1, input, resolve)
        }
    }

    saveServiceDiscountOwnerDivision(idx, input, resolve){ 
        var thisobj = this;
        var service = input.services_taken[idx];
        this.queryManager.getOwnerDetail().then(own => { 
            var ownerid = 0;
            if (own.length > 0)
                ownerid = own[0].id;
                var per_amt = service.discountamount;
                // Service Commission Calculation for Employee & owner for ticket services - Start
                window.api.getSyncUniqueId().then(syndata => {
                    var csyncid = syndata.syncid;   
                    var emp_input = {
                        employeeId: ownerid,
                        businessId: this.getBusinessId(), 
                        cash_type_for: 'owner-discount',
                        cash_amt: per_amt,
                        created_at: this.getDate(),
                        created_by: this.getUserId(),
                        updated_at: this.getDate(),
                        updated_by: this.getUserId(),
                        ticketref_id: input.ticketref_id,
                        ticketserviceref_id: input.serviceref_id,
                        sync_status: 0,
                        sync_id: csyncid + "owner-discount",
                        isActive:1, 
                    }   
                    thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                        thisobj.saveTicketService(idx+1, input, resolve)
                    }) 
                })
        });
    }
    
    saveServiceDiscountEmpDivision(idx, input, resolve){ 
        var thisobj = this;
        var service = input.services_taken[idx]; 
        var per_amt = service.discountamount;
        // Service Commission Calculation for Employee & owner for ticket services - Start
        window.api.getSyncUniqueId().then(syndata => {
            var csyncid = syndata.syncid;   
            var emp_input = {
                employeeId: service.employee_id,
                businessId: this.getBusinessId(), 
                cash_type_for: 'emp-discount',
                cash_amt: per_amt,
                created_at: this.getDate(),
                created_by: this.getUserId(),
                updated_at: this.getDate(),
                updated_by: this.getUserId(),
                ticketref_id: input.ticketref_id,
                ticketserviceref_id: input.serviceref_id,
                sync_status: 0,
                sync_id: csyncid + "emp-discount",
                isActive:1, 
            }   
            thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                thisobj.saveTicketService(idx+1, input, resolve)
            }) 
        }) 
    }

    
    saveServiceDiscountOwnerEmpDivision(idx, input, resolve, discountdetail){ 
        var thisobj = this;
        var service = input.services_taken[idx]; 
        var oper_amt = service.discountamount;
        var eper_amt = service.discountamount;
         
        oper_amt = service.discountamount * (discountdetail.owner_division / 100);
        eper_amt = service.discountamount * (discountdetail.emp_division / 100);

        this.queryManager.getOwnerDetail().then(own => { 
            var ownerid = 0;
            if (own.length > 0)
                ownerid = own[0].id;
                
                // Service Commission Calculation for Employee & owner for ticket services - Start
                window.api.getSyncUniqueId().then(syndata => {
                    var csyncid = syndata.syncid;   
                    var emp_input = {
                        employeeId: ownerid,
                        businessId: this.getBusinessId(), 
                        cash_type_for: 'owneremp-discount',
                        cash_amt: oper_amt,
                        created_at: this.getDate(),
                        created_by: this.getUserId(),
                        updated_at: this.getDate(),
                        updated_by: this.getUserId(),
                        ticketref_id: input.ticketref_id,
                        ticketserviceref_id: input.serviceref_id,
                        sync_status: 0,
                        sync_id: csyncid + "owneremp-discountowner",
                        isActive:1, 
                    }   
                    thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => {  
                        // Service Commission Calculation for Employee & owner for ticket services - Start
                        window.api.getSyncUniqueId().then(syndata => {
                            var csyncid = syndata.syncid;   
                            var emp_input = {
                                employeeId: service.employee_id,
                                businessId: this.getBusinessId(), 
                                cash_type_for: 'owneremp-discount',
                                cash_amt: eper_amt,
                                created_at: this.getDate(),
                                created_by: this.getUserId(),
                                updated_at: this.getDate(),
                                updated_by: this.getUserId(),
                                ticketref_id: input.ticketref_id,
                                ticketserviceref_id: input.serviceref_id,
                                sync_status: 0,
                                sync_id: csyncid + "owneremp-discountemp",
                                isActive:1, 
                            }   
                            thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                                thisobj.saveTicketService(idx+1, input, resolve)
                            }) 
                        }) 

                        
                    }) 
                })
        });
        
    }


    saveTicketDiscountCommission(idx, input, resolve){
        console.log("TICKET DISCOUNT COMMISSION")

        window.api.invoke("log", "671: TICKET DISCOUNT COMMISSION");
        var thisobj = this;
        console.log(input)
        if(  input.ticketDiscount.discount_id !== '' &&   input.ticketDiscount.discount_id !== undefined){
            var discountid =  input.ticketDiscount.discount_id;
            this.queryManager.getDiscountDetail(discountid).then(res=>{
                var discountdetail = res.length > 0 ? res[0] : {owner_division: 50, emp_division:50};
                if(discountdetail.division_type === 'owner'){
                    thisobj.saveTicketDiscountOwnerDivision(idx, input, resolve);
                }
                else if(discountdetail.division_type === 'employee'){
                    thisobj.saveTicketDiscountEmpDivision(idx, input, resolve);
                }
                else{
                    thisobj.saveTicketDiscountOwnerEmpDivision(idx, input, resolve, discountdetail);
                }
            }) 
        }
        else{
           resolve({stauts:200, msg:"Saved successfully"})
        }

       
    }
    

    
    saveTicketDiscountOwnerDivision(idx, input, resolve){ 
        var thisobj = this; 
        this.queryManager.getOwnerDetail().then(own => { 
            var ownerid = 0;
            if (own.length > 0)
                ownerid = own[0].id;
                var per_amt = input.ticketDiscount.discount_totalamt;
                // Service Commission Calculation for Employee & owner for ticket services - Start
                window.api.getSyncUniqueId().then(syndata => {
                    var csyncid = syndata.syncid;   
                    var emp_input = {
                        employeeId: ownerid,
                        businessId: this.getBusinessId(), 
                        cash_type_for: 'owner-discount',
                        cash_amt: per_amt,
                        created_at: this.getDate(),
                        created_by: this.getUserId(),
                        updated_at: this.getDate(),
                        updated_by: this.getUserId(),
                        ticketref_id: input.ticketref_id, 
                        sync_status: 0,
                        sync_id: csyncid + "owner-discount",
                        isActive:1, 
                    }   
                    window.api.invoke("log", "721: TICKET DISCOUNT COMMISSION OWNER"+per_amt);
                    thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                        resolve({stauts:200, msg:"Saved successfully"})
                    }) 
                })
        });
    }
    
    saveTicketDiscountEmpDivision(idx, input, resolve){  
        var per_amt =  Number(input.ticketDiscount.discount_totalamt) / input.services_taken.length;
        // Service Commission Calculation for Employee & owner for ticket services - Start
        this.saveTicketDiscountEmpDivisionCalculated(0, per_amt,'emp-discount', idx, input, resolve)
       
    }

    saveTicketDiscountEmpDivisionCalculated(eid,amt, discounttype, idx, input, resolve){
        var thisobj = this;
        if(eid < input.services_taken.length){
            window.api.getSyncUniqueId().then(syndata => {
                var csyncid = syndata.syncid;   
                var emp_input = {
                    employeeId: input.services_taken[eid].employee_id,
                    businessId: this.getBusinessId(), 
                    cash_type_for:  discounttype,
                    cash_amt: amt,
                    created_at: this.getDate(),
                    created_by: this.getUserId(),
                    updated_at: this.getDate(),
                    updated_by: this.getUserId(),
                    ticketref_id: input.ticketref_id, 
                    sync_status: 0,
                    sync_id: csyncid + "emp-discount",
                    isActive:1, 
                }   
                window.api.invoke("log", "755: TICKET DISCOUNT COMMISSION EMP "+amt);
                thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => { 
                    this.saveTicketDiscountEmpDivisionCalculated(eid+1, amt,discounttype, idx, input, resolve)
                }) 
            }) 
        }
        else{
            resolve({stauts:200, msg:"Saved successfully"})
        }
    }
    
    saveTicketDiscountOwnerEmpDivision(idx, input, resolve, discountdetail){ 
        var thisobj = this;
        var oper_amt =  input.ticketDiscount.discount_totalamt;
        var eper_amt =  input.ticketDiscount.discount_totalamt;
         
        oper_amt =  input.ticketDiscount.discount_totalamt * (discountdetail.owner_division / 100);
        eper_amt =  input.ticketDiscount.discount_totalamt * (discountdetail.emp_division / 100); 
        this.queryManager.getOwnerDetail().then(own => { 
            var ownerid = 0;
            if (own.length > 0)
                ownerid = own[0].id;
                
                // Service Commission Calculation for Employee & owner for ticket services - Start
                window.api.getSyncUniqueId().then(syndata => {
                    var csyncid = syndata.syncid;   
                    var emp_input = {
                        employeeId: ownerid,
                        businessId: this.getBusinessId(), 
                        cash_type_for: 'owneremp-discount',
                        cash_amt: oper_amt,
                        created_at: this.getDate(),
                        created_by: this.getUserId(),
                        updated_at: this.getDate(),
                        updated_by: this.getUserId(),
                        ticketref_id: input.ticketref_id, 
                        sync_status: 0,
                        sync_id: csyncid + "owneremp-discountowner",
                        isActive:1, 
                    }   
                    window.api.invoke("log", "797: TICKET DISCOUNT COMMISSION OWNER"+oper_amt);
                    thisobj.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => {  
                        // Service Commission Calculation for Employee & owner for ticket services - Start
                        var per_amt = eper_amt / input.services_taken.length;
                        // Service Commission Calculation for Employee & owner for ticket services - Start
                    window.api.invoke("log", "802: TICKET DISCOUNT COMMISSION OWNER"+per_amt);
                        this.saveTicketDiscountEmpDivisionCalculated(0, per_amt,'owneremp-discount', idx, input, resolve) ;
                    }) 
                })
        });
        
    }


    /** Transfer a service  */
    async saveNewVoidTransferredTicket(data){ 
        var thisobj = this;
        window.api.invoke("log", "Transfer a service from empty new ttcket - "+data.ticketDetail.ticket_code); 
        //console.log(data);
        
        var ticket_input = {
            ticket_code: data.ticketDetail.ticket_code,
            customer_id: data.customer_detail.id,
            sync_id: data.ticketDetail.sync_id,
            sync_status:0,
            technician_id: data.ticketowner.id,
            subtotal: data.price.subTotal,
            discounts: data.price.discountAmount,
            paid_status : data.ticketDetail.paid_status || '',
            created_at: this.getDate(),
            updated_at: this.getDate(),
            created_by : this.getUserId(),
            updated_by: this.getUserId(),
            businessId: this.getBusinessId(),
            total_tax: data.price.taxAmount,
            grand_total : data.price.grandTotal,  
            tips_totalamt : data.price.tipsAmount || 0,
            tips_type: data.price.tipsType || '',
            tips_percent: data.price.tipsPercent || '',
            discount_id: data.price.ticketDiscount.discount_id || '',
            discount_type: data.price.ticketDiscount.discount_type ||'',
            discount_value: data.price.ticketDiscount.discount_value||'',
            discount_totalamt : data.price.ticketDiscount.discount_totalamt||0,
            notes: data.ticketDetail.notes,
            isDelete:data.ticketDetail.isDelete || 0
        }

        return new Promise(async (resolve) => {
            var sql = `select * from ticket where sync_id='`+data.ticketDetail.sync_id+`'`;
            await window.api.getData(sql).then(results=>{
                if(results.length > 0){
                    window.api.invoke("log", "Transfer a service from empty new ttcket - "+data.ticketDetail.ticket_code); 
                    var savedData = results[0];
                    var ticketid = data.ticketDetail.sync_id;
                    delete ticket_input["created_by"];
                    delete ticket_input["crated_at"];
                    if(!data.isPaidOnOpen){
                        thisobj.updateData({ table_name: 'ticket_services', data: { isActive:2, sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                            thisobj.updateData({ table_name: 'ticketservice_taxes', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid}).then(r => {
                                thisobj.updateData({ table_name: 'ticketservice_requestnotes', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid}).then(r => {
                                    // thisobj.updateData({ table_name: 'ticket_payment', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                                        thisobj.updateData({ table_name: 'employee_commission_detail', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid }).then(r => {
                                            thisobj.updateData({table_name:'ticket', data: ticket_input, query_field:'sync_id', query_value:savedData.sync_id}).then(r=>{
                                                var obj = Object.assign({}, data);
                                                obj.ticketref_id = ticket_input.sync_id; 
                                                resolve({status:200, msg:"Ticket saved successfully."})
                                            });
                                        });
                                    // });
                                });
                            });
                        })
                    }
                    else{ 
                        thisobj.updateData({table_name:'ticket', data: ticket_input, query_field:'sync_id', query_value:savedData.sync_id}).then(r=>{
                            var obj = Object.assign({}, data);
                            obj.ticketref_id = ticket_input.sync_id; 
                            resolve({status:200, msg:"Ticket saved successfully."})
                        });
                    }
                }
                else{   
                    thisobj.saveData({table_name:'ticket', data:ticket_input}).then(r=>{ 
                        resolve({status:200, msg:"Ticket saved successfully."})
                    }); 
                }
            });
        });   
    }

    async SaveTransferToNewTicket(data){
        var thisobj = this;
        window.api.invoke("log", "Transfer a service from empty new ticket to new Ticket- "+data.ticketDetail.ticket_code); 
        //console.log(data);
        return new Promise(async (resolve) => {
            var ticket_input = {
                ticket_code: data.ticketDetail.ticket_code,
                customer_id: data.customer_detail.id,
                sync_id: data.ticketDetail.sync_id,
                sync_status:0,
                technician_id: data.ticketowner.id,
                subtotal: data.price.subTotal,
                discounts: data.price.discountAmount,
                paid_status : '',
                created_at: this.getDate(),
                updated_at: this.getDate(),
                created_by : this.getUserId(),
                updated_by: this.getUserId(),
                businessId: this.getBusinessId(),
                total_tax: data.price.taxAmount,
                grand_total : data.price.grandTotal,  
                tips_totalamt : data.price.tipsAmount || 0,
                tips_type: data.price.tipsType || '',
                tips_percent: data.price.tipsPercent || '',
                discount_id: data.price.ticketDiscount.discount_id || '',
                discount_type: data.price.ticketDiscount.discount_type ||'',
                discount_value: data.price.ticketDiscount.discount_value||'',
                discount_totalamt : data.price.ticketDiscount.discount_totalamt||0,
                notes: data.ticketDetail.notes
            }

            thisobj.saveData({table_name:'ticket', data:ticket_input}).then(r=>{ 
                resolve({status:200, msg:"Ticket saved successfully."})
            }); 
        });
    }

    updateExistingToTransferTicket(data){ 
        var thisobj = this;
        window.api.invoke("log", "Transfer a service from empty new ticket to new Ticket- "+data.ticketDetail.ticket_code); 
        console.log(data);
        return new Promise(async (resolve) => {
            var ticket_input = {
                ticket_code: data.ticketDetail.ticket_code,
                customer_id: data.customer_detail.id,
                sync_id: data.ticketDetail.sync_id,
                sync_status:0,
                technician_id: data.ticketowner.id,
                subtotal: data.price.subTotal,
                discounts: data.price.discountAmount,
                paid_status : '', 
                updated_at: this.getDate(), 
                updated_by: this.getUserId(),
                businessId: this.getBusinessId(),
                total_tax: data.price.taxAmount,
                grand_total : data.price.grandTotal,  
                tips_totalamt : data.price.tipsAmount || 0,
                tips_type: data.price.tipsType || '',
                tips_percent: data.price.tipsPercent || '',
                discount_id: data.price.ticketDiscount.discount_id || '',
                discount_type: data.price.ticketDiscount.discount_type ||'',
                discount_value: data.price.ticketDiscount.discount_value||'',
                discount_totalamt : data.price.ticketDiscount.discount_totalamt||0,
                notes: data.ticketDetail.notes,
                isDelete: data.ticketDetail.isDelete || 0
            } 
            thisobj.updateData({table_name:'ticket', data: ticket_input, query_field:'sync_id', query_value:data.ticketDetail.sync_id}).then(r=>{
                var obj = Object.assign({}, data);
                obj.ticketref_id = ticket_input.sync_id; 
                resolve({status:200, msg:"Ticket saved successfully."})
            });

        });
    } 

    updateTicketServiceToNewTicket(input){
        return new Promise(async (resolve) => {
            window.api.invoke('log', 'UPDATE SERVICE TO NEWTICKET::::: '+ JSON.stringify(input));
            this.updateData({table_name: input.table_name, data:input.data, query_field:input.query_field, query_value:input.query_value}).then(r=>{
                resolve({status:200, msg:"updated successdully." })
            })
        });
    } 

    updateTicketServiceCommissionToNewTicket(input){ 
        return new Promise(async (resolve) => {
            this.dataManager.getData(`select * from employee_commission_detail where sync_id='`+input["ticketref_id"]+`'`).then(commissions=>{
                this.changeCommissionCalculation(0, commissions, resolve,input)
            });
        });

    }
    changeCommissionCalculation(idx, commissions, resolve, data){
        if(idx < commissions.length){
            var input = commissions[idx];
            window.api.invoke('log', '845: UPDATE SERVICE COMMISION TO NEWTICKET::::: '+ JSON.stringify(input));
            this.dataManager.getData(`select dc.owner_percent as defowner_percent,dc.emp_percent as defemp_percent, (select owner_percentage from employee_salary where employeeId='`+input["employeeId"]+`') as emp_ownerpercent,  (select emp_percentage from employee_salary where employeeId='`+data["employeeId"]+`') as emp_emppercent,  (select id from employee_salary where employeeId='`+data["employeeId"]+`') as emp_salaryid  from default_commission `).then(comm=>{
                var commissiondetail = comm.length > 0 ? (comm[0].emp_salaryid !== null ?  { owner_percent : comm[0].emp_ownerpercent , emp_percent : comm[0].emp_emppercent} : { owner_percent : comm[0].owner_percent , emp_percent : comm[0].emp_percent}) :  { owner_percent : 100 , emp_percent : 0};
                var serviceamount = 0;
                if(Number(input.totalamount) > 0 && input["cash_type_for"] == 'service'){
                    serviceamount =  input.totalamount * (commissiondetail.emp_percent/100);
                    var inputdata={cash_amt: serviceamount, employeeId: data["employeeId"], ticketref_id: data["ticketref_id"]};
                    this.updateData({table_name: input.table_name, data:inputdata, query_field:input.query_field, query_value:input.query_value}).then(r=>{
                        this.changeCommissionCalculation(idx+1, commissions)
                    })
                }
                else if(Number(input.totalamount) > 0 && input["cash_type_for"] == 'ownercommission'){ 
                    serviceamount = input.totalamount * (commissiondetail.owner_percent/100);
                    var inputdata={cash_amt: serviceamount, employeeId: data["employeeId"], ticketref_id: data["ticketref_id"]};
                    this.updateData({table_name: input.table_name, data:inputdata, query_field:input.query_field, query_value:input.query_value}).then(r=>{
                        this.changeCommissionCalculation(idx+1, commissions)
                    })
                }
            })
        }
        else{
            resolve({status:200, msg:'saved successfully'});
        }
    } 
    updateClosedTicket(data){
        var thisobj = this;
        var ticketid = data.ticketDetail.sync_id;
        return new Promise(async (resolve) => {
            thisobj.updateData({ table_name: 'ticket_services', data: { isActive:2, sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                thisobj.updateData({ table_name: 'ticketservice_taxes', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid}).then(r => {
                    thisobj.updateData({ table_name: 'ticketservice_requestnotes', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid}).then(r => {
                        // thisobj.updateData({ table_name: 'ticket_payment', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                            thisobj.updateData({ table_name: 'employee_commission_detail', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid }).then(r => { 
                                    resolve({status:200, msg:"Ticket saved successfully."}) 
                            });
                        // });
                    });
                });
            })
        });
    }


    deleteTicket(tid){
        return new Promise(async (resolve) => {
            this.dataManager.saveData(`update ticket set isDelete=1 where sync_id='`+tid+`'`).then(r=>{
                resolve({status:200, msg: 'deleted successfully.'})
            })
        });
    }
}