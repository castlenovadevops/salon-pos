import DataManager from "./datacontroller";
import QueryManager from './queryManager';

export default class PaymentController extends DataManager{
    queryManager = new QueryManager();

    getTicketPayments(tid){
        return new Promise(async (resolve) => {
            var sql = `select * from ticket_payment where ticketref_id='`+tid+`'`;
            this.getData(sql).then(r=>{
                resolve(r);
            })
        });
    } 

    getTicketDetail(tid){  
        return new Promise(async (resolve) => {
            var sql = `select * from ticket where sync_id='`+tid+`'`;
            this.getData(sql).then(r=>{
                resolve(r.length > 0 ? r[0] : {});
            })
        });
    }

    getPaymentValues(x,n){
        var values = [];
        var x1 = Math.round(x / 10) * 10;
        values.push(x1);
        var x2 = Math.round((x1+10) / 10) * 10;
        values.push(x2);
        if(n === 3){ 
            var x3 = Math.round((x2+10) / 10) * 10;
            values.push(x3);
        }
        return values;
    }

    async savePayment(amt, ticket, mode, card_type, notes){
        return new Promise(async (resolve) => {
            await window.api.getSyncUniqueId().then(sync=>{ 
                var paymentinput =  {
                    ticket_id : ticket.sync_id,
                    pay_mode : mode,
                    payment_status : 'Success',
                    paid_at :  this.queryManager.getDate(),
                    notes :  notes,
                    card_type : card_type,
                    ticket_amt: amt,
                    created_at: this.queryManager.getDate(),
                    created_by: this.queryManager.getUserId(),
                    updated_at: this.queryManager.getDate(),
                    updated_by:  this.queryManager.getUserId(),
                    sync_id: sync.syncid,
                    sync_status:0,
                    ticketref_id: ticket.sync_id,
                    isActive:1,
                }
                var ticketinput = {
                    sync_status:0,
                    ticketPendingAmount: ticket.grand_total - amt,
                    paid_status: ticket.grand_total - amt > 0 ? 'Partially Paid' : 'paid'
                }
                this.queryManager.saveTableData({table_name:'ticket_payment', data:paymentinput}).then(res=>{
                    this.queryManager.updateTableData({table_name:'ticket', data: ticketinput, query_field:'sync_id', query_value: ticket.sync_id}).then(res=>{
                        resolve(res);
                    })
                })
            })
        });
    }
}