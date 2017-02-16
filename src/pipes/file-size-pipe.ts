import { Pipe, PipeTransform } from '@angular/core';
import { Type } from '../models/type'
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
    transform(value: number, args: string[]): any {

        let units = ['Byte','KB','MB','GB','TB'];
        let v:number = value;
        if(!v){
            v = 0;
        }
        let index = 0;
        while(v>=1024){
            index ++;
            v= v/1024;
        }

        return v.toFixed(2)+units[index];
    }
}
