import React from 'react';
import axios from 'axios';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Stack, Typography,InputAdornment,Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,FormControl, FormControlLabel, RadioGroup,Radio } from '@mui/material';
// components
import ButtonContent from '../../components/formComponents/Button';
import TextFieldContent from '../../components/formComponents/TextField';
import LoaderContent from '../../components/formComponents/LoaderDialog';
// import {RadioContent} from '../../components/Radio'
import config from '../../config/config';
import TicketController from '../../controller/TicketController';
import NumberFormat from "react-number-format";
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      maxLength={config.inputpercentage}
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

export default class DiscountForm extends React.Component {
    ticketController = new TicketController();
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            discount_type:'',
            discount_value:'',
            division_type:'',
            owner_division:0,
            emp_division:0,
            status:'active',
            userdetail:{},
            businessdetail: {},
            isEdit: false,
            isAmountShow: false,
            isPercentageShow: false,
            isDivisionBothShow: false,
            isDisable: true, 
            discountSelected: {},
            perAlert_Open: false,
            isLoading: false,
        }
        this.handlechange = this.handlechange.bind(this);
        this.handleclose = this.handleclose.bind(this);
        this.saveDiscount = this.saveDiscount.bind(this);
    }
    componentDidMount(){
        setTimeout(() => {   
            if(this.props.discountToEdit !== undefined){
                this.setState({discountSelected: this.props.discountToEdit,isEdit : true,isDisable: false}, function(){
                    let statevbl = this.state
                    statevbl = this.state.discountSelected;
                    this.setState(statevbl);

                    if(this.state.discountSelected.discount_type === 'amount'){
                        this.setState({isAmountShow: true,isPercentageShow: false});
                    }else{
                        this.setState({isAmountShow: false,isPercentageShow: true});
                    }

                    if(this.state.discountSelected.division_type === 'both'){
                        this.setState({isDivisionBothShow: true});
                    }else{
                        this.setState({isDivisionBothShow: false});
                    }
                    this.handleValidation();
                })
    
            }
            else {
                var userdetail = window.localStorage.getItem('employeedetail');
                var businessdetail = window.localStorage.getItem('businessdetail');
                if(userdetail !== undefined && userdetail !== null){
                    this.setState({userdetail:JSON.parse(userdetail), businessdetail: JSON.parse(businessdetail)})
                }
                this.getDefault_DiscountDivision();
            }
        }, 100);

      
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.discountToEdit !== prevState.discountSelected ) {
          return { discountSelected: nextProps.discountToEdit };
        }
        return null;
    }

    getDefault_DiscountDivision(){
        
       
       
        if(this.state.businessdetail !== undefined && this.state.businessdetail !== null){
            axios.get(config.root+"/settings/default_discount/list/"+this.state.businessdetail.id).then(res=>{ 

                var status = res.data.status;
                var data = res.data.data;
                console.log("default_discount----",res)
                if(status === 200){
                    if(data.length > 0){
                        this.setState({owner_division : Number(data[0].owner_percentage), emp_division :  Number(data[0].employee_percentage)});
                    }
                }
                
            })
        }
    }

    setCalculationValues(e) {
        if(e.target.name === "emp_division") {
            var value = (100)-Number(e.target.value)
            this.setState({owner_division: Number(value).toFixed(2)})
        }
        else if(e.target.name === "owner_division") {
            var value = (100)-Number(e.target.value)
            this.setState({emp_division: Number(value).toFixed(2)})
        }
      

    }
    handlechange(e){
        if(e.target.name === "discount_value"){
            if(this.state.discount_type === 'percentage' && e.target.name === "discount_value") {
                if(e.target.value.match( "^.{"+config.inputpercentage+","+config.inputpercentage+"}$")===null && e.target.value<=100) {
                    let statevbl = this.state
                    statevbl[e.target.name] = e.target.value;
                    this.setState(statevbl, function() {
                        this.handleValidation();
                        
                    });
                    // this.setCalculationValues(e)

                }
                

            }
            else if(this.state.discount_type === 'amount' && e.target.name === "discount_value") {
                if(e.target.value.match( "^.{"+config.inputpercentage+","+config.inputpercentage+"}$")===null) {
                    let statevbl = this.state
                    statevbl[e.target.name] = e.target.value;
                    this.setState(statevbl);
                    this.handleValidation();
                    // this.setCalculationValues(e)

                }
                // this.setCalculationValues(e)
            }
            else{
                let statevbl = this.state
                statevbl[e.target.name] = e.target.value;
                this.setState(statevbl);
                this.handleValidation();
                this.setState({perAlert_Open: false,alert_msg:'Percentage Value Should be less than or equal to 100 !'});

            }
        }
        else if(e.target.name === "emp_division" ||e.target.name === "owner_division"){
            if(e.target.value.match( "^.{"+config.inputpercentage+","+config.inputpercentage+"}$")===null) {
                let statevbl = this.state
                    statevbl[e.target.name] = e.target.value;
                    this.setState(statevbl, function() {
                        this.handleValidation();
                        
                });
                this.setCalculationValues(e)
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


    // handlechange(e){
       
    //     if(e.target.name === "discount_value" || e.target.name === "emp_division" ||e.target.name === "owner_division"){
    //         if(e.target.value.match( "^.{"+config.inputpercentage+","+config.inputpercentage+"}$")===null) {
    //             console.log("2")
    //             if(this.state.discount_type === 'percentage' && e.target.name === "discount_value" && e.target.value<=100) {
    //                 let statevbl = this.state
    //                 statevbl[e.target.name] = e.target.value;
    //                 this.setState(statevbl, function() {
                        
    //                 });
    //                 this.handleValidation();
    //             }
    //             else if(this.state.discount_type === 'amount' && e.target.name === "discount_value") {
    //                 // console.log("3")
    //                 let statevbl = this.state
    //                 statevbl[e.target.name] = e.target.value;
    //                 this.setState(statevbl);
    //                 this.handleValidation();
    //             }
    //             else {
    //                 // console.log("discount both")
    //                 let statevbl = this.state
    //                 statevbl[e.target.name] = e.target.value;
    //                 this.setState(statevbl);
    //                 this.handleValidation();
    //                 this.setState({perAlert_Open: false,alert_msg:'Percentage Value Should be equal to 100 !'});
                    
    //             }

    //             this.setCalculationValues(e)
             
    //         }
    //         else if( e.target.name == "emp_division"  || e.target.name === "owner_division"){
    //             console.log( Number(e.target.value))
    //             if(e.target.value.length<=6 && Number(e.target.value)<=100) {
    //                 let statevbl = this.state
    //                 statevbl[e.target.name] = e.target.value;
    //                 this.setState(statevbl);
    //                 this.handleValidation();

    //                 this.setCalculationValues(e)
    //             }
                    
    //         }
    //       }
    //       else {
    //         if(e.target.value.match( "^.{"+config.input+","+config.input+"}$")===null) {
    //         let statevbl = this.state
    //         statevbl[e.target.name] = e.target.value;
    //         this.setState(statevbl);
    //         this.handleValidation();
    //         }
    //       }


      
    // }
    handleValidation(){
        let formIsValid = true;
        let fields = this.state;

        console.log("DISCOU DIVISIO" , fields.division_type )
        //Name
        if (!fields.name) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if(!fields.discount_value){
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if(fields.owner_division === 0 && fields.emp_division === 0 && fields.division_type === 'both'){
            formIsValid = false;
            this.setState({ isDisable: true })

        }
        else if((fields.owner_division ==='' || fields.emp_division === '') && fields.division_type === 'both'){
            formIsValid = false;
            this.setState({ isDisable: true })

        }
        
        else if(fields.owner_division !== 0 && fields.owner_division <100 && fields.emp_division === 0 && fields.division_type === 'both'){
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if(fields.emp_division !== 0 && fields.emp_division <100 && fields.owner_division === 0 && fields.division_type === 'both'){
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if(fields.division_type ===''){
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else{
            this.setState({ isDisable: false })
        }
        return formIsValid;
    }
    handleradio(e){
        this.setState({discount_type: e.target.value})
        if(e.target.value === 'amount'){
            this.setState({isAmountShow: true,isPercentageShow: false,discount_value:''},function(){
                this.handleValidation();
            });
        }else{
            this.setState({isAmountShow: false,isPercentageShow: true,discount_value:''},function(){
                this.handleValidation();
            });
        }
        // this.handleValidation();
    }
    handledivisionradio(e){
        this.setState({division_type: e.target.value});
        if(e.target.value === 'both'){
            this.setState({isDivisionBothShow: true},function(){
                this.handleValidation();
            });
        }else{
            this.setState({isDivisionBothShow: false},function(){
                this.handleValidation();
            });
        }
    }
    handleclose(){
      this.props.afterSubmit('');
    }
    saveDiscount(){
        if(this.handleValidation()){
            this.setState({isLoading: true});
            var input =  Object.assign({},this.state)
            let msg;
            var totalPer = 0;
            // if(this.state.isEdit){
            //     input["id"] = this.state.discountSelected.id;
            //     msg = 'Updated successfully.';
            // }
            // else{
            //     msg = 'Saved successfully.';
            // }
            input["businessId"] = this.state.businessdetail.id

            delete input["userdetail"];
            delete input["isEdit"]
            delete input["isAmountShow"];
            delete input["isPercentageShow"];
            delete input["isDivisionBothShow"]
            delete input["isDisable"];
            delete input["discountSelected"];
            delete input["perAlert_Open"];
            delete input["isLoading"];
            delete input["alert_msg"];
            delete input["businessdetail"]

            console.log("saveDiscount - input",input)

            if(this.state.division_type === 'both'){
                totalPer = Number(this.state.owner_division)+Number(this.state.emp_division);
                if(totalPer === 100){
                    this.saveDiscountData(input,msg);
                }else{
                    this.setState({perAlert_Open: true});
                }
            }
            else{ 
                this.saveDiscountData(input, msg);
            }
        }

    }
    saveDiscountData(input, msg){

        input["sync_status"] = 0;
        if(this.state.isEdit){ 
          this.ticketController.updateData({table_name:'discounts', data: input, query_field:'sync_id', query_value:this.state.discountSelected.id}).then(()=>{ 
            this.props.afterSubmit('Updated successfully.');
            this.setState({isLoading: false});
          })
        }
        else{
            window.api.getSyncUniqueId().then(sync=>{
                var syncid = sync.syncid; 
                input["sync_id"] = syncid;
                this.ticketController.saveData({table_name:'discounts', data:input}).then(r=>{ 
                    this.props.afterSubmit('Saved successfully.');
                    this.setState({isLoading: false});
                }) 
            })
        }

        // axios.post(config.root+`/discount/saveorupdate`, input).then(res=>{ 
        //     var status = res.data["status"];
        //     console.log("saveDiscount- ouput",res.data)

        //     if(status === 200){
        //         this.props.afterSubmit(msg);
        //         this.setState({isLoading: false});
        //     }

        // }).catch(err=>{      
        // })
    }
    handleCloseAlert(){
          this.setState({perAlert_Open: false,alert_msg:'', isLoading: false});
    }
    render() {
        return (
            <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '100%',background: 'white', width: '60%'}}>
                {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
                <form autoComplete="off" noValidate>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextFieldContent
                                label="Discount Name"
                                name="name"
                                type="text"
                                required
                                fullWidth
                                value={this.state.name}
                                onChange={this.handlechange}
                                />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Discount Type : </Typography>
                                <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> </Typography>
                                <FormControl component="fieldset" style={{marginTop: 10}}> 
                                    <RadioGroup row aria-label="card" name="row-radio-buttons-group">
                                        <FormControlLabel value={this.state.discount_type} checked={this.state.discount_type === 'amount'} control={<Radio value="amount" />} onChange={(e)=>{ this.handleradio(e); }} label="Amount" />
                                        <FormControlLabel value={this.state.discount_type} checked={this.state.discount_type === 'percentage'} control={<Radio value="percentage" />} onChange={(e)=>{ this.handleradio(e); }}  label=" Percentage" />
                                    </RadioGroup>
                                </FormControl>
                                <TextFieldContent 
                                    id="discount_value" 
                                    required 
                                    type="number"
                                    name="discount_value"  
                                    label="Percentage" 
                                    value={this.state.discount_value}
                                    variant="standard" 
                                  
                                    style={{display: this.state.isPercentageShow ? 'block':'none'}}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    onChange={this.handlechange}
                                    // onChange={(e)=>{
                                        // this.handlechangeTips_percent(e)
                                    // }}
                                />

                                <TextFieldContent  
                                    // type="number" 
                                    label="Amount" 
                                    required
                                    name="discount_value"
                                    value={this.state.discount_value}
                                    variant="standard" 
                                    style={{display: this.state.isAmountShow ? 'block':'none'}}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        // inputComponent: NumberFormatCustom
                                    }}
                                    onChange={this.handlechange}
                                    // onChange={(e)=>{
                                        // this.handlechangeTips_individual_amt(e,index);
                                    // }}
                                />

                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> Division : </Typography>
                                <Typography variant="subtitle2" gutterBottom style={{marginTop: 10}}> </Typography>
                                <FormControl component="fieldset" style={{marginTop: 10}}>
                                    <RadioGroup row aria-label="card" name="row-radio-buttons-group">
                                        <FormControlLabel value={this.state.division_type} checked={this.state.division_type === 'owner'} control={<Radio value="owner" />} onChange={(e)=>{ this.handledivisionradio(e); }} label="Owner" />
                                        <FormControlLabel value={this.state.division_type} checked={this.state.division_type === 'employee'} control={<Radio value="employee" />} onChange={(e)=>{ this.handledivisionradio(e); }}  label="Employee" />
                                        <FormControlLabel value={this.state.division_type} checked={this.state.division_type === 'both'} control={<Radio value="both" />} onChange={(e)=>{ this.handledivisionradio(e); }}  label="Both" />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}  style={{display: this.state.isDivisionBothShow ? 'block':'none'}}>
                                <TextFieldContent  
                                    type="number" 
                                    label="Owner Percentage" 
                                    name="owner_division"
                                    value={this.state.owner_division}
                                    
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    onChange={this.handlechange}
                                    
                                />
                                <TextFieldContent  
                                    type="number" 
                                    label="Employee Percentage" 
                                    name="emp_division"
                                    value={this.state.emp_division}
                                    
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    onChange={this.handlechange}
                                   
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} onClick={()=>this.saveDiscount()} label={this.state.isEdit ? 'Update' : 'Save' } />
                                <ButtonContent  size="large" variant="outlined" label="Cancel" onClick={()=>this.handleclose()} />
                            </Stack>

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
                
            </div>
            
        )
    }

}