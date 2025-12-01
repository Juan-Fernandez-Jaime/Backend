import { Test, TestingModule } from '@nestjs/testing';
import { BoletasService } from './boletas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boleta } from '../entities/boleta.entity';
import { Producto } from '../entities/producto.entity';
import { BadRequestException } from '@nestjs/common';

describe('BoletasService', () => {
  let service: BoletasService;
  let boletaRepo;
  let productRepo;

  const mockBoletaRepo = {
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockProductRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoletasService,
        { provide: getRepositoryToken(Boleta), useValue: mockBoletaRepo },
        { provide: getRepositoryToken(Producto), useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<BoletasService>(BoletasService);
    boletaRepo = module.get(getRepositoryToken(Boleta));
    productRepo = module.get(getRepositoryToken(Producto));
  });

  describe('create', () => {
    it('debería crear una boleta si hay stock', async () => {
      const usuario = { id: 1 };
      const dto = {
        detalles: [{ productoId: 1, cantidad: 2 }],
        metodoPago: 'EFECTIVO'
      };

      const productoMock = { id: 1, nombre: 'Test', precio: 100, stock: 10 };

      mockProductRepo.findOneBy.mockResolvedValue(productoMock);
      mockProductRepo.save.mockResolvedValue(true); // Simula guardar el producto actualizado
      mockBoletaRepo.save.mockImplementation((boleta) => Promise.resolve({ id: 1, ...boleta }));

      const result = await service.create(dto, usuario);

      expect(result).toHaveProperty('total', 200); // 2 * 100
      expect(mockProductRepo.save).toHaveBeenCalled(); // Se actualizó el stock
    });

    it('debería fallar si no hay stock suficiente', async () => {
      const usuario = { id: 1 };
      const dto = { detalles: [{ productoId: 1, cantidad: 20 }], metodoPago: 'EFECTIVO' };
      const productoMock = { id: 1, nombre: 'Test', precio: 100, stock: 5 }; // Stock menor a cantidad

      mockProductRepo.findOneBy.mockResolvedValue(productoMock);

      await expect(service.create(dto, usuario)).rejects.toThrow(BadRequestException);
    });
  });
});