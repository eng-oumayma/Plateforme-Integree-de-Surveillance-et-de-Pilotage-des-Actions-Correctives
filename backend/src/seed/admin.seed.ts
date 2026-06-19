import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Role } from '../users/enums/role.enum';
import { AccountStatus } from '../users/user.entity';

export const seedAdmin = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);

  const existingAdmin = await userRepo.findOne({
    where: { role: Role.ADMIN_HSEE },
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin1234!', 12);

  const admin = userRepo.create({
    firstName: 'Admin',
    lastName: 'HSEE',
    email: 'admin@leoni.com',
    password: hashedPassword,
    role: Role.ADMIN_HSEE,
    status: AccountStatus.ACTIVE,
  });

  await userRepo.save(admin);

  console.log('Admin created successfully');
};