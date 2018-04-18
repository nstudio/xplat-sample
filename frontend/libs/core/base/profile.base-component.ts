import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { takeUntil, skip, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { User, Donation, getUserCoinsAndBadges } from '@sketchpoints/api';

import { environment } from '../environments/environment';
import { UserService } from '../services/user.service';
import { UserActions, UserState, RouterActions } from '../state';
import { BaseComponent } from './base-component';

export abstract class ProfileBaseComponent extends BaseComponent implements OnInit {
  public profile: User;
  public donations$: Observable<any[]>;
  public totalCoins: number = 0;
  public totalDonations: number = 0;
  private _editProfile: User;

  constructor(
    protected store: Store<UserState.IState>,
    protected route: ActivatedRoute,
    public userService: UserService
  ) {
    super();
  }

  public get editProfile() {
    return this._editProfile;
  }

  public set editProfile(value: User) {
    // clone to edit
    this._editProfile = value ? { ...value } : null;
  }

  public update(user: User) {
    this.store.dispatch(new UserActions.Update(user));
  }

  public toggleEdit() {
    if (this._editProfile) {
      this._editProfile = null;
    } else {
      this.editProfile = this.profile;
    }
  }

  ngOnInit(): void {
    this.store.pipe(select(UserState.selectCurrent), takeUntil(this.destroy$), skip(1)).subscribe((user: User) => {
      if (user && this.profile && user.id === this.profile.id) {
        // updated profile
        this._setProfile(user);
        this.editProfile = null;
      } else {
        // user logged out when on profile page, take them back to home
        this.store.dispatch(
          new RouterActions.Go({
            path: ['/']
          })
        );
      }
    });
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      this.userService.getProfile(id).subscribe(p => {
        this._setProfile(p);
      });
    });

    this.totalDonations = 0;
    this.donations$ = this.store.pipe(
      select(UserState.selectDonations),
      map((donations: Donation[]) => {
        this.totalDonations = 0;
        if (donations) {
          let amount = 0.99;
          const suffix = environment.dev ? 'testing' : '';
          const productIds = {
            donation: `donation${suffix}`,
            donationup: `donationup${suffix}`,
            donationplus: `donationplus${suffix}`,
            donationpremiere: `donationpremiere${suffix}`
          };
          return donations.map(d => {
            switch (d.productId) {
              case productIds.donation:
                amount = 0.99;
                break;
              case productIds.donationup:
                amount = 2.99;
                break;
              case productIds.donationplus:
                amount = 4.99;
                break;
              case productIds.donationpremiere:
                amount = 9.99;
                break;
            }
            this.totalDonations += amount;
            return {
              ...d,
              amount
            };
          });
        } else {
          return [];
        }
      })
    );
    // load donations
    this.store.dispatch(new UserActions.GetDonations());
  }

  private _setProfile(p: User) {
    const { __typename, ...profile } = <any>p;
    this.profile = profile;
    if (!environment.isArtist) {
      // for now don't show coins to artist (may reconsider later)
      if (profile && profile.products) {
        const data = getUserCoinsAndBadges(profile);
        this.totalCoins = data.coins;
      }
    }
  }
}
