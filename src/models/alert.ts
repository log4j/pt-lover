
import moment from 'moment';
import { Device } from 'ionic-native';

export class AlertRule {

    id: number;
    device: string;
    username: string;
    keyword: string = '';
    category: string = '';
    expirate: any;
    platform: string;
    mode: string;


    constructor(data) {
        this.expirate = moment().add(90, 'days').format('YYYY-MM-DD');
        this.platform = Device.platform;
        this.mode = 'sandbox';

        if (typeof data === 'string') {
            this.device = data;
        }
        else if (data) {
            if (data.id)
                this.id = data.id;
            if (data.username)
                this.username = data.username;
            if (data.device)
                this.device = data.device;
            if (data.keyword)
                this.keyword = data.keyword;
            if (data.category)
                this.category = data.category;
            if (data.expirate)
                this.expirate = data.expirate;
            if (data.platform)
                this.platform = data.platform;
            if (data.mode)
                this.mode = data.mode;
        }
    }

    updateDevice(device: string) {
        this.device = device;
    }

    updateUsername(username: string) {
        this.username = username;
    }

    truncateDate() {
        if (this.expirate.length > 10)
            this.expirate = this.expirate.substring(0, 10);
    }
}