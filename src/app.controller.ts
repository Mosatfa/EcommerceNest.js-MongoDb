import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthGuard } from './common/guards/auth.guard';
import { Role } from './common/enums/role.enum';
import { Roles } from './common/decorator/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  getHello(): string {
    return this.appService.getHello()
  }
}
