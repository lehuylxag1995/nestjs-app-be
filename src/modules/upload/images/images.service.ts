import { PrismaService } from '@Modules/prisma/prisma.service';
import { CreateImageDto } from '@Modules/upload/images/dto/create-image.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkOriginalNameUnique(name: string) {
    return (
      (await this.prismaService.image.findFirst({
        where: { originalName: name },
      })) !== null
    );
  }

  async create(data: CreateImageDto) {
    return await this.prismaService.image.create({
      data,
    });
  }

  async findOne(id: string) {
    const data = await this.prismaService.image.findUnique({ where: { id } });
    if (!data) throw new BadRequestException('Không tìm thấy hình ảnh theo Id');
    return data;
  }

  async changePublish(id: string, publish: boolean) {
    await this.findOne(id);

    return await this.prismaService.image.update({
      where: { id },
      data: {
        published: publish,
      },
      select: {
        id: true,
        filename: true,
        path: true,
        published: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.image.delete({
      where: { id },
    });
  }
}
