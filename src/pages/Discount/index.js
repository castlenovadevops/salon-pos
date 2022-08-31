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
import CreateDiscount from './create';

import LoaderContent from '../../components/formComponents/LoaderDialog';
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer';
import config from '../../config/config';
import DataManager from '../../controller/datacontroller'
import TicketController from '../../controller/TicketController'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


export default class Discount extends React.Component {
  dataManager = new DataManager(); 
  ticketController = new TicketController();
  constructor(props) {
        super(props);
        this.state = {
            discountlist:[],
            addForm: false,
            editForm: false,
            isSuccess: false,
            selectedDiscount:{},
            isOnline: false,
            columns:[
                {
                    field: 'name',
                    headerName: 'Name',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.name}
                        </div>
                    )
                },
                {
                    field: 'discount_type',
                    headerName: 'Type',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div style={{textTransform:'capitalize'}}>
                            {params.row.discount_type}
                        </div>
                    )
                },
                {
                    field: 'discount_value',
                    headerName: 'Value',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.discount_type ===  'amount'? '$' + params.row.discount_value : params.row.discount_value+'%' }
                        </div>
                    )
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    minWidth: 150,
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
                        <ButtonContent permission_id = "pos_edit_discount" permission_label="Show edit discount"
                        variant="contained" 
                        size="small" 
                        onClick={()=>this.openEdit(params.row)} 
                        label="Edit"/>
                        
                        }            
                    {params.row.status==='active' && 
                    <ButtonContent permission_id = "pos_status_discount" permission_label="Show status discount"
                    variant="contained"  
                    size="small" 
                    onClick={()=>{this.deleteRecord(params.row, 'inactive')}} 
                    label="Inactivate"/>
                    }
                        {params.row.status==='inactive' && 
                        <ButtonContent permission_id = "pos_status_discount" permission_label="Show status discount"
                        variant="contained"  
                        size="small" 
                        onClick={()=>{this.deleteRecord(params.row, 'active')}} 
                        label="Activate"/>
                        }
                    </strong>
                    ),
                }
            ],
            isLoading: false,
            businessdetail:{}
        };
        this.handleCloseform = this.handleCloseform.bind(this)
    
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
    // console.log("DISCOUNTTTTT")
   
    var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition=="online") ? true: false}, function() {
      // if(!this.state.isOnline) {
      //   const dataManager = new DataManager()
    //   dataManager.getData("select * from discounts").then(response =>{
    //     if (response instanceof Array) {
    //         this.setState({discountlist: response}, function(){
    //             // console.log(this.state.employeelist)
    //         })
    //     }
       
    // })
  
      // }
      // else {
        this.setState({businessdetail: JSON.parse(detail)}, function(){
          
          this.getDiscountList();
        });
      // }
    })
   

   
    
  }
  getDiscountList() { 
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail);
    // console.log("getDiscountList")
    this.setState({isLoading: true});
        // axios.get(config.root+`/discount/list/`+JSON.parse(window.localStorage.getItem("businessdetail")).id).then(res=>{
        //     this.setState({discountlist:res.data.data}, function(){
        //         this.setState({isLoading: false});
        //         console.log("getDiscountList",this.state.discountlist)
        //     })
        // }); 
        this.dataManager.getData("select sync_id as id, name, discount_type, discount_value, division_type, owner_division, emp_division, created_at, created_by, updated_at, updated_by, status, businessId, sync_status, sync_id from discounts where businessId="+businessdetail["id"]).then(response =>{
          if (response instanceof Array) {
              this.setState({discountlist: response, isLoading:false}, function(){
                  // console.log(this.state.employeelist)
              })
          }
         
      })

    }

  deleteRecord(detail, status){
    // axios.post(config.root+"/discount/saveorupdate", {id:detail.id, status:status}).then(res=>{
    //   var status = res.data["status"];
    //   if(status === 200){
    //     this.setState({isSuccess: true})

    //       this.getDiscountList();
    //   }
    // }).catch(err=>{      
    // })

    this.setState({isLoading: true}, ()=>{
      var input = {
        status: status,
        sync_status:0
      }
      this.ticketController.updateData({table_name:'discounts', data: input, query_field:'sync_id', query_value:detail.id}).then(()=>{
        this.setState({msg: 'Updated successfully.', isLoading: false, }, ()=>{
          this.setState({isSuccess: true});
          this.getDiscountList();
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

    this.getDiscountList()
  }

  openEdit(row){
    this.setState({selectedDiscount: row}, function(){
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
        <Container maxWidth="xl" style={{height: '100%'}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
            Discount
            </Typography>
            <ButtonContent permission_id = "pos_add_discount" permission_label="Show add discount"
              onClick={()=>this.openAdd()}
              size="large"
              variant="contained"
              label="Add Discount" 
              startIcon={<Icon icon={plusFill} />}
            />
          </Stack>

          <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
          <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
              <TableContent permission_id = "pos_view_discount" permission_label="Show view discount"
              style={{height: '100%'}} 
              data={this.state.discountlist} 
              columns={this.state.columns} />
          </div></div>
        </Container>: ''
        }
        { this.state.editForm ?  <CreateDiscount afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getDiscountList();}} discountSelected = {this.state.selectedDiscount} /> :  '' }
        { this.state.addForm ? <CreateDiscount afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getDiscountList();}} /> : '' }
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
