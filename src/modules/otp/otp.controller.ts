import { CreateOtpDto } from '@Modules/otp/dto/create-otp.dto';
import { UpdateOtpDto } from '@Modules/otp/dto/update-otp.dto';
import { OtpService } from '@Modules/otp/otp.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  async create(@Body() data: CreateOtpDto) {
    return await this.otpService.createOtp(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateOtpDto) {
    return await this.otpService.updateOtp(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.otpService.deleteOtp(id);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.otpService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.otpService.findAll();
  }
}
