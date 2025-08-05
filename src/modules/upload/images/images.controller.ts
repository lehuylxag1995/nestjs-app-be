import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateImageDto } from '@modules/upload/images/dto/create-image.dto';
import { ImageUploadValidationPipe } from '@pipes/upload-image.pipe';
import { existsSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ImagesService } from './images.service';

@Controller('upload/')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/product/:id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, uuidv4() + ext);
        },
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile(new ImageUploadValidationPipe()) image: Express.Multer.File,
    @Param('id', ParseUUIDPipe) productId: string,
  ) {
    const isDuplicate = await this.imagesService.checkOriginalNameUnique(
      image.originalname,
    );

    if (isDuplicate) {
      if (existsSync(image.path)) unlinkSync(image.path);

      throw new BadRequestException('Hình ảnh sản phẩm đã tồn tại');
    }

    const data: CreateImageDto = {
      filename: image.filename,
      mimetype: image.mimetype,
      originalName: image.originalname,
      size: image.size,
      path: `public/images/${image.filename}`,
      productId,
    };

    return await this.imagesService.create(data);
  }

  @Patch('/image/:id')
  async changePublish(
    @Param('id', ParseUUIDPipe) imageId: string,
    @Body('publish', ParseBoolPipe) publish: boolean,
  ) {
    return await this.imagesService.changePublish(imageId, publish);
  }

  @Delete('/image/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) imageId: string) {
    const image = await this.imagesService.findOne(imageId);

    if (existsSync(`${image.path}`)) unlinkSync(image.path);

    return await this.imagesService.remove(imageId);
  }
}
