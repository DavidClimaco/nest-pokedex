import { Injectable } from '@nestjs/common';
//import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=650`,
    );

    //3 formas de hacer el seed
    //1 forma
    // for (const { name, url } of data.results) {
    //   const segments = url.split('/');
    //   const no = Number(segments[segments.length - 2]);

    //   //const pokemon = await this.pokemonModel.create({ name, no });
    // }
    // return 'Seed executed';

    //2 forma
    // const insertPromisesArray: Promise<any>[] = [];

    // for (const { name, url } of data.results) {
    //   const segments = url.split('/');
    //   const no = Number(segments[segments.length - 2]);

    //   //const pokemon = await this.pokemonModel.create({ name, no });
    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    // }
    // await Promise.all(insertPromisesArray);

    // return 'Seed executed';

    //3 forma
    const pokemonToInsert: { name: string; no: number }[] = [];

    for (const { name, url } of data.results) {
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2]);
      // console.log({ name, no });
      pokemonToInsert.push({ name, no });
    }
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
