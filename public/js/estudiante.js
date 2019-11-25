const addStudent = () => {
    $('#modal-title').html('Agregar estudiante');
    $('#form-name').val('');
    $('#form-nua').val('');
    $('#modal-dialog').modal('show');
    $("#modal-save").attr("onclick", "saveNewStudent()");
};
const editStudent = (element) => {
    $('#modal-title').html('Editar estudiante');
    $('#form-name').val(element.innerHTML);
    $('#form-nua').val(element.closest('tr').children[1].children[0].innerHTML).attr('old-nua', element.closest('tr').children[1].children[0].innerHTML);
    $('#modal-dialog').modal('show');
    $("#modal-save").attr("onclick", "saveEditStudent()");
};

const saveNewStudent = async () => {
    try {
        await axios.post('/estudiante', {
            full_name: $('#form-name').val(),
            nua: $('#form-nua').val()
        });
        location.reload();
    } catch (e) {
        alert(e);
    }
};

const saveEditStudent = async () => {
    try {
        await axios.patch('/estudiante', {
            new_full_name: $('#form-name').val(),
            new_nua: $('#form-nua').val(),
            nua: $('#form-nua').attr('old-nua')
        });
        location.reload();
    } catch (e) {
        console.error(e);
    }
};

const saveDeleteStudent = async (element) => {
    if (confirm('¿Estás seguro de que deseas eliminar?')) {
        try {
            await axios.delete('/estudiante', {
                data: {
                    nua: element.closest('tr').children[1].children[0].innerHTML.trim()
                }
            });
            location.reload();
        } catch (e) {
            console.error(e);
        }
    }
};