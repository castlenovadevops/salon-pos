import React from 'react'; 

import QueryManager from '../../../../controller/queryManager';
import { QueryFunctions } from './functions';
import BatchController from '../../../../controller/batchController';
import { DialogContentText, Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core/';  
import ButtonContent from '../../../../components/formComponents/Button';
export default class BatchSettleComponent extends React.Component {
    queryFunctions = new QueryFunctions();
    queryManager = new QueryManager();
    batchController = new BatchController();
    constructor(props){
        super(props);
        this.state={
            tipsDialog: false,
            openTicketDialog: false,
            msgToast: false,
            batcherror: false
        }

        this.onCloseDialog=this.onCloseDialog.bind(this);
        this.onSubmitTipsDialog=this.onSubmitTipsDialog.bind(this);
        this.onSubmitTicketDialog = this.onSubmitTicketDialog.bind(this);
    }

    componentDidMount(){
        this.queryManager.getClosedTicketForBatch().then(ct=>{
            if(ct.length > 0){
                this.queryFunctions.getAllOpenTickets(this.queryManager.getBusinessId()).then(r=>{
                    if(r.length> 0){
                        this.setState({openTicketDialog: true})
                    }
                    else{
                        this.checkTips();
                    }
                })
            }
            else{
                this.setState({batcherror: true})
            }
        })
    }

    checkTips(){ 
        this.queryFunctions.getAllTicketsWithoutTips(this.queryManager.getBusinessId()).then(r=>{
            if(r.length>0){
                this.setState({tipsDialog: true});
            }
            else{
                this.onSubmitTipsDialog();
            }
        });
    }

    onSubmitTicketDialog(){
        this.checkTips();
    }

    onSubmitTipsDialog(){
        this.batchController.createTicketBatch('manual').then(r=>{
            this.setState({tipsDialog: false,openTicketDialog: false}, ()=>{
                this.props.onCompleteBatch();
            })
        });
    }

    onCloseDialog(){
        this.setState({tipsDialog: false,openTicketDialog: false, msgToast: false}, ()=>{
            this.props.closeBatchDialog();
        })
    }

    render(){
        return <div> 

                <Dialog
                    open={this.state.openTicketDialog}
                    onClose={this.onCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmation
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Some tickets are not closed. Are you sure to continue?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <ButtonContent  size="large" variant="contained" label="Yes" onClick={()=>this.onSubmitTicketDialog()}/>
                        <ButtonContent  size="large" variant="contained" label="No" onClick={()=>this.onCloseDialog()}/>
                    </DialogActions>
                </Dialog> 

                
                <Dialog
                    open={this.state.tipsDialog}
                    onClose={this.onCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmation
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Some ticket's tips are not adjusted. Are you sure to continue?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <ButtonContent  size="large" variant="contained" label="Yes" onClick={()=>this.onSubmitTipsDialog()}/>
                        <ButtonContent  size="large" variant="contained" label="No" onClick={()=>this.onCloseDialog()}/>
                    </DialogActions>
                </Dialog> 

                
                <Dialog
                    open={this.state.batcherror}
                    onClose={this.onCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        There are no closed tickets to batch.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions> 
                        <ButtonContent  size="large" variant="contained" label="OK" onClick={()=>this.onCloseDialog()}/>
                    </DialogActions>
                </Dialog> 

                

        </div>
    }
}