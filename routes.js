'use strict';

module.exports = function(app){
    var json = require('./controller');
    var verification = require('./middleware/verification');

    app.route('/')
        .get(json.index);

    /**kalo pake parameter
     * 
     * 
     /searchStudent/:id
     */

    app.post('/searchStudents', verification.verification, json.searchStudentDetails);
    app.post('/searchTeacher', verification.verification, json.searchTeacher);
    
    app.put('/editStudent', verification.verification, json.editStudent);
    app.put('/editTeacher', verification.verification, json.editTeacher);
    app.put('/changePassword', verification.verification, json.changePassword);
    
    app.post('/tahunAjaran/current', verification.verification, json.getCurrentTahunAjaran);
    // app.route('/tahunAjaran/current')
    //     .post(json.getCurrentTahunAjaran);

    app.post('/tahunAjaran/previous', verification.verification, json.getPreviousTahunAjaran);

    app.post('/tahunAjaran', verification.verification, json.showTahunAjaran);
    app.post('/tahunAjaran/add', verification.verification, json.addTahunAjaran);
    app.put('/tahunAjaran/edit', verification.verification, json.editTahunAjaran);
    app.delete('/tahunAjaran/delete', verification.verification, json.deleteTahunAjaran);
    app.put('/tahunAjaran/active', verification.verification, json.setActiveTahunAjaran);

    app.post('/rombelSekolah', verification.verification, json.showRombelSekolah);
    app.post('/rombelSekolah/add', verification.verification, json.addRombelSekolah);
    app.put('/rombelSekolah/edit', verification.verification, json.editRombelSekolah);
    app.delete('/rombelSekolah/delete', verification.verification, json.deleteRombelSekolah);
        
    app.get('/statusSiswa', verification.verification, json.getAllStatusSiswa);
    app.post('/statusSiswa/add', verification.verification, json.setStatusSiswa);
        
    app.delete('/rombelSiswa/delete', verification.verification, json.revertRombelSiswa);
    app.delete('/rombelWaliKelas/delete', verification.verification, json.revertRombelWaliKelas);
    app.post('/rombelWaliKelas/add', verification.verification, json.setWaliKelas);
    app.post('/rombelSiswa/add', verification.verification, json.setRombelSiswa);

    app.post('/nilaiSiswa/mapel', verification.verification, json.getAllMapel);
    app.post('/nilaiSiswa/all', verification.verification, json.getAllNilaiMapel);
    app.post('/nilaiSiswa/exists', verification.verification, json.getAllExistingNilaiMapel);
    app.post('/nilaiSiswa/add', verification.verification, json.addNilaiAkhirSiswa);

    app.post('/kuesioner', verification.verification, json.testKuesioner);
    app.post('/kuesioner/show', verification.verification, json.getTestResults);

    app.post('/rombelSiswa/getAllSiswa', verification.verification, json.getSiswaTingkat);
    app.post('/rombelSiswa/getAverage', verification.verification, json.getAverageNilaiAkhir);
    app.post('/rombelSiswa/getAllTests', verification.verification, json.getAllTestResults); 
    app.post('/rombelSiswa/showDetail', verification.verification, json.getRombelSearch);
}