export const DELIVERY_SIZES = [
    {
        value: 'xs',
        rate: 9,
        min: 149,
        description: $localize`17×12×9 см,<br>до 0.5 кг`
    },
    {
        value: 's',
        rate: 13,
        min: 199,
        description: $localize`23×19×10 см,<br>до 2 кг`
    },
    {
        value: 'm',
        rate: 20,
        min: 249,
        description: $localize`33×25×15 см,<br>до 5 кг`
    },
    {
        value: 'l',
        rate: 27,
        min: 349,
        description: $localize`31×25×38 см,<br>до 12 кг`
    },
    {
        value: 'xl',
        rate: 35,
        min: 499,
        description: $localize`60×35×30 см,<br>до 18 кг`
    },
    {
        value: 'max',
        rate: 70,
        min: 999,
        description: $localize`120×120×80 см,<br>до 200 кг`,
        mediaClass: 'main-size-media-palleta'
    }
] as const;

export const DELIVERY_SPEEDS = [
    {value: 'regular', label: $localize`Обычная`},
    {value: 'fast', label: $localize`Приоритетная`}
] as const;