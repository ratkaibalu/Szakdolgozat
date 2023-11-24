import {
  trigger,
  animate,
  transition,
  style,
  query,
  state,
  group
} from '@angular/animations';


export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    // order
    // 1
    query(
      ':enter, :leave',
      style({ position: 'absolute', width: '100%', top: 0, left: 0 }),
      { optional: true }
    ),
    // 2
    group([
      // block executes in parallel
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('0.5s ease-in-out', style({ opacity: 1 })),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ opacity: 1 }),
          animate('0.25s ease-in-out', style({ opacity: 0 })),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

export const fadeRouterTransition = trigger('fadeRouterTransition', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({
          top: '0',
          position: 'absolute',
          left: '-10px',
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        style({
          top: '0',
          position: 'absolute',
          left: '0',
          width: '100%',
          opacity: 1,
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [animate('200ms ease-in', style({ opacity: 0, left: '10px' }))],
      { optional: true }
    ),
    query(
      ':enter',
      [animate('200ms ease-in', style({ opacity: 1, left: '0' }))],
      { optional: true }
    ),
  ]),
]);

