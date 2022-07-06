import React from 'react';

import axios from 'axios';  
import { Typography, Grid } from '@mui/material'; 
import config from '../../config/config';
// components
import DataManager from '../../controller/datacontroller';
import SyncDataManager from '../../controller/syncManager';
import TicketManager from '../../controller/TicketManager';   
import LoadingModal from '../../components/Modal/loadingmodal';

export default class SyncDataManagerUtil extends React.Component {

    dataManager = new DataManager();
    syncDataManager = new SyncDataManager()
    ticketManager = new TicketManager()

    constructor(props){

      super(props)
      this.state={
        isLoading: false,
      }
     
    }

    componentDidMount(){

      setTimeout(()=>{
        this.setState({isLoading: true}, function() {
          this.syncData()
  
        })
      },100)
      
     
    }

    syncData(){

        
        return new Promise(async (resolve) => {
          await window.api.getData("select * from tickets ").then(results=>{
              resolve(results); 

              this.updateUnsyncTickets()
          });
        });

    }

    updateUnsyncTickets() {
        this.syncTicket();
    }  
    
    
    
     
    
    async syncTicket(){
       console.log("syncTicket")
        this.dataManager.getData("select * from ticket where sync_status=0").then(syncdata=>{
            console.log("syncdata.length", syncdata)
            if(syncdata.length > 0){
                this.syncIndividualTicket(syncdata);
            }
            else{
                this.syncTicketServices();
            }
        })
    }
    
