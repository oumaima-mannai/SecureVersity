import { Controller, Post, Body, UseGuards, Get, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { access_token, user } = await this.authService.login(body.email, body.password);
    
    res.cookie('jwt_token', access_token, {
      httpOnly: true, // Immune to JavaScript XSS
      secure: false,  // True if using HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return { user };
  }

  // Demonstration endpoint to verify Roles system for ISO 27001 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYSTEM, Role.RSSI)
  @Get('compliance-dashboard')
  getComplianceData(@Request() req: { user: { id: string; email: string; role: Role } }) {
    return {
      message: 'Access granted. Welcome to the ISO 27001 SMSI compliance overview.',
      user: req.user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req: any, @Body() body: any) {
    if (!body.newPassword) {
      throw new Error('newPassword is required');
    }
    const updatedUser = await this.usersService.changePassword(req.user.id, body.newPassword);
    return { message: 'Password changed successfully', user: updatedUser };
  }
}
