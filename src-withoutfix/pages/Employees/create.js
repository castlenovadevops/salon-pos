import React from 'react'; 
// material
import { Card,   Stack, Container, Typography, CardContent  } from '@mui/material';
// components 
import EmployeeForm from './addForm';

// ----------------------------------------------------------------------
export default class CreateEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeSelected: {},
      isEdit: false,
    };
    this.handleTable = this.handleTable.bind(this);
  }
  componentDidMount(){
    if(this.props.employeeSelected !== undefined){
        this.setState({ employeeSelected: this.props.employeeSelected });
        this.setState({ isEdit: true });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.employeeSelected !== prevState.employeeSelected ) {
      return { employeeSelected: nextProps.employeeSelected };
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
            {this.state.isEdit ? <Typography variant="h4" gutterBottom> Edit Employee </Typography> : <Typography variant="h4" gutterBottom> Create Employee </Typography> } 
          </Stack>
          <Card>
            <CardContent> 
              {this.state.isEdit ?
                 <EmployeeForm afterSubmit={(msg)=>{this.handleTable(msg);}} employeeSelected={this.state.employeeSelected}/> 
                 :
                 <EmployeeForm afterSubmit={(msg)=>{this.handleTable(msg);}}/> 
              }
            </CardContent>
          </Card>
        </Container> 
    );
  }
}
