import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/tools';
import { AddStudentsToGroupDto } from './dto/add-students-to-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(data: CreateGroupDto) {
    try {
      const existingGroup = await this.prisma.gROUP.findFirst({
        where: { name: data.name },
      });

      if (existingGroup) {
        throw new ConflictException('Bu nomli gruppa allaqachon mavjud!');
      }

      const newGroup = await this.prisma.gROUP.create({
        data: {
          name: data.name,
          courseType: data.courseType,
          price: data.price,
          description: data.description,
          days: data.days,
          ...(data.teacherId && {
            teacher: {
              connect: { id: data.teacherId },
            },
          }),
        },

        include: {
          teacher: true,
        },
      });

      return newGroup;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('O’qituvchi topilmadi!');
      }
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Gruppa yaratishda xato!');
    }
  }

  async findAllGroup(query: any) {
    const {
      name,
      courseType,
      teacherId,
      sortBy,
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const where: any = {
      ...(name && {
        name: { contains: name, mode: 'insensitive' },
      }),
      ...(courseType && { courseType }),
      ...(teacherId && { teacherId }),
    };

    try {
      const groups = await this.prisma.gROUP.findMany({
        where,
        include: {
          teacher: true,
          _count: { select: { students: true } },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        skip,
        take,
      });

      const total = await this.prisma.gROUP.count({ where });

      return {
        data: groups,
        total,
        page: Number(page),
        limit: take,
        lastPage: Math.ceil(total / take),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in fetching groups!');
    }
  }

  async updateGroup(id: string, data: UpdateGroupDto) {
    try {
      return await this.prisma.gROUP.update({
        where: { id },
        data: {
          name: data.name,
          courseType: data.courseType,
          price: data.price,
          description: data.description,
          days: data.days,
          ...(data.teacherId && {
            teacher: { connect: { id: data.teacherId } },
          }),
        },
        include: { teacher: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Gruppa yoki O’qituvchi topilmadi!');
      }
      throw error;
    }
  }

  async addStudentToGroup(data: AddStudentsToGroupDto) {
    try {
      return await this.prisma.gROUP.update({
        where: { id: data.groupId },
        data: {
          students: {
            connect: { id: data.studentId },
          },
        },
        include: {
          teacher: true,
          students: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Gruppa yoki Talaba topilmadi!');
      }
      throw new InternalServerErrorException(
        'Talabani gruppaga qo’shishda xatolik!',
      );
    }
  }

  async findOneGroup(id: string) {
    try {
      const group = await this.prisma.gROUP.findUnique({
        where: { id },
        include: {
          teacher: true,
          students: true,
        },
      });

      if (!group) {
        throw new NotFoundException('Gruppa topilmadi!');
      }

      return group;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in get group!');
    }
  }

  async removeGroup(id: string) {
    try {
      const existingGroup = await this.prisma.gROUP.findUnique({
        where: { id },
      });

      if (!existingGroup) {
        throw new NotFoundException('Gruppa topilmadi!');
      }

      const deletedGroup = await this.prisma.gROUP.delete({
        where: { id },
      });

      return deletedGroup;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in delete group!');
    }
  }
}
