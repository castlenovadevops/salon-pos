import React from 'react'; 
import Grid from '@material-ui/core/Grid'; 
import NumberPad from '../../components/numberpad'; 
import axios from 'axios'; 
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DataManager from '../../controller/datacontroller';
import config from '../../config/config';
import LoadingModal from '../../components/Modal/loadingmodal';
import { Card, CardContent,  Stack, Container, Typography,TextField ,IconButton, Button, 
    Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, FormControl,FormLabel, FormControlLabel, RadioGroup, Radio, InputLabel, Chip, Input, Checkbox }
     from '@mui/material';
import Moment from 'moment';
import TicketController from '../../controller/TicketController';

class ClockInOut extends React.Component {
    ticketController = new TicketController();
    constructor(props){
        super(props)
        this.state = {
            clockin: [],
                passcode: '',
                clockoutOptions: [],
                reason: '',
                reasonid:0,
                dataManager: new DataManager(),
                businessdetail:{},
                disabled: true,
                codeLength: 4,
                isLoading: false,
                isOnline: false,
                errorMsg : "",
                openDialog: false,
                msg: '',
            }
            this.handleChangeCode = this.handleChangeCode.bind(this)
            this.handleClockoutOptionschange = this.handleClockoutOptionschange.bind(this)
            this.onClockinout = this.onClockinout.bind(this)
            this.onClockinSubmit = this.onClockinSubmit.bind(this) 
            this.handleCloseDialog = this.handleCloseDialog.bind(this)
      }


