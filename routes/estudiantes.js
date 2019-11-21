const dbConfig = require('../config/db');
const db = dbConfig.db;

module.exports = (app) => {
    app.get('/estudiantes', async (req, res) => {
        const allStudents = await db.doc('students/studentsList').get();
        res.render('estudiantes', {
            students: allStudents.data().list,
            page: 'estudiantes'
        });
    });
    app.post('/estudiantes', async (req, res) => {
        try {
            const response = await db.doc(`students/studentsList`).get();
            let studentsArray = response.data().list;
            const studentIndex = studentsArray.findIndex(student => {
                return student.nua === req.body.nua;
            });
            if (studentIndex === 1) {
                res.status(400).json({error: 'STUDENT_ALREADY_EXISTS'});
            } else {
                studentsArray.push({
                    full_name: req.body.full_name,
                    nua: req.body.nua
                });
                await db.doc('students/studentsList').update({list: studentsArray});
            }
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });
    app.patch('/estudiantes', async (req, res) => {
        try {
            const response = await db.doc(`students/studentsList`).get();
            let studentsArray = response.data().list;
            const studentIndex = studentsArray.findIndex(student => {
                return student.nua === req.body.nua;
            });
            if (studentIndex === -1) {
                res.status(400).json({error: 'STUDENT_DOESNT_EXISTS'});
            } else {
                studentsArray[studentIndex].full_name = req.body.new_full_name;
                studentsArray[studentIndex].nua = req.body.new_nua;
                await db.doc('students/studentsList').update({list: studentsArray});
            }
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });
    app.delete('/estudiantes', async (req, res) => {
        try {
            const response = await db.doc(`students/studentsList`).get();
            let studentsArray = response.data().list;
            const studentIndex = studentsArray.findIndex(student => {
                return student.nua === req.body.nua;
            });
            if (studentIndex === -1) {
                res.status(400).json({error: 'STUDENT_DOESNT_EXISTS'});
            } else {
                const newStudentsArray = studentsArray.filter(student => student.nua !== req.body.nua);
                await db.doc('students/studentsList').update({list: newStudentsArray});
            }
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });
};
const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/login');
    }
};