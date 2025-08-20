import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    // Búsqueda
    const search = searchParams.get('search') || '';
    
    // Ordenamiento
    const sortBy = searchParams.get('sortBy') || 'firstName';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Filtros
    const status = searchParams.get('status');
    const membershipType = searchParams.get('membershipType');
    
    // Construir consulta base
    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (membershipType) {
      whereClause.membershipType = membershipType;
    }
    
    // Obtener estudiantes con paginación
    const [students, totalCount] = await Promise.all([
      db.student.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      }),
      db.student.count({ where: whereClause })
    ]);
    
    // Calcular estadísticas
    const stats = await db.student.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      where: {
        status: {
          not: null
        }
      }
    });
    
    const statusCounts = stats.reduce((acc, stat) => {
      if (stat.status) {
        acc[stat.status] = stat._count.status;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      students: students.map(student => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.user.email,
        phone: student.phone,
        membershipType: student.membershipType,
        joinDate: student.joinDate,
        status: student.status,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      stats: {
        total: totalCount,
        active: statusCounts['active'] || 0,
        inactive: statusCounts['inactive'] || 0,
        suspended: statusCounts['suspended'] || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Verificar si el email ya existe
    const existingUser = await db.user.findUnique({
      where: { email: body.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Crear usuario primero
    const user = await db.user.create({
      data: {
        email: body.email,
        name: `${body.firstName} ${body.lastName}`,
        role: 'STUDENT'
      }
    });
    
    // Crear estudiante
    const student = await db.student.create({
      data: {
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        address: body.address || '',
        emergencyContact: body.emergencyContact || '',
        medicalInfo: body.medicalInfo || '',
        membershipType: body.membershipType || 'basic',
        joinDate: body.joinDate || new Date(),
        status: body.status || 'active',
        photo: body.photo,
        notes: body.notes
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    const responseStudent = {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.user.email,
      phone: student.phone,
      membershipType: student.membershipType,
      joinDate: student.joinDate,
      status: student.status,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt
    };
    
    return NextResponse.json(responseStudent, { status: 201 });
    
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}