
import moment from 'moment';

export class AlertRule {

    id: number;
    device: string;

    keyword: string = '';
    category: string = '';
    expirate: any;


    constructor(data) {
        this.expirate = moment().add(90, 'days').format('YYYY-MM-DD');


        if (typeof data === 'string') {
            this.device = data;
        }
        else if (data) {
            this.id = data.id;
            this.device = data.device;
            this.keyword = data.keyword;
            this.category = data.category;
            this.expirate = data.expirate;
        }
    }

    updateDevice(device: string) {
        this.device = device;
    }
}