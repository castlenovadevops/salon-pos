import React from "react"; 
import axios from 'axios';
import config from '../../config/config';

import Footer from '../../components/Footer';
import LoadingModal from '../../components/Modal/loadingmodal'; 
import Moment from 'moment';
import {Card, CardContent,} from '@mui/material'; 
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from '@material-ui/core';
import { Typography } from '@material-ui/core'; 
import NumberPad from '../../components/numberpad';
import DataManager from "../../controller/datacontroller";

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
    
      this.state={
        oginInfo : true,
        passInfo : false,
        clockInfo: false,
        username : '',
        password : '',
        isLogin: false,
        isOnline: false,
        msg : '',
        openDialog: false,
        businessdetail:{},
        passcode : '',
        disabled: true,
        codeLength: 4,
        isLoading: false,
        dataManager: new DataManager()
    }
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.screenChange = this.screenChange.bind(this)
    this.onLoginSubmit = this.onLoginSubmit.bind(this)
    this.onLoginLocal = this.onLoginLocal.bind(this)
    this.clockinoutComplete = this.clockinoutComplete.bind(this) 
    this.handleChangeCode = this.handleChangeCode.bind(this);
  }

  handleCloseDialog(){
    this.setState({openDialog:false, msg: '',isLoading: false}, function() {
        this.clearPasscode()
    })
  }

  onLoginSubmit(){ 
    this.setState({isLoading: true})
    axios.post(config.root+"employee/login/", {passcode:this.state.passcode, businessId:this.state.businessdetail.id}).then(res=>{
        var status = res.data["status"];
        var data = res.data["data"];
       
        if(status === 200){ 
            if(data.length > 0){ 
                window.localStorage.setItem("employeedetail", JSON.stringify(data[0]))
                
                let time = new Date()
                this.state.dataManager.saveData("update staff_clockLog set isActive=0 where staff_id="+data[0].id).then(r=>{ 

                 


                    window.api.getSyncUniqueId().then(syun=>{
                        var synccodesql = `insert into staff_clockLog(staff_id,passcode,clockin_out,reason,time, isActive,sync_status, sync_id) values('`+
                        +data[0].id+`','`+this.state.passcode+`','`+"Clock-in"+`','`+""+`','`+ Moment().format('YYYY-MM-DDTHH:mm:ss')+`', 1`+`,0`+`,`+"'"+syun.syncid+"'"+`)`;
                       console.log("synccodesql",synccodesql)
   
                       this.state.dataManager.saveData(synccodesql).then((res)=>{

                        var qq = "update users set clocked_status="+"'"+"Clock-in"+"'"+" where id="+"'"+data[0].id+"'"
                           this.state.dataManager.saveData(qq).then((res)=>{
                            setTimeout(function() { 
                                this.setState({isLogin: true,isLoading: false}, function(){
                                  this.props.onLoggedIn();
                                }) 
                            }.bind(this), 1000);
                           })
                           
                       })
   
                       })

                });
                
            }
            else{
                this.setState({openDialog:true, msg: 'Invalid credentials.',isLoading: false})
            }

        }else{
            this.setState({openDialog:true, msg: 'Something Went Wrong !',isLoading: false})
        }
    })
}

onLoginLocal() {
    this.setState({isLoading: true})
    this.state.dataManager.getData("select *,u2.id as uid,u1.id as bid,u1.business_owner_id from user_business as u1 JOIN users as u2 on u1.business_owner_id = u2.id where passcode="+this.state.passcode).then(res=>{
        if(res.length>0) {
            let data = res[0]
            let userdata = {}
            userdata["clocked_status"] = data["clocked_status"]
            userdata["created_at"] = data["created_at"]
            userdata["created_by"] = data["created_by"]
            userdata["email"] = data["email"]
            userdata["firstName"] = data["firstName"]
            userdata["id"] = data["uid"]
            userdata["lastName"] = data["lastName"]
            userdata["mobile"] = data["mobile"]
            userdata["passcode"] = data["passcode"]
            userdata["password"] = data["password"]
            userdata["staff_role"] = data["staff_role"]
            userdata["status"] = data["status"]
            userdata["updated_at"] = data["updated_at"]
            userdata["userName"] = data["userName"]
            userdata["updated_by"] = data["updated_by"]
            userdata["userType"] = data["userType"]
            userdata["user_passcode"] = data["user_passcode"]

           

            window.localStorage.setItem("employeedetail", JSON.stringify(userdata))
                
            let time = new Date()
            this.state.dataManager.saveData("update staff_clockLog set isActive=0 where staff_id="+userdata.uid).then(r=>{ 
               
               

                window.api.getSyncUniqueId().then(syun=>{
                    var synccodesql = `insert into staff_clockLog(staff_id,passcode,clockin_out,reason,time, isActive,sync_status, sync_id) values('`+
                    +userdata.id+`','`+this.state.passcode+`','`+"Clock-in"+`','`+""+`','`+ Moment().format('YYYY-MM-DDTHH:mm:ss')+`', 1`+`,0`+`,`+"'"+syun.syncid+"'"+`)`;
                   console.log("synccodesql",synccodesql)

                   this.state.dataManager.saveData(synccodesql).then((res)=>{

                    var qq = "update users set clocked_status="+"'"+"Clock-in"+"'"+" where id="+"'"+userdata.id+"'"
                           this.state.dataManager.saveData(qq).then((res)=>{
                            setTimeout(function() { 
                                this.setState({isLogin: true,isLoading: false}, function(){
                                  this.props.onLoggedIn();
                                }) 
                            }.bind(this), 1000);
                           })
                       
                   })

                })


            });
          
        }
        else{
            this.setState({openDialog:true, msg: 'Invalid credentials.',isLoading: false})
        }

      })
}

