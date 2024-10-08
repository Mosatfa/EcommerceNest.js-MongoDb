import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    constructor(){
        console.log(process.env.SALT_ROUND);
        
    }
    hash(plaintext: string, saltRound: number = parseInt(process.env.SALT_ROUND)): string {
        // console.log(plaintext  , saltRound);
        
        return bcrypt.hashSync(plaintext, 8);
    }

    compare(plaintext: string, hashValue: string): boolean {
        return bcrypt.compareSync(plaintext, hashValue);
    }
}
