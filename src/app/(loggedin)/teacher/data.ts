import {Teacher, User} from '@prisma/client';

export interface TeacherWithUser extends Teacher {
    user: User;
}