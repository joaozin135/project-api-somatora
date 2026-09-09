import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ReceiptModule } from './receipt/receipt.module';
import { AuthModule } from './auth/auth.module';
import { ComplementaryInvoiceModule } from './complementary-invoice/complementary-invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot ({ isGlobal: true }),
    UsersModule,
    ReceiptModule,
    AuthModule,
    ComplementaryInvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
