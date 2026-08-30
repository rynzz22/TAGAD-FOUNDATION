import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { Role } from '@prisma/client';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        officeId: true,
        isActive: true,
        createdAt: true,
        office: { select: { code: true, name: true } }
      }
    });

    const formattedUsers = users.map(u => ({
      ...u,
      name: u.fullName,
      office: u.office?.code || u.officeId || '',
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, fullName, email, password, role = 'ENCODER', office, officeId } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    let resolvedOfficeId = officeId;
    if (!resolvedOfficeId && office) {
      const foundOffice = await prisma.office.findFirst({
        where: { OR: [{ code: office }, { name: office }] }
      });
      if (foundOffice) resolvedOfficeId = foundOffice.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: fullName || name || 'System User',
        email,
        passwordHash: hashedPassword,
        role: (role as Role) || Role.ENCODER,
        officeId: resolvedOfficeId,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      ...userWithoutPassword,
      name: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, fullName, email, role, office, officeId, isActive, password } = req.body;
  try {
    let resolvedOfficeId = officeId;
    if (!resolvedOfficeId && office) {
      const foundOffice = await prisma.office.findFirst({
        where: { OR: [{ code: office }, { name: office }] }
      });
      if (foundOffice) resolvedOfficeId = foundOffice.id;
    }

    const updateData: any = {};
    if (fullName || name) updateData.fullName = fullName || name;
    if (email) updateData.email = email;
    if (role) updateData.role = role as Role;
    if (resolvedOfficeId !== undefined) updateData.officeId = resolvedOfficeId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: String(req.params.id) },
      data: updateData,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      name: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: String(req.params.id) },
      data: { isActive: false },
    });
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
