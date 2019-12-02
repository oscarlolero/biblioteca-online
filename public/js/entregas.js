const tbody = document.querySelector('tbody');
const table = document.querySelector('table');
const input = document.querySelector('.nua-input');
table.style.visibility = 'hidden';

const getDueList = async () => {
    let markup = '';
    const response = await axios.post('/pendientes', {
        nua: document.getElementById('nua').value.trim()
    });
    if(!response.data.error) {
        response.data.due_list.forEach(element => {
            markup = markup.concat(`
               <tr>
                    <td>${element.title}</td>
                    <td>${element.author}</td>
                    <td>${element.edition}</td>
                    <td>${element.editorial}</td>
                    <td>${element.borrowed_on}</td>
                    <td>${element.expires_on}</td>
                    <td>
                        <i class="far fa-calendar-check" title="Entregar libro" onclick="deliverBook('${element.title}')"></i>
                        <i class="fas fa-redo-alt ml-3" title="Renovar 7 días"></i>
                    </td>
                </tr>
            `);
        });
        tbody.innerHTML = markup;
        table.style.visibility = 'visible';
        input.classList.remove('is-invalid');
    } else {
        input.value = '';
        input.classList.add('is-invalid');
        table.style.visibility = 'hidden';
    }

};

const deliverBook = async (title) => {
    const response = await axios.post('/')
};