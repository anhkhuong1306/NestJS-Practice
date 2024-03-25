import { ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common";

export const JwtPublic = (data: boolean) => SetMetadata('IsPublic', data);