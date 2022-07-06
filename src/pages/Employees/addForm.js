import React from 'react';
import axios from 'axios';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Stack,  InputLabel , FormControl, Select, MenuItem} from '@mui/material';
// components
import ButtonContent from '../../components/formComponents/Button';
import TextFieldContent from '../../components/formComponents/TextField';
import LoaderContent from '../../components/formComponents/LoaderDialog';
import PhoneNumberContent from '../../components/formComponents/PhoneNumber';
import config from '../../config/config';
// ----------------------------------------------------------------------
export default class EmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        lastName:'',
        userName:'',
        password: '',
        passcode: '',
        roleId:'',
        status: 'Active',
        mobile:'',
        email:'',
        userdetail:{},
        isDisable: true,
        open: false,
        vertical: 'top',
        horizontal: 'center',
        employeeSelected:{},
        isEdit: false,
        roles:[],
        existemail : false,
        isLoading: false,
        errormsg:'',
        onEdit_role:'',
        error:false,
        helperText:'',
        businessdetail:{},
        address1:'',
        address2:'',
        city:'',
        state:'',
        zipcode:''
    };
    this.handlechange = this.handlechange.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this)
    this.handlechangepasscode = this.handlechangepasscode.bind(this)
    this.handleChangeStatus = this.handleChangeStatus.bind(this)
  }
  componentDidMount(){
    var userdetail = window.localStorage.getItem('employeedetail');
    var businessdetail = window.localStorage.getItem('businessdetail');
    if(userdetail !== undefined && userdetail !== null){
        this.setState({userdetail:JSON.parse(userdetail), businessdetail:JSON.parse(businessdetail)}, function(){
          axios.get(config.root+`/employee/getroles/`+this.state.businessdetail.id).then(res=>{
            this.setState({roles:res.data.data} , function() {
              if(this.props.employeeSelected !== undefined){
                this.setState({employeeSelected: this.props.employeeSelected,isEdit : true,isDisable: false,onEdit_role:this.props.employeeSelected.staff_role}, function(){
                    let statevbl = this.state
                    statevbl = this.state.employeeSelected;
                    this.setState(statevbl);
                    // console.log(this.state.onEdit_role);

                    console.log("roles::", this.state.roles.length)

                    if(this.state.roles.length > 0 && this.state.employeeSelected.staff_role !== 'Owner'){
                      let selected_role = this.state.roles.filter(item => item.role === this.state.employeeSelected.staff_role);
                      console.log("roles::", this.state.roles)
                      this.setState({roleId: selected_role[0].id},function() {
                        // console.log("roles::", selected_role)
                      } )
                      
                    }
                   
                  
                })
            }
            })
            // console.log("roles",this.state.roles)
          })
          setTimeout(() => {   
           
          }, 100);
        })
      }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.employeeSelected !== prevState.employeeSelected ) {
        return { employeeSelected: nextProps.employeeSelected };
      }
      return null;
    }
    handlechange(e){

        if(e.target.name === "zipcode"){
          //  console.log("zipcode",e.target.value.match( "^.{6,6}$"))
          if(e.target.value.toString().match( "^.{6,6}$")===null) {
          
            let statevbl = this.state
            statevbl[e.target.name] = e.target.value;
            this.setState(statevbl);
            this.handleValidation();
          }
        }
        else if(e.target.name === "state"){
          if(e.target.value.match( "^.{3,3}$")===null) {
            let statevbl = this.state
            statevbl[e.target.name] = e.target.value;
            this.setState(statevbl);
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
    }

    handlechangepasscode(e){
      const numberPattern = new RegExp(/^[0-9\b]+$/);
      if (numberPattern.test(e.target.value)) {
        if(this.state.passcode.length < 4){
          this.setState({passcode: e.target.value});
        }else{
          if(this.state.passcode.length > e.target.value.length){
            var str = this.state.passcode
           this.setState({passcode: str.slice(0, -1)});
          }
        }
        this.handleValidation();
        
      }else{
        this.setState({passcode: ''});
      }
    }

    handlechangePhone(e){
      // console.log("date", e)
      this.setState({mobile: e});
    }

    handleValidation(){
      let formIsValid = true;
      let fields = this.state;
      //First Name
      if (!fields.firstName && fields.firstName === '') {
          formIsValid = false;
          this.setState({ isDisable: true })
      }
     
      //Last Name
      else if (!fields.lastName && fields.lastName === '') {
          formIsValid = false;
          this.setState({ isDisable: true })
      }

      //address1
      else if (!fields.address1 && fields.address1 === '') {
        formIsValid = false;
        this.setState({ isDisable: true })
      }
      //city
      else if (!fields.city && fields.city === '') {
        formIsValid = false;
        this.setState({ isDisable: true })
      }
      //state
      else if (!fields.state && fields.state === '') {
        formIsValid = false;
        this.setState({ isDisable: true })
      }
      //state
      else if (!fields.zipcode && fields.zipcode === '') {
        formIsValid = false;
        this.setState({ isDisable: true })
      }

      //roleId
      else if (!fields.roleId) {
        formIsValid = false;
        this.setState({ isDisable: true,error: true, helperText:'Role is required !' })
      }

      //mobile
      // else if (!fields.mobile) {
      //     formIsValid = false;
      //     this.setState({ isDisable: true })
      // }
      // else if(this.state.mobile.length < 14) {
      //   formIsValid = false;
      //   this.setState({ isDisable: true })
      // }

      //Passcode
      else if (!fields.passcode) {
        formIsValid = false;
        this.setState({ isDisable: true })
      }
      else if (fields.passcode.length < 3) {
        formIsValid = false;
        this.setState({ isDisable: true })
      }

      else{
        this.setState({ isDisable: false ,error: false, helperText:''})
      }

      if(this.state.isEdit) {
        formIsValid = true;
        this.setState({ isDisable: false })
      }
      return formIsValid;

    }
    handleClose(){
        this.setState( { open: false})
    }

    handleChangeRole(e) {
        this.setState({roleId:e.target.value})
        this.handleValidation();
    }
    handleChangeStatus(e) {
        this.setState({status:e.target.value})
    }
    saveEmployee(){
      if(this.handleValidation()){
        this.setState({isLoading: true, existemail:false, errormsg:''});
        var input =  Object.assign({},this.state)
        if(this.state.isEdit){
            input["id"] = this.state.employeeSelected.id;
        }
        input["businessId"]= this.state.businessdetail.id
        delete input["roles"]
        delete input["userdetail"];
        delete input["error"];
        delete input["isDisable"]
        delete input["isfNameEmpty"]
        delete input["errorTextfName"]
        delete input["isemailEmpty"]
        delete input["errorTextemail"]
        delete input["isPassEmpty"]
        delete input["errorTextPass"]
        delete input["ismobileEmpty"]
        delete input["errorTextmobile"]
        delete input["isroleEmpty"]
        delete input["errorTextrole"]
        delete input["open"]
        delete input["vertical"]
        delete input["horizontal"]
        delete input["password"]
        delete input["isLoading"]
        delete input["onEdit_role"]
        delete input["error"]
        delete input["helperText"]
        input["userName"] = input["email"];
        var userdetail = window.localStorage.getItem('employeedetail');
        console.log("userdetail",userdetail)
        if(userdetail !== undefined && userdetail !== null){
            input["created_by"] = JSON.parse(userdetail).id;
            input["updated_by"] = JSON.parse(userdetail).id;
        }

        var staff_roleinput = {};
        staff_roleinput['businessId'] = this.state.businessdetail.id;
        staff_roleinput['role'] = this.state.roleId;
        staff_roleinput['status'] = 'active';
        staff_roleinput["created_at"] = new Date();
        staff_roleinput["updated_at"] = new Date();
        staff_roleinput["created_by"] = JSON.parse(userdetail).id;
        staff_roleinput["updated_by"] = JSON.parse(userdetail).id;

        if(this.state.isEdit){

          console.log("isEdit")
            delete input["clocked_status"];
            delete input["employeeSelected"];
            delete input["isEdit"];
            delete input["staff_role"];

            axios.post(config.root+`/users/checkpasscode`, {userid: input["id"], passcode:this.state.passcode, businessid:input["businessId"]}).then(res=>{
                    let data = res.data;
                    if(data.isexist === 1){
                        this.setState({existemail:true, errormsg: data.msg, isLoading:false})
                    }else{
                      axios.post(config.root+`/employee/saveorupdate`, input).then(res=>{
                        var status = res.data["status"];
                        if(status === 200){
                            this.props.afterSubmit('Updated successfully.');
                            this.setState({isLoading: false});
                        }
                    })

                    }

            })


            
        }
        else{
            delete input["employeeSelected"];
            delete input["isEdit"];
            // console.log("save")
            // axios.post(config.root+`/employee/staff_role/saveorupdate`, staff_roleinput).then(res=>{
            //     var status = res.data["status"];
            //     if(status === 200){
            //         input['roleId'] = res.data["data"].insertId;
            input["roletype"] = staff_roleinput['role'];
            // if(this.state.email !== ''){
                axios.post(config.root+`/users/checkemail`, {mobile:this.state.mobile, email:this.state.email, passcode:this.state.passcode, businessid:input["businessId"]}).then(res=>{
                    let data = res.data;
                    if(data.isexist === 1){
                        this.setState({existemail:true, errormsg: data.msg, isLoading:false})
                    }
                    else{
                        axios.post(config.root+`/employee/saveorupdate`, input).then(res=>{ 
                                setTimeout(() => {
                                  if (typeof window !== 'undefined') {
                                    this.props.afterSubmit('Added successfully.');
                                    this.setState({isLoading: false});
                                    // window.location.href = "/dashboard/employee";
                                  }
                                }, 1000);
                        }).catch(err=>{      
                        })
                    }
                });
            // }else{
            //       axios.post(config.root+`/employee/saveorupdate`, input).then(res=>{ 
            //         setTimeout(() => {
            //           if (typeof window !== 'undefined') {
            //             this.props.afterSubmit('Added successfully.');
            //             this.setState({isLoading: false});
            //             // window.location.href = "/dashboard/employee";
            //           }
            //         }, 1000);
            //       }).catch(err=>{      
            //       })
              
            // }

        

        }
      }

    }

  

  render() {
    // console.log("render:", this.state.roleId)
    return ( <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '100%',background: 'white'}}>
    {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
      <form autoComplete="off" noValidate>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="First Name"
              name="firstName"
              type="text"
              required
              fullWidth
              value={this.state.firstName}
              onChange={this.handlechange}
            />
            <TextFieldContent
              label="Last Name"
              name="lastName"
              type="text"
              required
              fullWidth
              value={this.state.lastName}
              onChange={this.handlechange}
            />
          </Stack>
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="User Name"
              name="userName"
              type="text"
              fullWidth
              value={this.state.userName}
              onChange={this.handlechange}
            />
            <TextFieldContent
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={this.state.password}
              onChange={this.handlechange}
            />
          </Stack> */}
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              label="Email"
              name="email"
              type="text" 
              fullWidth
              disabled={this.state.isEdit}
              value={this.state.email}
              onChange={this.handlechange}
            />
             <PhoneNumberContent
              label="Mobile Number"
              required
              fullWidth 
              name="mobile"
              disabled={this.state.isEdit}
              value={this.state.mobile}
              onChange={(e) => this.handlechangePhone(e)}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent fullWidth label="Address 1" required name="address1" value={this.state.address1} onChange={this.handlechange}/>
            <TextFieldContent fullWidth label="Address 2" name="address2" value={this.state.address2} onChange={this.handlechange}  /> 
          </Stack> 
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent fullWidth label="City" required name="city" value={this.state.city} onChange={this.handlechange}/>
            <TextFieldContent fullWidth label="State" required  name="state" value={this.state.state} onChange={this.handlechange}  /> 
            <TextFieldContent type="number" fullWidth label="Zipcode" required  name="zipcode" value={this.state.zipcode} onChange={this.handlechange}  /> 
          </Stack> 

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth required >
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                labelId=""
                id="roleId"
                name="roleId"
                value={this.state.onEdit_role === 'Owner'? 'Owner': this.state.roleId}
                disabled={this.state.onEdit_role === 'Owner'? true: false}
                error={this.state.error}
                helperText={this.state.helperText}
                label="Role"
                onChange={this.handleChangeRole}
                > 
                  {this.state.onEdit_role === 'Owner' ? <MenuItem value='Owner' >Owner</MenuItem> :
                        this.state.roles.map(elmt=>(
                            <MenuItem value={elmt.id}>{elmt.role}</MenuItem>
                        ))
                  }
                </Select>
            </FormControl>
            
            <TextFieldContent
              label="PassCode"
              name="passcode"
              required
              type="text"
              fullWidth
              value={this.state.passcode}
              // onChange={this.state.passcode.length < 4 ? this.handlechange : ''}
              onChange={this.handlechangepasscode}
            />
          </Stack>

          {/* <Stack direction={{ xs: 'column', sm: 'row' }} style={{display: this.state.onEdit_role === 'Owner'? 'block':'none'}}>
            <TextFieldContent
              label="Role"
              name="role"
              type="text"
              fullWidth
              value={this.state.onEdit_role}
              disabled={this.state.isEdit}
            />
            <TextFieldContent
              label="PassCode"
              name="passcode"
              required
              type="text"
              fullWidth
              value={this.state.passcode}
              onChange={this.handlechangepasscode}
            />
          </Stack> */}
          
          
        
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center"> 
            {this.state.existemail && <p className='errormsg' style={{color:'#FF4842', padding:'0 10px'}}>{this.state.errormsg}</p>} 
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save' }   onClick={()=>this.saveEmployee()}/>
            <ButtonContent size="large" variant="outlined" label="Cancel" onClick={()=>this.props.afterSubmit('')}/>
          </Stack>
        </Stack>
      </form>
      </div>
    );
  }
}
