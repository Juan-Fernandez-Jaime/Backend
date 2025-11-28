import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// OJO: Ajusta esta ruta según dónde tengas tu entidad realmente.
// Si usas la carpeta que subiste, sería: '../Components/Entities/producto.entity'
// Si usas la estructura estándar sugerida: '../entities/producto.entity'
import { Producto } from '../entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // Obtener todos los productos
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  // Obtener un producto por ID
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no fue encontrado`);
    }
    return producto;
  }

  // Crear un nuevo producto (CORREGIDO EL ERROR AQUÍ)
  async create(createProductoDto: any): Promise<Producto> {
    // El cambio clave: (createProductoDto as Producto)
    // Esto le asegura a TypeScript que estamos creando UN solo objeto, no un array.
    const nuevoProducto = this.productoRepository.create(createProductoDto as Producto);

    // Ahora .save() devolverá un solo Producto y el error desaparecerá
    return await this.productoRepository.save(nuevoProducto);
  }

  // Eliminar un producto
  async remove(id: number): Promise<void> {
    const resultado = await this.productoRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(
        `No se pudo eliminar: El producto con ID ${id} no existe`,
      );
    }
  }
}