import { CreateImageDto } from '@modules/upload/images/dto/create-image.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateImageDto extends PartialType(CreateImageDto) {}
