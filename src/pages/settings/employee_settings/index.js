// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios'; 
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Stack, Container, Typography, Grid } from '@mui/material';

// components
import ButtonContent from '../../../components/formComponents/Button'; 
import LoaderContent from '../../../components/formComponents/LoaderDialog';  
import EmployeeSettingForm from './addForm';

import AppBarContent from '../../TopBar';
import DrawerContent from '../../Drawer';
import config from '../../../config/config'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DataManager from '../../../controller/datacontroller'
import TicketController from '../../../controller/TicketController'
export default class EmployeeSetting extends React.Component {
  dataManager= new DataManager();
  ticketController = new TicketController();
    constructor(props) {
        super(props);
        this.state = {
            employee_salarylist:[],
            addForm: false,
            editForm: false,
            isSuccess: false,
            isLoading: false,
            businessdetail:{},
            isOnline: false,
            selectedEmpSalary:{},
            columns:[
                
            {
                field: 'employeeId',
                headerName: 'Employee',
                minWidth: 300,
                editable: false,
                renderCell: (params) => (
                <div>
                    {params.row.firstName} {params.row.lastName}
                </div>
                )
            },
            {
                field: 'minimum_salary',
                headerName: 'Minimum Salary',
                minWidth: 300,
                editable: false,
                renderCell: (params) => (
                <div>
                    $. {params.row.minimum_salary}
                </div>
                )
            },
            {
                field: 'Action',
                headerName:'Action',
                minWidth:250,
                renderCell: (params) => (
                <strong>    
                    {
                    <ButtonContent variant="outlined" size="small" onClick={()=>this.openEdit(params.row)} disabled={!this.state.isOnline} label="Edit"/>
                    
                    }    
                    {params.row.isActive===1 && 
                    <ButtonContent variant="contained" size="small" onClick={()=>{this.deleteRecord(params.row, 0)}} disabled={!this.state.isOnline} label="Inactivate"/>
                    }
                    {params.row.isActive===0 && 
                    <ButtonContent variant="contained" size="small" onClick={()=>{this.deleteRecord(params.row, 1)}} disabled={!this.state.isOnline} label="Activate"/>
                    }        
                
                </strong>
                ),
            }
            ],
            mastertables:[]
        };
        this.handleCloseform = this.handleCloseform.bind(this);

    
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);

    }
    

  handleClick(){
    // //console.log(event.target)
    this.setState({anchorEl:null, openMenu:true, editForm:false, addForm:false});
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


    componentDidMount(){
    
      var condition = navigator.onLine ? 'online' : 'offline';
      this.setState({isOnline: (condition=="online") ? true: false}, function() {

        if(!this.state.isOnline) {
          const dataManager = new DataManager()
          dataManager.getData("select * from employee_salary").then(response =>{
           
              if (response instanceof Array) {
                
                    this.setState({employee_salarylist: response}, function(){
                      console.log("after-response",this.state.employee_salarylist)
                      // console.log(this.state.employeelist)
                  })
              }
             
          })
  
  
  
        }
        else {
          this.setState({mastertables:[{
            name: "employee_salary",
            tablename: 'employee_salary',
            progressText: "Synchronizing Salary Division...",
            progresscompletion: 10,
            url: config.root + `/settings/employee_salary/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
            syncurl:''
        }]},()=>{
          this.getEmpSalaryList()
        });
        }

      })

      

     
       
    }



  syncMasterData(mindex) {
    if (mindex < this.state.mastertables.length) {
        var tbldata = this.state.mastertables[mindex];
        this.setState({downloadinMessage: tbldata.progressText}, ()=>{
            console.log(mindex, "master index")
            axios.get(tbldata.url).then((res) => {
                var data = res.data["data"];
                if (data instanceof Array) {
                    console.log(tbldata.tablename, data.length)
                    this.syncIndividualEntry(mindex, 0, data, tbldata)
                }
            })
        })
    } 
}

syncIndividualEntry(mindex, idx, data, tbldata) {
    if (idx < data.length) {
        var input = data[idx]; 
        this.dataManager.saveData(`delete from ` + tbldata.tablename+ ` where (sync_status=1 and sync_id='`+input.sync_id+`') or id =`+input.id).then(res => {
            input["sync_id"] = input["sync_id"] !== null && input["sync_id"] !== undefined ? input["sync_id"] : input["id"];
            input["sync_status"] = 1;
            if(tbldata.tablename === 'employee_salary'){
              delete input["firstName"];
              delete input["lastName"];
            }
            if(tbldata.tablename === 'ticket'){
                delete input["name"];
                delete input["email"];
                delete input["pay_mode"];
            }
            this.ticketController.saveData({ table_name: tbldata.name, data: input }).then(r => {
                this.syncIndividualEntry(mindex, idx + 1, data, tbldata);
            })
        })     
    }
    else {
        this.setState({progress: tbldata.progress}, ()=>{
            console.log(mindex, "master sync index")
            this.syncMasterData(mindex + 1)
        });
    }
}


    getEmpSalaryList(){
        
      var businessdetail = window.localStorage.getItem('businessdetail');

      if(businessdetail !== undefined && businessdetail !== null){
        this.setState({businessdetail:JSON.parse(businessdetail)})
      }
        var userdetail = window.localStorage.getItem('employeedetail');
        if(userdetail !== undefined && userdetail !== null){
          this.setState({isLoading: true})
            axios.get(config.root+`/settings/employee_salary/list/`+JSON.parse(businessdetail).id).then(res=>{ 
                this.setState({isLoading: false,employee_salarylist:res.data.data});
                // console.log("getEmpSalaryList",this.state.employee_salarylist)
            })
        }
    }

    deleteRecord(detail, status){
        axios.post(config.root+`/settings/employee_salary/save`, {id:detail.id, isActive:status}).then(res=>{
          var status = res.data["status"];
          if(status === 200){
             this.setState({isSuccess: true})
    
              this.getEmpSalaryList();
          }
        }).catch(err=>{      
        })
      }

    handleCloseform(msg){
        this.setState({editForm:false,addForm:false}, function(){
            if(msg !== ''){
              this.setState({isSuccess: true})
            }
        })
    }
    openEdit(row){
        this.setState({selectedEmpSalary: row}, function(){
          this.setState({editForm: true})
        })
    }
    
    openAdd(){
        this.setState({addForm: true})
    }

    render() {
    return (
      <div style={{height:'100%'}}> 
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

      
      {/* Drawer menu ends */}

        {/* ResponsiveGridLayout Starts */}

      
      <Grid container spacing={3}  style={{height:'100%', padding: 0}}>
          <Grid item xs={12} style={{height:'100%', paddingRight:0}}> 

       
        { !this.state.editForm && !this.state.addForm ?
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
                Employee Specific Setting
            </Typography> 
          </Stack>
          {/* {this.state.isOnline && */}
           <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
           <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
             <EmployeeSettingForm />
          </div></div> 
          {/* } */}
        </Container> : ''
        }  </Grid></Grid> 
        
        <Snackbar open={!this.state.isOnline} style={{width:'100%', marginBottom: -25}} anchorOrigin={{ vertical: "bottom", horizontal:  "center" }}>

      <MuiAlert elevation={6}  variant="filled" severity="error" sx={{ width: '100%' }} style={{background: 'red', color: 'white'}}>
      No internet available !
      </MuiAlert>


      </Snackbar>


      <Snackbar autoHideDuration={4000} open ={this.state.isSuccess} style={{width:'50%', marginTop: 50}} anchorOrigin={{ vertical: "top", horizontal:  "center" }}  
      onClose={() => this.setState({isSuccess: false})}>
      <MuiAlert elevation={6}  variant="filled" severity="success" sx={{ width: '50%' }} style={{background: '#134163', color: 'white'}}>
      Updated successfully.
      </MuiAlert>
      </Snackbar>
   


        </div></div>
    );
  }

}