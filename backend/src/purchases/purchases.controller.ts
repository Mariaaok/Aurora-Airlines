import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Purchases } from './purchases.entity';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Controller('purchases')
@UseGuards(SessionAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  async create(@Body() purchaseData: Partial<Purchases>, @Request() req): Promise<Purchases> {
    purchaseData.userId = req.user.id;
    return this.purchasesService.create(purchaseData);
  }

  @Get()
  async findAll(): Promise<Purchases[]> {
    return this.purchasesService.findAll();
  }

  @Get('my-purchases')
  async findMyPurchases(@Request() req): Promise<Purchases[]> {
    return this.purchasesService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Purchases | null> {
    return this.purchasesService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Purchases>,
  ): Promise<Purchases | null> {
    return this.purchasesService.update(+id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.purchasesService.remove(+id);
  }
}
