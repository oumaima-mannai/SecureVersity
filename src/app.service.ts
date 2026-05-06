import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.bootstrapAdmin();
  }

  private async bootstrapAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

    if (!adminEmail || !adminPassword) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_DEFAULT_PASSWORD not set in .env — skipping admin bootstrap.');
      return;
    }

    const existing = await this.prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      this.logger.log(`Admin account already exists (${adminEmail}), skipping bootstrap.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.prisma.user.create({
      data: {
        email: adminEmail,
        fullName: 'System Administrator',
        role: Role.ADMIN_SYSTEM,
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    this.logger.log(`✅ Admin account bootstrapped successfully: ${adminEmail}`);
  }
}
