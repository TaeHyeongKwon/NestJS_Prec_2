import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async registerUser(newUser: UserDTO): Promise<UserDTO> {
    const userFind: UserDTO = await this.userService.findByFields({
      where: { username: newUser.username },
    });
    if (userFind) {
      throw new HttpException('이미 있는 ID입니다', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.save(newUser);
  }

  async validateUser(userDTO: UserDTO): Promise<UserDTO | undefined> {
    const existedUser: UserDTO = await this.userService.findByFields({
      where: { username: userDTO.username },
    });
    const validatePassword = await bcrypt.compare(
      userDTO.password,
      existedUser.password,
    );
    if (!existedUser || !validatePassword) {
      throw new UnauthorizedException();
    }

    return existedUser;
  }
}
