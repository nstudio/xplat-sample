import { Routes } from '@angular/router';

import { environment } from '@sketchpoints/core';

export interface IRouteBase {
  base: string;
  login: string;
}
export function routeBase(lazyLoad: IRouteBase, additional: Routes = []): Routes {
  return [
    {
      path: environment.baseRoutePath,
      loadChildren: lazyLoad.base
    },
    {
      path: environment.loginRoutePath,
      loadChildren: lazyLoad.login
    },
    ...additional
  ];
}

export function routeLogin(index: any) {
  return [
    {
      path: '',
      component: index
    }
  ];
}

export function routeTags(
  index: any,
  detail: any,
  gatheringDetail: any,
  gatheringDetailExtras: any = {}
): Routes {
  return [
    {
      path: '',
      component: index
    },
    {
      path: ':slug',
      component: detail,
      children: [
        {
          path: ':slug',
          component: gatheringDetail,
          ...gatheringDetailExtras
        }
      ]
    }
  ];
}
