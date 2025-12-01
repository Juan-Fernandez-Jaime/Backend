import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductosService', () => {
  let service: ProductosService;
  let repo;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        { provide: getRepositoryToken(Producto), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repo = module.get(getRepositoryToken(Producto));
  });

  it('findAll debería devolver un array de productos', async () => {
    const productos = [{ id: 1, nombre: 'P1' }];
    repo.find.mockResolvedValue(productos);
    expect(await service.findAll()).toEqual(productos);
  });

  it('create debería guardar un nuevo producto', async () => {
    const dto = { nombre: 'Nuevo', precio: 100, stock: 10 };
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ id: 1, ...dto });

    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
  });

  it('remove debería eliminar un producto existente', async () => {
    repo.delete.mockResolvedValue({ affected: 1 });
    await expect(service.remove(1)).resolves.not.toThrow();
  });

  it('remove debería fallar si el producto no existe', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});