import React from 'react';
import axios from 'axios';  
import { Typography, Grid } from '@mui/material'; 
import config from '../../config/config';
// components
import DataManager from '../../controller/datacontroller';
import SyncDataManager from '../../controller/syncManager';
import TicketManager from '../../controller/TicketManager';   
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress'; 
import LoadingModal from '../../components/Modal/loadingmodal';  
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer';
import LoaderContent from '../../components/formComponents/LoaderDialog'; 

import { Card, Stack, Container } from '@mui/material';
import * as Moment from 'moment';
import TicketController from '../../controller/TicketController';

export default class SettingsSync extends React.Component {
  dataManager = new DataManager();
  ticketController = new TicketController()
    constructor(props){

        super(props)
        this.state={
          dataManager: new DataManager(),
          syncDataManager: new SyncDataManager(),
          progress: 0,
          isLoading: false,
          isFinished: false,
          downloadinMessage: '',
          isOnline: false,
          businessdetail: {},
          TicketManager: new TicketManager(this.props),
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.dataManager = new DataManager()
        this.handleClose = this.handleClose.bind(this)
        this.logout = this.logout.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this) 
        this.handleClick = this.handleClick.bind(this);
        this.handlePageEvent = this.handlePageEvent.bind(this);
    }

    handleClick(){
      // ////console.log(event.target)
      this.setState({anchorEl:null, openMenu:true, editForm:false, addForm:false});
  }
  
  handleClose(msg){
    this.setState({addForm:false,editForm:false}, function(){
        if(msg !== ''){
          
        }
        
    })
  }
  handleCloseMenu(){
      this.setState({anchorEl:null, openMenu:false});
  }
  handlePageEvent(pagename){
      this.props.onChangePage(pagename);
    }
    
    
    handleClickInvent(opt){
      if(opt === 'inventory')
        this.setState({expand_menu_show : !this.state.expand_menu_show});
      if(opt === 'settings')
        this.setState({setting_menu_show : !this.state.setting_menu_show});
    } 
    
    logout(){ 
      window.localStorage.removeItem("employeedetail")
      window.location.reload();
    }

    componentDidMount() {
      // this.state.syncDataManager.clearSyncedData() 
      let detail = window.localStorage.getItem("businessdetail");
      this.setState({businessdetail: JSON.parse(detail)})

      var condition = navigator.onLine ? 'online' : 'offline';
      this.setState({isOnline: (condition=="online") ? true: false}, function() {
        if(this.state.isOnline) {
         
          this.updateUnsyncTickets();
         

        }
      })

     
    } 

