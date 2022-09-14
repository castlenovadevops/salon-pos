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
            console.log("INSERT::::", sqlQuery);
            // window.api.invoke('log', "INSERT::: "+sqlQuery);
            this.dataManager.saveData(sqlQuery).then(res => {
                //////console.log(res); 
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
            console.log("UPDATE:::::",sqlQuery);
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
                    console.log("CALLING UPDATE TICKET");
        window.api.invoke('log', 'combine'+JSON.stringify(obj)).then(r => {

        })
            console.log(obj);
            this.updateData({ table_name: 'ticket_services', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: JSON.stringify(obj)}).then(r => {

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
        console.log(data);
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
                                    thisobj.updateData({ table_name: 'ticket_payment', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value: ticketid }).then(r => {
                                        thisobj.updateData({ table_name: 'employee_commission_detail', data: {  isActive:2,sync_status: 0 }, query_field: 'ticketref_id', query_value:ticketid }).then(r => {
                                            thisobj.saveTicketDetail(data, resolve, savedData)
                                        });
                                    });
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
                        isDelete: 0,
                        tips_totalamt : data.price.tipsAmount,
                        tips_type: data.price.tipsType,
                        tips_percent: data.price.tipsPercent,
                        discount_id: data.price.ticketDiscount.discount_id,
                        discount_type: data.price.ticketDiscount.discount_type,
                        discount_value: data.price.ticketDiscount.discount_value,
                        discount_totalamt : data.price.ticketDiscount.discount_amt,
                        notes: data.ticketDetail.notes
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
            sync_id: savedData.sync_id,
            sync_status:0,
            technician_id: input.ticketowner.id,
            customer_id: input.customer_detail.id,
            subtotal: input.price.subTotal,
            discounts: input.price.discountAmount,
            paid_status : '',
            created_at: this.getDate(),
            updated_at: this.getDate(),
            created_by : this.getUserId(),
            updated_by: this.getUserId(),
            businessId: this.getBusinessId(),
            total_tax: input.price.taxAmount,
            grand_total : input.price.grandTotal, 
            isDelete: 0,
            tips_totalamt : input.price.tipsAmount,
            tips_type: input.price.tipsType,
            tips_percent: input.price.tipsPercent,
            discount_id: input.price.ticketDiscount.discount_id,
            discount_type: input.price.ticketDiscount.discount_type,
            discount_value: input.price.ticketDiscount.discount_value,
            discount_totalamt : input.price.ticketDiscount.discount_amt,
            notes: input.ticketDetail.notes
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
        console.log(input, idx);
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
                    console.log("SERVICE SAVE")
                    console.log(obj)
                    thisobj.saveTicketServiceRequestNotes(idx, obj, resolve);
                })
            });
        }
        else{
            resolve("Saved successfully");
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
        console.log(input);
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
                            console.log(commissiondetail)
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
                                    sync_id: csyncid + "service",
                                    isActive:1,
                                    totalamount:service.qty * service.perunit_cost,
                                    owner_percent:commissiondetail.owner_percent,
                                    emp_percent:commissiondetail.emp_percent
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
                var commissiondetail= comm.length > 0 ? comm[0] : {owner_percentage:100, emp_percentage: 0 };

                this.queryManager.getEmployeeCommission(service.employee_id, this.getBusinessId()).then(empcomm=>{
                    if(empcomm.length > 0){
                        commissiondetail = empcomm[0];
                    } 

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
                            owner_percent:commissiondetail.owner_percent,
                            emp_percent:commissiondetail.emp_percent
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
            this.saveTicketDiscountCommission(idx, input, resolve)
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
                        this.saveTicketDiscountCommission(idx, input, resolve)
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
                this.saveTicketDiscountCommission(idx, input, resolve)
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
                                this.saveTicketDiscountCommission(idx, input, resolve)
                            }) 
                        }) 

                        
                    }) 
                })
        });
        
    }


    saveTicketDiscountCommission(idx, input, resolve){
        console.log("TICKET DISCOUNT COMMISSION")
        this.saveTicketService(idx+1, input, resolve)
    }

}