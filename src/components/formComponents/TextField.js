import PropTypes from 'prop-types';
import React from 'react';
// material
import { TextField } from '@mui/material';
import NumberFormat from "react-number-format";
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
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


export default class TextFieldContent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        helperText: '',
        error: false,
        // inputProps: { maxLength: 25}
      }
  }
  
  validationCheck = (e) => {
    this.setState({helperText: '', error: false });
    // //console.log(e.target.type)
    // //console.log(e.target.required)
    // //console.log(e.target.name)
    const mblePattern = new RegExp(/^[0-9\b]+$/);
    if (e.target.type === 'text' && e.target.required === true) {      
      if (!e.target.value && e.target.name !== 'email') {
        this.setState({helperText: this.props.label +' required !', error: true});
      } 
      // Email
      else if (e.target.name === 'email' || e.target.name === 'username' ) {
        const lastAtPos = e.target.value.lastIndexOf('@');
        const lastDotPos = e.target.value.lastIndexOf('.');

        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            e.target.value.indexOf('@@') === -1 &&
            lastDotPos > 2 &&
            e.target.value.length - lastDotPos > 2
          )
        ) {
          this.setState({helperText: this.props.label+' is not valid', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      // Passcode - Employee
      else if (e.target.name === 'passcode' && typeof e.target.value !== 'undefined') {
      
        if (e.target.value.length < 4) {
          this.setState({helperText: 'Please enter valid 4-digit code.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      // Passcode - Owner passcode in create business
      else if (e.target.name === 'user_passcode' && typeof e.target.value !== 'undefined') {
        
        if (e.target.value.length < 4) {
          this.setState({helperText: 'Please enter valid 4-digit code.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      else {
        this.setState({helperText: '', error: false});
      }
    } 
   
    else if (e.target.type === 'number') {     
      // MobileNumber
      if (e.target.name === 'mobile' || e.target.name === 'phone') {
        
        if (!mblePattern.test(e.target.value)) {
          this.setState({helperText: 'Please enter only number.', error: true});
        } else if (e.target.value.length !== 10 && e.target.value !== '') {
          this.setState({helperText: 'Please enter valid 10-digit phone number.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      // Busoness Phonenumber
      if (e.target.name === 'businessphone' && typeof e.target.value !== 'undefined') {
        // this.setState({inputProps: { maxLength: 10}})
        
        if (!mblePattern.test(e.target.value)) {
          this.setState({helperText: 'Please enter only number.', error: true});
        } else if (e.target.value.length !== 10 && e.target.value !== '') {
          this.setState({helperText: 'Please enter valid 10-digit phone number.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      // Agent Code/Staff Id passcode
      if (e.target.name === 'user_code' && typeof e.target.value !== 'undefined') {
       
        if (!mblePattern.test(e.target.value)) {
          this.setState({helperText: 'Please enter only number.', error: true});
        } else if (e.target.value.length !== 4) {
          this.setState({helperText: 'Please enter valid 4-digit code.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
     //Product&service Price  
      if (e.target.required === true) {
        if (e.target.value === 0 || e.target.value === '') {
          this.setState({helperText: this.props.label +' required!', error: true});
        } 
        else {
          this.setState({helperText: '', error: false});        
        }
      }
    }
    
    else if (e.target.type === 'password') {
      if (!e.target.value) {
        this.setState({helperText: 'Field required', error: true});
      } 
      else {
        this.setState({helperText: '', error: false});
      }
    }
    else if(e.target.type === 'text' && e.target.name === 'email' && e.target.value !== ''){
      const lastAtPos = e.target.value.lastIndexOf('@');
      const lastDotPos = e.target.value.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          e.target.value.indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          e.target.value.length - lastDotPos > 2
        )
      ) {
        this.setState({helperText: this.props.label+' is not valid', error: true});
      } else {
        this.setState({helperText: '', error: false});
      }

    }

    else{
      this.setState({helperText: '', error: false});
    }
  };

  render() {
    let selectedDot = false;
    return (
      <TextField
        label={this.props.label}
        name={this.props.name}
        id={this.props.id}
        error={this.state.error}
        helperText={this.state.helperText}
        type={this.props.type}
        value={this.props.value}
        required={this.props.required}
        disabled={this.props.disabled}
        color={this.props.color}
        fullWidth={this.props.fullWidth}
        onBlur={this.validationCheck}
        onChange={this.props.onChange}
        // inputProps={this.props.inputProps}
        inputProps={this.state.inputProps}
        InputProps={this.props.InputProps}
        style={this.props.style}
        defaultValue={this.props.defaultValue}
        rows={this.props.rows}
        multiline={this.props.rows}
        // inputComponent = {(e)=>{
        //   if(e.target.name == "price") {
        //     console.log("currency")
        //     return NumberFormatCustom
        //   }
        // }}
        // onKeyPress ={this.props.onKeyPress}
        onSelect = {(e) => {
          if(window.getSelection().toString().indexOf(".") > -1) selectedDot = true;
        }}
        onKeyDown = {(e)=>{
          // console.log("onKeyDown::",e.target.value)
          if(e.target.name === "check_percentage"   || e.target.name === "cash_percentage" || e.target.name === "owner_percentage"   || e.target.name === "emp_percentage" ||
          e.target.name === "tax_value" || e.target.name === "employee_percentage" || e.target.name === "owner_percentage"||
          e.target.name === "check_percentage" || e.target.name === "cash_percentage" || e.target.name === "employee_percentage" || e.target.name === "owner_percentage" ||
          e.target.name === "discount_value" || e.target.name === "emp_division" ||e.target.name === "owner_division" || e.target.name === "service_price" || e.target.mame === "variable_price"
          ||e.target.name === "price" || e.target.name === "cost"
          ){  
            // console.log(e.target.value+e.key);
            if(e.key === 'e'  || e.key === "+" || e.key === "-" ){
                e.preventDefault();
            }
            if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) {
              
                e.preventDefault();
               
            }
          }
        }}
       
      />
    );
  }
}
TextFieldContent.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.bool,
  disabled:PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error'
  ]),
  fullWidth: PropTypes.bool,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  InputProps: PropTypes.object,
  style: PropTypes.object,
  defaultValue: PropTypes.number,
  rows: PropTypes.object,
  multiline:PropTypes.bool,
  onKeyPress: PropTypes.func
};
