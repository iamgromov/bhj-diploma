/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error();
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.classList.contains('remove-account')) {
        this.removeAccount();
      }
      else if (event.target.closest('.transaction__remove')) {
        this.removeTransaction(event.target.closest('button').dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions && confirm('Удалить этот счёт?')) {
      Account.remove({id: this.lastOptions.account_id}, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      this.clear();
      App.updateWidgets();
      App.updateForms();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if(this.lastOptions && confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id }, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      App.update();
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return;
    }
    this.lastOptions = options;

    Account.get(options.account_id, {}, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      this.renderTitle(response.data.name);
    });

    Transaction.list(options, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = undefined;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const startDate = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatDate = startDate.toLocaleString('ru', options).toString();
    const formatTime = startDate
      .toLocaleTimeString()
      .slice(0, startDate.toLocaleTimeString().length - 3);

    return `${formatDate} в ${formatTime}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
    <div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
        </div>
     </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash transaction-trash"></i>  
        </button>
      </div>
    </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const transactionsBlock = this.element.querySelector('.content');

    if(Object.keys(data) !== 0) {
      transactionsBlock.innerHTML = data.reduce((acc, current) => {
        return acc + this.getTransactionHTML(current);
      }, '');
    }
  }
}