import React from 'react';
import Container from '@material-ui/core/Container'; 
import Grid from '@material-ui/core/Grid';
import { TextField} from '@mui/material';  
import GenerateRandomCode from 'react-random-code-generator';

import TextFieldContent from '../../../../components/formComponents/TextField';
import ButtonContent from '../../../../components/formComponents/Button';
import PhoneNumberContent from '../../../../components/formComponents/PhoneNumber';
import AutoCompleteContent from '../../../../components/formComponents/AutoComplete';
import Moment from 'moment';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import config from '../../../../config/config';
import TicketController from '../../../../controller/TicketController';

export default class AddCustomer extends React.Component {
    ticketController = new TicketController();
    constructor(props){
        super(props);
        this.state={
            member_id:'',
            cust_name: '',
            email:'',
            dob: new Date(),
            phone: '',
            first_visit: '',
            last_visit: '',
            visit_count: '',
            total_spent:'',
            status: 'Active',
            userdetail:{},
            isDisable: true,
            isNameEmpty: false,
            errorTextName: '',
            ismIDEmpty: false,
            errorTextmId: '',
            isEmailEmpty: false,
            errorTextEmail: '',
            open: false,
            vertical: 'top',
            horizontal: 'center',
            businessdetail:{},
            address1:'',
            address2:'',
            city:'',
            state:null,
            zipcode:''
        }
        this.handlechange = this.handlechange.bind(this);
        this.onBlurField = this.onBlurField.bind(this);
        this.handlechangeDate = this.handlechangeDate.bind(this);
        this.handlechangememberId = this.handlechangememberId.bind(this);
        this.handlechangePhone = this.handlechangePhone.bind(this)
    }
    componentDidMount(){
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined){
            this.setState({businessdetail:JSON.parse(businessdetail)})
        }
        // this.genetrateCode();
    }
    genetrateCode(){
        this.setState({member_id:  GenerateRandomCode.NumCode(4)});
    }
    handleChangeText(e,id){
        if(id=== 'name'){
            this.setState({name: e.target.value});
        }
        else if(id=== 'email'){
            this.setState({email: e.target.value});
        }
        else if(id=== 'phone'){
            this.setState({phone: e.target.value});
        }
        else if(id=== 'dob'){
            this.setState({dob: e.target.value});
        }
        else if(id=== 'first_visit'){
            this.setState({first_visit: e.target.value});
        }
        else if(id=== 'last_visit'){
            this.setState({last_visit: e.target.value});
        }
        else if(id=== 'loyality_point'){
            this.setState({loyality_point: e.target.value});
        }
        else if(id=== 'total_spent'){
            this.setState({total_spent: e.target.value});
        }
        else if(id=== 'visit_count'){
            this.setState({visit_count: e.target.value});
        }
    }
    handlechange(e){ 
        // console.log("handlechange", e.target.name)
        if(e.target.name === "loyality_point") {
            if((e.target.value.match( "^.{"+config.inputprice+","+config.inputprice+"}$")===null)) {
                this.setState({ [e.target.name]: e.target.value });
                this.handleValidation();
            }

        }
        else if(e.target.name === "zipcode"){
            //  console.log("zipcode",e.target.value.match( "^.{6,6}$"))
            const numberPattern = new RegExp(/^[0-9\b]+$/);
            if(e.target.value.toString().match( "^.{6,6}$")===null && numberPattern.test(e.target.value) && e.keyCode !== 69) { 
              let statevbl = this.state
              statevbl[e.target.name] = e.target.value;
              this.setState(statevbl);
              this.handleValidation();
            }
          }
        else {
            if((e.target.value.match( "^.{"+config.input+","+config.input+"}$")===null)) {
                this.setState({ [e.target.name]: e.target.value });
                this.handleValidation();
            }
        }
             
      
    }
    handlechangePhone(e){
        // //console.log("date", e)
        this.setState({phone: e});
        this.handleValidation();
    }
    handlechangememberId(e){
        const numberPattern = new RegExp(/^[a-z0-9]+$/);
        if (numberPattern.test(e.target.value)) {
          if(this.state.member_id.length < 4){
            this.setState({member_id: e.target.value});
          }else{
            if(this.state.member_id.length > e.target.value.length){
              var str = this.state.member_id
             this.setState({member_id: str.slice(0, -1)});
            }
          }        
        }else{
          this.setState({member_id: ''});
        }
    }
    handleValidation(){
        let formIsValid = true;
        let fields = this.state;
        //Name
        if (!fields.name) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        
        //email
        else if (!fields.email) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else if (!fields.address1 && fields.address1 === '') {
            formIsValid = false;
            this.setState({ isDisable: true })
          }
          else if (!fields.city) {
              formIsValid = false;
              this.setState({ isDisable: true })
          }
          else if (!fields.state) {
              formIsValid = false;
              this.setState({ isDisable: true })
          }
          else if (!fields.zipcode) {
              formIsValid = false;
              this.setState({ isDisable: true })
          }
        else{
            this.setState({ isDisable: false })
        }
        return formIsValid;
    }
    handleClose(){
        this.setState( { open: false})
    }
    onBlurField(){
        if(!this.state.member_id){
            this.setState({ errorTextmId: 'Field Required' })
            this.setState( { ismIDEmpty: true})
            this.setState( { isDisable: true})
        }

        if(!this.state.name){
            this.setState({ errorTextName: 'Field Required' })
            this.setState( { isNameEmpty: true})
            this.setState( { isDisable: true})
        }

        if(!this.state.email){
            this.setState({ errorTextEmail: 'Field Required' })
            this.setState( { isEmailEmpty: true})
            this.setState( { isDisable: true})
        }

        if(this.state.name && this.state.member_id && this.state.email){
            this.setState( { isDisable: false})
            this.setState( { ismIDEmpty: false})
            this.setState( { isEmailEmpty: false})
            this.setState( { isNameEmpty: false})
        }
    }
    handlechangeDate(e){
        

        const datecomp = Moment(e).isBefore(new Date());
        
        //console.log("handlechangeDate::",e, datecomp)
        if(datecomp) {
            this.setState({dob: e});
        }
       
       
    }
    saveCustomer(){
        var customer_input = {
            member_id : this.state.member_id,
            name : this.state.name,
            email : this.state.email,
            dob: this.state.dob.toISOString(),
            phone: this.state.phone,
            first_visit : this.state.first_visit,
            last_visit : this.state.last_visit,
            visit_count : this.state.visit_count,
            total_spent : this.state.total_spent,
            loyality_point : this.state.loyality_point,
            created_at: new Date().toISOString(),
            created_by: this.state.userdetail.id,
            updated_at: new Date().toISOString(),
            updated_by: this.state.userdetail.id,
            businessId: this.state.businessdetail.id,
            status:'Active',
            address1 : this.state.address1,
            address2 : this.state.address2,
            city : this.state.city,
            state : this.state.state,
            zipcode : this.state.zipcode,
            sync_status: 0
        }
        window.api.getSyncUniqueId().then(sync=>{
            var syncid = sync.syncid; 
            customer_input["sync_id"] = syncid;
            customer_input["mode"] = 'POS';
            this.ticketController.saveData({table_name:'customers', data:customer_input}).then(r=>{ 
                this.props.afterSubmit('Saved successfully.');
                this.setState({isLoading: false});
            }) 
        })
        
        // axios.post(config.root +"customer/saveorupdate/", customer_input).then(res=>{
        //     var status = res.data["status"]; 
        //     if(status === 200){
        //         this.props.afterSubmit('Saved successfully.')
        //     }
        // })
    }

    render(){
        return (
            <div style={{height: '100%', background: ''}}>
                <Container style={{marginTop: '5%'}}> 
                            <form>
                                <div style={{ padding: 10, margin: 'auto'}}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextFieldContent id="member_id" 
                                            name="member_id"  
                                            label="Member ID" 
                                            type="text"
                                            value={this.state.member_id}
                                            onChange={this.handlechangememberId}
                                            
                                            fullWidth 
                                            />
                                        </Grid>
                                         <Grid item xs={6}>
                                            <TextFieldContent id="name" 
                                            required 
                                            name="name"  
                                            label="Customer Name" 
                                            type="text"
                                            value={this.state.name}
                                            onChange={this.handlechange}
                                            fullWidth 
                                            
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextFieldContent id="email"  
                                            name="email"  
                                            label="Email" 
                                            value={this.state.email}
                                            type="text"
                                            onChange={this.handlechange}
                                            fullWidth 
                                            required 
                                            />
                                        </Grid>
                                        <Grid item xs={6}> 
                                            <PhoneNumberContent
                                            label="Mobile Number"
                                            required
                                            fullWidth 
                                            name="phone"
                                            value={this.state.phone}
                                            onChange={(e) => this.handlechangePhone(e)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}> 
                                            <TextFieldContent fullWidth label="Address 1" required name="address1" value={this.state.address1} onChange={this.handlechange}/>
                                        </Grid>
                                        <Grid item xs={6}> 
                                            <TextFieldContent fullWidth label="Address 2" name="address2" value={this.state.address2} onChange={this.handlechange}/>
                                        </Grid>
                                        <Grid item xs={6}> 
                                        <TextFieldContent fullWidth label="City" required name="city" value={this.state.city} onChange={this.handlechange}/>
                                        </Grid>
                                        <Grid item xs={6}> 
                                            <AutoCompleteContent 
                                            fullWidth 
                                            label="State"
                                            required  
                                            name="state" 
                                            value={this.state.state} 
                                            onChange={(event, newValue) => {
                                                this.setState({state: newValue.value})
                                            }}
                                            /> 
                                        </Grid>
                                        <Grid item xs={6}> 
                                        <TextFieldContent type="number" fullWidth label="Zipcode" required  name="zipcode" value={this.state.zipcode} onChange={this.handlechange}  /> 
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DesktopDatePicker 
                                                    label="DOB"
                                                    inputFormat="MM/dd/yyyy"
                                                   
                                                    maxDate={new Date()}
                                                    value={this.state.dob}

                                                    onChange={this.handlechangeDate}
                                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid> 
                                        <Grid item xs={6}>
                                            <TextFieldContent
                                             type="number"
                                            id="loyality_point" 
                                            name="loyality_point"     
                                            label="Loyality Point" 
                                            fullWidth 
                                           
                                            value={this.state.loyality_point}
                                            onChange={this.handlechange}
                                            
                                            />
                                        </Grid>
                                        
                                        
                                        <div  style={{alignItems:'center',display:'flex', justifyContent:'center', width: '100%', marginTop: 40}}>
                                          
                                            <div item xs={4} alignItems='center' style={{alignItems:'center'}}>
                                                <ButtonContent stle={{width: 100}} variant="contained" color="success" disabled={this.state.isDisable} size="large" label="Save" onClick={()=>this.saveCustomer()} />
                                                <ButtonContent style={{marginLeft: 20, width: 100}} variant="outlined" color="success" size="large" label="Cancel" onClick={()=>{
                                                    this.props.afterSubmit('Saved successfully.')
                                                }} />    
                                            </div>
                                           
                                        </div>
                                    </Grid>
                                   
                                </div>
                            </form> 
                </Container>
            </div>
        )
    }
}
