import React from 'react'; 
// material
import { Card, Stack, Container, Typography, CardContent } from '@mui/material';
// components 
import TaxForm from './addForm';

// ----------------------------------------------------------------------
export default class CreateTax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taxSelected: {},
      isEdit: false,
    };
    this.handleTable = this.handleTable.bind(this);
  }
  componentDidMount(){
    if(this.props.taxSelected !== undefined){
        this.setState({ taxSelected: this.props.taxSelected });
        this.setState({ isEdit: true });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.taxSelected !== prevState.taxSelected ) {
      return { taxSelected: nextProps.taxSelected };
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
          {this.state.isEdit ? <Typography variant="h4" gutterBottom> Edit Taxes & Fees </Typography> : <Typography variant="h4" gutterBottom> Create Taxes & Fees </Typography> }
            
          </Stack>
          <Card>
            <CardContent>
            {this.state.isEdit ?
                 <TaxForm afterSubmit={(msg)=>{this.handleTable(msg);}} taxToEdit={this.state.taxSelected}/> 
                 :
                 <TaxForm afterSubmit={(msg)=>{this.handleTable(msg);}}/> 
              }
            </CardContent>
          </Card>
        </Container> 
    );
  }
}
