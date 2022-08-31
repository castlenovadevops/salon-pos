// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Stack, Container, Typography, Grid } from '@mui/material';

// components
import ButtonContent from '../../../../components/formComponents/Button';
import TableContent from '../../../../components/formComponents/DataGrid';
import LoaderContent from '../../../../components/formComponents/LoaderDialog'; 

import CreateCategory from './create';
import config from '../../../../config/config';

import AppBarContent from '../../../TopBar';
import DrawerContent from '../../../Drawer';
// import DataManager from '../../../controller/datacontroller'
import DataManager from '../../../../controller/datacontroller'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TicketController from '../../../../controller/TicketController';

export default class Category extends React.Component {
  ticketController = new TicketController();
  interval;
  constructor(props) {
    super(props);
    this.state = {
        categorylist:[],
        addForm: false,
        isSuccess: false,
        isOnline: false,
        editForm: false,
        selectedcategory:{},
        expand_menu_show: false,
        setting_menu_show:false,
        anchor:"left",
        anchorEl: null,
        openMenu:false,
        columns:[
          {
            field: 'name',
            headerName: 'Category Name',
            minWidth: 300,
            editable: false,
            renderCell: (params) => (
              <div>
                  {params.row.name}
              </div>
            )
          },
          // {
          //   field: 'description',
          //   headerName: 'Description',
          //   minWidth: 300,
          //   editable: false,
          //   renderCell: (params) => (
          //     <div>
          //        {params.row.description === ''? '--' : params.row.description}
          //     </div>
          //   )
          // },
          
          {
            field: 'status',
            headerName: 'Status',
            minWidth: 200,
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
                  <ButtonContent variant="contained" size="small" onClick={()=> this.openEdit(params.row)}  label="Edit"  />
                   
                  }            
               {params.row.status==='Active' && 
                <ButtonContent variant="contained" size="small" onClick={()=>{this.deleteRecord(params.row, 'Inactive')}} label="Inactivate"  />
               }
                 {params.row.status==='Inactive' && 
                 <ButtonContent variant="contained" size="small" onClick={()=>{this.deleteRecord(params.row, 'Active')}} label="Activate"  />
                 }
              </strong>
            ),
          }
        ],
        isLoading: false,
        businessdetail:{},
        currentTime:''
    };
    this.handleCloseform = this.handleCloseform.bind(this);
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);
  }
  componentDidMount(){

  

    var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition=="online") ? true: false}, function() {

      // if(!this.state.isOnline) {
      //   const dataManager = new DataManager()
      //   dataManager.getData("select * from category").then(response =>{
      //       if (response instanceof Array) {
      //           this.setState({categorylist: response}, function(){
      //               console.log(this.state.employeelist)
      //           })
      //       }
           
      //   })
      // }
      // else {
        this.getCategoryList()
      // }
      
    })

    this.interval = setInterval(() => this.setState({ currentTime: new Date().toLocaleTimeString('en-US') }), 1000);

    
    
  }

  getCategoryList(){
    this.setState({isLoading: true});
    var detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== null){
      var businessdetail = JSON.parse(detail);
      // this.setState({businessdetail: businessdetail})
        // axios.get(config.root+`/inventory/category/`+JSON.parse(businessdetail).id).then(res=>{
        //   this.setState({isLoading: false});
        //   this.setState({categorylist:res.data.data});
        // })
        this.setState({businessdetail: businessdetail}, ()=>{
          const dataManager = new DataManager()
          dataManager.getData("select sync_id as id, name, status, description,created_at, created_by, updated_at, updated_by,businessId, sync_status from category where businessId="+businessdetail["id"]+" order by created_at asc").then(response =>{ 
              if (response instanceof Array) {
                  this.setState({categorylist: response, isLoading: false}, function(){
                    console.log(this.state.categorylist);
                  })
              }
             
          })
        })
    }
  }
  deleteRecord(detail, status){
    // axios.post(config.root+`/inventory/category/saveorupdate`, {id:detail.id, status:status}).then(res=>{
    //   var status = res.data["status"];
    //   if(status === 200){
    //     this.setState({isSuccess: true})
    //       this.getCategoryList();
    //   }
    // }).catch(err=>{      
    // })

    this.setState({isLoading: true}, ()=>{
      var input = {
        status: status,
        sync_status:0
      }
      this.ticketController.updateData({table_name:'category', data: input, query_field:'sync_id', query_value:detail.id}).then(()=>{
        this.setState({msg: 'Updated successfully.', isLoading: false, }, ()=>{
          this.setState({isSuccess: true});
          this.getCategoryList();
        })
      })
    });

  }

  handleCloseform(msg){
    this.setState({editForm:false,addForm:false}, function(){
        if(msg !== ''){
          this.setState({isSuccess: true})
        }
    })
  }

  openEdit(row){ 
    this.setState({selectedcategory: row}, function(){
      this.setState({editForm: true})
    })
  }

  openAdd(){
    this.setState({addForm: true})
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
        <Container maxWidth="xl"  style={{height:'100%'}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
            Category
            </Typography>
            <ButtonContent
              onClick={()=>this.openAdd()}
              size="large"
              variant="contained" 
              className='bgbtn'
              label="Add Category"
              startIcon={<Icon icon={plusFill} />}
            />
          </Stack>

          <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
          <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
              <TableContent  style={{height: '100%'}} data={this.state.categorylist} columns={this.state.columns} />
          </div></div>
        </Container> : ''
        }
        { this.state.editForm ?  <CreateCategory afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getCategoryList();}} categorySelected = {this.state.selectedcategory} /> :  '' }
        { this.state.addForm ? <CreateCategory afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getCategoryList();}} /> : '' }
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
