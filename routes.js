'use strict';

module.exports = function(app){
    var json = require('./controller');

    app.route('/')
        .get(json.index);

    /**kalo pake parameter
     * 
     * 
     /searchStudent/:id
     */

    app.route('/searchStudents')
        .post(json.searchStudentDetails);

    app.route('/searchTeacher')
        .post(json.searchTeacher);

    app.route('/editStudent')
        .put(json.editStudent);

    app.route('/editTeacher')
        .put(json.editTeacher);

    app.route('/changePassword')
        .put(json.changePassword);

    app.route('/tahunAjaran')
        .get(json.showTahunAjaran);

    app.route('/tahunAjaran/add')
        .post(json.addTahunAjaran);

    app.route('/tahunAjaran/edit')
        .put(json.editTahunAjaran);

    app.route('/tahunAjaran/delete')
        .delete(json.deleteTahunAjaran);

    app.route('/tahunAjaran/active')
        .put(json.setActiveTahunAjaran);

    app.route('/rombelSekolah')
        .get(json.showRombelSekolah);

    app.route('/rombelSekolah/add')
        .post(json.addRombelSekolah);

    app.route('/rombelSekolah/edit')
        .put(json.editRombelSekolah);

    app.route('/rombelSekolah/delete')
        .delete(json.deleteRombelSekolah);
        
    app.route('/statusSiswa')
        .get(json.getAllStatusSiswa);

    app.route('/statusSiswa/add')
        .post(json.setStatusSiswa);
        
    app.route('/rombelSiswa/delete')
        .delete(json.revertRombelSiswa);
}