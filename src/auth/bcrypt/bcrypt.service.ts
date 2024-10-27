import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    constructor() { }
    hash(plaintext: string, saltRound: number = parseInt(process.env.SALT_ROUND)): string {
        return bcrypt.hashSync(plaintext, saltRound);
    }

    compare(plaintext: string, hashValue: string): boolean {
        return bcrypt.compareSync(plaintext, hashValue);
    }
}
