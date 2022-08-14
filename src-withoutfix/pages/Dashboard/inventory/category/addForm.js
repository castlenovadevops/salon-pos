import React from 'react';
// material
import { Stack } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// components
import TextFieldContent from '../../../../components/formComponents/TextField';
// import TextAreaContent from '../../../components/TextArea';
import ButtonContent from '../../../../components/formComponents/Button';
import LoaderContent from '../../../../components/formComponents/LoaderDialog';

import config from '../../../../config/config';
import TicketController from '../../../../controller/TicketController';

// ----------------------------------------------------------------------
export default class CategoryForm extends React.Component {
  ticketController = new TicketController();
  constructor(props) {
    super(props);
    this.state = {
        name:'',
        status:'Active',
        description:'',
        employeedetail:{},
        isDisable: true, 
        errorText:'',
        isEmpty:false,
        categorySelected:{},
        isEdit: false,
        isLoading: false,
    };
    this.handlechange = this.handlechange.bind(this);
    this.handleclose = this.handleclose.bind(this);
  }
  componentDidMount(){
    setTimeout(() => {   
      if(this.props.categoryToEdit !== undefined){
          this.setState({categorySelected: this.props.categoryToEdit,isEdit : true,isDisable: false}, function(){
              let statevbl = this.state
              statevbl = this.state.categorySelected;
              this.setState(statevbl);
          })

      }
    }, 100);
    var employeedetail = window.localStorage.getItem('employeedetail');
    if(employeedetail !== undefined && employeedetail !== null){
        this.setState({employeedetail:JSON.parse(employeedetail)})
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    setTimeout(() => {   
      if (nextProps.categoryToEdit !== prevState.categorySelected ) {
      return { categorySelected: nextProps.categoryToEdit };
      }
      return null;
    }, 100);
  }

  handlechange(e){
    if(e.target.name === "name"){
      if(e.target.value.match( "^.{"+config.input+","+config.input+"}$")===null) {
        let statevbl = this.state
        statevbl[e.target.name] = e.target.value;
        this.setState(statevbl);
        this.handleValidation();
      }
    }
    else{
      let statevbl = this.state
      statevbl[e.target.name] = e.target.value;
      this.setState(statevbl);
      this.handleValidation();

    }
  }
  handleValidation(){
    let formIsValid = true;
    let fields = this.state;
    //Category Name
    if (!fields.name) {
        formIsValid = false;
        this.setState({ isDisable: true })
    }
    else{
        this.setState({ isDisable: false })
    }
    return formIsValid;
  }
    saveCategory(){
      if(this.handleValidation()){
        this.setState({isLoading: true});
            var input = Object.assign({},  this.state)
            let msg;

        window.api.getSyncUniqueId().then(sync=>{
          var syncid = sync.syncid; 

            // if(this.state.isEdit){
            //     input["id"] = this.state.categorySelected.id;
            //     msg = 'Updated successfully.';
            // }
            // else{
            //     msg = 'Saved successfully.';
            // }
            delete input["employeedetail"];
            delete input["isDisable"]
            delete input["errorText"];
            delete input["isEmpty"]
            delete input["isLoading"]
            
            var employeedetail = window.localStorage.getItem('employeedetail');
            var businessdetail = window.localStorage.getItem('businessdetail');
            if(employeedetail !== undefined && employeedetail !== null){
                input["created_by"] = JSON.parse(employeedetail).id;
                input["updated_by"] = JSON.parse(employeedetail).id;
                input["businessId"] = JSON.parse(businessdetail).id;
            }
            delete input["categorySelected"];
            delete input["isEdit"];
            input["sync_status"] = 0;
            if(this.state.isEdit){
              // input["id"] = this.state.categorySelected.id;
              this.ticketController.updateData({table_name:'category', data: input, query_field:'sync_id', query_value:this.state.categorySelected.id}).then(()=>{ 
                this.props.afterSubmit('Updated successfully.');
                this.setState({isLoading: false});
              })
            }
            else{
              input["sync_id"] = syncid;
              input["mode"] = 'POS';
              this.ticketController.saveData({table_name:'category', data:input}).then(r=>{ 
                  this.props.afterSubmit('Saved successfully.');
                  this.setState({isLoading: false});
              }) 
            }

            // axios.post(config.root+`/inventory/category/saveorupdate`, input).then(res=>{
            //     var status = res.data["status"];
            //     if(status === 200){
            //       this.props.afterSubmit(msg);
            //       this.setState({isLoading: false});
            //     }
            // }).catch(err=>{      
            // })
          });
      }
        
    }
    handleclose(){
      this.props.afterSubmit('');
    }



  render() {
    return (<div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '100%',background: 'white', width: '60%'}}>
      {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
      <form autoComplete="off" noValidate>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextFieldContent
              fullWidth
              label="Category Name"
              name="name"
              id="name"
              required
              value={this.state.name}
              onChange={this.handlechange}
            />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextFieldContent
                label="Description"
                name="description"
                placeholder="Description"
                rows={3}
                fullWidth
                multiline={true}
                value={this.state.description}
                // style={{ width: 1200 }}
                onChange={this.handlechange}
              />
            </Stack>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save' } onClick={()=>this.saveCategory()}/>
            <ButtonContent size="large" variant="outlined" label="Cancel" onClick={()=>this.handleclose()}/>
          </Stack>
        </Stack>
      </form>
      </div>
    );
  }
}