clockinoutComplete() {
    //console.log("clockinoutComplete")
}


screenChange = (value) => (event) => {
    if(value === 'Login'){
        this.setState({
            loginInfo : true,
            passInfo : false,
            clockInfo: false,
        })
    }else if(value === 'passcode'){
        this.setState({
            loginInfo : false,
            passInfo : true,
            clockInfo: false,
        })
    }else{
        this.setState({
            loginInfo : false,
            passInfo : false,
            clockInfo: true,
        })
    }
};

componentDidMount(){
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && (detail !== 'undefined' || detail === "")){
        businessdetail = JSON.parse(detail);
        this.setState({businessdetail:businessdetail}, function(){
            document.title = this.state.businessdetail.name+ ' - The Finest Salon Management Platform (Development)';
        })
    }
}

handleChangeCode(code){
    // this.setState({passcode:code});

    if(code === "remove") {
        this.setState({passcode: code, disabled: true});
    }
    else if(code.length === this.state.codeLength) {
        const stringData = code.reduce((result, item) => {
            return `${result}${item}`
        }, "") 
        this.setState({passcode: stringData, disabled: false}); 
    }
}


clearData() {

    window.localStorage.removeItem("employeedetail")
    window.localStorage.removeItem("businessdetail")
    window.localStorage.removeItem("synced")
    setTimeout(()=>{
        window.location.reload();
    })

}

render() {
    return(
        <div>
            {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>} 
            <div>
                <div className='container synccontainer'>
                    <div style={section} >
                        <img className="launchScreen-logo" alt="logoImg" src="assets/images/logo.png"   style={{objectFit: 'cover'}}/> 
                    </div>
                    <div  style={{display:'flex', justifyContent:'center', alignItems:'flex-start', flexDirection:'column', width:'40%'}}> 
                        <Card style={{borderRadius: 16, boxShadow:'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}}>
                            <CardContent style={{marginTop: 0, marginBottom: 0}}>
                                
                                <Typography variant="h6" align="center">  
                                {this.state.businessdetail.name}
                                </Typography>
                                <Typography variant="h6" align="center" color="textSecondary"> Enter the passcode to access this POS </Typography>
                                <form>
                                    <Grid container spacing={3} style={{marginTop: 0}}>
                                        <Grid item xs={12}>
                                            <NumberPad codeLength='4' textLabel='Enter code' handleChangeCode={this.handleChangeCode} 
                                            onSubmit={()=> {
                                                var condition = navigator.onLine ? 'online' : 'offline';
                                                this.setState({isOnline: (condition=="online") ? true: false}, function (){
                                                    if(this.state.isOnline) {
                                                        this.onLoginSubmit()
                                                    }
                                                    else {
                                                        this.onLoginLocal()
                                                    }
                                                })
                                            }
                                            
                                            
                                            } clearPasscode={clearPasscode => this.clearPasscode  = clearPasscode}/>
                                        </Grid> 
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                        
                        <Dialog
                                    open={this.state.openDialog}
                                    onClose={this.handleCloseDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {this.state.msg}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Please Try Again Later
                                    </DialogContentText>
                                        </DialogContent>
                                    <DialogActions>
                                        <Button onClick={()=>this.handleCloseDialog()}> OK </Button>
                                    </DialogActions>
                        </Dialog>  
                    </div> 
                </div>
                

                <Footer/>
            </div>
        </div>
    )
}
 
}
