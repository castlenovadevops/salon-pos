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
            owner_percentage:0,
            employee_percentage:0,
            isActive:1,
            userdetail:{},
            isDisable: true, 
            discountSelected:{},
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
        this.setState({isOnline: (condition==="online") ? true: false});

        setTimeout(() => { 
            if(this.props.discountToEdit !== undefined){
                this.setState({discountSelected: this.props.discountToEdit,isEdit : true,isDisable:false}, function(){
                    let statevbl = this.state
                    statevbl = this.state.discountSelected;
                    this.setState(statevbl);
                })
            }
        }, 100);
        var userdetail = window.localStorage.getItem('employeedetail');
        if(userdetail !== undefined && userdetail !== null){
            this.setState({userdetail:JSON.parse(userdetail)})
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.discountToEdit !== prevState.discountSelected ) { 
            if(nextProps.discountToEdit !== undefined){
                var obj = { discountSelected: nextProps.discountToEdit,  owner_percentage:nextProps.discountToEdit.owner_percentage,
                    employee_percentage:nextProps.discountToEdit.employee_percentage, 
                    isActive:nextProps.discountToEdit.isActive ,isDisable:false}
                    console.log(obj)
                return obj;
                }
                else{
                    return {};
                }
                
        } 
    }

    setCalculationValues(e) {
        if(e.target.name === "employee_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({owner_percentage: Number(value).toFixed(2)})
        }
        else if(e.target.name === "owner_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({employee_percentage: Number(value).toFixed(2)})
        }
       

    }


    handlechange(e){
        if(e.target.name === "employee_percentage" || e.target.name === "owner_percentage" ){
            if(e.target.value.match( "^.{"+config.inputpercentage+","+config.inputpercentage+"}$")===null && e.target.value<=100) {
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
        //owner_percentage
        if (!fields.owner_percentage) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        // else{
        //     this.setState({ isDisable: false })
        // }

        //employee_percentage
        else if (!fields.employee_percentage) {
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
                this.saveDiscountDivision();
            }else{
                this.setState({offlineCheckAlert: true });
            }
        })
        
    }
    saveDiscountDivision(){
        if(this.handleValidation()){
            this.setState({isLoading: true});
            var input =  this.state;
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
              delete input["discountSelected"];
              delete input["perAlert_Open"];
              delete input["alert_msg"];
              delete input["isLoading"];
              delete input["isOnline"];
              delete input["offlineCheckAlert"];
            //   input["created_at"] = new Date();
            //   input["updated_at"] = new Date();
              
            var businessdetail = window.localStorage.getItem('businessdetail');
            //console.log(businessdetail);
              var userdetail = window.localStorage.getItem('employeedetail');
                if(userdetail !== undefined && userdetail !== null){
                    input["created_by"] = JSON.parse(userdetail).id;
                    input["updated_by"] = JSON.parse(userdetail).id;
                    input["businessId"] = JSON.parse(businessdetail).id;
                }
                input["created_at"] = new Date().toISOString();
                input["updated_at"] = new Date().toISOString();
  
                totalPer = Number(this.state.owner_percentage)+Number(this.state.employee_percentage);
              if(totalPer === 100){
                  this.setState({perAlert_Open: false,alert_msg:''});
                  axios.post(config.root+`/settings/default_discount/save`, input).then(res=>{
                      var status = res.data["status"];
                      if(status === 200){
                          
                        this.dataManager.saveData("delete from default_discount_division").then(r=>{
                            input["sync_status"] =1;
                            this.ticketController.saveData({table_name:'default_discount_division', data: input}).then(r=>{

                                this.props.afterSubmit(msg);
                                this.setState({isLoading: false,isOnline: true});
                            });
                        });
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
                                {/* <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Owner Percentage : </Typography> */}
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
                                />
                                <TextFieldContent 
                                    id="employee_percentage" 
                                    required 
                                    type="number"
                                    name="employee_percentage"  
                                    label="Employee Percentage" 
                                    fullWidth
                                    value={this.state.employee_percentage}
                                    variant="standard" 
                                   
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    onChange={this.handlechange}
                                />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                

                                
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" style={{marginTop: 10}}>
                            {/* <div style={{display : this.state.isOnline ? 'block':'none'}}> */}
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