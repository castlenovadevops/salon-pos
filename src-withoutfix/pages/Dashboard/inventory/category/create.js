import React from 'react'; 
// material
import { Card,  Stack, Container, Typography, CardContent } from '@mui/material';
// components
import Page from '../../../../components/formComponents/Page';
import CategoryForm from './addForm';

// ----------------------------------------------------------------------
export default class CreateCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        categorySelected: {},
        isEdit: false,
        isOnline: false,
    };
    this.handleTable = this.handleTable.bind(this);
  }
  componentDidMount(){

    var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition=="online") ? true: false})

    if(this.props.categorySelected !== undefined){
        this.setState({ categorySelected: this.props.categorySelected });
        this.setState({ isEdit: true });
    }

  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.categorySelected !== prevState.categorySelected ) {
      return { categorySelected: nextProps.categorySelected };
    }
    return null;
  }
  handleTable(msg){
    this.props.afterSubmitForm(msg);
  }

  render() {
    return (
      <Page title="Create Category | Astro POS">
        <Container maxWidth="xl">
          <Stack direction="column" alignItems="left" mb={2} mt={5}>
            {this.state.isEdit ? <Typography variant="h6" gutterBottom> Edit Category </Typography> : <Typography variant="h6" gutterBottom> Create Category </Typography> }
             
          </Stack>
          <Card>
            <CardContent>
              {this.state.isEdit ?
                 <CategoryForm afterSubmit={(msg)=>{this.handleTable(msg);}} categoryToEdit={this.state.categorySelected}/> 
                 :
                 <CategoryForm afterSubmit={(msg)=>{this.handleTable(msg);}}/> 
              }
            </CardContent>
          </Card>
        </Container>
      </Page>
    );
  }
}
