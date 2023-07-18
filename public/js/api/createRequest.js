/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    if (options.data && options.method === 'GET') {
      options.url += '?';
      for(let key in options.data) {
        if(options.data[key]) {
          options.url += `${key}=${options.data[key]}&`
        }
      }
      options.url = options.url.slice(0, -1);

      xhr.open(options.method, options.url);
      xhr.send();
    } else {
      const formData = new FormData();

      for (let key in options.data) {
        formData.append(key, options.data[key]);
      }

      xhr.open(options.method, options.url);
      xhr.send(formData);
    }

    xhr.onerror = () => {
        options.callback(new Error(xhr.statusText), null);
    }

    xhr.onload = () => {
      options.callback(null, xhr.response);
    }
};
