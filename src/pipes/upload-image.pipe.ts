import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ImageUploadValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) throw new BadRequestException('Không có hình ảnh !');

    const allowedType = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 1024 * 1024 * 5;

    if (!allowedType.includes(file.mimetype))
      throw new BadRequestException('Định dạng không hợp lệ (jpg,png,webp)');

    if (file.size > maxSize)
      throw new BadRequestException('Hình ảnh vượt quá 5Mb');

    return file;
  }
}
