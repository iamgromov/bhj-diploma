/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const body = document.querySelector('body');

    sidebarToggle.addEventListener('click', () => {
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerButton = document.querySelector('.menu-item_register');
    const loginButton = document.querySelector('.menu-item_login');
    const logoutButton = document.querySelector('.menu-item_logout');

    registerButton.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('register').open();
    });

    loginButton.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('login').open();
    });

    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      User.logout((err, response) => {
        if (response && response.success === true) {
          App.setState('init');
        }
      });
    });
  }
}