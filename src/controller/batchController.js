import DataManager from "./datacontroller"; 
import QueryManager from "./queryManager"; 
import TicketServiceController from "./TicketServiceController";

export default class BatchController extends QueryManager{ 
    ticketServiceController = new TicketServiceController()
    constructor(props){
        super(props);
    }

    getBatchesList(){
        return new Promise(async (resolve) => {
            this.getBatches().then(res=>{
                resolve(res)
            })
        });
    } 

    createTicketBatch(mode){
        return new Promise(async (resolve) => {
            this.createBatch(mode).then(res=>{
                var batch = res.data;
                var batchid = batch.sync_id;
                this.updateBatchId(batchid).then(res=>{
                    resolve({msg:"Batch created successfully."});
                })
            })
        });
    }
}