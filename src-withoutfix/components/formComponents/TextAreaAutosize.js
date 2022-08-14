// import PropTypes from 'prop-types';
import React from 'react';
// material
import { TextField } from '@mui/material';
import { outlinedInputClasses } from "@mui/material/OutlinedInput"; 
import { styled } from "@mui/material/styles";
 
export default class TextareaAutosizeContent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        helperText: '',
        error: false
      }
  }
  
  validationCheck = (e) => {
    this.setState({helperText: '', error: false});
    //console.log(e.target.type)
    const mblePattern = new RegExp(/^[0-9\b]+$/);
    if (e.target.type === 'text' && e.target.required === true) {
      
      if (!e.target.value && e.target.name !== 'email') {
        this.setState({helperText: 'Field required', error: true});
      } 
      // Email
      else if (e.target.name === 'email' && typeof e.target.value !== 'undefined') {
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
          this.setState({helperText: 'Email is not valid', error: true});
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
      if (e.target.name === 'mobile' && typeof e.target.value !== 'undefined') {
        if (!mblePattern.test(e.target.value)) {
          this.setState({helperText: 'Please enter only number.', error: true});
        } else if (e.target.value.length !== 10 && e.target.value !== '') {
          this.setState({helperText: 'Please enter valid phone number.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      // Busoness Phonenumber
      if (e.target.name === 'businessphone' && typeof e.target.value !== 'undefined') {
        if (!mblePattern.test(e.target.value)) {
          this.setState({helperText: 'Please enter only number.', error: true});
        } else if (e.target.value.length !== 10 && e.target.value !== '') {
          this.setState({helperText: 'Please enter valid phone number.', error: true});
        } else {
          this.setState({helperText: '', error: false});
        }
      }
      // Agent Code/Staff Id
      if (e.target.name === 'user_code' && typeof e.target.value !== 'undefined') {
        if (!mblePattern.test(e.target.value)) {
          this.setState({helperText: 'Please enter only number.', error: true});
        } else if (e.target.value.length !== 4) {
          this.setState({helperText: 'Please enter valid 4-digit code.', error: true});
        } else {
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
  };

  render() {
    return (
      
   

       <StyledTextField
        label={this.props.label}
        name={this.props.name}
        id={this.props.id}
        error={this.state.error}
        // helperText={this.state.helperText}
        type={this.props.type}
        value={this.props.value}
        required={this.props.required}
        disabled={this.props.disabled}
        // color={this.props.color}
        fullWidth={this.props.fullWidth}
        onBlur={this.validationCheck}
        onChange={this.props.onChange}
        inputProps={this.props.inputProps}
        InputProps={this.props.InputProps}
        placeholder={this.props.placeholder}
        variant={this.props.variant}
        
        multiline={true}
        rows={this.props.rows}
      />

    );
  }
}


const StyledTextField = styled(TextField)({
  
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
    borderBottom:'1px #00AB5',
    borderTop:0,borderLeft:0,
    borderRight:0,
    borderColor: '#134163'
  }, 

});

