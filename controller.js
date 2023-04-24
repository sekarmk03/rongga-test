'use strict';

var response = require('./res');
var connection = require('./koneksi');
var md5 = require('md5');

exports.index = function (req, res) {
    response.ok("Aplikasi REST API berjalan!", res)
};

//get all data siswa
/* exports.searchStudent = function (req, res) { */
    /**kalo pake parameter
     * 
     * 
     let id = req.params.id;
     ntar querynya jadi SELECT * FROM view_siswa WHERE id = ?, [id]
     */

    /* connection.query('SELECT * FROM view_siswa', function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res)
        }
    });
} */

/* SEARCH FEATURE */
//post request
exports.searchStudentDetails = function (req, res) {
    let id_sekolah = req.body.id_sekolah;
    let nama = "%" + req.body.nama + "%";
    let rombel = req.body.rombel;

    let query = "";
    let requests = [];

    if ((nama != null && nama !== "%%") && (rombel != null && rombel !== '')){
        query = "SELECT * FROM view_siswa WHERE id_sekolah=? AND nama LIKE ? AND rombel = ?";
        requests.push(id_sekolah);
        requests.push(nama);
        requests.push(rombel);
    } else {
        if (nama != null && nama !== "%%") {
            query = "SELECT * FROM view_siswa WHERE id_sekolah=? AND nama LIKE ?";
            requests.push(id_sekolah);
            requests.push(nama);
        } else if (rombel != null && rombel !== '') {
            query = "SELECT * FROM view_siswa WHERE id_sekolah=? AND rombel = ?";
            requests.push(id_sekolah);
            requests.push(rombel);
        } else {
            query = "SELECT * FROM view_siswa WHERE id_sekolah=?";
            requests.push(id_sekolah);
        }
    }

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            //kalo post biasa response rows bisa diisi dengan string message dan res
            response.ok(rows, res)
        }
    });
}

exports.searchTeacher = function (req, res) {
    let id_sekolah = req.body.id_sekolah;
    let nama = "%" + req.body.nama + "%";

    let query = "";
    let requests = [];

    if (nama != null && nama !== "%%"){
        query = "SELECT * FROM view_guru WHERE id_sekolah=? AND nama LIKE ?";
        requests.push(id_sekolah);
        requests.push(nama);
    } else {
        query = "SELECT * FROM view_guru WHERE id_sekolah=?";
        requests.push(id_sekolah);
    }

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res)
        }
    });
}

/* UPDATE PROFILE FEATURE */
exports.editStudent = function (req, res) {
    let id_user = req.body.id;
    let nis = req.body.no_induk;
    let nama = req.body.nama;
    let email = req.body.email;
    let gender = req.body.gender;
    let no_telp = req.body.telp;
    let photos = req.body.photos;
    let alamat = req.body.alamat;
    let status_siswa = req.body.status_siswa;
    let id_tingkat_siswa = req.body.id_tingkat_siswa;
    let tahun_masuk = req.body.tahun_masuk;

    let query_users = "UPDATE users SET no_induk=?, nama=?, email=?, gender=?, no_telp=?, photo=?, alamat=? WHERE id=?";
    let users_requests = [nis, nama, email, gender, no_telp, photos, alamat, id_user];

    connection.query(query_users, users_requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            query_users = "UPDATE siswa SET tahun_masuk=?, status_awal_siswa=?, id_tingkat_siswa=? WHERE id_users=?";
            users_requests = [tahun_masuk, status_siswa, id_tingkat_siswa, id_user];

            connection.query(query_users, users_requests, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok("Update Profil berhasil!", res)
                }
            });
        }
    });
}

