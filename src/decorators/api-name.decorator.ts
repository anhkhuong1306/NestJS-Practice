import { Reflector } from '@nestjs/core';

export const ApiName = Reflector.createDecorator<string>();