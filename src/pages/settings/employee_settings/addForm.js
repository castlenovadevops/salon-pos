import React from 'react';
// material
import { Stack, Typography,InputAdornment,Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,Grid} from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'; 
// import {  SearchBar as Search} from "material-ui-search-bar";
// components
// import Page from '../../../components/Page';
import TextFieldContent from '../../../components/formComponents/TextField';
// import TextAreaContent from '../../../components/TextArea';
import ButtonContent from '../../../components/formComponents/Button';
import config from '../../../config/config'
import NumberFormat from "react-number-format";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import TicketController from '../../../controller/TicketController';
import DataManager from '../../../controller/datacontroller';
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      maxLength="12" 
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      // isNumericString
    />
  );
}
const service = {
    border:'2px solid #f0f0f0',
    padding: 10,
    cursor:'pointer'
}

export default class EmployeeSettingForm extends React.Component {
    ticketController = new TicketController();
    dataManager = new DataManager();
    constructor(props) {
        super(props);
        this.state = {
            employeeId:0,
            owner_percentage:'',
            employee_percentage:'',
            cash_percentage:'',
            check_percentage:'',
            tips_cash_percentage:'',
            tips_check_percentage:'',
            minimum_salary:'',
            isActive:1,
            userdetail:{},
            isDisable: true, 
            empSalarySelected:{},
            isEdit: false,
            perAlert_Open: false,
            alert_msg:'',
            employeelist:[],
            searched:'',
            isOnline: false,
            offlineCheckAlert: false,
            mastertables:[]
        };
        this.handlechange = this.handlechange.bind(this);
        this.handleChangeEmp = this.handleChangeEmp.bind(this);
        this.handleclose = this.handleclose.bind(this);
        this.handleCloseAlert = this.handleCloseAlert.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
    }
    componentDidMount(){
        // setTimeout(() => { 
        //     if(this.props.empSalaryToEdit !== undefined){
        //         this.setState({empSalarySelected: this.props.empSalaryToEdit,isEdit : true,isDisable:false}, function(){
        //             let statevbl = this.state
        //             statevbl = this.state.empSalarySelected;
        //             this.setState(statevbl);
        //         })
        //     }
        // }, 100);

        this.setState({mastertables:[{
            name: "employee_salary",
            tablename: 'employee_salary',
            progressText: "Synchronizing Salary Division...",
            progresscompletion: 10,
            url: config.root + `/settings/employee_salary/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
            syncurl:''
        }]},()=>{
        });
        this.loadData();
    }


    loadData(){
        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({isOnline: (condition==="online") ? true: false}, ()=>{

            var userdetail = window.localStorage.getItem('employeedetail');
            if(userdetail !== undefined && userdetail !== null){
                this.setState({userdetail:JSON.parse(userdetail)})
            }
            // this.getEmployeeList();
            this.getDefault_DiscountDivision();
            this.getDefault_commission();
            if(!this.state.isOnline) {
        
                console.log("!ONline didmount")
                const dataManager = new DataManager()
                dataManager.getData("select * from users").then(response =>{
                    if (response instanceof Array) {
                        this.setState({employeelist: response}, function(){
                            console.log(this.state.employeelist)
                            if(response.length > 0){
                                this.getEmp(response[0].id);
                            }
                        })
                    }
                })
            }
            else {
                console.log("ONline didmount")
                this.getEmployeeList();
            }
        })
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
        input["sync_id"] = input["sync_id"] !== null && input["sync_id"] !== undefined ? input["sync_id"] : input["id"];
            input["sync_status"] = 1;
            if(tbldata.tablename === 'employee_salary'){
              delete input["firstName"];
              delete input["lastName"];
            }
            if(tbldata.tablename === 'ticket'){
                delete input["name"];
                delete input["email"];
                delete input["pay_mode"];
            }
            this.ticketController.saveData({ table_name: tbldata.name, data: input }).then(r => {
                this.syncIndividualEntry(mindex, idx + 1, data, tbldata);
            })  
    }
    else {
        this.setState({progress: tbldata.progress}, ()=>{
            console.log(mindex, "master sync index")
            this.syncMasterData(mindex + 1)
        });
    }
}

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     // setTimeout(() => {    
    //         if (nextProps.empSalaryToEdit !== prevState.empSalarySelected ) {
    //         return { empSalarySelected: nextProps.empSalaryToEdit };
    //         }
    //         return null;
    //     // }, 100);
    // }
    getEmployeeList() {
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){

            axios.get(config.root+`/employee/`+JSON.parse(businessdetail).id).then(res=>{
                var status = res.data.status;
                var data = res.data.data;
                if(status === 200){
                    if(data.length >0){
                        this.setState({employeelist:data}, function(){
                            let selected_emp = this.state.employeelist.filter(item => item.staff_role === "Owner");
                            console.log("selected_emp selected_emp", selected_emp, this.state.employeeId)
                            // var newarr = this.state.employeelist.filter(function(item){
                            //     return !selected_emp.includes(item);
                            // });
                            // this.setState({employeelist: newarr});
                            if(selected_emp.length > 0 && this.state.employeeId === 0){
                                this.setState({employeeId:selected_emp[0].id},()=>{
                                    console.log("hghjghghjgjhgjhgjgjg", this.state.employeeId)
                                    this.getEmp(selected_emp[0].id);
                                })
                            }
                            else{ 
                                this.getEmp(this.state.employeeId);
                            }
                            
                        })
                    }
                }
            });
        }
    }
    getDefault_DiscountDivision(){
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            if(!this.state.isOnline) {
                const dataManager = new DataManager()
                dataManager.getData("select * from default_discount_division where businessId="+JSON.parse(businessdetail).id).then(response =>{
                    if (response instanceof Array) {
                        if(response.length > 0){
                            this.setState({owner_percentage : response[0].owner_percentage, employee_percentage : response[0].employee_percentage});
                        }

                    }
                })

            }
            else{
                axios.get(config.root+`/settings/default_discount/list/`+JSON.parse(businessdetail).id).then(res=>{ 
                    var status = res.data.status;
                    var data = res.data.data;
                    if(status === 200){
                        if(data.length > 0){
                            this.setState({owner_percentage : data[0].owner_percentage, employee_percentage : data[0].employee_percentage});
                        }
                    }
                    
                })
            }
            
        }
    }
    getDefault_commission(){
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            if(!this.state.isOnline) {
                const dataManager = new DataManager()
                dataManager.getData("select * from default_commission where businessId="+JSON.parse(businessdetail).id).then(response =>{
                    if (response instanceof Array) {
                        if(response.length > 0){
                            this.setState({owner_percentage : response[0].owner_percentage,employee_percentage : response[0].emp_percentage,cash_percentage : response[0].cash_percentage, check_percentage : response[0].check_percentage,tips_cash_percentage : response[0].tips_cash_percentage, tips_check_percentage : response[0].tips_check_percentage}, function(){
                                this.handleValidation();
                            });
                        }
                    }
                });

            }else{
                axios.get(config.root+`/settings/default_commission/list/`+JSON.parse(businessdetail).id).then(res=>{ 
                    var status = res.data.status;
                    var data = res.data.data;
                    if(status === 200){
                        if(data.length > 0){
                            this.setState({owner_percentage : data[0].owner_percentage,employee_percentage : data[0].emp_percentage,cash_percentage : data[0].cash_percentage, check_percentage : data[0].check_percentage,tips_cash_percentage : data[0].tips_cash_percentage, tips_check_percentage : data[0].tips_check_percentage}, function(){
                                this.handleValidation();
                            });
                        }
                    }
                    
                })

            }
            
        }
    }

    setCalculationValues(e) {
        if(e.target.name === "check_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({cash_percentage: Number(value).toFixed(2)})
        }
        else if(e.target.name === "cash_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({check_percentage: Number(value).toFixed(2)})
        }
        else if(e.target.name === "tips_check_percentage") {
            var valuet = (100)-Number(e.target.value)
            this.setState({tips_cash_percentage: Number(valuet).toFixed(2)})
        }
        else if(e.target.name === "tips_cash_percentage") {
            var valuetc = (100)-Number(e.target.value)
            this.setState({tips_check_percentage: Number(valuetc).toFixed(2)})
        }
        else if(e.target.name === "employee_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({owner_percentage: Number(value).toFixed(2)})
        }
        else if(e.target.name === "owner_percentage") {
            var value = (100)-Number(e.target.value)
            this.setState({employee_percentage: Number(value).toFixed(2)})
        }
        
      

    }


    handlechange(e){
        if(e.target.name === "check_percentage" || e.target.name === "cash_percentage" || e.target.name === "tips_check_percentage" || e.target.name === "tips_cash_percentage" || e.target.name === "employee_percentage" || e.target.name === "owner_percentage" ){
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
        //minimum_salary
        // if (fields.minimum_salary === '') {
        //     formIsValid = false;
        //     this.setState({ isDisable: true })
        // }
        // else{
        //     this.setState({ isDisable: false })
        // }
        //owner_percentage
        if (fields.owner_percentage === '') {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if (fields.employee_percentage === '') {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if (fields.employeeId === 0) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else{
            this.setState({ isDisable: false })
        }
        return formIsValid;
    }
    handleChangeEmp(e) {
        this.setState({employeeId:e.target.value})
    }
    handleclose(){
        this.setState({isEdit : false,isDisable: true,employeeId: 0}, function(){
            this.setState({owner_percentage: '',
                employee_percentage:'',
                cash_percentage:'',
                check_percentage:'',
                tips_cash_percentage:'',
                tips_check_percentage:'',
                minimum_salary:''
            });
        });
        this.getEmployeeList();
    }
    handleCloseAlert(){
        this.setState({perAlert_Open: false,alert_msg:'' }); 
    }
    getEmp(id){
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            if(!this.state.isOnline) {
                console.log("offline")
                const dataManager = new DataManager()
                dataManager.getData("select * from default_commission where businessId="+JSON.parse(businessdetail).id).then(response =>{
                    if (response instanceof Array) {
                        if(response.length > 0){
                            this.setState({owner_percentage : response[0].owner_percentage,employee_percentage : response[0].emp_percentage,cash_percentage : response[0].cash_percentage, check_percentage : response[0].check_percentage,tips_cash_percentage : response[0].tips_cash_percentage, tips_check_percentage : response[0].tips_check_percentage}, function(){
                          
                                dataManager.getData("select * from employee_salary where isActive =1 and   employeeId="+id+" and businessId="+JSON.parse(businessdetail).id).then(response =>{
                                    if (response instanceof Array) {
                                        // this.setState({employeelist: response}, function(){
                                        //     console.log(this.state.employeelist)
                                        // }) 
                                        var stateobj = Object.assign({}, this.state)

                                        if(response.length >0){
                                            console.log(response[0])
                                            this.setState({isEdit : true,isDisable: false,employeeId: id}, function(){
                                                this.setState({owner_percentage: response[0].owner_percentage,
                                                    employee_percentage:response[0].employee_percentage,
                                                    cash_percentage:response[0].cash_percentage,
                                                    check_percentage:response[0].check_percentage,
                                                    tips_cash_percentage:response[0].tips_cash_percentage !== null && response[0].tips_cash_percentage !== undefined ? response[0].tips_cash_percentage : stateobj.tips_cash_percentage,
                                                    tips_check_percentage:response[0].tips_check_percentage!== null && response[0].tips_check_percentage !== undefined ? response[0].tips_check_percentage : stateobj.tips_check_percentage,
                                                    minimum_salary:response[0].minimum_salary
                                                });
                                            })
                                        }else{
                                            this.setState({isEdit : false,isDisable: true,employeeId: id}, function(){
                                                this.setState({
                                                    //owner_percentage: '',
                                                    // employee_percentage:'',
                                                    // cash_percentage:'',
                                                    // check_percentage:'',
                                                    minimum_salary:''
                                                });
                                                this.getDefault_commission();
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    }
                })

            }
            else{
                console.log("online")

                axios.get(config.root+`/settings/default_commission/list/`+JSON.parse(businessdetail).id).then(res=>{ 
                    var status = res.data.status;
                    var data = res.data.data;
                    if(status === 200){
                        if(data.length > 0){
                            this.setState({owner_percentage : data[0].owner_percentage,employee_percentage : data[0].emp_percentage,cash_percentage : data[0].cash_percentage, check_percentage : data[0].check_percentage,tips_cash_percentage : data[0].tips_cash_percentage, tips_check_percentage : data[0].tips_check_percentage}, function(){
                               
                                    var stateobj = Object.assign({}, this.state)
                                    axios.get(config.root+`/settings/employee_salary/detail/`+id+`/`+JSON.parse(businessdetail).id).then(res=>{ 
                                        var status = res.data.status;
                                        var data = res.data.data;
                                        if(status === 200){
                                            if(data.length >0){
                                                this.setState({isEdit : true,isDisable: false}, function(){
                                                    this.setState({owner_percentage: data[0].owner_percentage,
                                                        employee_percentage:data[0].employee_percentage,
                                                        cash_percentage:data[0].cash_percentage,
                                                        check_percentage:data[0].check_percentage,
                                                        tips_cash_percentage:data[0].tips_cash_percentage !== null && data[0].tips_cash_percentage !== undefined ? data[0].tips_cash_percentage : stateobj.tips_cash_percentage,
                                                        tips_check_percentage:data[0].tips_check_percentage!== null && data[0].tips_check_percentage !== undefined ? data[0].tips_check_percentage : stateobj.tips_check_percentage,
                                                        minimum_salary:data[0].minimum_salary
                                                    });
                                                })
                                            }else{
                                                this.setState({isEdit : false,isDisable: true}, function(){
                                                    this.setState({
                                                        //owner_percentage: '',
                                                        // employee_percentage:'',
                                                        // cash_percentage:'',
                                                        // check_percentage:'',
                                                        minimum_salary:''
                                                    });
                                                    this.getDefault_commission();
                                                })
                                            }
                                        }
                                    
                                    })
                            });
                        }
                    }
                    
                })

            }
            
        }
        
    }
    requestSearch(e) {
        //console.log(e.target.value);
        this.setState({searched : e.target.value}, function(){
            if(this.state.searched !== ''){
                const filteredRows = this.state.employeelist.filter(item => item.firstName.includes(this.state.searched));
                this.setState({employeelist: filteredRows}) 
            }else{
                this.getEmployeeList();
            }
        });
        // //console.log(this.state.searched)
        // var searchVal = this.state.searched;
        // if(searchVal !== ''){
        //     const filteredRows = this.state.employeelist.filter(item => item.firstName.includes(searchVal));
        //     // const filteredRows = this.state.employeelist.filter((row) => {
        //     //     var name = row.firstName;
        //     //     return name;
        //     //     // return name.toLowerCase().includes(searchVal.toLowerCase());
        //     // });
        //    this.setState({employeelist: filteredRows})  
        // }else{
        //     // this.setState({searched :''});
        //     this.getEmployeeList();
        // }
       
    }
    cancelSearch() {
        this.setState({searched: ""})
        this.requestSearch("");
    }
    checkOnline(){
        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({isOnline: (condition==="online") ? true: false},function(){
            if(this.state.isOnline){
                this.saveEmployeeSalary();
            }else{
                this.setState({offlineCheckAlert: true });
            }
        })
    }
    saveEmployeeSalary(){
        if(this.handleValidation()){
            var input =  Object.assign({},this.state);
            let msg;
            var totalDiscount_Per = 0;
            var totalCommission_Per = 0;
            if(this.state.isEdit){
                // input["id"] = this.state.empSalarySelected.id;
                msg = 'Updated successfully.';
                
            }
            else{
                msg = 'Saved successfully.';
                
            }
            delete input["downloadinMessage"];
            delete input["mastertables"];
            delete input["userdetail"];
            delete input["isDisable"];
            delete input["isEdit"];
            delete input["empSalarySelected"];
            delete input["perAlert_Open"];
            delete input["alert_msg"];
            delete input["employeelist"];
            delete input["searched"];
            delete input["isOnline"];
            delete input["offlineCheckAlert"];
            input["updated_at"] = new Date().toISOString();
            input["created_at"] = new Date().toISOString();
            var businessdetail = window.localStorage.getItem('businessdetail');
            var userdetail = window.localStorage.getItem('employeedetail');
            if(userdetail !== undefined && userdetail !== null){
                input["created_by"] = JSON.parse(userdetail).id;
                input["updated_by"] = JSON.parse(userdetail).id;
                input["businessId"] = JSON.parse(businessdetail).id;
            }
            totalCommission_Per = Number(this.state.owner_percentage)+Number(this.state.employee_percentage);
            totalDiscount_Per= Number(this.state.cash_percentage)+Number(this.state.check_percentage);
            var totalDiscount_tips= Number(this.state.tips_cash_percentage)+Number(this.state.tips_check_percentage);
            if(totalDiscount_Per === 100 && totalCommission_Per === 100 && totalDiscount_tips === 100){
                this.setState({perAlert_Open: false,alert_msg:''});
                axios.post(config.root+`/settings/employee_salary/save`, input).then(res=>{
                        var status = res.data["status"];
                        if(status === 200){

                        this.dataManager.saveData("delete from employee_salary").then(r=>{
                        //     input["sync_status"] =1;
                            // this.ticketController.saveData({table_name:'employee_salary', data: input}).then(r=>{

                                this.syncMasterData(0);
                            this.setState({perAlert_Open: true,alert_msg: msg});
                            this.getEmp(input["employeeId"]);
                            // });
                        });
                            // this.props.afterSubmit(msg);
                        }
                    }).catch(err=>{      
                });
            } 
            else {
                this.setState({perAlert_Open: true,alert_msg:'Percentage Value Should be equal to 100 !'});
            }
            
            
        }
    }
    
    render() {
        return(
            <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '100%',background: 'white'}}>
           
            
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap',height:'550px'}}>
                    <Grid item xs={4} style={{height:'100%', borderRight:'1px solid #f0f0f0',}}>
                        <Typography variant="h6" gutterBottom align="center" style={{borderRight:'0px solid #f0f0f0',background:'white',padding:'10px'}}> 
                        <TextFieldContent
                            fullWidth
                            label="Search"
                            name="searched"
                            value={this.state.searched}
                            onChange={(e)=>this.requestSearch(e)}
                            />

                        </Typography>
                        {this.state.employeelist.length>0 &&
                            <div style={{height:'92%',borderRight:'2px solid #f0f0f0',borderLeft:'2px solid #f0f0f0', overflowY: "auto"}}>
                            
                                {this.state.employeelist.map((emp, index) => (
                                    <Grid item xs={12} style={{'background':(this.state.employeeId ===emp.id ? '#134163':'transparent'),'color':(this.state.employeeId===emp.id ? '#fff':'#000')}} >
                                        <div style={service} onClick={() =>{this.setState({employeeId:emp.id}, ()=>{this.getEmp(emp.id)}) }}><Typography id="modal-modal-title" variant="subtitle2" align="center">{emp.firstName} {emp.lastName} ({emp.staff_role})</Typography></div>
                                    </Grid>
                                ))}
                            
                            </div>
                        }
                        {
                            this.state.employeelist.length ===0 &&
                            <Typography variant="subtitle2" align="center" style={{cursor:'pointer', marginTop: 20}} >No Records Found!</Typography> 
                        }
                        
                    </Grid>
                    <Grid item xs={8} style={{padding:'20px'}}>
                        <form autoComplete="off" noValidate>
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextFieldContent  
                                            fullWidth
                                            // type="number" 
                                            label="Minimum Salary" 
                                            name="minimum_salary"
                                            value={this.state.minimum_salary}
                                            disabled={!this.state.isOnline}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                inputComponent: NumberFormatCustom
                                            }}
                                            onChange={this.handlechange}
                                            
                                    />
                                    <TextFieldContent  
                                            type="number" 
                                            label="Owner Percentage" 
                                            name="owner_percentage"
                                            disabled={!this.state.isOnline}
                                            required
                                            fullWidth
                                            value={this.state.owner_percentage}
                                            
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            onChange={this.handlechange}
                                            
                                        />
                                        <TextFieldContent  
                                            type="number" 
                                            fullWidth
                                            label="Employee Percentage" 
                                            name="employee_percentage"
                                            disabled={!this.state.isOnline}
                                            required
                                            value={this.state.employee_percentage}
                                          
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            onChange={this.handlechange}
                                            
                                        />
                                </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Commission Payment : </Typography>
                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextFieldContent  
                                            type="number" 
                                            label="Cash Percentage" 
                                            name="cash_percentage"
                                            disabled={!this.state.isOnline}
                                            value={this.state.cash_percentage}
                                            
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            onChange={this.handlechange}
                                            
                                        />
                                        <TextFieldContent  
                                            type="number" 
                                            label="Check Percentage" 
                                            name="check_percentage"
                                            disabled={!this.state.isOnline}
                                            value={this.state.check_percentage}
                                           
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            onChange={this.handlechange}
                                            
                                        />
                                    </Stack>
                                
                                   
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Tips Payment : </Typography>
                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextFieldContent  
                                            type="number" 
                                            label="Cash Percentage" 
                                            name="tips_cash_percentage"
                                            disabled={!this.state.isOnline}
                                            value={this.state.tips_cash_percentage||''}
                                            
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            onChange={this.handlechange}
                                            
                                        />
                                        <TextFieldContent  
                                            type="number" 
                                            label="Check Percentage" 
                                            name="tips_check_percentage"
                                            disabled={!this.state.isOnline}
                                            value={this.state.tips_check_percentage || ''}
                                           
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            onChange={this.handlechange}
                                            
                                        />
                                    </Stack>
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                    {/* <div style={{ display : this.state.isOnline ? 'block':'none'}}> */}
                                        <ButtonContent size="large" variant="contained" onClick={()=>this.checkOnline()} disabled={this.state.isDisable || !this.state.isOnline} label={this.state.isEdit ? 'Update' : 'Save' } />
                                    {/* </div> */}
                                </Stack>
                            </Stack>
                        </form>
                    </Grid>
            </Grid>

                
            <Dialog
                open={this.state.perAlert_Open}
                onClose={this.handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> 
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

        
                <Snackbar open={!this.state.isOnline} style={{width:'100%', marginBottom: -25}} anchorOrigin={{ vertical: "bottom", horizontal:  "center" }}>

                    <MuiAlert elevation={6}  variant="filled" severity="error" sx={{ width: '100%' }} style={{background: 'red',display:'flex', alignItems:'center', color: 'white'}}>
                    No internet available !
                    <ButtonContent size="large" variant="contained" style={{'height':'36px', position:'absolute', top:'8px', right:'1rem' }} onClick={()=>this.loadData()}  label={'Reload'} />
                    </MuiAlert>


                </Snackbar>
            </div>
            
            
        )
    }

}