import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Order } from './pages/order/order';
import { Track } from './pages/track/track';

export const routes: Routes = [
    {
        component: Home,
        path: '',
    },
    {
        component: Order,
        path: 'order',
    },
    {
        component: Track,
        path: 'track',
    },
    {
        redirectTo: 'Track',
        path: '**',
    },
];