    async syncIndividualTicket(syncdata){
     console.log("syncIndividualTicket")
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedId"];
        delete data["sync_status"]; 
        delete data["id"];
        delete data["pay_mode"];
        delete data["services"];
        //console.log("sync individual ticket")
        axios.post(config.root+'ticket/saveorupdate', data).then(res=>{ 
            console.log(res.data);
            var syncticketid = res.data.data.ticketid;
            thisobj.dataManager.saveData("update ticket set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
              console.log("update ticket set sync_status=1, syncedId="+syncticketid+" where sync_id='"+data.sync_id+"'")
                thisobj.syncTicket();
            })

            // thisobj.dataManager.saveData("update employee_commission_detail set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(res1=>{ 
            //     thisobj.dataManager.saveData("update ticketservice_taxes set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(res2=>{
            //         thisobj.dataManager.saveData("update ticketservice_requestnotes set ticket_id="+syncticketid+"  where ticketref_id='"+data.sync_id+"'").then(res2=>{
            //             thisobj.dataManager.saveData("update ticket_services set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(ree=>{
            //                 thisobj.dataManager.saveData("update ticket_payment set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(ree=>{
            //                     thisobj.dataManager.saveData("update ticket set sync_status=1, syncedId="+data.sync_id+" where sync_id='"+data.sync_id+"'").then(r=>{
            //                       console.log("update ticket set sync_status=1, syncedId="+syncticketid+" where sync_id='"+data.sync_id+"'")
            //                         thisobj.syncTicket();
            //                     })
            //                 }); 
            //             });
            //         });
            //     });
            // });
        })
    }
    
    syncTicketServices(){
     // console.log("syncTicketServices")
        this.dataManager.getData("select * from ticket_services where sync_status=0").then(syncdata=>{
            //console.log("syncdata.length", syncdata.length)
            if(syncdata.length > 0){
                this.syncIndividualTicketService(syncdata);
            }
            else{ 
                this.syncTicketServiceTaxes();
            }
        })
    }
    
    
    async syncIndividualTicketService(syncdata){
     // console.log("syncIndividualTicketService")
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"]; 
        delete data["id"];
        //console.log("sync individual ticket")
        axios.post(config.root+'ticket/service/saveorupdate', data).then(res=>{ 
            //console.log(res.data);
            var serviceid = res.data.data.insertId;
            thisobj.dataManager.saveData("update employee_commission_detail set ticket_serviceId="+serviceid+" where ticketserviceref_id='"+data.sync_id+"'").then(res1=>{ 
                thisobj.dataManager.saveData("update ticketservice_taxes set ticketservice_id="+serviceid+" where serviceref_id='"+data.sync_id+"'").then(res2=>{
                    thisobj.dataManager.saveData("update ticketservice_requestnotes set service_id="+serviceid+"  where serviceref_id='"+data.sync_id+"'").then(res2=>{  
                        thisobj.dataManager.saveData("update ticket_services set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
                            thisobj.syncTicketServices();
                        }) 
                    });
                });
            });
        })
    }
    
    
    
    
    syncTicketServiceTaxes(){
     // console.log("syncTicketServiceTaxes")
        this.dataManager.getData("select * from ticketservice_taxes where sync_status=0").then(syncdata=>{
            //console.log("syncdata trax.length", syncdata.length)
            if(syncdata.length > 0){
                this.syncIndividualTicketServiceTax(syncdata);
            }
            else{
                this.syncTicketServiceNotes() 
            }
        })
    }
    
    
    async syncIndividualTicketServiceTax(syncdata){
     // console.log("syncIndividualTicketServiceTax")
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"]; 
        delete data["id"];
        //console.log("sync individual ticket service tax")
        axios.post(config.root+'ticket/tax/saveorupdate', data).then(res=>{  
            thisobj.dataManager.saveData("update ticketservice_taxes set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
                thisobj.syncTicketServiceTaxes();
            }) 
        })
    }
    
    
    
    
    syncTicketServiceNotes(){
     // console.log("syncTicketServiceNotes")
        this.dataManager.getData("select * from ticketservice_requestnotes where sync_status=0").then(syncdata=>{
            //console.log("syncdata ticketservice_requestnotes.length", syncdata.length)
            if(syncdata.length > 0){
                this.syncIndividualTicketServiceNotes(syncdata);
            }
            else{ 
                this.syncEmpCommission();
            }
        })
    }
    
    
    async syncIndividualTicketServiceNotes(syncdata){
     // console.log("syncIndividualTicketServiceNotes")
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"]; 
        delete data["id"];
        //console.log("sync individual ticket ticketservice_requestnotes")
        axios.post(config.root+'ticket/service/saveorupdatenotes', data).then(res=>{  
            thisobj.dataManager.saveData("update ticketservice_requestnotes set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
                thisobj.syncTicketServiceNotes();
            }) 
        })
    }
    
    
    
    
    
    syncEmpCommission(){
     // console.log("syncEmpCommission")
        this.dataManager.getData("select * from employee_commission_detail where sync_status=0").then(syncdata=>{
            //console.log("syncdata employee_commission_detail.length", syncdata.length)
            if(syncdata.length > 0){
                this.syncIndividualEmpCommission(syncdata);
            }
            else{
                this.syncPayment() 
            }
        })
    }
    
    
    async syncIndividualEmpCommission(syncdata){
     // console.log("syncIndividualEmpCommission")
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"]; 
        delete data["id"];
        //console.log("sync individual ticket employee_commission_detail")
        axios.post(config.root+'employee_commission/save', data).then(res=>{  
            thisobj.dataManager.saveData("update employee_commission_detail set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
                thisobj.syncEmpCommission();
            }) 
        })
    }
    
    
    
    syncPayment(){
     // console.log("syncPayment")
        this.dataManager.getData("select * from ticket_payment where sync_status=0").then(syncdata=>{
            //console.log("syncdata ticket_payment.length", syncdata.length)
            if(syncdata.length > 0){
                this.syncIndividualPayment(syncdata);
            }
            else{
                this.getStaffList() 
            }
        })
    }
    
    
    async syncIndividualPayment(syncdata){
      // console.log("syncIndividualPayment")
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"]; 
        delete data["id"];
        //console.log("sync individual syncIndividualPayment")
        axios.post(config.root+'ticket/payment/saveorupdate', data).then(res=>{  
            thisobj.dataManager.saveData("update ticket_payment set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
                thisobj.syncPayment();
            }) 
        })
    }
    
      getTicketList(){ 
        // // this.updateProgress();;
        //this.setstate({downloadinMessage: 'Tickets'})
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
    
            this.dataManager.saveData( `delete from ticket`).then(res=>{ 
    
            this.ticketManager.getAllTickets(businessdetail.id).then(res=>{
              this.saveIndividualTicket(0, res.data)
            }) 
          });
          
        }
      }
    
      saveIndividualTicket(i, response){
        if(i < response.length){
          var ticketinput = response[i];
          ticketinput["sync_status"] = 1;
          this.syncDataManager.saveTicket(ticketinput).then((res)=> { 
            if(res !== undefined && res !== null){
              this.saveIndividualTicket(i+1, response) 
            }
          })
        }
        else{
            this.getTicketServices();
        }
      }
    
    
    
      getTicketServices(){ 
        // // this.updateProgress();;
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
    
            this.dataManager.saveData( `delete from ticket_services`).then(res=>{ 
                    this.ticketManager.getAllTicketServices(businessdetail.id).then(res=>{
                      //console.log("Serviceds syncing")
                      //console.log(res.data.length)
                      if(res !== undefined && res !== null){
                        this.saveIndividualTicketService(0, res.data) 
                      }
                    }) 
          })
        }
      }
    
    
    
      saveIndividualTicketService(i, response){
        //console.log("Serviceds syncing")
        //console.log(i, response.length)
        if(i < response.length){
          //console.log("service",i, response.length);
          var ticketserviceinput = response[i]; 
          this.ticketManager.saveTicketService(ticketserviceinput).then((res)=> { 
            if(res !== undefined && res !== null){
              this.saveIndividualTicketService(i+1, response)
            
            }
          })
        }
        else{
            this.getTicketServiceTaxes();
        }
      }
    
    
    
      getTicketServiceTaxes(){
        // // this.updateProgress();;
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            
            this.dataManager.saveData( `delete from ticketservice_taxes`).then(res=>{ 
                this.ticketManager.getAllTicketServiceTaxes(businessdetail.id).then(res=>{
                  this.saveIndividualTicketServiceTax(0, res.data)
                }) 
          })
        }
      }
    
    
      saveIndividualTicketServiceTax(i, response){
        if(i < response.length){
          var tax_input = response[i]; 
          this.ticketManager.saveTax(i, tax_input).then((res)=> { 
            if(res !== undefined && res !== null){
              this.saveIndividualTicketServiceTax(i+1, response)
            
            }
          })
        }
        else{
            this.getTicketPayment();
        }
      }
    
    
      getTicketPayment(){
        // // this.updateProgress();;
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            
            this.dataManager.saveData( `delete from ticket_payment`).then(res=>{ 
                this.ticketManager.getAllTicketsPayment(businessdetail.id).then(res=>{
                  this.saveIndividualTicketPayment(0, res.data)
                }) 
          })
        }
      }
    
    
      saveIndividualTicketPayment(i, response){
        if(i < response.length){
          var pay_input = response[i]; 
          this.ticketManager.saveTicketPayment(pay_input).then((res)=> { 
            if(res !== undefined && res !== null){
              this.saveIndividualTicketPayment(i+1, response)
            
            }
          })
        }
        else{
            this.getEmpCommission();
        }
      }
      
    
      getEmpCommission(){
        // // this.updateProgress();;
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            this.ticketManager.getAllEmpCommission(businessdetail.id).then(res=>{
              //console.log("business commission", res.data);
              this.saveIndividualEmpCommission(0, res.data)
            })
        }
      }
    
    
      saveIndividualEmpCommission(i, response){
        if(i < response.length){
          ////console.log(i, response.length)
          var cm_input = response[i]; 
          this.ticketManager.saveTicketEmployeeCommission(cm_input).then((res)=> {  
              this.saveIndividualEmpCommission(i+1, response) 
          })
        }
        else{
            this.finishDownloading();
        }
      }
    


      getStaffList(){
        // this.updateProgress();
       // console.log("getStaffList")
        this.dataManager.saveData( `delete from users`).then(res=>{ 
                var businessdetail = {}
                var  detail = window.localStorage.getItem('businessdetail');
                if(detail !== undefined && detail !== 'undefined'){
                    businessdetail = JSON.parse(detail);
                  
                    
                    //this.setstate({downloadinMessage: 'Masters-Employee'})
                    axios.get(config.root+"employee/"+businessdetail["id"]).then(res=>{
                      
                        var status = res.data["status"];
                        var data = res.data["data"];
                        //console.log("Masters-Employee",data)
                        if(status === 200){
  
                        
                          if (data instanceof Array) {
                            if(data.length===0) {
                              this.getInventoryCategoryList()
                            }
                            else {
                              if(data.length > 0){
                                this.syncIndividualUsers(0,  data)
                              }
  
                            }
                          
                          }
  
                          
                          
                        }
                    })
                    
                } 
        });
    }
  
    syncIndividualUsers(i,  data){
     // console.log("syncIndividualUsers")
        if(i < data.length){
          this.syncDataManager.saveUsersToLocal(data[i]).then((response)=> {
           
            if(response !== undefined && response !== null){
              this.syncIndividualUsers(i+1, data)
            }
          })
  
        }
        else{
          this.getInventoryCategoryList()
        }
    
    }
  
  
    getInventoryCategoryList() {
     // console.log("getInventoryCategoryList")
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-Category'})
      this.dataManager.saveData( `delete from category`).then(res=>{ 
            axios.get(config.root+"/inventory/category/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
  
              
              //this.setstate({categorylist:res.data.data});
              var data = res.data["data"];
              if (data instanceof Array) {
                if(data.length===0) {
                  this.getInventoryServicesList()
                }
                else {
                  if(data.length > 0){
                    this.syncIndividualCategory(0,  data)
                  }
                
                }
              
              }
  
            }) 
      })
    }
    syncIndividualCategory(i,  data){
     // console.log("syncIndividualCategory")
      if(i < data.length){
        this.syncDataManager.saveCategoryToLocal(data[i]).then((response)=> {
      
          if(true){//if(response !== undefined && response !== null){ 
            setTimeout(()=>{
              ////console.log(data[i].id)
              this.getServiceByCategory(i,  data, data[i].id) 
            },100)
            
          }
        })
  
      }
      else{
        this.dataManager.getData("select * from category").then(res=>{
          //console.log("Category result");
          //console.log(res);
        })
        this.getInventoryServicesList()
       
      }
  
  }
  
  
  
  
  getServiceByCategory(catidx, categories,category_id){
    // // this.updateProgress();
   // console.log("getServiceByCategory")
    this.dataManager.saveData( `delete from services_category where category_id=`+category_id).then(res=>{ 
  
            axios.get(config.root+"inventory/services/"+category_id).then(res=>{
              var status = res.data["status"];
              var data = res.data["data"];
              if(status === 200){
                if(data.length > 0){
                  this.syncIndividualServicesByCategory(0,  data,category_id, catidx, categories)
                }
                else{
                  this.syncIndividualCategory(catidx+1, categories);
                }
              }
            }) 
    })
  }
  
  syncIndividualServicesByCategory(i,  data, category_id, catidx, categories){
   // console.log("syncIndividualServicesByCategory")
    if(i < data.length){
      this.syncDataManager.saveServicesByCategory(data[i], category_id).then((response)=> { 
        if(response !== undefined && response !== null){
          this.syncIndividualServicesByCategory(i+1, data, category_id,  catidx, categories) 
        }
      })
  
    }
    else{
      this.syncIndividualCategory(catidx+1, categories);
    }
  
  }
  
    getInventoryServicesList() {
      // this.updateProgress();
      ////console.log("inventory product/service adding");
      //this.setstate({downloadinMessage: 'Masters-Services'})
     // console.log("getInventoryServicesList")
      this.dataManager.saveData( `delete from services`).then(res=>{ 
  
                axios.get(config.root+"/inventory/servicesbybusiness/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
              
                  var data = res.data["data"];
                  if (data instanceof Array) {
                    if(data.length===0) {
                      this.getDiscountsList()
                    }
                    else {
                      if(data.length > 0){
                        this.syncIndividualServices(0,  data)
                      }
                    }
                  
  
                  }
  
                }) 
    })
  
    }
  
    syncIndividualServices(i,  data){
    
      if(i < data.length){
        this.syncDataManager.saveServices(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualServices(i+1, data) 
          }
        })
  
      }
      else{
        this.dataManager.getData("select * from services_category").then(res=>{
          //console.log("services_category result");
          //console.log(res);
        })
        this.getDiscountsList() 
      }
  
  }
  
    getDiscountsList() {
     // console.log("getDiscountsList")
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-Discounts'})
      
      this.dataManager.saveData( `delete from discounts`).then(res=>{ 
  
              axios.get(config.root+"/discount/list/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
            
                var data = res.data["data"];
                if (data instanceof Array) {
                  if(data.length===0) {
                    this.getCustomers()
                  }
                  else {
                    if(data.length>0) {
                      this.syncIndividualDiscounts(0,data)
                    } 
                  }
                
  
                }
  
              }) 
    })
    }
  
    syncIndividualDiscounts(i,  data){
      if(i < data.length){
        this.syncDataManager.saveDiscounts(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualDiscounts(i+1, data)
           
          }
        })
  
      }
      else{
        this.getCustomers()
       
      }
  
    }
  
  
    getCustomers() {
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-Customers'})
     // console.log("getCustomers")
      this.dataManager.saveData( `delete from customers`).then(res=>{ 
              axios.get(config.root+"/customer/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
            
                var data = res.data["data"];
                if (data instanceof Array) {
                  if(data.length===0) {
                    this.getSettingsTax()
                  }
                  else {
                    if(data.length>0) {
                    this.syncIndividualCustomers(0,data)
                    } 
                  }
                
  
                }
  
              }) 
    })
    }
  
    syncIndividualCustomers(i,  data){
      if(i < data.length){
        this.syncDataManager.saveCustomers(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualCustomers(i+1, data)
           
          }
        })
  
      }
      else{
        this.getSettingsTax()
       
      }
  
    }
  
  
    getSettingsTax() {
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-Taxes'})
     // console.log("getSettingsTax")
      this.dataManager.saveData( `delete from taxes`).then(res=>{ 
  
                axios.get(config.root+"/tax/list/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
              
                  var data = res.data["data"];
                  if (data instanceof Array) {
                    if(data.length===0) {
                      this.getSettingsCommision()
                    }
                    else {
                      if(data.length>0) {
                        this.syncIndividualSettingsTax(0,data)
                      }
                    } 
                  }
  
                }) 
      })
    }
  
    syncIndividualSettingsTax(i,  data){
      if(i < data.length){
        this.syncDataManager.saveTaxes(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualSettingsTax(i+1, data)
           
          }
        })
  
      }
      else{
        this.getSettingsCommision()
       
      }
  
    }
  
  
    getSettingsCommision() {
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-Commision'})
     // console.log("getSettingsCommision")
      this.dataManager.saveData( `delete from default_commission`).then(res=>{ 
  
            axios.get(config.root+"/settings/default_commission/list/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
          
              var data = res.data["data"];
              if (data instanceof Array) {
                if(data.length===0) {
                  this.getSettingsDiscountDivision()
                }
                else {
                  if(data.length>0){
                    this.syncIndividualCommision(0,data)
                  }
                }
              
  
              }
  
            }) 
    })
    }
  
    syncIndividualCommision(i,  data){
      if(i < data.length){
        this.syncDataManager.saveCommission(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualCommision(i+1, data)
           
          }
        })
  
      }
      else{
        this.getSettingsDiscountDivision()
       
      }
  
    }
  
  
    getSettingsDiscountDivision() {
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-DiscountDivision'})
     // console.log("getSettingsDiscountDivision")
      this.dataManager.saveData( `delete from default_discount_division`).then(res=>{ 
  
              axios.get(config.root+"/settings/default_discount/list/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
            
                var data = res.data["data"];
                if (data instanceof Array) {
                  if(data.length===0) {
                    this.getSettingsEmployee()
                  }
                  else {
                  if(data.length>0){
                    this.syncIndividualSettingsDiscountDivision(0,data)
                  }
                  }
                  
  
                }
  
              }) 
      })
    }
  
    syncIndividualSettingsDiscountDivision(i,  data){
      if(i < data.length){
        this.syncDataManager.saveDiscountDivision(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualSettingsDiscountDivision(i+1, data)
           
          }
        })
  
      }
      else{
        this.getSettingsEmployee()
       
      }
  
    }
  
  
    getSettingsEmployee() {
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'Masters-EmployeeSettings'})
     // console.log("getSettingsDiscountDivision")
      this.dataManager.saveData( `delete from employee_salary`).then(res=>{ 
  
                axios.get(config.root+"/settings/employee_salary/list/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 
              
                  var data = res.data["data"];
                  if (data instanceof Array) {
                    if(data.length===0) {
                      // this.getTicketList()
                      this.getBusinessOwner()
                    }
                    else {
                      if(data.length>0) {
                        this.syncIndividualSettingsEmploye(0,data)
                      }
                    }
                  
  
                  }
  
                }) 
      })
    }
  
    syncIndividualSettingsEmploye(i,  data){
      if(i < data.length){
        this.syncDataManager.saveEmployeeSalary(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualSettingsEmploye(i+1, data)
           
          }
        })
  
      }
      else{
        this.getBusinessOwner()
       
      }
  
    }
  
   
    getBusinessOwner(){
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'BusinessOwner'})
     // console.log("getBusinessOwner")
      this.dataManager.saveData( `delete from user_business`).then(res=>{ 
            axios.get(config.root+"business/getowner/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then(res=>{
              var data = res.data["data"];
              if (data instanceof Array) {
                if(data.length===0) {
                  this.getServiceTaxes()
                }
                else{
                if(data.length>0){
                  this.syncIndividualBusinessOwner(0,data)
                }
                }
                
  
              }
            
          }) 
    })
    }
  
    syncIndividualBusinessOwner(i,  data){
      if(i < data.length){
        this.syncDataManager.saveBusinessOwner(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualBusinessOwner(i+1, data)
           
          }
        })
  
      }
      else{
        this.getServiceTaxes()
       
      }
  
    }
  
    getServiceTaxes() {
      // this.updateProgress();
      //this.setstate({downloadinMessage: 'ServicesTax'})
     // console.log("getServiceTaxes")
      this.dataManager.saveData( `delete from services_tax`).then(res=>{ 
  
              axios.get(config.root+"inventory/services_tax").then(res=>{
                var data = res.data["data"];
                ////console.log("saving getServiceTaxes...",data)
                if (data instanceof Array) {
                  if(data.length===0) {
                   this.finishDownloading();
                  }
                  else {
                    if(data.length>0) {
                      this.syncIndividualServiceTaxes(0,data)
                    }
                  }
                
  
                }
              
            }) 
    })
    }
  
    syncIndividualServiceTaxes(i,  data){
      if(i < data.length){
        this.syncDataManager.saveServiceTaxes(data[i]).then((response)=> {
      
          if(response !== undefined && response !== null){
            this.syncIndividualServiceTaxes(i+1, data)
           
          }
        })
  
      }
      else{
        this.getTicketList()
       
      }
  
    }

    
    
      async finishDownloading() {
        // return new Promise(async (resolve) => {
        //     await window.api.getData("select * from tickets").then(results=>{
        //         resolve(results); 
        //     });
        // });
        this.props.finishDownloading()
        this.setState({isLoading: false})
       // console.log("finishDownloading")


      }



      render()  {    
        //// console.log("window.innerWidth",this.state.isLoading)
        return <div style={{width: 80, height: 80, marginTop: -60}}> 
                  {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
         </div>

// return <div style={{ackground:'transparent'}}>
// <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
//     <div style={{background:'transparent',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
//     </div>
//     <div style={{background:'transparent',width:'10%', height: '10%',margin:'10% auto 0', position:'relative', borderRadius: 10}}>
//     <Grid container spacing={2}>
//     {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
//     </Grid>

//     </div>
// </div>
// </div>
      }
                      
    
}