/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let path = `http://localhost:8000${options.url}`;

    if (options.method === 'GET') {
        if (options.data) {
          path = `${path}?`;
          for (let key in options.data) {
            path = `${path}${key}=${options.data[key]}&`;
          }
          path = path.slice(0, path.length);
        }
        xhr.open(options.method, path);
        xhr.send();
    } else {
        const formData = new FormData();
        for (let key in options.data) {
          formData.append(key, options.data[key]);
        }
        xhr.open(options.method, path);
        xhr.send(formData);
    }

    xhr.onerror = () => {
        options.callback(new Error(xhr.statusText), null);
    }

    xhr.onload = () => {
        options.callback(err, xhr.response);
    }
};
