import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(newUser: UserDTO): Promise<UserDTO> {
    const userFind: UserDTO = await this.userService.findByFields({
      where: { username: newUser.username },
    });
    if (userFind) {
      throw new HttpException('이미 있는 ID입니다', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.save(newUser);
  }

  async validateUser(userDTO: UserDTO): Promise<{ accessToken } | undefined> {
    const existedUser: User = await this.userService.findByFields({
      where: { username: userDTO.username },
    });
    const validatePassword = await bcrypt.compare(
      userDTO.password,
      existedUser.password,
    );
    if (!existedUser || !validatePassword) {
      throw new UnauthorizedException();
    }
    const payload: Payload = {
      id: existedUser.id,
      username: existedUser.username,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async tokenValidateUser(payload: Payload): Promise<UserDTO | undefined> {
    return await this.userService.findByFields({ where: { id: payload.id } });
  }
}
