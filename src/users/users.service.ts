import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserContact } from './entities/user-contact.entity';
import { UserBlocked } from './entities/user-blocked.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserContact)
    private userContactsRepository: Repository<UserContact>,
    @InjectRepository(UserBlocked)
    private userBlockedRepository: Repository<UserBlocked>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) throw new BadRequestException("Email already in use. Please change email address or login.");

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Créer le nouvel utilisateur
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find({
      select: ['id', 'username', 'email', 'avatar', 'role', 'tips', 'createdAt'] // On exclue le password
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'avatar', 'role', 'tips', 'createdAt'],
      relations: ['contacts', 'blocked']
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // Méthodes pour gérer les contacts
  async addContact(userId: number, contactId: number) {
    if (userId === contactId) {
      throw new BadRequestException('Cannot add yourself as contact');
    }

    const userContact = this.userContactsRepository.create({
      user: { id: userId },
      contact: { id: contactId }
    });

    return this.userContactsRepository.save(userContact);
  }

  async removeContact(userId: number, contactId: number) {
    const contact = await this.userContactsRepository.findOne({
      where: {
        user: { id: userId },
        contact: { id: contactId }
      }
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.userContactsRepository.remove(contact);
  }

  // Méthodes pour gérer les utilisateurs bloqués
  async blockUser(userId: number, blockedUserId: number) {
    if (userId === blockedUserId) {
      throw new BadRequestException('Cannot block yourself');
    }

    const userBlocked = this.userBlockedRepository.create({
      user: { id: userId },
      blockedUser: { id: blockedUserId }
    });

    return this.userBlockedRepository.save(userBlocked);
  }

  async unblockUser(userId: number, blockedUserId: number) {
    const blocked = await this.userBlockedRepository.findOne({
      where: {
        user: { id: userId },
        blockedUser: { id: blockedUserId }
      }
    });

    if (!blocked) {
      throw new NotFoundException('Blocked user not found');
    }

    await this.userBlockedRepository.remove(blocked);
  }
}
