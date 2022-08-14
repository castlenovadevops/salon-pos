// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';

// import { DataGrid } from '@mui/x-data-grid';
// material
import { Card, Stack, Container, Typography, Grid, CardContent } from '@mui/material';
// components
import ButtonContent from '../../components/formComponents/Button';
import TableContent from '../../components/formComponents/DataGrid';
import LoaderContent from '../../components/formComponents/LoaderDialog'; 
import CreateEmployee from './create';
import config from '../../config/config';
import DataManager from '../../controller/datacontroller'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer';
import TicketController from '../../controller/TicketController';
export default class Employee extends React.Component {
  ticketController = new TicketController();
  dataManager = new DataManager();
  constructor(props) {
    super(props);
    this.state = {
        employeelist:[],
        addForm: false,
        editForm: false,
        isOnline: false,
        selectedEmployee:{},
        isSuccess: false,
        mastertables:[],
        columns:[
            {
                field: 'firstName',
                headerName: 'Name',
                minWidth: 200,
                editable: false,
                renderCell: (params) => (
                    <div>
                        {params.row.firstName === ''? '--' : params.row.firstName + ' ' + params.row.lastName }
                    </div>
                )
            },
            {
                field: 'staff_role',
                headerName: 'Role',
                minWidth: 100,
                editable: false,
                renderCell: (params) => (
                    <div>
                      {params.row.staff_role === ''? '--' : params.row.staff_role}
                        {/* {params.row.roleId} */}
                    </div>
                )
            },
            {
                field: 'email',
                headerName: 'Email',
                minWidth: 200,
                editable: false,
                renderCell: (params) => (
                    <div>
                       {params.row.email === ''? '--' : params.row.email}
                    </div>
                )
            },
            {
              field: 'passcode',
              headerName: 'PassCode',
              minWidth: 100,
              editable: false,
              renderCell: (params) => (
                  <div>
                     {params.row.passcode === ''? '--' : params.row.passcode}
                  </div>
              )
          },
            {
                field: 'status',
                headerName: 'Status',
                minWidth: 100,
                editable: false,
                renderCell: (params) => (
                   <div style={{textTransform:'capitalize'}}>
                         {params.row.status ==  'undefined' ? '--' : params.row.status} 
                    </div>
                )
            },
            {
                field: 'Action',
                headerName:'Actions',
                minWidth:150,
                renderCell: (params) => (
                    <strong>       
                        {/* {userdetail.id !== params.row.id && */}
                            <ButtonContent permission_id = "pos_edit_employee" permission_label="Show edit employee"
                            variant="contained" 
                            size="small" 
                            onClick={()=>this.openEdit(params.row)} 
                            label="Edit" 
                            disabled={!this.state.isOnline}/>
                             
                        {/* }        */}
                    {/* {params.row.status==='active' &&  userdetail.id !== params.row.id &&
                        <ButtonContent variant="contained" size="small" onClick={()=>{this.deleteRecord(params.row, 'inactive')}} label="Inactivate"/>
                    }
                    {params.row.status==='inactive' && userdetail.id !== params.row.id &&
                        <ButtonContent variant="contained" size="small" onClick={()=>{this.deleteRecord(params.row, 'active')}} label="Activate"/>
                    }
                    {userdetail.id === params.row.id && <p>N/A</p> } */}
                    </strong>
                    
                ),
            }
            
        ],
        isLoading: false,
        businessdetail:{}
    };
    this.handleClose = this.handleClose.bind(this)
 
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);

     }
     handleClick(){
        // //console.log(event.target)
        this.setState({anchorEl:null, openMenu:true, editForm:false, addForm:false});
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
    this.setState({isOnline: (condition=="online") ? true: false})

    let detail = window.localStorage.getItem("businessdetail");
    this.setState({businessdetail: JSON.parse(detail)}, function(){

      this.setState({mastertables:[
        {
            name: "users",
            tablename: 'users',
            progressText: "Synchronizing Staffs...",
            progresscompletion: 10,
            url: config.root + "/employee/" + JSON.parse(window.localStorage.getItem('businessdetail')).id,
            syncurl:'/inventory/category/saveorupdate'
        }
      ]} );
    // console.log("componentDidMount::",this.state.isOnline)

    if(!this.state.isOnline) {
      console.log("load from local")

      const dataManager = new DataManager()
      dataManager.getData("select * from users").then(response =>{
          if (response instanceof Array) {
              this.setState({employeelist: response}, function(){
                  console.log(this.state.employeelist)
              })
          }
          
      })


    }
    else {
        this.getEmployeeList();
    }


    

    });
  }
  handleClose(msg){
    this.setState({addForm:false,editForm:false}, function(){
        if(msg !== ''){
          this.setState({isSuccess: true})

        }
        
    })
  }
  deleteRecord(detail, status){
    axios.post(config.root+`/employee/saveorupdate`, {id:detail.id, status:status}).then(res=>{
      var status = res.data["status"];
      if(status === 200){
        this.setState({isSuccess: true})

          this.getEmployeeList();
      }
    }).catch(err=>{      
    })
  }

  getEmployeeList() {
    this.setState({isLoading: true}); 
        axios.get(config.root+`/employee/`+this.state.businessdetail.id).then(res=>{
            this.setState({employeelist:res.data.data}, function(){
              this.setState({isLoading: false});
                // console.log(this.state.employeelist)
                this.syncMasterData(0);
            })
        }); 
  }

  openEdit(row){
    this.setState({selectedEmployee: row}, function(){
      this.setState({editForm: true})
    })
  }

  openAdd(){
    this.setState({addForm: true})
  }

  render() {
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

    
    {/* Drawer menu ends */}

      {/* ResponsiveGridLayout Starts */}

    <Grid container spacing={3}  style={{height:'calc(100% - 104px)', padding: 0}}>
        <Grid item xs={12} style={{height:'100%', paddingRight:0}}> 

      

        { !this.state.editForm && !this.state.addForm ? 
        <Container maxWidth="xl" style={{ height: '100%', background: ''}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
              Employee
            </Typography>
            <ButtonContent permission_id = "pos_add_employee" permission_label="Show add employee"
              onClick={()=>this.openAdd()}
              size="large"
              disabled={!this.state.isOnline}
              variant="contained"
              label="Add Employee"
              style={{padding: 20}}
              startIcon={<Icon icon={plusFill} />}
            />
          </Stack>

          {/* <Card style={{ height: '80%',marginLeft: '10px', overflow: "visible"}}>
          <CardContent style={{ height: '100%', background: 'white'}}>
          <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'red' }}>
              <TableContent style={{ height: '100%', background: ''}} data={this.state.employeelist} columns={this.state.columns} />
          </div>
          </CardContent>
          </Card> */}

      <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
      <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
              <TableContent permission_id = "pos_view_employee" permission_label="Show view employee"
              style={{ height: '80%', background: '', border: "1px solid"}} 
              data={this.state.employeelist} 
              columns={this.state.columns} />
        </div>
      </div>
        

          </Container>: ''
        }
        { this.state.editForm ?  <CreateEmployee afterSubmitForm={(msg)=>{this.handleClose(msg); this.getEmployeeList();}} employeeSelected = {this.state.selectedEmployee} /> :  '' }
        { this.state.addForm ? <CreateEmployee afterSubmitForm={(msg)=>{this.handleClose(msg); this.getEmployeeList();}} /> : '' }
      </Grid>
      </Grid>

      <Snackbar open={!this.state.isOnline} style={{width:'100%', marginBottom: -25}} anchorOrigin={{ vertical: "bottom", horizontal:  "center" }}>

      <MuiAlert elevation={6}  variant="filled" severity="error" sx={{ width: '100%' }} style={{background: 'red', color: 'white'}}>
      No internet available !
      </MuiAlert>


      </Snackbar>

      <Snackbar autoHideDuration={4000} open ={this.state.isSuccess} style={{width:'50%', marginTop: 50}} anchorOrigin={{ vertical: "top", horizontal:  "center" }}  onClose={() => this.setState({isSuccess: false})}>
      <MuiAlert elevation={6}  variant="filled" severity="success" sx={{ width: '50%' }} style={{background: '#134163', color: 'white'}}>
      Updated successfully.
      </MuiAlert>
      </Snackbar>


      </div></div>
    );
  }
}
