import React from "react";
import DataManager from '../../controller/datacontroller'; 
import axios from 'axios';
import config from '../../config/config';

import Footer from '../../components/Footer';
import LoadingModal from '../../components/Modal/loadingmodal';
import CommonModal from '../../components/Modal/commonmodal';

import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextFieldContent from '../../components/formComponents/TextField';
import ButtonContent from '../../components/formComponents/Button';

const section = {
  height: '100%',
  marginTop: 10, 
  display:'flex', 
  justifyContent:'center', 
  alignItems:'center',  
  width:'50%'
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataManager: new DataManager(),
      code:'',
      isSynced: false,
      syncData: "",
      msg : '',
      currentDateTime: new Date(),
      openDialog: false,
      isLoading: false,
    } 
  }

  componentDidMount(){  

  }


  handleCloseDialog(){
    this.setState({openDialog: false})
  } 

  onSubmit(){ 
    if(this.state.code.trim() !== ''){
      this.setState({isLoading: true})

      if(navigator.onLine) {
        axios.post(config.root+"business/sync/",{syncCode:this.state.code}).then(res=>{
        
          var status = res.data["status"];
          var data = res.data["data"]; 
          if(status === 200){ 
              if(data.length > 0){  
                window.localStorage.setItem("businessdetail", JSON.stringify(data[0])) 

                var synccodesql = `insert into business_detail(businessID,name,address,owner_name,syncCode,created_at) values('`+data[0].businessId+`','`+data[0].name+`','`+data[0].address+`','`+data[0].owner_name+`','`+data[0].syncCode+`','`+this.state.currentDateTime+`')`;
                
                this.state.dataManager.saveData(synccodesql).then((res)=>{ 
                })

                var logsql = `insert into sync_log(syncCode,businessID,created_at) values('`+data[0].syncCode+`','`+data[0].businessId+`','`+this.state.currentDateTime+`')`;
                this.state.dataManager.saveData(logsql).then((res)=>{ 
                }) 

                this.setState({isSynced:true,isLoading: false}, function(){
                  this.props.onSyncedBusiness();
                })
              }
              else{ 
                this.setState({msg: res.data.msg}, function(){
                  this.setState({openDialog: true,isLoading: false})
                })
              }
          }
          else{ 
            this.setState({msg: res.data.msg}, function(){
                this.setState({openDialog: true,isLoading: false})
            })
          }
      }).catch(err=>{       
        this.setState({openDialog: true,isLoading: false})
      })
      }
      else {
        this.setState({msg:"Please check your internet connection before syncing", openDialog: true, isLoading: false})
      }
      
    }
    else{
      this.setState({msg:"Please enter the code", openDialog: true})
    }
  }




  keyPress(e){ 
    if(e.which === 13){
      this.onSubmit() 
    }
 }

  render() {
    return (  
        <div>
            {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>} 
          <div>
            <div className='container synccontainer'>
                  <div style={section}>
                  <img className="launchScreen-logo" alt="logoImg" src="assets/images/logo.png"   
                          style={{objectFit: 'cover'}}/> 
                  </div>
                  <div  style={{display:'flex', justifyContent:'center', alignItems:'flex-start', flexDirection:'column', width:'50%'}}>
                  <Grid item xs={9} style={{display:'flex', justifyContent:'center', alignItems:'flex-start', flexDirection:'column'}}> 
                    <Grid item ><Typography variant="h6" noWrap > Enter Your Sync Code</Typography> </Grid> 
                    <Grid item  style={{marginTop: 20,display:'flex' }}>
                        <TextFieldContent id="code" label="Sync Code" type="text" value={this.state.code} onKeyPress={e=>{this.keyPress(e);}} onChange={(val) => { 
                          if(val.target.value.match("^.{7,7}$")==null) {
                            this.setState({code: val.target.value.toUpperCase()})}
                          } 
                        } 
                        />
                        <ButtonContent 
                              color="success"
                              size="medium"
                              variant="contained"
                              style={{marginLeft:'10px', color:'#fff'}}
                              onClick={()=>this.onSubmit()}
                              label="Submit"
                        />
                    </Grid>
                    <Grid item  style={{marginTop: 10}}><Typography variant="subtitle2" noWrap style={{color:'#808080'}}> This is your secret code for your business.</Typography>
                    <Typography variant="subtitle2" noWrap style={{color:' #808080'}}> You can get this code from your given login credentials.</Typography> </Grid> 

                  </Grid>
                  </div>
            </div>
            <CommonModal open={this.state.openDialog} onClose={()=>this.handleCloseDialog()} title="Error" contentText={this.state.msg} />
          </div> 
        <Footer/>
      </div>
    )
  }
}
