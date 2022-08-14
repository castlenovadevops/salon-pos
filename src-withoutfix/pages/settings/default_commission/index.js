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
import CommissionForm from './addForm';

import AppBarContent from '../../TopBar';
import DrawerContent from '../../Drawer';
import config from '../../../config/config'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DataManager from '../../../controller/datacontroller'

import TicketController from '../../../controller/TicketController'
export default class Commission extends React.Component {
  dataManager= new DataManager();
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state = {
        businessdetail:{},
        commissionlist:[],
        isSuccess: false,
        addForm: false,
        editForm: false,
        isOnline: false,
        selectedcommission:{},
        columns:[
            
        {
          field: 'owner_percentage',
          headerName: 'Owner Percentage',
          minWidth: 200,
          editable: false,
          renderCell: (params) => (
          <div>
              {params.row.owner_percentage} %
          </div>
          )
      },
      {
          field: 'emp_percentage',
          headerName: 'Employee Percentage',
          minWidth: 200,
          editable: false,
          renderCell: (params) => (
          <div>
              {params.row.emp_percentage} %
          </div>
          )
      },  
        {
            field: 'cash_percentage',
            headerName: 'Cash Percentage',
            minWidth: 200,
            editable: false,
            renderCell: (params) => (
            <div>
                {params.row.cash_percentage} %
            </div>
            )
        },
        {
            field: 'check_percentage',
            headerName: 'Check Percentage',
            minWidth: 200,
            editable: false,
            renderCell: (params) => (
            <div>
                {params.row.check_percentage} %
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
                <ButtonContent color="success" variant="contained" size="small" onClick={()=>this.openEdit(params.row)} label="Edit"  disabled={!this.state.isOnline}/>
                
                }            
            
            </strong>
            ),
        }
        ],
        isLoading: false,
        mastertables:[]
    };
    
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);
  }
  componentDidMount(){
   
      let detail = window.localStorage.getItem("businessdetail");
      this.setState({businessdetail: JSON.parse(detail)}, ()=>{
       
      })


      this.setState({mastertables:[
        {
          name: "default_commission",
          tablename: 'default_commission',
          progressText: "Synchronizing Commission...",
          progresscompletion: 10,
          url: config.root + `/settings/default_commission/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
          syncurl:''
        } 
      ]} );

      var condition = navigator.onLine ? 'online' : 'offline';
      this.setState({isOnline: (condition=="online") ? true: false}, function (){
        if(!this.state.isOnline) {
          const dataManager = new DataManager()
          dataManager.getData("select * from default_commission").then(response =>{
              if (response instanceof Array) {
                  this.setState({commissionlist: response}, function(){
                      if(this.state.commissionlist.length> 0){
                        this.setState({selectedcommission:this.state.commissionlist[0]},()=>{
                        });
                      }
                  })
              }
             
          })
  
        }
        else{
          this.getCommisionList();
        }
      })

     
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



    getCommisionList(){
       this.setState({isLoading: true});
        var userdetail = window.localStorage.getItem('employeedetail');
        if(userdetail !== undefined && userdetail !== null){
            axios.get(config.root+`/settings/default_commission/list/`+this.state.businessdetail.id).then(res=>{ 
                this.setState({commissionlist:res.data.data,isLoading: false}, function(){ 
                  console.log(this.state.commissionlist.length)
                  if(this.state.commissionlist.length> 0){
                    this.setState({selectedcommission:this.state.commissionlist[0]},()=>{
                      console.log(this.state.selectedcommission);

                this.syncMasterData(0);

                    });
                  }
                });
            })
        }
    }
    
    handleCloseform(msg){
        this.setState({editForm:false,addForm:false}, function(){
            if(msg !== ''){
              
              this.setState({isSuccess: true})
            }
            this.getCommisionList();
        })
      }
    
      openEdit(row){
        this.setState({selectedcommission: row}, function(){
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
            Default Commission Payment
            </Typography>
            {/* <ButtonContent
              onClick={()=>this.openAdd()}
              size="large"
              variant="contained"
              label="Add Commission Payment"
              disabled={!this.state.isOnline}
              startIcon={<Icon icon={plusFill} />}
            />
          </Stack>

          <Card style={{height: '80%'}}>
              <TableContent style={{height: '100%'}} data={this.state.commissionlist} columns={this.state.columns} />
          </Card> */}
          </Stack>
         

          
          {this.state.commissionlist.length > 0 ? 

<div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '50%',background: 'white', marginTop: 20, width:'60%'}}>
<div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
              <CommissionForm afterSubmit={(msg)=>{this.handleCloseform(msg);}} commissionToEdit={this.state.selectedcommission}/> 
              </div></div>
                :
                <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '50%',background: 'white', width:'60%'}}>
                <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
                 <CommissionForm afterSubmit={(msg)=>{this.handleCloseform(msg);}}/>  </div></div>
                 
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
