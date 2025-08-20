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
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Filtros
    const status = searchParams.get('status');
    const membershipType = searchParams.get('membershipType');
    
    // Construir consulta base
    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
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
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          membershipType: true,
          joinDate: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      db.student.count({ where: whereClause })
    ]);
    
    // Calcular estadísticas
    const stats = await db.student.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      students,
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
    const requiredFields = ['name', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Verificar si el email ya existe
    const existingStudent = await db.student.findUnique({
      where: { email: body.email }
    });
    
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this email already exists' },
        { status: 409 }
      );
    }
    
    // Crear estudiante
    const student = await db.student.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address || '',
        emergencyContact: body.emergencyContact || '',
        medicalInfo: body.medicalInfo || '',
        membershipType: body.membershipType || 'basic',
        joinDate: body.joinDate || new Date().toISOString(),
        status: body.status || 'active',
        photo: body.photo,
        notes: body.notes
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        membershipType: true,
        joinDate: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(student, { status: 201 });
    
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}