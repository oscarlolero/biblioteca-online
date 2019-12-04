const input = document.getElementById('nua');

const updateTable = () => {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("title");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
};
const addBook = async (element) => {
    const row = element.closest('tr');
    try {
        const book_data = {
            title: row.children[0].children[1].innerHTML,
            author: row.children[1].innerHTML,
            edition: row.children[2].innerHTML,
            editorial: row.children[3].innerHTML,
        };
        const response = await axios.post('/asignar', {
           book_data,
           nua: parseInt(document.getElementById('nua').value)
        });
        row.classList.add('table-success');
        setTimeout(() => {
            row.classList.remove('table-success');
        }, 450);

        input.classList.remove('is-invalid');
    } catch (e) {
        if(e.response.status === 404) {
            input.value = '';
            input.classList.add('is-invalid');
        } else {
            alert('No se puede asignar el mismo libro a un estudiante.');
        }
    }
};
