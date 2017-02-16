import { Pipe, PipeTransform } from '@angular/core';
import { Type } from '../models/type'
@Pipe({ name: 'torrentStatus' })
export class TorrentStatusPipe implements PipeTransform {
    transform(value: number, args: string[]): any {
        console.log(value, Type.TorrentStatus )
        for (let item of Type.TorrentStatus) {
            if (item.value === value)
                return item.label;
        }

        return '未知';
    }
}
