import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsDecimalCustomConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    if (typeof value !== 'number' || !isFinite(value)) return false;
    const [intPart, decimalPart = ''] = value.toString().split('.');
    return intPart.length <= 10 && decimalPart.length <= 3;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Chỉ cho phép số tối đa 10 chữ số nguyên và 3 chữ số thập phân';
  }
}

export function IsDecimalCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDecimalCustomConstraint,
    });
  };
}
