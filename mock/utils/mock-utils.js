export const parseQueryParams = (url) => {
    const query = url.split('?')[1] || '';
    const params = {};
    query.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    return params;
}



export default {parseQueryParams}