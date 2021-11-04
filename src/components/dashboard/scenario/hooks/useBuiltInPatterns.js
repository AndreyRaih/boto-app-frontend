import { v4 } from "uuid";

export default function useBuiltInPatterns() {
    function createSegmentationModule() {
        const segmentation = [
            {
                id: v4(),
                title: 'Начало',
                event: {
                    label: 'Начало'
                },
                triggers: [createChild(v4(), '1'), createChild(v4(), '2'), createChild(v4(), '3')],
                text: 'Начало диалога, расскажите немного о себе, придумайте вопрос, определяющий к какому сегменту отнести клиента.'
            }
        ];
        function createChild(id, segmentName) {
            setTimeout(() => segmentation.push({
                id,
                title: `Ветка для сегмента "${segmentName}"`,
                event: {
                    label: `Сегмент: ${segmentName}`
                },
                triggers: [],
                text: `Ветка диалога для клиентов из сегмента ${segmentName}. Введите свой текст...`
            }), 0);
            return { destinationId: id, text: `Ветка для сегмента "${segmentName}"` }
        }
        return segmentation;
    }

    function createFunnelModule() {
        const addingQueue = [];
        const funnel = [
            {
                id: v4(),
                title: 'Начало',
                event: {
                    label: 'Автоворонка: лид-магнит'
                },
                triggers: [createChild(v4(), {
                    title: 'Автоворонка: презентация',
                    event: {
                        label: 'Автоворонка: презентация'
                    },
                    triggers: [createChild(v4(), {
                        title: 'Автоворонка: действие',
                        event: {
                            label: 'Автоворонка: действие'
                        },
                        triggers: [],
                        text: 'Шаг с целевым действием. Затем мы задаем вопрос, мотивирующий пользователя на дальнейшее действие. Например, зовем на консультацию, встречу, предлагаем пообщаться с менеджером — в зависимости от специфики услуги.'
                    })],
                    text: 'Шаг с презентацией. Это знакомство, которое мягко посвящает получателя в курс дела — чем вы можете быть ему полезны.'
                })],
                text: 'Начало диалога. Здесь могут быть бесплатные полезные материалы: чеклисты, руководства, шаблоны, которые пользователь получит в обмен на оставленный контакт.'
            }
        ];
        function createChild(id, node) {
            addingQueue.unshift({ ...node, id });
            return { destinationId: id, text: node.title }
        }
        for (const item of addingQueue) {
            funnel.push(item);
        }
        return funnel;
    }

    function createQuizModule() {
        const addingQueue = [];
        const quiz = [
            {
                id: v4(),
                title: 'Вопрос 1 - Начало',
                event: {
                    label: 'Квиз: Начало'
                },
                triggers: [createChild(v4(), {
                    title: 'Вопрос 1 - Ответ 1',
                    event: {
                        label: 'Квиз: Вопрос 1 - Ответ 1'
                    },
                    triggers: [createChild(v4(), {
                        title: 'Вопрос 2 - Ответ 1',
                        event: {
                            label: 'Квиз: Вопрос 2 - Ответ 1'
                        },
                        triggers: [],
                        text: 'Шаг с предложением решения.'
                    })],
                    text: 'Вопрос для соответствующего сегмента. Здесь может быть выявление потребностей.'
                }),
                createChild(v4(), {
                    title: 'Вопрос 1 - Ответ 2',
                    event: {
                        label: 'Квиз: Вопрос 1 - Ответ 2'
                    },
                    triggers: [createChild(v4(), {
                        title: 'Вопрос 2 - Ответ 1',
                        event: {
                            label: 'Квиз: Вопрос 2 - Ответ 1'
                        },
                        triggers: [],
                        text: 'Шаг с предложением решения.'
                    })],
                    text: 'Вопрос для соответствующего сегмента. Здесь может быть выявление потребностей.'
                })],
                text: 'Начало диалога. Здесь может быть вопрос, сегментирующий аудиторию'
            }
        ];
        function createChild(id, node) {
            addingQueue.unshift({ ...node, id });
            return { destinationId: id, text: node.title }
        }
        for (const item of addingQueue) {
            quiz.push(item);
        }
        return quiz;
    }
    return {
        segmentation: createSegmentationModule(),
        autofunnel: createFunnelModule(),
        quiz: createQuizModule(),
        getPatternByType: (type) => {
            switch (type) {
                case 'add_segment':
                    return createSegmentationModule();
                case 'new_funnel':
                    return createFunnelModule();
                case 'new_quize':
                    return createQuizModule();
                default:
                    return [];
            }
        }
    }
}