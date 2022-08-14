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
import config from '../../../../config/config';
import CreateProduct from './create';
import AppBarContent from '../../../TopBar';
import DrawerContent from '../../../Drawer';
import DataManager from '../../../../controller/datacontroller'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { func } from 'prop-types';
import TicketController from '../../../../controller/TicketController';


export default class Products extends React.Component {

  dataManager = new DataManager();
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state = {
      serviceslist:[],
      addForm: false,
      isSuccess: false,
      isOnline: false,
      editForm: false,
      selectedservice:{},
      businessdetail:{},
      currentTime:'',
      columns:[
        {
          field: 'name',
          headerName: 'Name',
          minWidth: 250,
          editable: false,
          renderCell: (params) => (
            <div>
                {params.row.name}
            </div>
          )
        },
        {
          field: 'category_name',
          headerName: 'Category',
          minWidth: 250,
          editable: false,
          renderCell: (params) => (
            <div style={{textTransform:'capitalize', whiteSpace:'normal'}}>
                {params.row.category_name !== '' ||  params.row.category_name !== null? params.row.category_name : '--'}
            </div>
          )
        },
        {
          field: 'producttype',
          headerName: 'Type',
          minWidth: 200,
          editable: false,
          renderCell: (params) => (
            <div style={{textTransform:'capitalize'}}>
                {params.row.producttype}
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
                <ButtonContent variant="contained" size="small" onClick={()=>this.openEdit(params.row)} label="Edit"  />       
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
handlePageEvent(pagename){
  this.props.onChangePage(pagename);
}



  componentDidMount(){
   

    var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition=="online") ? true: false}, function() {
      // if(!this.state.isOnline) {
      //   const dataManager = new DataManager()
      //   dataManager.getData("select * from services").then(response =>{
      //       if (response instanceof Array) {
      //           this.setState({serviceslist: response}, function(){
      //               console.log(this.state.employeelist)
      //           })
      //       }
           
      //   })
  
      // }
      // else {
        this.getServicesList()
      // }
    })

   
   
  }


  deleteRecord(detail, status){
   
    this.setState({ isLoading: true }, () => {
      var input = {
          status: status,
          sync_status: 0
      }
      this.ticketController.updateData({ table_name: 'services', data: input, query_field: 'sync_id', query_value: detail.id }).then(() => {
          this.setState({ msg: 'Updated successfully.', isLoading: false, }, () => {
              this.setState({ isSuccess: true });
              this.getServicesList();
          })
      })
  });
    // console.log(detail, status)
    // axios.post(config.root+`/inventory/services/saveorupdate`, {id:detail.id, status:status}).then(res=>{
    //   var status = res.data["status"];
    //   console.log(res.data)
    //   if(status === 200){
    //      this.setState({isSuccess: true})

    //       this.getServicesList();
    //   }

    //   else {
    //     this.setState({isSuccess: true})
    //       this.getServicesList();
        
    //   }
    // }).catch(err=>{      
    // })
  }

  getServicesList(){
    this.setState({isLoading: true});
    var businessdetail = window.localStorage.getItem('businessdetail');
    if(businessdetail !== undefined && businessdetail !== null){

// "select sync_id as id,sync_id,name, status, description, created_at, created_by, updated_at, updated_by, price, businessId, tax_type, cost, pricetype, sku, producttype, productcode   from services"
      this.dataManager.getData("select (select group_concat(name) from category where sync_id in (select category_id from services_category where service_id = s.id or service_id=s.sync_id and status='active') or id in (select category_id from services_category where service_id = s.id or service_id=s.sync_id and status='active')) as category_name, s.sync_id as id,s.name, s.status, s.description, s.created_at, s.created_by, s.updated_at, s.updated_by, s.price, s.businessId, s.tax_type, s.cost, s.pricetype, s.sku, s.producttype, s.productcode from services as s  order by s.created_at asc").then(response => {
        if (response instanceof Array) {
            this.setState({ serviceslist: response }, function () {
                this.setState({ isLoading: false });
            })
        }

    })
      // axios.get(config.root+`/inventory/servicesbybusiness/`+JSON.parse(businessdetail).id).then(res=>{
      //   this.setState({serviceslist:res.data.data,isLoading: false});
      // })
    }
    
  }
  handleCloseform(msg){
    this.setState({editForm:false,addForm:false}, function(){
        if(msg !== ''){
          this.setState({isSuccess: true})
        }
    })
  }

  openEdit(row){
    this.setState({selectedservice: row}, function(){
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

    <Grid container spacing={3}  style={{height:'calc(100% - 104px)', padding: 0, overflow:'auto'}}>
        <Grid item xs={12} style={{height:'100%', paddingRight:0}}> 
       
        { !this.state.editForm && !this.state.addForm ? 
        <Container maxWidth="xl"  style={{height:'100%'}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
            Products & Services
            </Typography>
            <ButtonContent
              onClick={()=>this.openAdd()}
              size="large" 
              variant="contained"
              label="Add Product / Service"
              startIcon={<Icon icon={plusFill} />}
            />
          </Stack>

          <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
          <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
              <TableContent style={{height: '100%'}} data={this.state.serviceslist} columns={this.state.columns} />
          </div></div>
        </Container> : ''
        }
        { this.state.editForm ?  <CreateProduct afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getServicesList();}} serviceSelected = {this.state.selectedservice} /> :  '' }
        { this.state.addForm ? <CreateProduct afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getServicesList();}} /> : '' }
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
