describe('ToDo Calendar Application', () => {
    beforeEach(() => {
        // Очищаем базу данных сервера перед каждым тестом
        cy.request('POST', 'http://localhost:4000/reset');
    });

    it('Должен отображать календарь с количеством задач', () => {
        cy.visit('/');
        cy.get('.calendar').should('exist');
    });

    it('Должен добавлять новую задачу и отображать ее в календаре', () => {
        cy.visit('/');

        // Открываем форму добавления задачи
        cy.get('.add-task-button').click();

        // Заполняем форму
        cy.get('input[name="title"]').type('Новая задача');
        cy.get('input[name="date"]').type('2023-10-10');

        // Отправляем форму
        cy.get('.submit-button').click();

        // Проверяем, что задача отображается в календаре на соответствующей дате
        cy.get('.calendar')
            .contains('10')
            .parent()
            .should('contain', '1'); // Предполагаем, что количество задач отображается числом

        // Проверяем, что при клике на дату отображается задача
        cy.get('.calendar').contains('10').click();
        cy.get('.task-list').should('contain', 'Новая задача');
    });

    it('Должен удалять задачу', () => {
        // Предварительно добавляем задачу
        cy.request('POST', 'http://localhost:4000/tasks', {
            title: 'Задача для удаления',
            date: '2023-10-11',
        });

        cy.visit('/');

        // Переходим к задачам на 11-е число
        cy.get('.calendar').contains('11').click();

        // Удаляем задачу
        cy.get('.task-list')
            .contains('Задача для удаления')
            .parent()
            .find('.delete-button')
            .click();

        // Проверяем, что задача удалена из списка
        cy.get('.task-list').should('not.contain', 'Задача для удаления');

        // Проверяем, что количество задач в календаре обновилось
        cy.get('.calendar')
            .contains('11')
            .parent()
            .should('not.contain', '1');
    });

    it('Должен отображать ошибки валидации при добавлении задачи без названия', () => {
        cy.visit('/');

        cy.get('.add-task-button').click();

        // Оставляем поле названия пустым
        cy.get('input[name="title"]').should('have.value', '');

        cy.get('input[name="date"]').type('2023-10-12');

        cy.get('.submit-button').click();

        // Проверяем, что отображается сообщение об ошибке
        cy.get('.error-message').should('contain', 'Название задачи обязательно');
    });
});
