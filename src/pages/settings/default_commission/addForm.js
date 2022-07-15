import React from 'react';
// material
import { Stack,InputAdornment,Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// components
import TextFieldContent from '../../../components/formComponents/TextField';
// import TextAreaContent from '../../../components/TextArea';
import ButtonContent from '../../../components/formComponents/Button';
import LoaderContent from '../../../components/formComponents/LoaderDialog';
import config from '../../../config/config' 
import TicketController from '../../../controller/TicketController';
import DataManager from '../../../controller/datacontroller';
export default class CommissionForm extends React.Component {
    ticketController = new TicketController();
    dataManager = new DataManager();
    constructor(props) {
        super(props);
        this.state = {
            owner_percentage:"",
            emp_percentage:"",
            cash_percentage:"",
            check_percentage:"",
            isActive:1,
            userdetail:{},
            businessdetail:{},
            isDisable: true, 
            commissionSelected:{},
            isEdit: false,
            perAlert_Open: false,
            alert_msg:'',
            isLoading: false,
            isOnline: false,
            offlineCheckAlert: false,
        };
        this.handlechange = this.handlechange.bind(this);
        this.handleclose = this.handleclose.bind(this);
        this.handleCloseAlert = this.handleCloseAlert.bind(this);
    }
    componentDidMount(){
        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({isOnline: (condition==="online") ? true: false})

        setTimeout(() => { 
            if(this.props.commissionToEdit !== undefined){
                this.setState({commissionSelected: this.props.commissionToEdit,isEdit : true}, function(){
                    let statevbl = this.state
                    statevbl = this.state.commissionSelected;
                    this.setState(statevbl);
                    // if(!this.state.isOnline){
                    //     this.setState({isDisable: true});
                    // }else{
                    //     this.setState({isDisable: false});
                    // }
                })
            }
        }, 100);
        var userdetail = window.localStorage.getItem('employeedetail');
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(userdetail !== undefined && userdetail !== null){
            this.setState({userdetail:JSON.parse(userdetail), businessdetail:JSON.parse(businessdetail)})
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.commissionToEdit !== prevState.commissionSelected ) {
            console.log("prop update", nextProps.commissionToEdit) 
            if(nextProps.commissionToEdit !== undefined){
            var obj = { commissionSelected: nextProps.commissionToEdit,  owner_percentage:nextProps.commissionToEdit.owner_percentage,
                emp_percentage:nextProps.commissionToEdit.emp_percentage,
                cash_percentage:nextProps.commissionToEdit.cash_percentage,
                check_percentage:nextProps.commissionToEdit.check_percentage,
                isActive:nextProps.commissionToEdit.isActive,isDisable:false }
                console.log(obj)
            return obj;
            }
            else{
                return {};
            }
        } 
    }

    handlekeypress(e){
       
        if(e.target.name === "check_percentage"   || e.target.name === "cash_percentage" || e.target.name === "owner_percentage"   || e.target.name === "emp_percentage"){
            if(e.key === 'e'  || e.key === "+" || e.key === "-"){
                e.preventDefault();
            }
            if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) {
                e.preventDefault();
               
            }
        }
    }

    setCalculationValues(e) {
        if(e.target.name === "owner_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({emp_percentage: Number(value).toFixed(2)},function(){
                this.handleValidation();

            })
        }
        else if(e.target.name === "emp_percentage") {
            var value1 = (100)-Number(e.target.value)
            this.setState({owner_percentage:  Number(value1).toFixed(2)},function(){
                this.handleValidation();

            })
        }
        else if(e.target.name === "cash_percentage") {
            var value2 = (100)-Number(e.target.value)
            this.setState({check_percentage: Number(value2).toFixed(2)},function(){
                this.handleValidation();

            })
        }
        else if(e.target.name === "check_percentage") {
            var value3 = (100)-Number(e.target.value)
            this.setState({cash_percentage:  Number(value3).toFixed(2)},function(){
                this.handleValidation();

            })
        }
      

    }


    handlechange(e){
        if(e.target.name === "check_percentage"   || e.target.name === "cash_percentage" || e.target.name === "owner_percentage"   || e.target.name === "emp_percentage"){
         
            if((e.target.value.match( "^.{"+config.inputpercentage+","+config.inputpercentage+"}$")===null) && e.target.value<=100 ) {
              let statevbl = this.state
              statevbl[e.target.name] = e.target.value;
              this.setState(statevbl, function() {
                this.setCalculationValues(e)
              });
              this.handleValidation();
            }
          }
          else {
            if(e.target.value.match( "^.{"+config.input+","+config.input+"}$")===null) {
            let statevbl = this.state
            statevbl[e.target.name] = e.target.value;
            this.setState(statevbl);
            this.handleValidation();
            }
          }

       
    }
    handleValidation(){
        let formIsValid = true;
        let fields = this.state;

        //cash_percentage
        if (!fields.owner_percentage) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        // else{
        //     this.setState({ isDisable: false })
        // }

        //check_percentage
        else if (!fields.emp_percentage) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        // else{
        //     this.setState({ isDisable: false })
        // }
        //cash_percentage
        else if (!fields.cash_percentage) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        // else{
        //     this.setState({ isDisable: false })
        // }

        //check_percentage
        else if (!fields.check_percentage) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else{
            this.setState({ isDisable: false })
        }
        return formIsValid;
    }

    checkOnline(){
        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({isOnline: (condition==="online") ? true: false},function(){
            if(this.state.isOnline){
                this.saveCommision();
            }else{
                this.setState({offlineCheckAlert: true });
            }
        })
        
    }
    saveCommision(){
        // console.log("saveCommision",this.state.owner_percentage)
        if(this.handleValidation()){
            this.setState({isLoading: true});
            var input =  Object.assign({},this.state);
              let msg;
              var totalPer = 0;
              if(this.state.isEdit){
                  msg = 'Updated successfully.';
              }
              else{
                  msg = 'Saved successfully.';
              } 
              delete input["userdetail"];
              delete input["isDisable"];
              delete input["isEdit"];
              delete input["id"];
              delete input["commissionSelected"];
              delete input["perAlert_Open"];
              delete input["alert_msg"];
              delete input["isLoading"];
              delete input["businessdetail"]; 
              delete input["isOnline"];
              delete input["offlineCheckAlert"];
              
              var userdetail = window.localStorage.getItem('employeedetail');
                if(userdetail !== undefined && userdetail !== null){
                    input["created_by"] = JSON.parse(userdetail).id;
                    input["updated_by"] = JSON.parse(userdetail).id;
                    input["businessId"] = this.state.businessdetail.id;
                }
                input["created_at"] = new Date().toISOString();
                input["updated_at"] = new Date().toISOString();
  
              var totalPer1 = Number(this.state.owner_percentage)+Number(this.state.emp_percentage);
              totalPer = Number(this.state.cash_percentage)+Number(this.state.check_percentage);
              if(totalPer === 100 && totalPer1 === 100){
                  this.setState({perAlert_Open: false,alert_msg:''});
                  axios.post(config.root+`/settings/default_commission/save`, input).then(res=>{
                      var status = res.data["status"];
                      if(status === 200){  
                        this.dataManager.saveData("delete from default_commission").then(r=>{
                            input["sync_status"] =1;
                            this.ticketController.saveData({table_name:'default_commission', data: input}).then(r=>{

                                this.props.afterSubmit(msg);
                                this.setState({isLoading: false});
                            })
                        })
                      }
                  }).catch(err=>{      
                  })
              }
              else{
                  this.setState({perAlert_Open: true,alert_msg:'Percentage Value Should be equal to 100 !'});
                  
              }
        }
          
      }
      handleclose(){
        this.props.afterSubmit('');
      }
      handleCloseAlert(){
          this.setState({perAlert_Open: false,alert_msg:'', isLoading: false});
      }
      render() {
        return (
            <div style={{padding: 20}}>
            {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
            <form autoComplete="off" noValidate>
                <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        {/* <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Cash Percentage : </Typography> */}
                        <TextFieldContent 
                            id="owner_percentage" 
                            required 
                            type="number"
                            name="owner_percentage"  
                            label="Owner Percentage" 
                            value={this.state.owner_percentage}
                            variant="standard" 
                            fullWidth
                            
                            InputProps={{
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            onChange={this.handlechange}
                            onKeypress={this.handlekeypress}
                        />
                        <TextFieldContent 
                            id="emp_percentage" 
                            required 
                            type="number"
                            fullWidth
                            name="emp_percentage" 
                            label="Employee Percentage" 
                            value={this.state.emp_percentage}
                            variant="standard" 
                           
                            InputProps={{
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            onChange={this.handlechange}
                            onKeypress={this.handlekeypress}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        {/* <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Cash Percentage : </Typography> */}
                        <TextFieldContent 
                            id="cash_percentage" 
                            required 
                            type="number"
                            name="cash_percentage"  
                            label="Cash Percentage" 
                            value={this.state.cash_percentage}
                            variant="standard" 
                            fullWidth
                            
                            InputProps={{
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            onChange={this.handlechange}
                            onKeypress={this.handlekeypress}
                        />
                        <TextFieldContent 
                            id="check_percentage" 
                            required 
                            type="number"
                            fullWidth
                            name="check_percentage" 
                            label="Check Percentage" 
                            value={this.state.check_percentage}
                            variant="standard" 
                           
                            InputProps={{
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            onChange={this.handlechange}
                            onKeypress={this.handlekeypress}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}></Stack>
                    
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" style={{marginTop: 10}} >
                    {/* <div style={{ display : this.state.isOnline ? 'block':'none'}}> */}
                    <ButtonContent  size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save' } onClick={()=>this.checkOnline()}/>
                    {/* </div> */}
                    
                    {/* <ButtonContent  size="large" variant="outlined" label="Cancel" onClick={()=>this.handleclose()}/> */}
                </Stack>
            </form>

            <Dialog
                open={this.state.perAlert_Open}
                onClose={this.handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Alert !"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {this.state.alert_msg}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ButtonContent  size="large" variant="outlined" label="OK" onClick={()=>this.handleCloseAlert()}/>
                </DialogActions>
            </Dialog>

            <Dialog
                open={this.state.offlineCheckAlert}
                onClose={()=>{
                    this.setState({offlineCheckAlert: false})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Alert"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {"No Internet available! Please check your connection."}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ButtonContent  size="large" variant="outlined" label="OK" onClick={()=>{
                        this.setState({offlineCheckAlert: false})
                    }}/>
                </DialogActions>
            </Dialog>
            </div>

        )
      }

}