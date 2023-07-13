import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserRepo } from './user.repo';
import { User } from './user.schema';
import { InLoginDto } from '../auth/dtos/in-login.dto';
import { InRegisterDto } from '../auth/dtos/in-register.dto';
import { UserDao } from './daos/user.dao';
import { TypeAuthInfoDto } from './dtos/type-auth-user.dto';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { DuplicateError } from '../../errors/duplicate-error';
import { InGetPaginatedUsers } from './dtos/in-get-paginated-users.dto';
import { OutGetPaginatedUsersDto } from './dtos/out-get-paginated-users.dto';
import { TypeUserDto } from './dtos/type-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async verifyRegisterInput(
    userInfo: InRegisterDto,
  ): Promise<DuplicateError | true> {
    if (!(await this.isUsernameAvailable(userInfo.username)))
      return new DuplicateError('Username');
    if (!(await this.isEmailAvailable(userInfo.email)))
      return new DuplicateError('Email');

    return true;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const userModel = await this.userRepo.getByUsername(username);

    return !userModel;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const userModel = await this.userRepo.getByEmail(email);

    return !userModel;
  }

  async createUser(
    userInfo: InRegisterDto,
  ): Promise<TypeUserDto | DuplicateError> {
    let isInputValid = await this.verifyRegisterInput(userInfo);
    if (isInputValid !== true) return isInputValid;
    const userModel = await this.userRepo.create({
      ...userInfo,
      createdAt: new Date(),
    });
    const userFull = UserDao.convertOne(userModel);

    return userFull;
  }

  async getAuthInfoByUsername(
    username: string,
  ): Promise<TypeAuthInfoDto | NotFoundError> {
    const userModel = await this.userRepo.getByUsername(username);
    if (!userModel) return new NotFoundError('User');
    return UserDao.convertOneToAuthInfo(userModel);
  }

  async getUserByid(
    paramUserId: string,
  ): Promise<TypeUserDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(paramUserId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const userModel = await this.userRepo.getById(paramUserId);
    if (!userModel) return new NotFoundError('User');
    const user = UserDao.convertOne(userModel);

    return user;
  }

  async getPaginatedUsers(
    userId: string,
    { page, num }: InGetPaginatedUsers,
  ): Promise<OutGetPaginatedUsersDto> {
    const paginatedUserModels = await this.userRepo.getPaginatedUsers(
      num,
      (page - 1) * num,
    );
    const res: OutGetPaginatedUsersDto = {
      count: paginatedUserModels.count ?? 0,
      values: paginatedUserModels.values.map(UserDao.convertOne),
    };

    return res;
  }
}
