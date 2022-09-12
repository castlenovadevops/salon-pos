import React from 'react';
import {  Typography} from '@material-ui/core/';  
import TableContent from '../../../../components/formComponents/DataGrid'; 
import { QueryFunctions } from './functions';
import TicketDataController from '../../../../controller/TicketDataController';
import Moment from 'moment';

export default class OpentTicketsComponent extends React.Component{
    queryManager = new QueryFunctions();
    ticketdatacontroller = new TicketDataController();
    constructor(props){
        super(props);
        this.state = {
            open_tickets:[],
            columns:[
                {
                    field: 'ticket_code',
                    headerName: 'Ticket Code',
                    // minWidth: 150,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                        <Typography variant="subtitle2" 
                        style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                            {params.row.ticket_code}</Typography>
    
                    )
                },
                {
                    field: 'customer_id',
                    headerName: 'Customer Name',
                    // minWidth: 150,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                          {params.row.customer_name !== null && params.row.customer_name !== '' ? params.row.customer_name : 'NA'}
                          </Typography>
                    )
                },  
                {
                    field: 'created_at',
                    headerName: 'Time',
                    // minWidth: 250,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                            <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                          {Moment(params.row.created_at).format('YYYY-MM-DD hh:mm a')}
                          </Typography> 
                    )
                },
            ]
        }

        this.onTransfer = this.onTransfer.bind(this);
    }

    componentDidMount(){ 
        this.queryManager.getAllOpenTickets(this.ticketdatacontroller.getBusinessId()).then((res)=>{
            var data = res.filter(t=>t.ticket_code !== this.props.data.ticketDetail.ticket_code);
            this.setState({open_tickets: data});
        })
    }

    onTransfer(params){
        this.props.data.onTransfer(params.row);
    }

    render(){
        return  <TableContent style={{ height: '100%', background: ''}}  onRowClick={ this.onTransfer} data={this.state.open_tickets} columns={this.state.columns} />
    }
}