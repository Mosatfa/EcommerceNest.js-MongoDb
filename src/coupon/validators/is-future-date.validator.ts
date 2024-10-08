import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate > currentDate; // Check if the input date is in the future
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`; // Default error message
        },
      },
    });
  };
}