exports.editTeacher = function (req, res) {
    let id_user = req.body.id;
    let nis = req.body.no_induk;
    let nama = req.body.nama;
    let email = req.body.email;
    let gender = req.body.gender;
    let no_telp = req.body.telp;
    let photos = req.body.photos;
    let alamat = req.body.alamat;
    let status_kerja = req.body.status_kerja;
    let id_mapel = req.body.id_mapel;

    let query_users = "UPDATE users SET no_induk=?, nama=?, email=?, gender=?, no_telp=?, photo=?, alamat=? WHERE id=?";
    let users_requests = [nis, nama, email, gender, no_telp, photos, alamat, id_user];

    connection.query(query_users, users_requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            query_users = "UPDATE guru SET id_mapel=?, status_kerja=? WHERE id_users=?";
            users_requests = [id_mapel, status_kerja, id_user];

            connection.query(query_users, users_requests, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok("Update Profil berhasil!", res)
                }
            });
        }
    });
}

/* CHANGE PASSWORD */
exports.changePassword = function (req, res) {
    let id_user = req.body.id;
    let password = md5(req.body.password);

    let query_users = "UPDATE users SET password=? WHERE id=?";
    let users_requests = [password, id_user];

    connection.query(query_users, users_requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Password berhasil diubah!", res);
        }
    });
}

/* ADMIN TAHUN AJARAN */
exports.showTahunAjaran = function (req, res) {
    let id_sekolah = req.params.id_sekolah;

    let query = "SELECT * FROM tahun_ajaran WHERE id_sekolah=?";
    let requests = [id_sekolah];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
}

exports.addTahunAjaran = function (req, res) {
    let id_sekolah = req.body.id_sekolah;
    let tahun_ajaran = req.body.tahun_ajaran;
    let semester = req.body.semester;
    let aktif = 0;

    let query = "SELECT * FROM tahun_ajaran WHERE id_sekolah=? AND tahun_ajaran=? AND semester=?";
    let requests = [id_sekolah, tahun_ajaran, semester];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if(rows.length === 0) {
                query = "INSERT INTO tahun_ajaran (id_sekolah, tahun_ajaran, semester, aktif) VALUES (?,?,?,?)";
                requests = [id_sekolah, tahun_ajaran, semester, aktif];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.ok("Tahun Ajaran berhasil ditambahkan!", res);
                    }
                });                
            } else {
                response.ok("Tahun Ajaran tersebut sudah ada!", res);
            }
        }
    });
}

exports.editTahunAjaran = function (req, res) {
    let id_tahun_ajaran = req.body.id_tahun_ajaran;
    let id_sekolah = req.body.id_sekolah;
    let tahun_ajaran = req.body.tahun_ajaran;
    let semester = req.body.semester;
    let aktif = 0;

    let query = "UPDATE tahun_ajaran SET id_sekolah=?, tahun_ajaran=?, semester=?, aktif=? WHERE id=?";
    let requests = [id_sekolah, tahun_ajaran, semester, aktif, id_tahun_ajaran];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Tahun Ajaran berhasil diubah!", res);
        }
    });
}

exports.deleteTahunAjaran = function (req, res) {
    let id_tahun_ajaran = req.body.id_tahun_ajaran;

    let query = "DELETE FROM tahun_ajaran WHERE id=?";
    let requests = [id_tahun_ajaran];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Tahun Ajaran berhasil dihapus!", res);
        }
    });
}

/* SET TAHUN AJARAN AKTIF */
exports.setActiveTahunAjaran = function (req, res) {
    let id_tahun_ajaran = req.body.id_tahun_ajaran;
    let id_sekolah = req.body.id_sekolah;

    let query = "UPDATE tahun_ajaran SET aktif=0 WHERE id_sekolah=?";
    let requests = [id_sekolah];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            query = "UPDATE tahun_ajaran SET aktif=1 WHERE id_tahun_ajaran=?";
            requests = [id_tahun_ajaran];

            connection.query(query, requests, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok("Tahun Ajaran Aktif berhasil diubah!", res)
                }
            });
        }
    });
}

/* ADMIN ROMBEL SEKOLAH */
exports.showRombelSekolah = function (req, res) {
    let id_sekolah = req.params.id_sekolah;

    let query = "SELECT * FROM rombel_sekolah WHERE id_sekolah=?";
    let requests = [id_sekolah];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
}

