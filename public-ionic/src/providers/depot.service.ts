import { Injectable }       from '@angular/core';
import { Headers, Http }    from '@angular/http';
import { Storage }          from '@ionic/storage';

import { User }  from '../models/user';
import { Depot } from '../models/depot';

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DepotService {
  storage: Storage = new Storage(null);

  constructor(
    private http: Http
  ) { }

  /**
   * Add depot request
   */
  addDepot(depot: Depot) {
    return this.storage.get('user').then(
      (user: User) => {

        return this.storage.get('token').then((token) => {

          let seq = this.http.post(
            'http://192.168.1.11:8080/depots/' + user.email, // End-point
            JSON.stringify(depot),
            {headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            })}
          ).share();

          seq
            .map(res => res.json())
            .subscribe( () => { }, () => { } );

          return seq;

        });

      }
    );
  }

  /**
   * Modify depot request
   */
  modifyDepot(id: any, depot: Depot) {
    return this.storage.get('user').then(
      (user: User) => {

        return this.storage.get('token').then((token) => {

          let seq = this.http.put(
            'http://192.168.1.11:8080/depots/' + user.email + '/' +  id, // End-point
            JSON.stringify(depot),
            {headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            })}
          ).share();

          seq
            .map(res => res.json())
            .subscribe( () => { }, () => { } );

          return seq;

        });

      }
    );
  }

  /**
   * Delete depot request
   */
  deleteDepot(id: any, member: string) {
    return this.storage.get('user').then(
      (user: User) => {

        return this.storage.get('token').then((token) => {

          let seq = this.http.delete(
            'http://192.168.1.11:8080/depots/' + user.email + '/' +  id, // End-point
            {
              body: JSON.stringify({member: member}),
              headers: new Headers({   // Headers
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              })
            }
          ).share();

          seq
            .map(res => res.json())
            .subscribe( () => { }, () => { } );

          return seq;

        });

      }
    );
  }

  /**
   * Get depots request
   */
  getDepots() {
    return this.storage.get('user').then(
      (user: User) => {

        return this.storage.get('token').then(
          (token: any) => {

            let seq = this.http.get(
              'http://192.168.1.11:8080/depots/' + user.email, // End-point
              {headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              })}
            ).share();

            seq
              .map(res => res.json())
              .subscribe( () => { }, () => { } );

            return seq;

        });

      }
    );
  }

  /**
   * Get depot request
   */
  getDepot(depotID: string) {
    return this.storage.get('user').then(
      (user: User) => {

        return this.storage.get('token').then(
          (token: any) => {

            let seq = this.http.get(
              'http://192.168.1.11:8080/depots/' + user.email + '/' + depotID, // End-point
              {headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              })}
            ).share();

            seq
              .map(res => res.json())
              .subscribe( () => { }, () => { } );

            return seq;

          });

      }
    );
  }
}
