export const FORM_CONTENT = {
    defaults: {
        trigger: {
            type: 'button',
            description: null,
            text: null,
            validation: 'word',
            inputNeedMatch: false,
            matchString: null
        },
        event: {
            label: null,
            value: null
        }
    },
    validations: [
        {
            label: 'Текст',
            value: 'word'
        },
        {
            label: 'Email',
            value: 'email'
        },
        {
            label: 'Телефон',
            value: 'phone'
        },
        {
            label: 'Адрес',
            value: 'address'
        },
        {
            label: 'Сумма',
            value: 'price'
        },
        {
            label: 'Возраст',
            value: 'age'
        }
    ],
    triggerTypes: [{
            label: 'Кнопка',
            value: 'button'
        },
        {
            label: 'Ввод',
            value: 'input'
        }
    ],
    rules: {
        labelRule: {
            required: true,
            message: 'Текст сообщения обязателен!',
            trigger: 'blur'
        },
        triggerRule: {
            required: true,
            message: 'Текст триггера обязателен!',
            trigger: 'blur'
        },
        triggerDescriptionRule: {
            required: true,
            message: 'Описание триггера обязательно!',
            trigger: 'blur'
        },
    }
}