import { Component, NgZone } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { User, getUserCoinsAndBadges } from '@sketchpoints/api';
import { WindowService, LogService, UserActions, UserState } from '@sketchpoints/core';
import { TagState } from '@sketchpoints/features/tags';
import { getAppProducts, IViewerProducts } from '@sketchpoints/features/models';
import { ModalBaseComponent } from './modal.base-component';

export interface ICoinBtn {
  id: string;
  icon: string;
  name: string;
  pending: boolean;
  btn: string;
  btnAction: (btn: ICoinBtn) => void;
}

export abstract class ModalBadgesBaseComponent extends ModalBaseComponent {
  public title;
  public badges: Array<any>;
  public userProducts: Array<string> = [];
  public userData: { coins: number; badges: Array<string> };
  public buy$: Subject<boolean>;
  public coinsp$: BehaviorSubject<ICoinBtn>;
  public coinspgold$: BehaviorSubject<ICoinBtn>;
  public coinspplus$: BehaviorSubject<ICoinBtn>;
  public coinspplatinum$: BehaviorSubject<ICoinBtn>;
  public activeProductId: string;
  public products: IViewerProducts;
  private _purchaseDone$: Subject<boolean> = new Subject();
  private _badges: Array<any> = [];

  constructor(
    store: Store<any>,
    protected ngZone: NgZone,
    protected translate: TranslateService,
    protected win: WindowService,
    protected log: LogService,
  ) {
    super(store);

    this.products = <IViewerProducts>getAppProducts();
    this.buy$ = new Subject();
    this.coinsp$ = new BehaviorSubject({
      id: this.products.coinsp,
      icon: '~/assets/images/coin.png',
      name: '1 Coin',
      pending: false,
      btn: '$0.99',
      btnAction: this._btnAction.bind(this)
    });
    this.coinspgold$ = new BehaviorSubject({
      id: this.products.coinspgold,
      icon: '~/assets/images/coin3.png',
      name: '3 Coins',
      pending: false,
      btn: '$2.99',
      btnAction: this._btnAction.bind(this)
    });
    this.coinspplus$ = new BehaviorSubject({
      id: this.products.coinspplus,
      icon: '~/assets/images/coin5.png',
      name: '5 Coins',
      pending: false,
      btn: '$3.99',
      btnAction: this._btnAction.bind(this)
    });
    this.coinspplatinum$ = new BehaviorSubject({
      id: this.products.coinspplatinum,
      icon: '~/assets/images/coin10.png',
      name: '10 Coins',
      pending: false,
      btn: '$4.99',
      btnAction: this._btnAction.bind(this)
    });

    this._badges = [
      {
        id: `badge-heart`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-heart.png?alt=media',
        color: '#e50808',
        name: 'Heart',
        pending: false,
        btn: 'Choose',
        btnAction: this._chooseAction.bind(this)
      },
      {
        id: `badge-angular`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-angular.png?alt=media',
        color: '#e30f0f',
        name: 'Angular',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-ngrx`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-ngrx.png?alt=media',
        color: '#c619c6',
        name: 'ngrx',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-ionic`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-ionic.png?alt=media',
        color: '#2e64c3',
        name: 'Ionic',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-rxjs`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-rxjs.png?alt=media',
        color: '#ca0ac4',
        name: 'rxjs',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-universal`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-universal.png?alt=media',
        color: '#4caf50',
        name: 'Universal',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-vscode`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-vscode.png?alt=media',
        color: '#0089ff',
        name: 'VS Code',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-nrwl`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-nrwl.png?alt=media',
        color: '#00dcff',
        name: 'Nrwl',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-nx`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-nx.png?alt=media',
        color: '#2b456c',
        name: 'Nx',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-thisdot`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-thisdot.png?alt=media',
        color: '#f46663',
        name: 'This Dot',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-nativescript`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-nativescript.png?alt=media',
        color: '#4569e9',
        name: 'NativeScript',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-rangleio`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-rangleio.png?alt=media',
        color: '#e6383a',
        name: 'Rangle.io',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-briebug`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-briebug.png?alt=media',
        color: '#f2622a',
        name: 'BrieBug',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-microsoft`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-microsoft.png?alt=media',
        color: '#00a3ee',
        name: 'Microsoft',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-aggrid`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-aggrid.png?alt=media',
        color: '#e11f22',
        name: 'ag-Grid',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-oasisdigital`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-oasisdigital.png?alt=media',
        color: '#2ed50d',
        name: 'Oasis Digital',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-clarity`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-clarity.png?alt=media',
        color: '#f38b00',
        name: 'Clarity',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-progress`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-progress.png?alt=media',
        color: '#5ce501',
        name: 'Progress',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-valor`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-valor.png?alt=media',
        color: '#8c131b',
        name: 'Valor',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-capone`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-capone.png?alt=media',
        color: '#004879',
        name: 'Capital One',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-domo`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-domo.png?alt=media',
        color: '#98c6e0',
        name: 'DOMO',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-firebase`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-firebase.png?alt=media',
        color: '#fcca3f',
        name: 'Firebase',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-infragistics`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-infragistics.png?alt=media',
        color: '#0099ff',
        name: 'Infragistics',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-nstudio`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-nstudio.png?alt=media',
        color: '#f75930',
        name: 'nStudio',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-electron`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-electron.png?alt=media',
        color: '#9feaf9',
        name: 'Electron',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      },
      {
        id: `badge-google`,
        icon:
          'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-google.png?alt=media',
        color: '#4285f4',
        name: 'Google',
        pending: false,
        btn: 'Redeem',
        btnAction: btn => {
          this._redeem(btn, 1);
        }
      }
      // {
      //   id: `badge-apple`,
      //   icon: 'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fbadge-apple.png?alt=media',
      //   color: '#000',
      //   name: 'Apple',
      //   pending: false,
      //   btn: 'Redeem',
      //   btnAction: (btn) => {
      //     this._redeem(btn, 1);
      //   }
      // }
    ];
  }

  private _btnAction(btn: ICoinBtn) {
    this.activeProductId = btn.id;
    this._buy();
  }

  private _redeem(btn: any, coinRequired: number) {
    if (this.userData.coins >= coinRequired) {
      this.win
        .confirm(
          `Would you like to use ${
            coinRequired > 1 ? coinRequired + ' of your coins' : '1 coin'
          } to redeem this badge?`,
          () => {
            this.ngZone.run(() => {
              // update user products - decrease coin
              this._updateUserCoinTotal(-coinRequired, 0, btn.id);
            });
          },
          'Yes, definitely!'
        )
        .then(_ => {}, _ => {});
    } else {
      this.win.alert(`This badge requires ${coinRequired > 1 ? coinRequired + ' coins' : '1 coin'} to redeem.`);
    }
  }

  private _buy() {
    this.ngZone.run(() => {
      this.buy$.next(true);
    });
  }

  public showError() {
    this.win.alert('Sorry, there might be a connection issue to the store.');
  }

  ngOnInit() {
    this.store.pipe(select(UserState.selectCurrent), takeUntil(this.destroy$)).subscribe((user: User) => {
      if (user && user.products) {
        this.userProducts = [...(user.products || [])];
        this.userData = getUserCoinsAndBadges(user);
        this.ngZone.run(() => {
          this.log.debug('user was updated totalCoins:', this.userData.coins);
          this.unlockBadges(this.userData.badges);
        });
      }
    });
  }

  public orderPending(pending: boolean) {
    this.log.debug('pending change:', pending);
    if (pending) {
      const productId = this.sanitizeProductId();
      const coin$: BehaviorSubject<ICoinBtn> = this[productId + '$'];
      coin$.next({
        ...coin$.getValue(),
        btn: '---'
      });
    } else {
      let value = this._getProductValue();
      this._resetCoins(value);
    }
  }

  public purchaseSuccess() {
    this.log.debug('purchaseSuccess:', this.activeProductId);
    this.store.dispatch(new UserActions.CreateDonation(this.activeProductId));

    // reset item status
    let value = this._getProductValue();
    this._resetCoins(value);

    // update user coin products total
    this._updateUserCoinTotal(value, 400);
  }

  public sanitizeProductId() {
    return this.activeProductId.replace(/testing/g, '');
  }

  public unlockBadges(badgeIds: Array<string>) {
    badgeIds = badgeIds || [];
    const badges = [...(this.badges || this._badges)];
    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i];
      if (badgeIds.includes(badge.id)) {
        badge.btn = 'Choose';
        badge.btnAction = this._chooseAction.bind(this);
      }
    }
    this.badges = badges;
  }

  private _updateUserCoinTotal(value: number, timeout: number = 0, badgeId?: string) {
    let updated = false;
    let coinproduct = '';
    for (let i = 0; i < this.userProducts.length; i++) {
      const p = this.userProducts[i];
      if (p.indexOf('coinsp:') > -1) {
        let currentTotal = +p.split(':')[1];
        if (currentTotal < 0) {
          // incase value got weird/negative (should never happen)
          currentTotal = 0;
        }
        value = currentTotal + value;
        coinproduct = `coinsp:${value}`;
        this.userProducts[i] = coinproduct;
        break;
      }
    }
    if (!coinproduct) {
      // first time coin purchase
      coinproduct = `coinsp:${value}`;
      this.userProducts.push(coinproduct);
    }
    if (badgeId) {
      // user redeemed a badge
      this.userProducts.push(badgeId);
      // this._unlockBadges([badgeId]);
    }
    this.log.debug('updating user products:', JSON.stringify(this.userProducts));
    this.win.setTimeout(_ => {
      this.store.dispatch(
        new UserActions.Update({
          products: this.userProducts
        })
      );
    }, timeout);
  }

  private _resetCoins(value: number) {
    this.ngZone.run(() => {
      let btn = '$0.99';
      switch (value) {
        case 3:
          btn = '$2.99';
          break;
        case 5:
          btn = '$3.99';
          break;
        case 10:
          btn = '$4.99';
          break;
      }
      const productId = this.sanitizeProductId();
      const coin$: BehaviorSubject<ICoinBtn> = this[productId + '$'];
      coin$.next({
        ...coin$.getValue(),
        btn
      });
    });
  }

  private _chooseAction(btn) {
    this.close(btn);
  }

  private _getProductValue() {
    let value = 1;
    switch (this.activeProductId) {
      case this.products.coinsp:
        value = 1;
        break;
      case this.products.coinspgold:
        value = 3;
        break;
      case this.products.coinspplus:
        value = 5;
        break;
      case this.products.coinspplatinum:
        value = 10;
        break;
    }
    return value;
  }
}
