// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios'; 
// material
import {  Stack, Container, Typography, Grid, Switch } from '@mui/material';

// components
import ButtonContent from '../../../components/formComponents/Button'; 
import LoaderContent from '../../../components/formComponents/LoaderDialog';  
import DiscountForm from './addForm';

import AppBarContent from '../../TopBar';
import DrawerContent from '../../Drawer';
import config from '../../../config/config'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DataManager from '../../../controller/datacontroller'
import TicketController from '../../../controller/TicketController'

export default class ShopSettings extends React.Component {
  dataManager= new DataManager();
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state = {
        settings:[
          {
            settingName:"resetTicketCode",
            settingStatus:"disabled"
          }
        ],
        addForm: false,
        editForm: false,
        isOnline: false,
        isSuccess: false, 
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
   
    var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition==="online") ? true: false}, function(){
      if(!this.state.isOnline) {
        const dataManager = new DataManager() 
        dataManager.getData("select * from merchant_settings").then(response =>{
            if (response instanceof Array) {
              if(response.length > 0){
                this.setState({settings: response}, function(){ 
                })
              } 
            }
           
        })
  
      }
      else {
        this.setState({mastertables:[{
          name: "merchant_settings",
          tablename: 'merchant_settings',
          progressText: "Synchronizing Shop Settings...",
          progresscompletion: 10,
          url: config.root + `/merchantsettings/getSettings/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
          syncurl:''
      } ]},()=>{  
        this.getSettings();
        })
      }
    })

  
    
  }


  getSettings(){
    this.setState({isLoading: true});
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
          this.setState({businessdetail:JSON.parse(businessdetail)});
            axios.get(config.root+`/merchantsettings/getSettings/`+JSON.parse(businessdetail).id).then(res=>{ 
                // this.setState({default_discountlist:res.data.data,isLoading: false});
                if(res.data.data.length >0){
                  this.setState({settings:res.data.data,isLoading: false}, ()=>{ 
                      this.syncMasterData(0); 
                  });
                }
                else{
                  this.setState({isLoading: false}, ()=>{ 
                    
                  });
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
        
        <Container maxWidth="xl" style={{height: '100%'}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
            <Typography variant="h4" gutterBottom>
             Settings
            </Typography> 
          </Stack> 
          {
            this.state.settings.map(elmt=>{
              return <>
                  <div>{elmt.settingName}</div> 
                  <div>{elmt.settingStatus}</div> 
              </>
            })
          }
        </Container> 
       
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
