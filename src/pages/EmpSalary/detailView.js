import React from 'react';
import axios from 'axios';
import config from '../../config/config';
import { Stack, Container, Typography } from '@mui/material';
import TableContent from '../../components/formComponents/DataGrid';

export default class ReportView extends React.Component  {
    constructor(props){
        super(props);
        this.state={
            selected_emp:{},
            ticket_details:[],
            columns:[
                {
                    field: 'ticket_code',
                    headerName: 'Ticket Code',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.ticket_code}
                    </div>
                    )
                },
                {
                    field: 'service_name',
                    headerName: 'Service',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.service_name}
                    </div>
                    )
                },
                {
                    field: 'created_at',
                    headerName: 'Date&Time',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.created_at.replace("T", " ").substring(0, params.row.created_at.length-5)}
                    </div>
                    )
                },
                {
                    field: 'cash_type_for',
                    headerName: 'Service Cost',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ {params.row.cash_type_for === 'service'? params.row.cash_amt : 0}
                    </div>
                    )
                },
                {
                    field: 'cash_amt',
                    headerName: 'Tips',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ {params.row.cash_type_for === 'tips'? params.row.cash_amt : 0}
                    </div>
                    )
                },
                {
                    field: '',
                    headerName: 'Discount',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                         $ {params.row.cash_type_for === 'discount'? params.row.cash_amt : 0}
                    </div>
                    )
                },
            ]
        }
    }
    componentDidMount(){
        //console.log(this.props.empSelected);
        if(this.props.empSelected !== undefined){
            // this.setState({selected_emp: this.props.empSelected});
            this.setState({selected_emp: this.props.empSelected}, function() {
                // //console.log(this.state.customers)
                this.getEmpTicket(this.state.selected_emp.id);
            });

            
        }
    }

    getEmpTicket(empId){
        axios.get(config.root+"/employee_commission/ticketlist/"+empId).then((res)=>{ 
            var status = res.data["status"];
            var data = res.data["data"];
            if(status === 200){
                if(data.length > 0){
                    this.setState({ticket_details:res.data.data});
                }
            }
            
        })
    }
 

    render(){
        return (
            <div style={{height: '100%'}}>
                <Container maxWidth="xl" style={{width: "100%", height: '100%'}}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{ marginTop: 20}}>
                        <Typography variant="subtitle2" gutterBottom>Employee Name: {this.state.selected_emp.firstName} {this.state.selected_emp.lastName}</Typography>
                        <Typography variant="subtitle2" gutterBottom>Total Price: $ {this.state.selected_emp.totalservice_price}</Typography>
                        <Typography variant="subtitle2" gutterBottom>Total Discount: $ {this.state.selected_emp.total_discount}</Typography>
                        <Typography variant="subtitle2" gutterBottom>Total Tips: $ {this.state.selected_emp.total_tips}</Typography>

                    </Stack>

                    <Stack style={{height: '80%'}}>
                        <TableContent style={{height: '100%'}} pageSize={5} data={this.state.ticket_details} columns={this.state.columns} />
                    </Stack>
                    
                </Container>
            </div>
        )
    }
}