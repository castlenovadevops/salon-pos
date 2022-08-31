// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Stack, Container, Typography, Grid } from '@mui/material';

// components
import ButtonContent from '../../../components/formComponents/Button';
import TableContent from '../../../components/formComponents/DataGrid';
import LoaderContent from '../../../components/formComponents/LoaderDialog';  
import DiscountForm from './addForm';

import AppBarContent from '../../TopBar';
import DrawerContent from '../../Drawer';
import config from '../../../config/config'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DataManager from '../../../controller/datacontroller'
import TicketController from '../../../controller/TicketController'

export default class DefaultDiscount extends React.Component {
  dataManager= new DataManager();
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state = {
        default_discountlist:[],
        addForm: false,
        editForm: false,
        isOnline: false,
        isSuccess: false,
        selectedDiscount:{},
        columns:[
        {
            field: 'owner_percentage',
            headerName: 'Owner Percentage',
            minWidth: 300,
            editable: false,
            renderCell: (params) => (
            <div>
                {params.row.owner_percentage} %
            </div>
            )
        },
        {
            field: 'employee_percentage',
            headerName: 'Employee Percentage',
            minWidth: 300,
            editable: false,
            renderCell: (params) => (
            <div>
                {params.row.employee_percentage} %
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
                <ButtonContent color="success" variant="contained" size="small" onClick={()=>this.openEdit(params.row)} label="Edit" disabled={!this.state.isOnline}/>
                }            
            
            </strong>
            ),
        }
        ],
        isLoading: false,
        businessdetail:{},
        mastertables:[]
    };


    
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);
  }
  componentDidMount(){
   
    var detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== null){
      var businessdetail = JSON.parse(detail);
      var condition = navigator.onLine ? 'online' : 'offline';
      this.setState({isOnline: (condition==="online") ? true: false}, function(){
        if(!this.state.isOnline) {
          const dataManager = new DataManager() 
          dataManager.getData("select * from default_discount_division where businessId="+businessdetail["id"]).then(response =>{
              if (response instanceof Array) {
                  this.setState({default_discountlist: response}, function(){
                    this.setState({selectedDiscount:this.state.default_discountlist[0]}, ()=>{
                      console.log(this.state.selectedDiscount); 
                    })
                  })
              }
            
          })
    
        }
        else {
          this.setState({mastertables:[{
            name: "default_discount_division",
            tablename: 'default_discount_division',
            progressText: "Synchronizing Discount Division...",
            progresscompletion: 10,
            url: config.root + `/settings/default_discount/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
            syncurl:''
        } ]},()=>{

          this.getDef_DiscountList();
          })
        }
      })

    }
      
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


  getDef_DiscountList(){
        this.setState({isLoading: true});
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
          this.setState({businessdetail:JSON.parse(businessdetail)});
            axios.get(config.root+`/settings/default_discount/list/`+JSON.parse(businessdetail).id).then(res=>{ 
                // this.setState({default_discountlist:res.data.data,isLoading: false});
                this.setState({default_discountlist:res.data.data,isLoading: false}, ()=>{
                  this.setState({selectedDiscount:this.state.default_discountlist[0]}, ()=>{
                    console.log(this.state.selectedDiscount);
                    this.syncMasterData(0);
                  })
                });
            })
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
       
        {/* { !this.state.editForm && !this.state.addForm ? */}
        <Container maxWidth="xl" style={{height: '100%'}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
            Default Discount Division
            </Typography>
            {/* <ButtonContent
              onClick={()=>this.openAdd()}
              size="large"
              variant="contained"
              label="Add Discount Division"
              disabled={!this.state.isOnline}
              startIcon={<Icon icon={plusFill} />}
            /> */}
          </Stack>

          {/* <Card style={{height: '80%'}}>
              <TableContent style={{height: '100%'}} data={this.state.default_discountlist} columns={this.state.columns} />
          </Card> */}
             {this.state.default_discountlist.length > 0 ?  
             <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '40%',background: 'white', marginTop: 20, width:'60%'}}>
             <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
             <DiscountForm afterSubmit={(msg)=>{this.handleCloseform(msg); this.getDef_DiscountList();}} discountToEdit = {this.state.selectedDiscount} />
             </div></div> :
             
             <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '40%',background: 'white', marginTop: 20, width:'60%'}}>
             <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
             <DiscountForm afterSubmit={(msg)=>{this.handleCloseform(msg); this.getDef_DiscountList();}} />  </div></div> }

        </Container> 
        {/* // : ''
        // }
        // { this.state.editForm ?  <CreateDiscount afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getDef_DiscountList();}} discountSelected = {this.state.selectedDiscount} /> :  '' }
        // { this.state.addForm ? <CreateDiscount afterSubmitForm={(msg)=>{this.handleCloseform(msg); this.getDef_DiscountList();}} /> : '' } */}
      </Grid>
      </Grid> 

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