exports.addRombelSekolah = function (req, res) {
    let id_sekolah = req.body.id_sekolah;
    let id_tingkat_kelas = req.body.id_tingkat_kelas;
    let rombel = req.body.rombel;

    let query = "SELECT * FROM rombel_sekolah WHERE id_sekolah=? AND id_tingkat_kelas=? AND rombel=?";
    let requests = [id_sekolah, id_tingkat_kelas, rombel];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if(rows.length === 0) {
                query = "INSERT INTO rombel_sekolah (id_sekolah, id_tingkat_kelas, rombel) VALUES (?,?,?)";
                requests = [id_sekolah, id_tingkat_kelas, rombel];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.ok("Rombel berhasil ditambahkan!", res);
                    }
                });                
            } else {
                response.ok("Tahun Ajaran tersebut sudah ada!", res);
            }
        }
    });
}

exports.editRombelSekolah = function (req, res) {
    let id_rombel = req.body.id_rombel;
    let id_sekolah = req.body.id_sekolah;
    let id_tingkat_kelas = req.body.id_tingkat_kelas;
    let rombel = req.body.rombel;

    let query = "UPDATE rombel_sekolah SET id_sekolah=?, id_tingkat_kelas=?, rombel=? WHERE id=?";
    let requests = [id_sekolah, id_tingkat_kelas, rombel, id_rombel];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Rombel berhasil diubah!", res);
        }
    });
}

exports.deleteRombelSekolah = function (req, res) {
    let id_rombel = req.body.id_rombel;

    let query = "DELETE FROM rombel_sekolah WHERE id=?";
    let requests = [id_rombel];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Tahun Ajaran berhasil dihapus!", res);
        }
    });
}

/* SET STATUS SISWA */
exports.getAllStatusSiswa = function (req, res) {
    let id_sekolah = req.body.id_sekolah;
    let rombel = req.body.rombel;

    let query = "SELECT * FROM view_status_siswa WHERE id_sekolah=? AND rombel=?";
    let requests = [id_sekolah, rombel];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
}

exports.setStatusSiswa = function (req, res) {
    let id_siswa = req.body.id_siswa;
    let id_tahun_ajaran = req.body.id_tahun_ajaran;
    let status = req.body.status;

    let query = "SELECT * FROM status_siswa WHERE id_siswa=? AND id_tahun_ajaran=?";
    let requests = [id_siswa, id_tahun_ajaran];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if(rows.length === 0) {
                query = "INSERT INTO status_siswa (id_siswa, id_tahun_ajaran, status) VALUES (?,?,?)";
                requests = [id_siswa, id_tahun_ajaran, status];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.ok("Status siswa sudah berubah!", res);
                    }
                });
            } else {
                query = "UPDATE status_siswa SET status=? WHERE id_siswa=? AND id_tahun_ajaran=?";
                requests = [status, id_siswa, id_tahun_ajaran];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.ok("Status siswa sudah berubah!", res);
                    }
                });
            }
        }
    });
}

/* REVERT ROMBEL SISWA */
exports.revertRombelSiswa = function (req, res) {
    let id_tahun_ajaran = req.body.id_tahun_ajaran;
    let id_sekolah = req.body.id_sekolah;
    let id_tingkat_kelas = req.body.id_tingkat_kelas;

    let query = "DELETE rombel_siswa FROM rombel_siswa INNER JOIN rombel_sekolah " +
     "on rombel_siswa.id_rombel_sekolah = rombel_sekolah.id_rombel_sekolah " + 
     "WHERE rombel_siswa.id_tahun_ajaran=? AND rombel_sekolah.id_sekolah=? AND rombel_sekolah.id_tingkat_kelas=?";
    let requests = [id_tahun_ajaran, id_sekolah, id_tingkat_kelas];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Rombel pada tingkat kelas tersebut sudah dihapus!", res);
        }
    });
}