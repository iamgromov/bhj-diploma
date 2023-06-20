/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';

  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback){
    createRequest({
      url: this.URL,
      method: 'GET',
      data: {
        id: id
      },
      callback: (err, response) => {
        if (response && response.success === true) {
          callback(null, response);
        } else if (response && response.success === false) {
          callback(response, null);
        }
      }
    });
  }
}