      handleCloseDialog(){
        this.setState({openDialog:false, msg: '',isLoading: false}, function(){
            this.clearPasscode()
        })
    }


   
    componentDidMount(){
        //console.log("ClockInOut -- componentDidMount")
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            this.setState({businessdetail:businessdetail}, function(){ 
                
                
            })
        }

        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({isOnline: (condition=="online") ? true: false})

        
    }

    
    
    handleChangeCode(passcode){
         //console.log("clockinout", passcode)
        
        if(passcode === "remove") {
            this.setState({passcode: passcode, disabled: true});
        }
        else if(passcode.length === this.state.codeLength) {
            const stringData = passcode.reduce((result, item) => {
                return `${result}${item}`
            }, "")

            this.setState({passcode: stringData, disabled: false});
        }
        

    }
    
    handleClockoutOptionschange(e){
            this.setState({reasonid:  e.target.value }, function(){
                this.state.clockoutOptions.forEach(element => {
                    if(element.id === this.state.reasonid){
                        this.setState({reason:element.option}, function(){
                            ////console.log(this.state.reason)
                        })
                    }
                });
            });
    }
    
    onClockinout(clockin){
        if(this.state.passcode.length === 0) {
            alert('Please enter Passcode !')
        }
        else {
            //console.log("onClockinout")
            this.getActiveClockinDetails()
            
        }
    }

    getActiveClockinDetails() {
        this.saveClockinLocal()

        // if(this.state.isOnline) {
        //     this.setState({isLoading: true})
        //     axios.post(config.root+'employee/getStaffId/', {passcode: this.state.passcode, businessId:this.state.businessdetail.id}).then(res=>{
        //         var status = res.data["status"];
        //         var data = res.data["data"];
        //         var msg = res.data["msg"];
        //         //console.log("1.getActiveClockinDetails",status, data)
        //         if(status === 200){
        //             if(data.length>0) {
        //                 //console.log("2.getActiveClockinDetails")
        //                 let staffId = data[data.length-1].id
        //                 axios.post(config.root+'employee/getActiveClockInDetails/', {staff_id: staffId}).then(res=>{
                           
        //                     var data = res.data["data"];
        //                     //console.log("3.getActiveClockinDetails", data)
        //                     if(data.length===0) {
        //                         //console.log("4.getActiveClockinDetails")
        //                         this.saveClockinDetails("Clock-in")
        //                     }
        //                     else {
                                
        //                         // ////console.log("getActiveClockInDetails", data[0].status, this.state.reason)
        //                         let status = data[0].status
                                
        //                         if(status === 'Clock-in') {
        //                             //console.log("6.tobe out")
        //                             this.saveClockinDetails("Clock-out")
        //                         }
        //                         else if(status === 'Clock-out') {
        //                             //console.log("6.tobe clockin")
        //                             this.saveClockinDetails("Clock-in")
    
        //                         }
        //                         //console.log("5.getActiveClockinDetails",status)
    
        //                     }
        //                 });
        //             }
    
        //             else {
        //                 this.setState({isLoading: false,  openDialog:true, msg: 'You are not authorized to access reports.'}, function() {
                           
        //                     // setTimeout(function(){ 
        //                     //     alert('Something Went Wrong. Please enter correct Passcode !')
        //                     //     console.log("after clear")
        //                     //     this.clearPasscode()
                               
        //                     // },100);
        //                 })
                        
                        
        //             }
        //         }
        //     })
        // }
       

        // else {

          
        //    this.saveClockinLocal()
        // }
     }


    //  getClockinDetailsFromUsers(id) {
    //     let query = "select * from users where id="+id
    //     this.state.dataManager.getData(query).then(response =>{
    //         if(response.length>0) {
    //             clockin_status = response[response.length-1].clocked_status
    //         }
    //     })


    //  }

    checkLoginUser(input) {
        if(input["status"] == "Clock-out") {
            let staff_id = input["staff_id"]
            var employeedetail = window.localStorage.getItem("employeedetail") 
            let login_id = JSON.parse(employeedetail).id
           //console.log("checkLoginUser",staff_id,login_id)
           if(staff_id == login_id) {
               window.localStorage.removeItem("employeedetail")

               setTimeout(() => {
                   window.location.reload();
               },100);
           }
            

        }
    }
 
     saveClockinLocal() {
        this.setState({isLoading: true})

        

        /** check the selected techi passcode  */

        if(this.props.selectedTechi.passcode != undefined) {
            if(this.props.selectedTechi.passcode == this.state.passcode) {
                this.performClockin()
            }
            else {
                this.setState({isLoading: false,  openDialog:true, errorMsg: "Invalid code"  }, function() {
                })
            }
        }
        else{
            this.performClockin()
        }
       
        console.log("this.props.selectedTechi.passcode",this.props.selectedTechi.passcode, this.state.passcode)
       
     }

     performClockin() {
        var clockin_status = "Clock-in"
        let query = "select * from users where passcode='"+this.state.passcode+"'"
        this.state.dataManager.getData(query).then(response =>{
            console.log("user_passcode::",query,response)
            
            if(response.length>0){
                var staff_id = response[0].id
                var sql = "select * from staff_clockLog  where staff_id="+response[response.length-1].id
                // console.log("staff_clockLog",sql)
                this.state.dataManager.getData(sql).then(response =>{
                    
                    if(response.length==0){
                        
                        // / ** getClockinDetailsFromUsers **/
                        let query = "select * from users where id="+staff_id
                        this.state.dataManager.getData(query).then(userresponse =>{
                            console.log("get from users",userresponse.length)

                            if(userresponse.length>0) {
                                if( userresponse[0].clocked_status == "Clock-in") {
                                    clockin_status = "Clock-out"
                                }
                                else if(userresponse[0].clocked_status == "Clock-out") {
                                    clockin_status = "Clock-in"
                                }
                               
                            }
                        })

                    }
                    else {
                        // console.log("clockin_status", response[response.length-1].clockin_out)
                        if(response[response.length-1].clockin_out == "Clock-in") {
                            clockin_status = "Clock-out"
                        }
                        else if(response[response.length-1].clockin_out == "Clock-out") {
                            clockin_status = "Clock-in"
                        }
                       
                    }

                    window.api.getSyncUniqueId().then(syun=>{
                        var synccodesql = `insert into staff_clockLog(staff_id,passcode,clockin_out,reason,time, isActive,sync_status, sync_id) values('`+
                       staff_id+`','`+this.state.passcode+`','`+clockin_status+`','`+""+`','`+ Moment().format('YYYY-MM-DDTHH:mm:ss')+`', 1`+`,0`+`,`+"'"+syun.syncid+"'"+`)`;
                    //    console.log("synccodesql",synccodesql)
                        var input = {
                            staff_id:staff_id,
                            passcode: this.state.passcode,
                            clockin_out:clockin_status,
                            reason:'',
                            time:Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            isActive:1, 
                            sync_status:0,
                            sync_id:syun.syncid
                        }
                    //    this.state.dataManager.saveData(synccodesql).then((res)=>{
                        this.ticketController.saveData({table_name:'staff_clockLog', data: input}).then(res=>{
                           console.log("after save")
                           var qq = "update users set clocked_status="+"'"+clockin_status+"'"+" where id="+"'"+staff_id+"'"
                           this.state.dataManager.saveData(qq).then((res)=>{
                               
                               this.props.afterFinished()

                               var input = {
                                staff_id: staff_id,
                                passcode:this.state.passcode,
                                time: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                status : clockin_status,
                                isActive: true
                                }    

                               setTimeout(() => {
                                this.checkLoginUser(input)
                               },1000);

                           })
                       })
   
                       })
                   
                   
                   
                })
            }
            else {
                this.setState({isLoading: false,  openDialog:true, errorMsg:"Invalid code"  }, function() {
                })
            }
        })
     }

     updateData(obj) {
        var sqlQuery = `UPDATE `+obj.table_name+` set `;
        Object.keys(obj.data).forEach((val, i) => {
            if(obj.data[val] != undefined){
                if(i > 0){
                    sqlQuery  +=",";
                }
                sqlQuery += val +"="+(typeof obj.data[val] == 'string' ? (val != 'password' ? `'${obj.data[val].replace("'","''").trim()}'` : `md5('${obj.data[val]}')`) : `${obj.data[val]}`)
            }
        });
        if(typeof obj.query_value ==='string'){
            sqlQuery += " where "+obj.query_field+"='"+obj.query_value+"'";  
        }
        else{
            sqlQuery += " where "+obj.query_field+"="+obj.query_value;  
        }
        return sqlQuery
     }

     checkLoginUser(input) {
         if(input["status"] == "Clock-out") {
             let staff_id = input["staff_id"]
             var employeedetail = window.localStorage.getItem("employeedetail") 
             let login_id = JSON.parse(employeedetail).id
            //console.log("checkLoginUser",staff_id,login_id)
            if(staff_id == login_id) {
                window.localStorage.removeItem("employeedetail")

                setTimeout(() => {
                    window.location.reload();
                },100);
            }
             

         }
        

     }

   


     onClockinSubmit() {
        const clockin = this.state.clockin
        if (clockin.length===0) {
            this.onClockinout("clock-in")
        }
        else if(clockin[clockin.length-1].status === "Clock-out"){
            this.onClockinout("clock-in")
        }
        else {
            this.onClockinout("clock-out")
        }

     }


     render() {

        const clockin = this.state.clockin
        const renderclockinButton = () => {
            if (clockin.length===0) {
              return <Grid item xs={5}> 
              {/* <Button fullWidth style={{marginTop:10}} color='secondary' variant="contained" onClick={()=>this.onClockinout("clock-in")} disabled={this.state.disabled}>Clock In/Out</Button>  */}
              </Grid>
            } 
            else if(clockin[clockin.length-1].status === "Clock-out"){
                return <Grid item xs={5}> 
                {/* <Button fullWidth style={{marginTop:10}} color='secondary' variant="contained" onClick={()=>this.onClockinout("clock-in")} disabled={this.state.disabled}>Clock In/Out</Button>  */}
                </Grid>
            }
            else {
            
              return <div >
                    <Grid container  spacing={2}>
                    {/* <Grid item xs={12} style={{display:'flex'}}> */}
                        <Grid item xs={12} style={{display: 'none'}}>
    

                            <Select
                                fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.reasonid}
                                    name="reason"
                                    label="Reason"
                                    onChange={(e)=>{
                                        this.handleClockoutOptionschange(e);
                                    }}>               
                                    {this.state.clockoutOptions.map(item => (
                                        <MenuItem value={item.id}>{item.option}</MenuItem>
                                    ))}           
                            </Select>
                                    
                        </Grid>
                        <Grid item xs={12}>
                            {/* <Button fullWidth color='secondary'  variant="contained" onClick={()=>this.onClockinout("clock-out")} disabled={this.state.disabled}>Clock In/Out</Button> */}
                        </Grid>
                        </Grid>
              {/* </Grid> */}
              </div>
            
            }
        }
        return(
            <div>
                {/* <Typography style={{boxShadow: '0px 2px 1px 0 rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 1px 0px rgb(0 0 0 / 12%)'}}  id="modal-modal-title" variant="h6" component="h2" align="center">Clock In/Out </Typography>
                                             */}

                {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}             
                <Grid container spacing={2}>
                
                    <Grid item xs={12}>
                        <NumberPad codeLength='4' textLabel='Enter code' handleChangeCode={this.handleChangeCode} onSubmit={()=>this.onClockinSubmit()} 
                        clearPasscode={clearPasscode => this.clearPasscode  = clearPasscode}/>
                
                    </Grid>
                    <Grid item xs={12} container justify = "center">
                        {renderclockinButton()}
                      
                    </Grid>
                </Grid>



                <Dialog
                                    open={this.state.openDialog}
                                    onClose={this.handleCloseDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    style={{borderRadius:'10px'}}
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {/* {this.state.msg} */}
                                             {this.state.errorMsg}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <Typography variant="subtitle2" >Please Try Again Later</Typography>
                                    </DialogContentText>
                                        </DialogContent>
                                    <DialogActions>
                                        <Button variant="contained" onClick={()=>this.handleCloseDialog()}> OK </Button>
                                    </DialogActions>
                        </Dialog>  
                    
            </div   >   
        )
     }


}
export default ClockInOut;