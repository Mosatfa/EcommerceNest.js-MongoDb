import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import {isValidObjectId} from 'mongoose'
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string,string> {
  transform(value: any, metadata: ArgumentMetadata):string {
    if (!isValidObjectId(value)) {
        throw new BadRequestException(`${value} is not a valid ObjectId`);
    }
    return value;
  }
}