import { Pipe, PipeTransform } from '@angular/core';
import { Type } from '../models/type'
@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
    transform(value: string, args: string[]): any {

        for (let item of Type.Types) {
            if (item.value === value)
                return item.label;
        }

        return '不限';
    }
}
