import PropTypes from 'prop-types';
import React from 'react';
// material
import MuiPhoneNumber from 'material-ui-phone-number';

export default class PhoneNumberContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          helperText: '',
          error: false,
        }
    }

    validationCheck = (e) => {
        this.setState({helperText: '', error: false });
        // const mblePattern = new RegExp(/^[0-9\b]+$/);
        // const mblePattern = new RegExp(/^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/); 
        // const mblePattern = new RegExp(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/);
        // const mblePattern = new RegExp(/^(((\+?\(91\))|0|((00|\+)?91))-?)?[7-9]\d{9}$/);
        // MobileNumber
        if (e.target.name === 'mobile' || e.target.name === 'phone' || e.target.name === 'businessphone') {
            // //console.log(e.target.value.length);
            
            // if (!mblePattern.test(e.target.value)) {
            //   this.setState({helperText: 'Please enter valid number.', error: true});
            // } 
            // else 
            if (e.target.value.length < 15 && e.target.value !== '') {
              this.setState({helperText: 'Please enter valid phone number.', error: true});
            } else {
              this.setState({helperText: '', error: false});
            }
        }
        else{
            this.setState({helperText: '', error: false});
        }
    }

    render() {
        return(
            <MuiPhoneNumber
              defaultCountry={'us'}
              fullWidth 
              label={this.props.label}
              regions={['america', 'asia']}
              name={this.props.name}
              id={this.props.id}
              error={this.state.error}
              helperText={this.state.helperText}
              value={this.props.value}
              variant="outlined"
              onChange={this.props.onChange}
              onBlur={this.validationCheck}
              required={this.props.required}
              disabled={this.props.disabled}
              sx={{
                svg:{
                  height:"20px"
                }
              }}
            />
        )
    }
}
MuiPhoneNumber.propTypes = {
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
  };