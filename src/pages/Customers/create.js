import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Link, Stack, Container, Typography, CardContent } from '@mui/material';
// components
import CustomerForm from './addForm';

// ----------------------------------------------------------------------
export default class CreateCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerSelected: {},
      isEdit: false,
    };
    this.handleTable = this.handleTable.bind(this);
  }
  componentDidMount(){
    if(this.props.customerSelected !== undefined){
        this.setState({ customerSelected: this.props.customerSelected });
        this.setState({ isEdit: true });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.customerSelected !== prevState.customerSelected ) {
      return { customerSelected: nextProps.customerSelected };
    }
    return null;
  }
  handleTable(msg){
    this.props.afterSubmitForm(msg);
  }

  render() {
    return ( 
        <Container maxWidth="xl">
          <Stack direction="column" alignItems="left" mb={3} mt={3}>
            {this.state.isEdit ? <Typography variant="h4" gutterBottom> Edit Customer </Typography> : <Typography variant="h4" gutterBottom> Create Customer </Typography> } 
          </Stack>
          <Card>
            <CardContent>
            {this.state.isEdit ?
                 <CustomerForm afterSubmit={(msg)=>{this.handleTable(msg);}} customerToEdit={this.state.customerSelected}/> 
                 :
                 <CustomerForm afterSubmit={(msg)=>{this.handleTable(msg);}}/> 
              }
            </CardContent>
          </Card>
        </Container> 
    );
  }
}
