import { Injectable } from '@angular/core';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public user: User | undefined;
}
