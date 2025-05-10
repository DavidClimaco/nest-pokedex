import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/paginatio.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(queryParameters: PaginationDto) {
    const { limit = 10, offset = 0 } = queryParameters;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon;

    //Por No
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    //Por MongoID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    //Por Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: id.toLocaleLowerCase().trim(),
      });
    }
    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with no, name or id not found in db`,
      );
    }
    return pokemon as Pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }
    try {
      if (updatePokemonDto.name) {
        await pokemon.updateOne(updatePokemonDto);
      }
    } catch (error) {
      this.handleExceptions(error);
    }
    return { ...pokemon.toJSON(), ...updatePokemonDto }; //Esto es solamente para ver el elemento actualizado si no hubo errores
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //return 'Pokemon deleted';} {
    // const pokemon = await this.pokemonService.findOne(id);
    // await pokemon.deleteOne();
    //return 'Pokemon deleted';
    //const result = await this.pokemonModel.findByIdAndDelete(id);

    //UNA FORMA DE HACERLO CON UNA SOLA CONSULTA A LA BASE DE DATOS
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return 'Pokemon deleted';
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create pokemon - Check server logs`,
    );
  }
}
