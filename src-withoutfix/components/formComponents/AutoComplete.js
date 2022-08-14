import PropTypes from 'prop-types';
import React from 'react';
// material
import { Autocomplete, TextField } from '@mui/material';

const states = [
    {
      "name": "Alaska",
      "value": "AK"
    },
    {
      "name": "American Samoa",
      "value": "AS"
    },
    {
      "name": "Arizona",
      "value": "AZ"
    },
    {
      "name": "Arkansas",
      "value": "AR"
    },
    {
      "name": "California",
      "value": "CA"
    },
    {
      "name": "Colorado",
      "value": "CO"
    },
    {
      "name": "Connecticut",
      "value": "CT"
    },
    {
      "name": "Delaware",
      "value": "DE"
    },
    {
      "name": "District Of Columbia",
      "value": "DC"
    },
    {
      "name": "Federated States Of Micronesia",
      "value": "FM"
    },
    {
      "name": "Florida",
      "value": "FL"
    },
    {
      "name": "Georgia",
      "value": "GA"
    },
    {
      "name": "Guam",
      "value": "GU"
    },
    {
      "name": "Hawaii",
      "value": "HI"
    },
    {
      "name": "Idaho",
      "value": "ID"
    },
    {
      "name": "Illinois",
      "value": "IL"
    },
    {
      "name": "Indiana",
      "value": "IN"
    },
    {
      "name": "Iowa",
      "value": "IA"
    },
    {
      "name": "Kansas",
      "value": "KS"
    },
    {
      "name": "Kentucky",
      "value": "KY"
    },
    {
      "name": "Louisiana",
      "value": "LA"
    },
    {
      "name": "Maine",
      "value": "ME"
    },
    {
      "name": "Marshall Islands",
      "value": "MH"
    },
    {
      "name": "Maryland",
      "value": "MD"
    },
    {
      "name": "Massachusetts",
      "value": "MA"
    },
    {
      "name": "Michigan",
      "value": "MI"
    },
    {
      "name": "Minnesota",
      "value": "MN"
    },
    {
      "name": "Mississippi",
      "value": "MS"
    },
    {
      "name": "Missouri",
      "value": "MO"
    },
    {
      "name": "Montana",
      "value": "MT"
    },
    {
      "name": "Nebraska",
      "value": "NE"
    },
    {
      "name": "Nevada",
      "value": "NV"
    },
    {
      "name": "New Hampshire",
      "value": "NH"
    },
    {
      "name": "New Jersey",
      "value": "NJ"
    },
    {
      "name": "New Mexico",
      "value": "NM"
    },
    {
      "name": "New York",
      "value": "NY"
    },
    {
      "name": "North Carolina",
      "value": "NC"
    },
    {
      "name": "North Dakota",
      "value": "ND"
    },
    {
      "name": "Northern Mariana Islands",
      "value": "MP"
    },
    {
      "name": "Ohio",
      "value": "OH"
    },
    {
      "name": "Oklahoma",
      "value": "OK"
    },
    {
      "name": "Oregon",
      "value": "OR"
    },
    {
      "name": "Palau",
      "value": "PW"
    },
    {
      "name": "Pennsylvania",
      "value": "PA"
    },
    {
      "name": "Puerto Rico",
      "value": "PR"
    },
    {
      "name": "Rhode Island",
      "value": "RI"
    },
    {
      "name": "South Carolina",
      "value": "SC"
    },
    {
      "name": "South Dakota",
      "value": "SD"
    },
    {
      "name": "Tennessee",
      "value": "TN"
    },
    {
      "name": "Texas",
      "value": "TX"
    },
    {
      "name": "Utah",
      "value": "UT"
    },
    {
      "name": "Vermont",
      "value": "VT"
    },
    {
      "name": "Virgin Islands",
      "value": "VI"
    },
    {
      "name": "Virginia",
      "value": "VA"
    },
    {
      "name": "Washington",
      "value": "WA"
    },
    {
      "name": "West Virginia",
      "value": "WV"
    },
    {
      "name": "Wisconsin",
      "value": "WI"
    },
    {
      "name": "Wyoming",
      "value": "WY"
    }
  ];

export default class AutoCompleteContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          helperText: '',
          error: false,
        }
    }
    validationCheck = (e) => {
      console.log(e.target.value);
      this.setState({helperText: '', error: false });
      if(e.target.value === '' || e.target.value === null){
        console.log("if")
        this.setState({helperText: 'State required!', error: true});
      }
      else{
        console.log("else")
        this.setState({helperText: '', error: false});
      }

      // console.log(e.target);
      // console.log(e.target.name);
      // console.log(e.target.value);
      //   this.setState({helperText: '', error: false });
      //   if (e.target.name === 'state') {
      //         this.setState({helperText: 'State required!', error: true});
      //   }
      //   else{
      //       this.setState({helperText: '', error: false});
      //   }
    }
    render() {
      let selectedValue = null;
      console.log(this.props.value)
      if(this.props.value !== null){
        let res = states.filter(item => item.value === this.props.value);
         selectedValue = res[0];
         console.log(selectedValue);
      }
      
      
        return(
          
            <Autocomplete
                fullWidth
                disablePortal
                id={this.props.id}
                options={states}
                // value={this.props.value}
                value={selectedValue}
                onChange={this.props.onChange}
                name={this.props.name}
                getOptionLabel={option => `${option.name} ( ${option.value} )`}
                renderInput={params => (
                    <TextField {...params} 
                    label={this.props.label} 
                    required={this.props.required}
                    helperText={this.state.helperText}
                    error={this.state.error}
                    
                    variant="outlined" />
                  )}
                
                
                onBlur={this.validationCheck}
                disabled={this.props.disabled}
            />
        )
    }

}

Autocomplete.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    error: PropTypes.bool,
    disabled:PropTypes.bool,
    helperText: PropTypes.string,
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
    onChange: PropTypes.func,
    label: PropTypes.string,
    selectedValue: PropTypes.string
    // inputValue: PropTypes.string,

}