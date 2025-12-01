import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(Usuario), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repo = module.get(getRepositoryToken(Usuario));
  });

  it('findAll debería devolver usuarios', async () => {
    const users = [{ id: 1, nombre: 'Juan' }];
    repo.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });

  it('update debería modificar un usuario', async () => {
    const user = { id: 1, nombre: 'Juan' };
    const changes = { nombre: 'Juan Actualizado' };

    repo.findOneBy.mockResolvedValue(user);
    repo.save.mockResolvedValue({ ...user, ...changes });

    const result = await service.update(1, changes);
    expect(result.nombre).toBe('Juan Actualizado');
  });
});