import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Link, Stack, Container, Typography, CardContent, Breadcrumbs } from '@mui/material';
// components 
import DiscountForm from './addForm';

// ----------------------------------------------------------------------
export default class CreateDiscounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      discountSelected: {},
      isEdit: false,
    };
    this.handleTable = this.handleTable.bind(this);
  }
  componentDidMount(){
    if(this.props.discountSelected !== undefined){
        this.setState({ discountSelected: this.props.discountSelected });
        this.setState({ isEdit: true });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.discountSelected !== prevState.discountSelected ) {
      return { discountSelected: nextProps.discountSelected };
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
            {this.state.isEdit ? <Typography variant="h4" gutterBottom> Edit Discount </Typography> : <Typography variant="h4" gutterBottom> Create Discount </Typography> }
          
          </Stack>
          <Card>
            <CardContent>
            {this.state.isEdit ?
                 <DiscountForm afterSubmit={(msg)=>{this.handleTable(msg);}} discountToEdit={this.state.discountSelected}/> 
                 :
                 <DiscountForm afterSubmit={(msg)=>{this.handleTable(msg);}}/> 
              }
            </CardContent>
          </Card>
        </Container> 
    );
  }
}
