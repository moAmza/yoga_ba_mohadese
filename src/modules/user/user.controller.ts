import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OutGetUserDto } from './dtos/out-get-user.dto';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { InGetPaginatedUsers } from './dtos/in-get-paginated-users.dto';
import { OutGetPaginatedUsersDto } from './dtos/out-get-paginated-users.dto';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all users' })
  async getPaginatedUsers(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedUsers,
  ): Promise<OutGetPaginatedUsersDto> {
    const users = await this.userService.getPaginatedUsers(userId, input);
    return users;
  }

  @Get(':user_id')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get single user by id' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async getUserInfo(
    @Req() { userId }: { userId: string },
    @Param('user_id') paramUserId: string,
  ): Promise<OutGetUserDto> {
    const user = await this.userService.getUserByid(paramUserId);
    if (user instanceof NotFoundError) return user.throw();
    if (user instanceof BadRequestError) return user.throw();
    return { user };
  }
}