    getStaffList(){
      this.updateProgress()
      // this.dataManager.saveData('delete from sqlite_sequence').then(()=>{
        this.dataManager.saveData( `delete from users`).then(res=>{ 
                var businessdetail = {}
                var  detail = window.localStorage.getItem('businessdetail');
                if(detail !== undefined && detail !== 'undefined'){
                    businessdetail = JSON.parse(detail);
                  
                    
                    this.setState({downloadinMessage: 'Masters-Employee'})
                    axios.get(config.root+"employee/"+businessdetail["id"]).then(res=>{
                      
                        var status = res.data["status"];
                        var data = res.data["data"];
                        console.log("Masters-Employee",data.length, res)
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
      // })
  }

  syncIndividualUsers(i,  data){
  
      if(i < data.length){
        this.state.syncDataManager.saveUsersToLocal(data[i]).then((response)=> {
         
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
    console.log("getInventoryCategoryList")
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-Category'})
    this.dataManager.saveData( `delete from category`).then(res=>{ 
          axios.get(config.root+"/inventory/category/"+JSON.parse(window.localStorage.getItem('businessdetail')).id).then((res)=>{ 

            
            this.setState({categorylist:res.data.data});
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
  
    if(i < data.length){
      this.state.syncDataManager.saveCategoryToLocal(data[i]).then((response)=> {
    
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
  // this.updateProgress()

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

  if(i < data.length){
    this.state.syncDataManager.saveServicesByCategory(data[i], category_id).then((response)=> { 
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
    this.updateProgress()
    ////console.log("inventory product/service adding");
    this.setState({downloadinMessage: 'Masters-Services'})
    
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
      this.state.syncDataManager.saveServices(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-Discounts'})
    
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
      this.state.syncDataManager.saveDiscounts(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-Customers'})
    
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
      this.state.syncDataManager.saveCustomers(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-Taxes'})
    
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
      this.state.syncDataManager.saveTaxes(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-Commision'})
    
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
      this.state.syncDataManager.saveCommission(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-DiscountDivision'})
    
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
      this.state.syncDataManager.saveDiscountDivision(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'Masters-EmployeeSettings'})
    
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
      this.state.syncDataManager.saveEmployeeSalary(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'BusinessOwner'})

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
      this.state.syncDataManager.saveBusinessOwner(data[i]).then((response)=> {
    
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
    this.updateProgress()
    this.setState({downloadinMessage: 'ServicesTax'})

    this.dataManager.saveData( `delete from services_tax`).then(res=>{ 

            axios.get(config.root+"inventory/services_tax").then(res=>{
              var data = res.data["data"];
              ////console.log("saving getServiceTaxes...",data)
              if (data instanceof Array) {
                if(data.length===0) {
                 this.finishDownloading("getServiceTaxes");
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
      this.state.syncDataManager.saveServiceTaxes(data[i]).then((response)=> {
    
        if(response !== undefined && response !== null){
          this.syncIndividualServiceTaxes(i+1, data)
         
        }
      })

    }
    else{
      this.getTicketList()
     
    }

  }


  updateUnsyncTickets() {
    this.syncTicket();
  }  



 

  async syncTicket(){
    window.api.invoke('evantcall','sync ticket synginc api call started ').then(r=>{
                                
    })
    console.log("syncTicket")
    this.dataManager.getData("select * from ticket where sync_status=0").then(syncdata=>{
        //console.log("syncdata.length", syncdata.length)
        if(syncdata.length > 0){
            this.syncIndividualTicket(syncdata);
        }
        else{
            this.syncTicketServices();
        }
    })
}

async syncIndividualTicket(syncdata){
  window.api.invoke('evantcall','sync individual ticket synginc api call started ', syncdata).then(r=>{
                              
  })
    var data = syncdata[0];
    var thisobj = this;
    delete data["url"];
    delete data["input"];
    delete data["method"];
    delete data["syncedId"];
    delete data["sync_status"]; 
    delete data["id"];
    //console.log("sync individual ticket")
    axios.post(config.root+'ticket/saveorupdate', data).then(res=>{ 
        //console.log(res.data);
        // var syncticketid = res.data.data.ticketid;
        thisobj.dataManager.saveData("update ticket set sync_status=1 where sync_id='"+data.sync_id+"'").then(r=>{
          window.api.invoke('evantcall','sync individual ticket updated sync status api call started ').then(r=>{
                                      
          })
            thisobj.syncTicket();
        })

        // thisobj.dataManager.saveData("update employee_commission_detail set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(res1=>{ 
        //     thisobj.dataManager.saveData("update ticketservice_taxes set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(res2=>{
        //         thisobj.dataManager.saveData("update ticketservice_requestnotes set ticket_id="+syncticketid+"  where ticketref_id='"+data.sync_id+"'").then(res2=>{
        //             thisobj.dataManager.saveData("update ticket_services set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(ree=>{
        //                 thisobj.dataManager.saveData("update ticket_payment set ticket_id="+syncticketid+" where ticketref_id='"+data.sync_id+"'").then(ree=>{
        //                     thisobj.dataManager.saveData("update ticket set sync_status=1, syncedId="+syncticketid+" where sync_id='"+data.sync_id+"'").then(r=>{
        //                       window.api.invoke('evantcall','sync individual ticket updated sync status api call started ').then(r=>{
                                                          
        //                       })
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
  console.log("syncTicketServices")
  window.api.invoke('evantcall','ticket service synginc start').then(r=>{
                              
  })
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
    var data = syncdata[0];
    var thisobj = this;
    delete data["url"];
    delete data["input"];
    delete data["method"];
    delete data["syncedid"];
    delete data["sync_status"]; 
    delete data["id"];
    //console.log("sync individual ticket")
  window.api.invoke('evantcall','ticket individual service synginc api call ').then(r=>{
                              
  })
    axios.post(config.root+'ticket/service/saveorupdate', data).then(res=>{ 
        //console.log(res.data);
        var serviceid = res.data.data.insertId;
        thisobj.dataManager.saveData("update employee_commission_detail set ticket_serviceId='"+serviceid+"' where ticketserviceref_id='"+data.sync_id+"'").then(res1=>{ 
            thisobj.dataManager.saveData("update ticketservice_taxes set ticketservice_id='"+serviceid+"' where serviceref_id='"+data.sync_id+"'").then(res2=>{
                thisobj.dataManager.saveData("update ticketservice_requestnotes set service_id='"+serviceid+"'  where serviceref_id='"+data.sync_id+"'").then(res2=>{  
                    thisobj.dataManager.saveData("update ticket_services set sync_status=1  where sync_id='"+data.sync_id+"'").then(r=>{
                      window.api.invoke('evantcall','sync individual ticket service sync status synginc api call started ').then(r=>{
                                                  
                      })
                        thisobj.syncTicketServices();
                    }) 
                });
            });
        });
    })
}




syncTicketServiceTaxes(){
  window.api.invoke('evantcall','sync ticket taxes synginc api call started ').then(r=>{
                              
  })
  console.log("syncTicketServiceTaxes")
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
          window.api.invoke('evantcall','sync individual ticket  tax sync status synginc api call started ').then(r=>{
                                      
          })
            thisobj.syncTicketServiceTaxes();
        }) 
    })
}




syncTicketServiceNotes(){
  console.log("syncTicketServiceNotes")
  window.api.invoke('evantcall','sync individual ticket  notes synginc api call started ').then(r=>{
                              
  })
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
          window.api.invoke('evantcall','sync individual ticket notes syncind synginc api call started ').then(r=>{
                                      
          })
            thisobj.syncTicketServiceNotes();
        }) 
    })
}





syncEmpCommission(){
  console.log("syncEmpCommission")
  window.api.invoke('evantcall','sync individual ticket empcomision synginc api call started ').then(r=>{
                              
  })
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
          window.api.invoke('evantcall','sync individual ticket emp commission sycstatus synginc api call started ').then(r=>{
                                      
          })
            thisobj.syncEmpCommission();
        }) 
    })
}



syncPayment(){
  console.log("syncPayment")
  window.api.invoke('evantcall','sync individual ticket apyment synginc api call started ').then(r=>{
                              
  })
    this.dataManager.getData("select * from ticket_payment where sync_status=0").then(syncdata=>{
        //console.log("syncdata ticket_payment.length", syncdata.length)
        if(syncdata.length > 0){
            this.syncIndividualPayment(syncdata);
        }
        else{
            // this.getStaffList() 
            this.getClockinDetails()
        }
    })
}


async syncIndividualPayment(syncdata){
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
          window.api.invoke('evantcall','sync individual ticket payrment syncstatus synginc api call started ').then(r=>{
                                      
          })
            thisobj.syncPayment();
        }) 
    })
}

  getTicketList(){ 
    this.updateProgress();
    this.setState({downloadinMessage: 'Tickets'})
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);

        this.dataManager.saveData( `delete from ticket`).then(res=>{ 

        this.state.TicketManager.getAllTickets(businessdetail.id).then(res=>{
          this.saveIndividualTicket(0, res.data)
        }) 
      });
      
    }
  }

  saveIndividualTicket(i, response){
    if(i < response.length){
      var ticketinput = response[i];
      ticketinput["sync_status"] = 1;
      this.state.syncDataManager.saveTicket(ticketinput).then((res)=> { 
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
    this.updateProgress();
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);

        this.dataManager.saveData( `delete from ticket_services`).then(res=>{ 
                this.state.TicketManager.getAllTicketServices(businessdetail.id).then(res=>{
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
      this.state.TicketManager.saveTicketService(ticketserviceinput).then((res)=> { 
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
    this.updateProgress();
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);
        
        this.dataManager.saveData( `delete from ticketservice_taxes`).then(res=>{ 
            this.state.TicketManager.getAllTicketServiceTaxes(businessdetail.id).then(res=>{
              this.saveIndividualTicketServiceTax(0, res.data)
            }) 
      })
    }
  }


  saveIndividualTicketServiceTax(i, response){
    if(i < response.length){
      var tax_input = response[i]; 
      this.state.TicketManager.saveTax(i, tax_input).then((res)=> { 
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
    this.updateProgress();
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);
        
        this.dataManager.saveData( `delete from ticket_payment`).then(res=>{ 
            this.state.TicketManager.getAllTicketsPayment(businessdetail.id).then(res=>{
              this.saveIndividualTicketPayment(0, res.data)
            }) 
      })
    }
  }


  saveIndividualTicketPayment(i, response){
    if(i < response.length){
      var pay_input = response[i]; 
      this.state.TicketManager.saveTicketPayment(pay_input).then((res)=> { 
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
    this.updateProgress();
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);
        this.state.TicketManager.getAllEmpCommission(businessdetail.id).then(res=>{
          //console.log("business commission", res.data);
          this.saveIndividualEmpCommission(0, res.data)
        })
    }
  }


  saveIndividualEmpCommission(i, response){
    if(i < response.length){
      ////console.log(i, response.length)
      var cm_input = response[i]; 
      delete cm_input["id"];
      this.ticketController.saveData({table_name:'employee_commission_detail',data: cm_input}).then(r=>{
        this.saveIndividualEmpCommission(i+1, response) 
      })
      // this.state.TicketManager.saveTicketEmployeeCommission(cm_input).then((res)=> {  
      //     this.saveIndividualEmpCommission(i+1, response) 
      // })
    }
    else{
        this.finishDownloading();
        // this.getClockinDetails()
    }
  }


  getClockinDetails(){
    console.log("getClockinDetails::")
    window.api.invoke('evantcall','sync individual clocklog api call started ').then(r=>{
                                
    })
    let qq = "select * from staff_clocklog where sync_status=0 "
          this.state.dataManager.getData(qq).then(response =>{
            if(response.length>0) {
              // console.log("saveIndividualClocki::qq", response[response.length-1])
              this.saveIndividualClocki(0, response)
            }
            else {
              this.getStaffList()
            }
        })

  }
  

  saveIndividualClocki(i,response) {

   

    if(i < response.length){
      
      let data = response[i]
      var input = {
        staff_id: data.staff_id,
        passcode:data.passcode,
        time: new Date(),
        status : data.clockin_out,
        isActive: true
      }     

      // this.saveIndividualClocki(i+1, response) 
      // console.log("saveIndividualClocki",input)

      axios.post(config.root+'employee/clockin', input).then(res=>{
        var status = res.data["status"];
        if(status === 200){

          var qq = "update staff_clocklog set sync_status="+1+" where sync_id="+"'"+ data.sync_id+"'"
          this.state.dataManager.saveData(qq).then((res)=>{
              // console.log("updateQuery:",qq)
  window.api.invoke('evantcall','sync individual clocllog syncstatus synginc api call started ').then(r=>{
                              
  })
              this.saveIndividualClocki(i+1, response) 
          })
        }
      })
    }
    else {
     
      console.log("starting on next...")
      this.getStaffList()
    }

  }

  async finishDownloading(value) {
    console.log("finishDownloading::",value)
    window.localStorage.setItem("synced", "true")
    this.setState({isFinished: true},function() {
      this.setState({ progress: 100}, function(){
        this.props.onAfterSync()
      })
    })
  }

  updateProgress() {
    this.setState({ progress:  Number((this.state.progress + (100/20)).toFixed(1)) })
  }


  timer() {
   
  
    this.setState({ progress: this.state.progress + 13 }, function() {
      if(this.state.progress > 90) {
        window.localStorage.setItem("synced", "true")
        this.setState({isFinished: true})
      }
    })
  }

  
  
  onSubmit(){
    //////console.log("1.onSubmit")
    
  }

  renderOfflineContent() {
    return (  <div style={{height:'100%'}}> 
    {this.state.isLoading &&  <LoaderContent show={this.state.isLoading}></LoaderContent>}
    <AppBarContent  businessdetail={this.state.businessdetail} currentTime={this.state.currentTime}  
    handleClick={()=>this.handleClick()}   /> 
    
    <div style={{height:'100%'}}>  
        <DrawerContent 
          anchor={this.state.anchor} 
          open={this.state.openMenu} 
          expand_menu_show={this.state.expand_menu_show}
          setting_menu_show={this.state.setting_menu_show}
          onClose={()=>this.handleCloseMenu()}  
          onhandleClickInvent={(opt)=>this.handleClickInvent(opt)} 
          onlogout={()=>this.logout()} 
          onhandlePageevent= {(pagename)=>this.handlePageEvent(pagename)}
        />
    <Grid container spacing={3}  style={{height:'calc(100% - 104px)', padding: 0}}>
        <Grid item xs={12} style={{height:'100%', paddingRight:0}}> 

      

        { !this.state.editForm && !this.state.addForm ? 
        <Container maxWidth="xl" style={{ height: '100%', background: ''}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
              Sync
            </Typography>
           
          </Stack>

          <Card style={{ height: '80%', background: ''}}>
          <div className="tabcontent" style={{ height: '100%', width: '100%' }}>
             
          </div>
          </Card>

        

          </Container>: ''
        }
      
      </Grid>
      </Grid>

      <Snackbar open={!this.state.isOnline} style={{width:'100%', marginBottom: -25}} anchorOrigin={{ vertical: "bottom", horizontal:  "center" }}>

      <MuiAlert elevation={6}  variant="filled" severity="error" sx={{ width: '100%' }} style={{background: 'red', color: 'white'}}>
      No internet available !
      </MuiAlert>


      </Snackbar>

      </div></div>
    );
  }

      renderMain() {
      
        return (
         
          
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'}}>

                {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
                 
                 
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'}}>
                  <Grid container spacing={2} >
                        
                        <Grid item xs={2}> </Grid>
                        <Grid item xs={8}> 
                          {/* <Grid item xs={12}><Typography variant="h6" noWrap >Please wait until finish..</Typography> </Grid> */}
                          <Grid item xs={12}></Grid>
                          <Grid item xs={12} style={{marginTop: 20,display:'flex'}}>
                          <Box sx={{ width: '100%' }}>
                              <LinearProgress variant="determinate" value={this.state.progress} />
                          </Box>
                          </Grid>
                          <Grid item xs={12} style={{marginTop: 10}}><Typography variant="subtitle2" noWrap style={{color:'#808080'}}> Synchronizing {this.state.downloadinMessage}...{this.state.progress} %</Typography> </Grid>
                          <Grid item xs={12}><Typography variant="subtitle2" noWrap style={{color:' #808080'}}></Typography> </Grid>
                         
                        </Grid>
                        <Grid item xs={2}> </Grid>
                  </Grid>
                
                </div> 

             
          
          </div>
      )
    
      }

      render() {
        var content = this.renderMain()
        if(!this.state.isOnline) {
          content = this.renderOfflineContent()
        }
       
        return(
          
          content
        )
      }

}