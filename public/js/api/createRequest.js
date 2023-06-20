/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    xhr.responseType = 'json';
    xhr.open(options.method, options.url);

    xhr.onload = () => {
        if (xhr.status === 200) {
            options.callback(null, xhr.response);
        } else {
            options.callback(xhr.response, null);
        }
    }

    xhr.onerror = () => {
        options.callback(new Error(xhr.statusText), null);
    }

    if (options.method === 'GET') {
        xhr.send();
    } else {
        for (let key in options.data) {
            formData.append(key, options.data[key]);
        }
        xhr.send(formData);
    }
};
