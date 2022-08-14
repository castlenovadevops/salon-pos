import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Link, Stack, Container, Typography, CardContent, Breadcrumbs } from '@mui/material';
// components 
import ProductForm from './addForm';

// ----------------------------------------------------------------------
export default class CreateProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceSelected: {},
        isEdit: false,
    };
    this.handleTable = this.handleTable.bind(this);
  }
  componentDidMount(){
    if(this.props.serviceSelected !== undefined){
        this.setState({ serviceSelected: this.props.serviceSelected });
        this.setState({ isEdit: true });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.serviceSelected !== prevState.serviceSelected ) {
      return { serviceSelected: nextProps.serviceSelected };
    }
    return null;
  }
  handleTable(msg){
    this.props.afterSubmitForm(msg);
  }

  render() {
    return ( 
        <Container maxWidth="xl">
          <Stack direction="column" alignItems="left" mb={5}>
            {this.state.isEdit ? <Typography variant="h4" gutterBottom> Edit Product & Services </Typography> : <Typography variant="h4" gutterBottom> Create Product & Services </Typography> }
            
            <Breadcrumbs separator=">" aria-label="breadcrumb">
              <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard/app">
                Dashboard
              </Link>
              <Link className="pointer" underline="hover" color="inherit" onClick={() => this.handleTable()}>
                Product & Services
              </Link>
              {this.state.isEdit ? <Typography color="text.primary">Edit Product & Services</Typography> : <Typography color="text.primary">Add Product & Services</Typography> }
            </Breadcrumbs>
          </Stack>
          <Card>
            <CardContent>
            {this.state.isEdit ?
                 <ProductForm afterSubmit={(msg)=>{this.handleTable(msg);}} serviceToEdit={this.state.serviceSelected}/> 
                 :
                 <ProductForm afterSubmit={(msg)=>{this.handleTable(msg);}}/> 
              }
            </CardContent>
          </Card>
        </Container> 
    );
  }
}
