/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static URL = '';

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback){
		createRequest({
      url: this.URL,
		  method: 'GET',
			data: data,
			callback: (err, response) => {
        if (response && response.success === true) {
          callback(null, response);
        } else if (response && response.success === false) {
          callback(response, null);
        }
      }
		});
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
		createRequest({
      url: this.URL,
		  method: 'PUT',
			data: data,
			callback: (err, response) => {
        if (response && response.success) {
          callback(null, response);
        } else if (response && response.err) {
          callback(err, null);
        }
      }
		});
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {
		createRequest({
      url: this.URL,
		  method: 'DELETE',
			data: data,
			callback: (err, response) => {
        if (response) {
          callback(null, response);
        } else {
          callback(err, null);
        }
      }
		});
  }
}
