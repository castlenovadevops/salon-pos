import React from 'react';
import axios from 'axios';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Stack,TextField} from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Moment from 'moment';
// components
import ButtonContent from '../../components/formComponents/Button';
import TextFieldContent from '../../components/formComponents/TextField';
import LoaderContent from '../../components/formComponents/LoaderDialog';
import PhoneNumberContent from '../../components/formComponents/PhoneNumber';
import config from '../../config/config';
import TicketController from '../../controller/TicketController';

// ----------------------------------------------------------------------
export default class CustomerForm extends React.Component {
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state = {
        member_id:'',
        name: '',
        email:'',
        dob: new Date(),
        phone: '',
        first_visit: '',
        last_visit: '',
        visit_count: '',
        total_spent:'',
        loyality_point:'',
        status: 'Active',
        userdetail:{},
        isDisable: true,
        open: false,
        vertical: 'top',
        horizontal: 'center',
        customerSelected:{},
        isEdit: false,
        isLoading: false,
        businessdetail:{}
    };
    this.handlechange = this.handlechange.bind(this);
    this.handleclose = this.handleclose.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this); 
    this.handlechangememberId = this.handlechangememberId.bind(this);
  }
    componentDidMount(){
      setTimeout(() => {   
        if(this.props.customerToEdit !== undefined){
            this.setState({customerSelected: this.props.customerToEdit,isEdit : true,isDisable: false}, function(){
                let statevbl = this.state
                statevbl = this.state.customerSelected;
                this.setState(statevbl, function() {
                  console.log("1.update date", statevbl.dob)
                  this.setState({dob: new Date(statevbl.dob) }, function(){
                    console.log("2.update date", this.state.dob.toISOString())
                  })
                });
            })

        }
      }, 100);
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            this.setState({businessdetail:JSON.parse(businessdetail)})
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.customerToEdit !== prevState.customerSelected ) {
          return { customerSelected: nextProps.customerToEdit };
        }
        return null;
    }
    handlechange(e){
      // if(e.target.name === "loyality_point"){
      //   if(e.target.value.toString().match( "^.{6,6}$")===null) {
        
      //     let statevbl = this.state
      //     statevbl[e.target.name] = e.target.value;
      //     this.setState(statevbl);
      //     this.handleValidation();
      //   }
      // }
      if(e.target.name == "loyality_point") {
        if((e.target.value.match( "^.{"+config.inputprice+","+config.inputprice+"}$")===null)) {
            this.setState({ [e.target.name]: e.target.value });
            this.handleValidation();
        }
      }
      else{
        if(e.target.value.match( "^.{"+config.input+","+config.input+"}$")===null) {
          let statevbl = this.state
          statevbl[e.target.name] = e.target.value;
          this.setState(statevbl);
          this.handleValidation();
      }  
        
      }
      // else (e.target.value.match( "^.{"+config.input+","+config.input+"}$")===null) 
      // {
      //   let statevbl = this.state
      //   statevbl[e.target.name] = e.target.value;
      //   this.setState(statevbl);
      //   this.handleValidation();

      // }
     
        
    }

    handlechangememberId(e){
      const numberPattern = new RegExp(/^[0-9\b]+$/);
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

    handlechangePhone(e){
      // console.log("date", e)
      this.setState({phone: e});
      this.handleValidation();
    }

    handleChangeDate(e){
      // console.log(e);

      const datecomp = Moment(e).isBefore(new Date());
        
      console.log("handlechangeDate::",e, datecomp)
      if(datecomp) {
        this.setState({dob: e})
      }
      else{
        // formIsValid = false;
        this.setState({ isDisable: true })
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
      // else{
      //     this.setState({ isDisable: false })
      // }
      //email
      else if (!fields.email) {
          formIsValid = false;
          this.setState({ isDisable: true })
      }
      // else{
      //     this.setState({ isDisable: false })
      // }
      //phone
      else if (!fields.phone) {
          formIsValid = false;
          this.setState({ isDisable: true })
      }
      else if(this.state.phone.length < 14) {
        formIsValid = false;
        this.setState({ isDisable: true })
      }
      else{
        this.setState({ isDisable: false })
      }
    
      return formIsValid;
    }
    
    saveCustomer(){
      if(this.handleValidation()){
        this.setState({isLoading: true});
        var input =  Object.assign({},this.state);
        // if(input["member_id"] === ''){
        //     input["member_id"] = GenerateRandomCode.NumCode(3);
        // }
        let msg;
        // if(this.state.isEdit){
        //     input["id"] = this.state.customerSelected.id;
        //     msg = 'Updated successfully.';
        // }
        // else{
        //     msg = 'Saved successfully.';
        // }

        console.log("saveCustomer",input["dob"])
        delete input["userdetail"];
        delete input["open"]
        delete input["vertical"]
        delete input["horizontal"]
        delete input["isEdit"]
        delete input["customerSelected"]
        delete input["isDisable"]
        delete input["isLoading"]
        delete input["businessdetail"];
        input["dob"] = input["dob"].toISOString();
        var userdetail = window.localStorage.getItem('employeedetail');
        if(userdetail !== undefined && userdetail !== null){
            input["created_by"] = JSON.parse(userdetail).id;
            input["updated_by"] = JSON.parse(userdetail).id;
            input["businessId"] = this.state.businessdetail.id;
        }
        console.log(input);
        input["sync_status"] = 0;
        if(this.state.isEdit){ 
          this.ticketController.updateData({table_name:'customers', data: input, query_field:'sync_id', query_value:this.state.customerSelected.id}).then(()=>{ 
            this.props.afterSubmit('Updated successfully.');
            this.setState({isLoading: false});
          })
        }
        else{
            window.api.getSyncUniqueId().then(sync=>{
                var syncid = sync.syncid; 
                input["sync_id"] = syncid;
                input["mode"] = 'POS';
                this.ticketController.saveData({table_name:'customers', data:input}).then(r=>{ 
                    this.props.afterSubmit('Saved successfully.');
                    this.setState({isLoading: false});
                }) 
            })
        }


        // axios.post(config.root+`/customer/saveorupdate`, input).then(res=>{
        //     var status = res.data["status"];
        //     if(status === 200){
        //       this.props.afterSubmit(msg);
        //       this.setState({isLoading: false});
        //         // this.setState({open: true})
        //     }
        // }).catch(err=>{      
        // })
      }
    }

    handleclose(){
      this.props.afterSubmit();
    }
  

  render() {
    return (<div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '100%',background: 'white'}}>
    {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
      <form autoComplete="off" noValidate>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="Member ID"
              name="member_id"
              type="text"
              fullWidth
              disabled={this.state.isEdit}
              value={this.state.member_id}
              // onChange={this.handlechange}
              onChange={this.handlechangememberId}
            />
            <TextFieldContent
              label="Name"
              name="name"
              type="text"
              required
              fullWidth
              value={this.state.name}
              onChange={this.handlechange}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="Email"
              name="email"
              type="text"
              fullWidth
              required
              value={this.state.email}
              onChange={this.handlechange}
            />
            <PhoneNumberContent
              label="Mobile Number"
              required
              fullWidth 
              name="phone"
              value={this.state.phone}
              onChange={(e) => this.handlechangePhone(e)}
            />
          </Stack>
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="Total Spent"
              name="total_spent"
              type="text"
              fullWidth
              value={this.state.total_spent}
              onChange={this.handlechange}
            />
            <TextFieldContent
              label="Loyality Point"
              name="loyality_point"
              type="text"
              fullWidth
              value={this.state.loyality_point}
              onChange={this.handlechange}
            />
          </Stack> */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* <TextFieldContent
              label="DOB"
              name="dob"
              type="text"
              fullWidth
              value={this.state.dob}
              onChange={this.handlechange}
            /> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                name="dob"
                label="DOB"
                inputFormat="dd/MM/yyyy"
                maxDate={new Date()}
                value={this.state.dob}
                onChange={this.handleChangeDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
            <TextFieldContent
              label="Loyality Point"
              name="loyality_point"
              type="number"
              fullWidth
              value={this.state.loyality_point}
              onChange={this.handlechange}
            />
            {/* <TextFieldContent
              label="First Visit"
              name="first_visit"
              type="text"
              fullWidth
              value={this.state.first_visit}
              onChange={this.handlechange}
            /> */}
          </Stack>
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="Last Visit"
              name="last_visit"
              type="text"
              fullWidth
              value={this.state.last_visit}
              onChange={this.handlechange}
            />
            <TextFieldContent
              label="Visit Count"
              name="visit_count"
              type="text"
              fullWidth
              value={this.state.visit_count}
              onChange={this.handlechange}
            />
          </Stack> */}
          

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save' }  onClick={()=>this.saveCustomer()}/>
            <ButtonContent size="large" variant="outlined" label="Cancel" onClick={()=>this.handleclose()}/>
          </Stack>
        </Stack>
      </form>
    </div>
    );
  }
}
