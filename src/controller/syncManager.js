import DataManager from './datacontroller';
import * as Moment from 'moment';
export default  class SyncDataManager{ 


    dataManager = new DataManager()
    props ; 

    clearSyncedData() {
      
        this.dataManager.saveData( `delete from users`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='users';`)
        });
        this.dataManager.saveData( `delete from category`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='category';`)
        })
        this.dataManager.saveData( `delete from services`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='services';`)
        })
        this.dataManager.saveData( `delete from services_category`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='services_category';`)
        })
        this.dataManager.saveData( `delete from discounts`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='discounts';`)
        })
        this.dataManager.saveData( `delete from customers`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='customers';`)
        })
        this.dataManager.saveData( `delete from taxes`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='taxes';`)
        })
        this.dataManager.saveData( `delete from default_commission`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='default_commission';`)
        })
        this.dataManager.saveData( `delete from default_discount_division`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='default_discount_division';`)
        })
        this.dataManager.saveData( `delete from employee_commission_detail`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='employee_commission_detail';`)
        });
        this.dataManager.saveData( `delete from employee_salary`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='employee_salary';`)
        })
        this.dataManager.saveData( `delete from user_business`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='user_business';`)
        })
        this.dataManager.saveData( `delete from services_tax`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='services_tax';`)
        })

        this.dataManager.saveData( `delete from ticket`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='ticket';`)
        });
        this.dataManager.saveData( `delete from ticket_payment`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='ticket_payment';`)
        })
        this.dataManager.saveData( `delete from ticket_services`).then(res=>{
            this.dataManager.saveData(` delete from sqlite_sequence where name='ticket_services';`)
        }) 
    }
   
    async saveUsersToLocal(input) {
        // //console.log("input:",input)
        const clocked_status = input['clocked_status']
        const created_at = input['created_at']
        const created_by = input['created_by']
        const email = input['email']

        const updated_by = input['updated_by'] 
        const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")

        const firstName = input['firstName']
        const id = input['id']
        const lastName = input['lastName']
        const mobile = input['mobile']
       
        const passcode = input['passcode']
        const password = input['password']
        const staff_role = input['staff_role']
        const status = input['notstatuses']

        const userName = input['userName']
        const userType = input['userType']
        const user_passcode = input['user_passcode'] 
        var sql = `insert into users(clocked_status,created_at,created_by,email,firstName,id,lastName,mobile,passcode,password,
            staff_role,status, updated_at,updated_by, userName,userType, user_passcode
            ) values('`
            +clocked_status+`','`
            +created_at+`','`
            +created_by+`','`
            +email+`','`
            +firstName+`','`
            +id+`','`
            +lastName+`','`
            +mobile+`','`
            +passcode+`','`
            +password+`','`
            +staff_role+`','`
            +status+`','`
            +updated_at+`','`
            +updated_by+`','`
            +userName+`','`
            +userType+`','`
            +user_passcode+`')`;

        const res  = this.dataManager.saveData(sql)
        // console.log("saveUsersToLocal",res)
        return res

 
    }

    
    async saveCategoryToLocal(input) {
       
        const id = input['id']
        const name = input['name']
        const status = input['status']
        const description = input['description']
        const businessId = input['businessId']
        const created_at = input['created_at']
        const created_by = input['created_by']
        const updated_by = input['updated_by'] 
        const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
       
        var sql = `insert into category(id,name,status,description,created_at,
            created_by, updated_at,updated_by, businessId
            ) values('`
            +id+`','`
            +name+`','`
            +status+`','`
            +description+`','`
            +created_at+`','`
            +created_by+`','`
            +updated_at+`','`
            +updated_by+`','`
            +businessId+`')`;

        const res  = this.dataManager.saveData(sql).then(r=>{
            console.log("Aftr saving")
            console.log(r);
        })

        console.log("saveCategoryToLocal::::",sql)
        return res

 
    }

    async saveServicesByCategory(input, category_id) {
       
     
        const id = input['id']
        // const service_id = input['service_id']
        // const category_id = input['category_id']
        const status = input['status']
        
        const created_at = input['created_at']
        const created_by = input['created_by']
        const updated_by = input['updated_by'] 
        const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
       
        var sql = `insert into services_category(id,service_id,category_id,status,created_at,
            created_by, updated_at,updated_by
            ) values('`
            +id+`','`
            +id+`','`
            +category_id+`','`
            +status+`','`
            +created_at+`','`
            +created_by+`','`
            +updated_at+`','`
            +updated_by+`')`;

        const res  = this.dataManager.saveData(sql)
        return res

 
    }

    

    async saveServices(input) {
       

          const id = input['id']
          const name = input['name']
          const category_id = input['category_id']
          const status = input['status']
          const description = input['description']
          const price = input['price']
          const businessId = input['businessId']
          const tax_type = input['tax_type']
          const cost = input['cost']
          const pricetype = input['pricetype']
          const sku = input['sku']
          const producttype = input['producttype']
          const productcode = input['productcode']
          const created_at = input['created_at']
          const created_by = input['created_by']
          const updated_by = input['updated_by'] 
          const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
         
          var sql = `insert into services(id,name,category_id,status,description,
            price,businessId,tax_type,cost,pricetype,sku,producttype,productcode,
            created_at,created_by, updated_at,updated_by
            ) values('`
              +id+`','`
              +name+`','`
              +category_id+`','`
              +status+`','`
              +description+`','`
              +price+`','`
              +businessId+`','`
              +tax_type+`','`
              +cost+`','`
              +pricetype+`','`
              +sku+`','`
              +producttype+`','`
              +productcode+`','`
              +created_at+`','`
              +created_by+`','`
              +updated_at+`','`
              +updated_by+`')`;
  
              //console.log("inventory product/service adding query", sql);
          const res  = this.dataManager.saveData(sql, 'services')
          return res
  
    }


    async saveDiscounts(input) {
       
       
        const id = input['id']
        const name = input['name']
        const discount_type = input['discount_type']
        const discount_value = input['discount_value']
        const division_type = input['division_type']
        const owner_division = input['owner_division']
        const emp_division = input['emp_division']
        const status = input['status']
        const businessId = input['businessId']
       
        
        const created_at = input['created_at']
        const created_by = input['created_by']
        const updated_by = input['updated_by'] 
        const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
       
        var sql = `insert into discounts(id,name,discount_type,discount_value,division_type,
          owner_division,emp_division,status,businessId,
          created_at,created_by, updated_at,updated_by
          ) values('`
            +id+`','`
            +name+`','`
            +discount_type+`','`
            +discount_value+`','`
            +division_type+`','`
            +owner_division+`','`
            +emp_division+`','`
            +status+`','`
            +businessId+`','`
            
            +created_at+`','`
            +created_by+`','`
            +updated_at+`','`
            +updated_by+`')`;

        const res  = this.dataManager.saveData(sql)
        return res

  }

  async saveCustomers(input) {
    
    const id = input['id']
    const name = input['name']
    const member_id = input['member_id']
    const email = input['email']
    const dob = input['dob']
    const first_visit = input['first_visit']
    const last_visit = input['last_visit']
    const visit_count = input['visit_count']
    const total_spent = input['total_spent']
    const loyality_point = input['loyality_point']
    const status = input['status']
    const phone = input['phone']
    const businessId = input['businessId']
   
    
    const created_at = input['created_at']
    const created_by = input['created_by']
    const updated_by = input['updated_by'] 
    const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
   
    var sql = `insert into customers(id,name,member_id,email,dob,
        first_visit,last_visit,visit_count,total_spent,loyality_point,status,phone,businessId,
      created_at,created_by, updated_at,updated_by
      ) values('`
        +id+`','`
        +name+`','`
        +member_id+`','`
        +email+`','`
        +dob+`','`
        +first_visit+`','`
        +last_visit+`','`
        +visit_count+`','`
        +total_spent+`','`
        +loyality_point+`','`
        +status+`','`
        +phone+`','`
        +businessId+`','`
        
        +created_at+`','`
        +created_by+`','`
        +updated_at+`','`
        +updated_by+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

}

async saveTaxes(input) {
    
    const id = input['id']
    const tax_name = input['tax_name']
    const tax_type = input['tax_type']
    const tax_value = input['tax_value']
    const isDefault = input['isDefault']
    const status = input['status']
    const businessId = input['businessId']

    
    const created_at = input['created_at']
    const created_by = input['created_by']
    const updated_by = input['updated_by'] 
    const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")

    var sql = `insert into taxes(id,tax_name,tax_type,tax_value,isDefault,
        status,businessId,
    created_at,created_by, updated_at,updated_by
    ) values('`
        +id+`','`
        +tax_name+`','`
        +tax_type+`','`
        +tax_value+`','`
        +isDefault+`','`
        +status+`','`
        +businessId+`','`
        +created_at+`','`
        +created_by+`','`
        +updated_at+`','`
        +updated_by+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

}

async saveCommission(input) {
    const id = input['id']
    const cash_percentage = input['cash_percentage']
    const check_percentage = input['check_percentage']
    const owner_percentage = input['cash_percentage']
    const emp_percentage = input['check_percentage']
    const isActive = input['isActive']
    const businessId = input['businessId']
    const created_at = input['created_at']
    const created_by = input['created_by']
    const updated_by = input['updated_by'] 
    const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")

    var sql = `insert into default_commission(id,owner_percentage,emp_percentage,cash_percentage,check_percentage,isActive,
        businessId,
    created_at,created_by, updated_at,updated_by
    ) values('`
        +id+`','`
        +owner_percentage+`','`
        +emp_percentage+`','`
        +cash_percentage+`','`
        +check_percentage+`','`
        +isActive+`','`
        +businessId+`','`
        +created_at+`','`
        +created_by+`','`
        +updated_at+`','`
        +updated_by+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

}


async saveDiscountDivision(input) {

    const id = input['id']
    const owner_percentage = input['owner_percentage']
    const employee_percentage = input['employee_percentage']
    const isActive = input['isActive']
    const businessId = input['businessId']
    const created_at = input['created_at']
    const created_by = input['created_by']
    const updated_by = input['updated_by'] 
    const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")

    var sql = `insert into default_discount_division(id,owner_percentage,employee_percentage,isActive,
        businessId,
    created_at,created_by, updated_at,updated_by
    ) values('`
        +id+`','`
        +owner_percentage+`','`
        +employee_percentage+`','`
        +isActive+`','`
        +businessId+`','`
        +created_at+`','`
        +created_by+`','`
        +updated_at+`','`
        +updated_by+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

}

async saveEmployeeSalary(input) {

    const id = input['id']
    const employeeId = input['employeeId']
    const minimum_salary = input['minimum_salary']
    const owner_percentage = input['owner_percentage']
    const employee_percentage = input['employee_percentage']
    const check_percentage = input['check_percentage']
    const businessId = input['businessId']
    const isActive = input['isActive']


    const created_at = input['created_at']
    const created_by = input['created_by']
    const updated_by = input['updated_by'] 
    const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")

    var sql = `insert into employee_salary(id,employeeId,minimum_salary,owner_percentage,
        employee_percentage,check_percentage,businessId,isActive,
    created_at,created_by, updated_at,updated_by
    ) values('`
        +id+`','`
        +employeeId+`','`
        +minimum_salary+`','`
        +owner_percentage+`','`
        +employee_percentage+`','`
        +check_percentage+`','`
        +businessId+`','`
        +isActive+`','`
        +created_at+`','`
        +created_by+`','`
        +updated_at+`','`
        +updated_by+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

}


async saveTicket(input) {
    const ticket_code = input['ticket_code']
    const customer_id = input['customer_id']
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
    const updated_by = input['updated_by'] 
    var created_at = input["created_at"] != undefined ? input["created_at"] : Moment().format('YYYY-MM-DDTHH:mm:ss')
    var updated_at = input["updated_at"] != undefined ? input["updated_at"] : Moment().format('YYYY-MM-DDTHH:mm:ss')
    const url = 'ticket/saveorupdate/'
    const input1 = JSON.stringify(input)
    const method = 'post'
    let sync_status = 1
    let sync_id= input["sync_id"] != undefined ? input["sync_id"] : ''

        /** insert sql query */

    if(input["id"] !== undefined){
        created_at = input["created_at"];
        updated_at = input["updated_at"];
        var sqlid = `insert into ticket(id,syncedId,ticket_code,customer_id,technician_id,services,type,subtotal,discounts,paid_status,created_at,created_by,
            updated_at,updated_by, businessId,total_tax, grand_total,notes, isDelete,tips_totalamt,tips_type,tips_percent, discount_id,
            discount_type,discount_value,discount_totalamt
            ,url,input,method,sync_status, sync_id
            ) values(`+input["id"]+`,`+input["id"]+`,'`
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
            +sync_status+`','`+sync_id+`')`;
        const res  = this.dataManager.saveData(sqlid)
        return res
    }
    else{
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
            +sync_status+`','`+sync_id+`')`;
        const res  = this.dataManager.saveData(sql)
        return res
    } 
}


async saveBusinessOwner(input) {
    
    const id = input['id']
    const businessId = input['businessId']
    const business_owner_id = input['business_owner_id']
    const description = input['description']
    const role = input['role']
    const short_name = input['short_name']
    const status = input['status']
   

    var sql = `insert into user_business(id,businessId,business_owner_id,description,
        role,short_name,status
    ) values('`
        +id+`','`
        +businessId+`','`
        +business_owner_id+`','`
        +description+`','`
        +role+`','`
        +short_name+`','`
        +status+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

}


async saveServiceTaxes(input) {
    

    const id = input['id']
    const service_id = input['service_id']
    const tax_id = input['tax_id']
    const status = input['status']
    const tax_type = input['tax_type']

    const created_by = input['created_by'] 
    const created_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
    const updated_by = input['updated_by'] 
    const updated_at = Moment().format("YYYY-MM-DDTHH:mm:ss")
   

    var sql = `insert into services_tax(id,service_id,tax_id,status,
        tax_type,
        created_at,created_by, updated_at,updated_by
    ) values('`
        +id+`','`
        +service_id+`','`
        +tax_id+`','`
        +status+`','`
        +tax_type+`','`
        +created_at+`','`
        +created_by+`','`
        +updated_at+`','`
        +updated_by+`')`;

    const res  = this.dataManager.saveData(sql)
    return res

} 

}
    