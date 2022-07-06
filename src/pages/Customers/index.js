// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';

// import { DataGrid } from '@mui/x-data-grid';
// material
import { Card, Stack, Container, Typography, Grid } from '@mui/material';
// components
import ButtonContent from '../../components/formComponents/Button';
import TableContent from '../../components/formComponents/DataGrid';
import LoaderContent from '../../components/formComponents/LoaderDialog'; 
import CreateCustomer from './create';
import config from '../../config/config';
import DataManager from '../../controller/datacontroller'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer';
import TicketController from '../../controller/TicketController';

export default class Customer extends React.Component {
  dataManager = new DataManager();
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state={
        customerlist:[],
        addForm: false,
        isSuccess: false,
        editForm: false,
        isOnline: false,
        selectedcustomer:{},
        columns:[
            {
                field: 'name',
                headerName: 'Name',
                minWidth: 200,
                editable: false,
                renderCell: (params) => (
                    <div>
                        {params.row.name} {params.row.lastName}
                    </div>
                )
            },
            {
                field: 'member_id',
                headerName: 'MemberID',
                minWidth: 100,
                editable: false,
                renderCell: (params) => (
                    <div>
                        {params.row.member_id}
                    </div>
                )
            },
            {
                field: 'visit_count',
                headerName: 'Total Visit',
                minWidth: 100,
                editable: false,
                renderCell: (params) => (
                    <div>
                        {params.row.visit_count === ''? '--' : params.row.visit_count}
                    </div>
                )
            },
            {
                field: 'total_spent',
                headerName: 'Total Spent',
                minWidth: 150,
                editable: false,
                renderCell: (params) => (
                    <div>
                      {params.row.total_spent === ''? '--' : 'Rs. '+params.row.visit_count }
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
                        {params.row.status}
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
                            <ButtonContent permission_id = "pos_edit_customer" permission_label="Show edit customer"
                            variant="contained" 
                            size="small" 
                            onClick={()=>this.openEdit(params.row)} 
                            label="Edit" />
                        
                        }              
                    {params.row.status==='Active' && 
                     <ButtonContent permission_id = "pos_status_customer" permission_label="Show status customer"
                     variant="contained" 
                     size="small" 
                     onClick={()=>{this.deleteRecord(params.row, 'Inactive')}} 
                     label="Inactivate"/>
                    }
                    {params.row.status==='Inactive' && 
                     <ButtonContent permission_id = "pos_status_customer" permission_label="Show status customer"
                     variant="contained" 
                     size="small" 
                     onClick={()=>{this.deleteRecord(params.row, 'Active')}} 
                     label="Activate"/>
                    }
                   
                    </strong>
                    
                ),
            }
            
        ],
        isLoading: false,
        businessdetail:{}
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

  let detail = window.localStorage.getItem("businessdetail");
  this.setState({businessdetail: JSON.parse(detail)}, function(){
   
  });


  var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition=="online") ? true: false})
    // if(!this.state.isOnline) {
    //   const dataManager = new DataManager()
    //   dataManager.getData("select * from customers").then(response =>{
    //       if (response instanceof Array) {
    //           this.setState({customerlist: response}, function(){
    //               // console.log(this.state.customerlist)
    //           })
    //       }
         
    //   })

    // }
    // else {
      this.customerlist();
    // }

}



  customerlist() {
    this.setState({isLoading: true},()=>{
      this.dataManager.getData("select sync_id as id, member_id, name, email, dob, first_visit, last_visit, visit_count, total_spent, loyality_point, created_at, created_by, updated_at, updated_by, status, phone, businessId, sync_status, sync_id from customers").then(response =>{
        if (response instanceof Array) {
            this.setState({customerlist: response, isLoading: false}, function(){
                // console.log(this.state.customerlist)
            })
        }
       
    })
    }); 
        // axios.get(config.root+`/customer/`+this.state.businessdetail.id).then(res=>{
        //     this.setState({customerlist:res.data.data}, function(){
        //       this.setState({isLoading: false});
        //         console.log(this.state.customerlist)
        //     })
        // }); 
  }
  deleteRecord(detail, status){

    this.setState({isLoading: true}, ()=>{
      var input = {
        status: status,
        sync_status:0
      }
      this.ticketController.updateData({table_name:'customers', data: input, query_field:'sync_id', query_value:detail.id}).then(()=>{
        this.setState({msg: 'Updated successfully.', isLoading: false, }, ()=>{
          this.setState({isSuccess: true});
          this.customerlist();
        })
      })
    });

    // axios.post(config.root+"/customer/saveorupdate", {id:detail.id, status:status}).then(res=>{
    //   var status = res.data["status"];
    //   if(status === 200){
    //     this.setState({isSuccess: true})
    //       this.customerlist();
    //   }
    // }).catch(err=>{      
    // })
  }

  handleCloseform(msg){
    this.setState({editForm:false,addForm:false}, function(){
        if(msg !== ''){
          this.setState({isSuccess: true})
        }
    })
  }

  openEdit(row){
    this.setState({selectedcustomer: row}, function(){
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
  
      <Grid container spacing={3}  style={{height:'calc(100% - 104px)', padding: 0}}>
          <Grid item xs={12} style={{height:'100%', paddingRight:0}}> 
  
        
        { !this.state.editForm && !this.state.addForm ? 
        <Container maxWidth="xl"  style={{height: '100%'}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
            Customer
            </Typography>
            <ButtonContent  permission_id = "pos_add_customer" permission_label="Show add customer"
              onClick={()=>this.openAdd()}
              size="large"
              variant="contained"
              label="Add Customer" 
              startIcon={<Icon icon={plusFill} />}
            />
          </Stack>

       
          
          <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
      <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
              <TableContent permission_id = "pos_view_customer" permission_label="Show view customer"
              style={{height: '100%'}} 
              data={this.state.customerlist} 
              columns={this.state.columns} />
          </div></div>
        </Container>: ''
        }
        { this.state.editForm ?  <CreateCustomer afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.customerlist();}} customerSelected = {this.state.selectedcustomer} /> :  '' }
        { this.state.addForm ? <CreateCustomer afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.customerlist();}} /> : '' }
      </Grid>
      </Grid>

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
   


      </div>
      </div>
    );
  }
}
