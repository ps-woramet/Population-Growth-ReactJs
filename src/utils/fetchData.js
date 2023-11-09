export function fetchData(apiUrl){
    return new Promise((resolve, reject) => {
            axios.get(apiUrl)
            .then(response => {
                const jsonData = response.data
                return jsonData;
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })
}