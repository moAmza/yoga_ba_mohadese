import { OutPaginatedDto } from 'src/dtos/out-paginated.dto';
import { TypeUserDto } from './type-user.dto';

export class OutGetPaginatedUsersDto implements OutPaginatedDto<TypeUserDto> {
  count: number;
  values: TypeUserDto[];
}
