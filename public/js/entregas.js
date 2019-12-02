const tbody = document.querySelector('tbody');
const table = document.querySelector('table');
const input = document.querySelector('.nua-input');
table.style.visibility = 'hidden';


const getDueList = async () => {
    let markup = '';
    try {
        const response = await axios.get(`/pendientes?nua=${document.getElementById('nua').value.trim()}`);
        response.data.due_list.forEach(element => {
            markup = markup.concat(`
               <tr ${element.expired ? 'class="table-danger"' : null}>
                    <td>${element.title}</td>
                    <td>${element.author}</td>
                    <td>${element.edition}</td>
                    <td>${element.editorial}</td>
                    <td>${element.borrowed_on}</td>
                    <td>${element.expires_on}</td>
                    <td>
                        <i class="far fa-calendar-check" title="Entregar libro" onclick="deliverBook(this)"></i>
                        <i class="fas fa-redo-alt ml-3" title="Renovar 7 días" onclick="postponeBook(this)"></i>
                    </td>
                </tr>
            `);
        });
        tbody.innerHTML = markup;
        table.style.visibility = 'visible';
        input.classList.remove('is-invalid');
    } catch (e) {
        input.value = '';
        input.classList.add('is-invalid');
        table.style.visibility = 'hidden';
    }


};

const deliverBook = async (row) => {
    const title = row.closest('tr').children[0].innerHTML.trim();
    try {
        await axios.post(`/entregar?nua=${document.getElementById('nua').value.trim()}&title=${title}`, {data:null});
        row.closest('tr').remove();
    } catch (e) {
        console.log(e.response);
    }
};

const postponeBook = async (row) => {
    const title = row.closest('tr').children[0].innerHTML.trim();
    try {
        const response = await axios.post(`/posponer?nua=${document.getElementById('nua').value.trim()}&title=${title}`, {data:null});
        const rowElement = row.closest('tr');
        console.log(response.data.new_date);
        rowElement.children[5].innerHTML = response.data.new_date;
        if(rowElement.classList.contains('table-danger')) {
            rowElement.classList.remove('table-danger');
        }
    } catch (e) {
        console.log(e);
        console.log(e.response);
    }
};