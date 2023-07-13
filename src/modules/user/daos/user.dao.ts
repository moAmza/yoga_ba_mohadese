import { TypeAuthInfoDto } from '../dtos/type-auth-user.dto';
import { TypeUserDto } from '../dtos/type-user.dto';
import { User } from '../user.schema';

export abstract class UserDao {
  static convertOne = (model: MongoDoc<User>): TypeUserDto => ({
    id: model._id.toString(),
    username: model.username,
    firstname: model.firstname,
    lastname: model.lastname,
    email: model.email,
    phone: model.phone,
    createdAt: model.createdAt,
  });
  static convertOneToAuthInfo = (model: MongoDoc<User>): TypeAuthInfoDto => ({
    id: model._id.toString(),
    username: model.username,
    password: model.password,
  });
}
