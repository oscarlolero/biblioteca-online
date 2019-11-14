const dbConfig = require('../config/db');
const db = dbConfig.db;

module.exports = (app) => {
    app.get('/estudiantes', checkLogin, async (req, res) => {
        const allStudents = await db.collection('students').listDocuments();
        res.render('estudiantes', {
            students: allStudents.map(e => e.id),
            page: 'estudiantes'
        });
    });
    app.post('/estudiantes', async (req, res) => {
        try {
            const student = await db.doc(`students/${req.body.student_name}`).get();
            if (student.exists) return res.status(400).json({error: 'STUDENT_ALREADY_EXISTS'});
            await db.collection('students').doc(req.body.student_name).set({
                nua: req.body.nua
            });
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });
    app.patch('/estudiantes', async (req, res) => {
        try {
            const student = await db.doc(`students/${req.body.student_name}`).get();
            if (!student.exists) return res.status(404).json({error: 'STUDENT_DOESNT_EXISTS'});
            await Promise.all([
                db.collection('students').doc(req.body.old_student_name).delete(),
                db.collection('students').doc(req.body.new_student_name).set({
                    nua: req.body.nua
                })
            ]);
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });
    app.delete('/estudiantes', async (req, res) => {
        try {
            const student = await db.doc(`students/${req.body.student_name}`).get();
            if (!student.exists) return res.status(404).json({error: 'STUDENT_DOESNT_EXISTS'});
            await db.collection('students').doc(req.body.student_name).delete();
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