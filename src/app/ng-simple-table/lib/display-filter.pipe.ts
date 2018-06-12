import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayFilter'
})
export class DisplayFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
