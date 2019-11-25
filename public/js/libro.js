const addBook = () => {
    $('#modal-title').html('Agregar libro');
    $('#form-name').val('');
    $('#form-author').val('');
    $('#form-editorial').val('');
    $('#form-edition').val('');
    $('#modal-dialog').modal('show');
    $("#modal-save").attr("onclick", "saveNewBook()");
};
const editBook = (element) => {
    $('#modal-title').html('Editar libro');
    $('#form-title').val(element.closest('tr').children[0].innerHTML).attr('old-title', element.closest('tr').children[0].innerHTML);
    $('#form-author').val(element.closest('tr').children[1].innerHTML);
    $('#form-edition').val(element.closest('tr').children[2].innerHTML);
    $('#form-editorial').val(element.closest('tr').children[3].children[0].innerHTML);
    $('#modal-dialog').modal('show');
    $("#modal-save").attr("onclick", "saveEditBook()");
};

const saveNewBook = async () => {
    try {
        await axios.post('/libro', {
            title: $('#form-title').val(),
            author: $('#form-author').val(),
            edition: $('#form-edition').val(),
            editorial: $('#form-editorial').val()
        });
        location.reload();
    } catch (e) {
        alert(e);
    }
};

const saveEditBook = async () => {
    try {
        const book = {
            old_title: $('#form-title').attr('old-title'),
            title: $('#form-title').val(),
            author: $('#form-author').val(),
            edition: $('#form-edition').val(),
            editorial: $('#form-editorial').val()
        };
        await axios.patch('/libro', book);
        location.reload();
    } catch (e) {
        console.error(e);
    }
};

const saveDeleteBook = async (element) => {
    if (confirm('¿Estás seguro de que deseas eliminar?')) {
        try {
            await axios.delete('/libro', {
                data: {
                    title: element.closest('tr').children[0].innerHTML.trim()
                }
            });
            location.reload();
        } catch (e) {
            console.error(e);
        }
    }
};