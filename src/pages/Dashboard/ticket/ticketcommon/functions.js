import moment from "moment"; 
export class QueryFunctions{ 
 
    getCategoryList(searchtext){
        var sql = "select sync_id as id, name, status, description,created_at, created_by, updated_at, updated_by,businessId, sync_id  from category where status = 'Active'" ;
        if(searchtext !== ''){
            sql = "select sync_id as id, name, status, description,created_at, created_by, updated_at, updated_by,businessId, sync_id  from category where status = 'Active' and (  lower(name) like '%"+searchtext+"%' or sync_id in (select category_id from services_category where service_id in (select sync_id from services where lower(name) like '%"+searchtext+"%' and status = 'Active')))" ;
        }
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }

    getServiceListByCategory(categoryid, searchtext){ 
        var sql = "select  sync_id as id,name, status, description, created_at, created_by, updated_at, updated_by, price, businessId, tax_type, cost, pricetype, sku, producttype, productcode  from services where sync_id in (select service_id from services_category where category_id='"+categoryid+"') and status = 'Active'" ;

        if(searchtext){
             sql = "select  sync_id as id,name, status, description, created_at, created_by, updated_at, updated_by, price, businessId, tax_type, cost, pricetype, sku, producttype, productcode  from services where sync_id in (select service_id from services_category where category_id='"+categoryid+"') and lower(name) like '%"+searchtext+"%' and status = 'Active'" ; 
        }

        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }

    getClockedInEmployees(){
        const sql = `select * from users where status='active' and  lower(clocked_status)='clock-in'`;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    } 


    getEmployees(){
        const sql = `select * from users where status='active'`;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }


    getServiceTaxes(serviceid){
        var sql = "SELECT st.tax_id as id,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.sync_id=st.tax_id and t.status='active' where service_id='"+serviceid+"' and st.status='active'"; 
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }

    getDefaultTaxes(){ 
        var sql = "SELECT t.sync_id as id, t.tax_name,t.tax_type,t.tax_value from  taxes as t where t.status='active' and isDefault=1"; 
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }

    getAllTaxes(businessid){ 
        var sql = "SELECT t.sync_id as id, t.tax_name,t.tax_type,t.tax_value from  taxes as t where t.status='active' and businessId="+businessid; 
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }


    getAllDiscounts(businessid){ 
        var sql = "SELECT d.sync_id as id, d.name,d.discount_type,d.discount_value,d.division_type, d.owner_division, d.emp_division  from  discounts as d where d.status='active' and businessId="+businessid; 
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }

    getOwnerDetail(){ 
        const sql = `select * from users where staff_role='Owner'`;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        }); 
    }

    getDefaultCommission(businessid){
        const sql = `select * from default_commission where businessId=`+businessid;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    
    getDefaultDiscountDivision(businessid){
        const sql = `select * from default_discount_division where businessId=`+businessid;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getEmployeeCommission(empid, businessid){ 
        const sql = `select * from employee_salary where isActive=1 and employeeId=`+empid+` and businessId=`+businessid;
        window.api.invoke('log', 'SQL:::'+sql)
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getDiscountDetail(discountid){
        const sql = `select * from discounts where sync_id='`+discountid+`'`;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getCustomerDetail(customerid){
        const sql = `select * from customers where sync_id='`+customerid+`'`;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getTicketServices(tid){ 
        const sql = `select ts.*, (select notes from ticketservice_requestnotes where isActive=1 and serviceref_id=ts.sync_id) as requestNotes from ticket_services as ts where ts.isActive=1 and ts.ticketref_id='`+tid+`'`; 
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getserviceDetail(serviceid){
        const sql = `select  sync_id as id,name, status, description, created_at, created_by, updated_at, updated_by, price, businessId, tax_type, cost, pricetype, sku, producttype, productcode  from services where sync_id='`+serviceid+`'`; 
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getServicetax(serviceid){
        const sql = `select tax_id as id, (select tax_name from taxes where sync_id=tst.tax_id) as tax_name, tax_type, tax_value, tax_type, tax_calculated from ticketservice_taxes as tst where serviceref_id='`+serviceid+`'`;
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }


    getAllOpenTickets(businessid){
        const sql = "select  t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value,t.sync_id, t.discount_totalamt, t.sync_id,c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.businessId= '"+businessid+"' and t.isDelete!=1 and (t.paid_status is null or t.paid_status!='paid')";
        console.log(sql)
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }

    getTicketByTicketCode(code){
        const sql = "select * from ticket where ticket_code='"+code+"' and Date(created_at)=Date('"+moment().format('YYYY-MM-DD HH:mm:ss')+"')";
        return new Promise(async (resolve) => {
            await window.api.getData(sql).then(results=>{
                resolve(results); 
            });
        });
    }
}