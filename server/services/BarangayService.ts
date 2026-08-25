import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';

export class BarangayService {
  public static async getBarangays() {
    return prisma.barangay.findMany({
      orderBy: { name: 'asc' },
    });
  }

  public static async getBarangayById(id: string) {
    const barangay = await prisma.barangay.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            households: true,
            beneficiaries: true,
          },
        },
      },
    });

    if (!barangay) {
      throw new NotFoundError('Barangay');
    }

    return barangay;
  }
}
