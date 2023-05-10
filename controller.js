'use strict';

var response = require('./res');
var connection = require('./koneksi');
var md5 = require('md5');
var resource = require('./config/resource');
var filesystem = require('fs');

exports.index = function (req, res) {
    response.ok("Aplikasi REST API berjalan!", res)
};

/* SEARCH FEATURE */
//post request
exports.searchStudentDetails = function (req, res) {
    let id_sekolah = req.body.id_sekolah;
    let nama = "";
    
    if (req.body.nama) {
        nama = "%" + req.body.nama + "%";
    } else {
        nama = "%%";
    }

    let rombel = req.body.rombel;

    let query = "";
    let requests = [];

    if ((nama !== "%%") && (rombel != null && rombel !== '')){
        query = "SELECT * FROM view_siswa WHERE id_sekolah=? AND nama LIKE ? AND rombel = ?";
        console.log("sini1");
        requests.push(id_sekolah);
        requests.push(nama);
        requests.push(rombel);
    } else {
        if (nama !== "%%") {
            query = "SELECT * FROM view_siswa WHERE id_sekolah=? AND nama LIKE ?";
            console.log("sini2" + nama);
            requests.push(id_sekolah);
            requests.push(nama);
        } else if (rombel != null && rombel !== '') {
            query = "SELECT * FROM view_siswa WHERE id_sekolah=? AND rombel = ?";
            console.log("sini3" + rombel);
            requests.push(id_sekolah);
            requests.push(rombel);
        } else {
            query = "SELECT * FROM view_siswa WHERE id_sekolah=?";
            console.log("sini4");
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
    let nama = "";
    
    if (req.body.nama) {
        nama = "%" + req.body.nama + "%";
    } else {
        nama = "%%";
    }

    let query = "";
    let requests = [];

    if (nama !== "%%"){
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
    let photos = req.body.tempPhoto;
    let alamat = req.body.alamat;
    let status_siswa = req.body.status_siswa;
    let id_tingkat_siswa = req.body.id_tingkat_siswa;
    let tahun_masuk = req.body.tahun_masuk;
    let method = req.body.method;

    if (method == 2) {
        filesystem.unlink('public/images/'+photos, function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                photos = "";
                
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
        });
    } else {
        if (req.files) {
            let file = req.files.photo;
            let img_name = id_user + "_" + file.name;
    
            file.mv('public/images/'+img_name, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    photos = img_name;

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
            });
        } else {
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
    }
}

exports.editTeacher = function (req, res) {
    let id_user = req.body.id;
    let nis = req.body.no_induk;
    let nama = req.body.nama;
    let email = req.body.email;
    let gender = req.body.gender;
    let no_telp = req.body.telp;
    let photos = req.body.tempPhoto;
    let alamat = req.body.alamat;
    let status_kerja = req.body.status_kerja;
    let id_mapel = req.body.id_mapel;
    let method = req.body.method;

    if (method == 2) {
        filesystem.unlink('public/images/'+photos, function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                photos = "";
                
                let query_users = "UPDATE users SET no_induk=?, nama=?, email=?, gender=?, no_telp=?, photo=?, alamat=? WHERE id=?";
                let users_requests = [nis, nama, email, gender, no_telp, photos, alamat, id_user];

                connection.query(query_users, users_requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        query_users = "UPDATE guru SET id_mapel=?, status_ikatan_kerja=? WHERE id_users=?";
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
        });
    } else {
        if (req.files) {
            let file = req.files.photo;
            let img_name = id_user + "_" + file.name;
    
            file.mv('public/images/'+img_name, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    photos = img_name;
    
                    let query_users = "UPDATE users SET no_induk=?, nama=?, email=?, gender=?, no_telp=?, photo=?, alamat=? WHERE id=?";
                    let users_requests = [nis, nama, email, gender, no_telp, photos, alamat, id_user];
    
                    connection.query(query_users, users_requests, function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                        } else {
                            query_users = "UPDATE guru SET id_mapel=?, status_ikatan_kerja=? WHERE id_users=?";
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
            });
        } else {
            let query_users = "UPDATE users SET no_induk=?, nama=?, email=?, gender=?, no_telp=?, photo=?, alamat=? WHERE id=?";
            let users_requests = [nis, nama, email, gender, no_telp, photos, alamat, id_user];
    
            connection.query(query_users, users_requests, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    query_users = "UPDATE guru SET id_mapel=?, status_ikatan_kerja=? WHERE id_users=?";
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
    }
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

exports.revertRombelWaliKelas = function (req, res) {
    let id_tahun_ajaran = req.body.id_tahun_ajaran;
    let id_sekolah = req.body.id_sekolah;
    let id_tingkat_kelas = req.body.id_tingkat_kelas;

    let query = "DELETE rombel_wali_kelas FROM rombel_wali_kelas INNER JOIN rombel_sekolah " +
     "on rombel_wali_kelas.id_rombel_sekolah = rombel_sekolah.id_rombel_sekolah " + 
     "WHERE rombel_wali_kelas.id_tahun_ajaran=? AND rombel_sekolah.id_sekolah=? AND rombel_sekolah.id_tingkat_kelas=?";
    let requests = [id_tahun_ajaran, id_sekolah, id_tingkat_kelas];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Rombel pada tingkat kelas tersebut sudah dihapus!", res);
        }
    });
}

/* ROMBEL SISWA */
exports.setWaliKelas = function (req, res) {
    let wali_kelas = req.body.wali_kelas;

    let query = "INSERT INTO rombel_wali_kelas (id_guru, id_tahun_ajaran, id_rombel_sekolah) VALUES ?";
    let requests = [wali_kelas.map(item => [item.id_guru, item.id_tahun_ajaran, item.id_rombel_sekolah])];
    
    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Wali Kelas berhasil ditambahkan!", res);
        }
    });
}

exports.setRombelSiswa = function (req, res) {
    let rombel_siswa = req.body.rombel_siswa;

    let query = "INSERT INTO rombel_siswa (id_siswa, id_tahun_ajaran, id_rombel_sekolah) VALUES ?";
    let requests = [rombel_siswa.map(item => [item.id_siswa, item.id_tahun_ajaran, item.id_rombel_sekolah])];
    
    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Siswa berhasil ditambahkan pada rombel tersebut!", res);
        }
    });
}

/* INPUT NILAI AKHIR */
exports.addNilaiAkhirSiswa = function (req, res) {
    let nilai_akhir = req.body.nilai_akhir;

    let query, requests;
    let successes = true;
    let moreSuccesses = 0;

    let i = 0;
    while ((i < nilai_akhir.length) && (successes)) {
        query = "";
        requests = [];

        if (nilai_akhir[i].id_nilai_akhir.length > 0) {
            query = "UPDATE nilai_akhir_siswa SET id_mapel=?, id_siswa=?, id_tingkat_kelas=?, id_sekolah=?, id_tahun_ajaran=?, nilai=? WHERE id=?";
            requests = [nilai_akhir[i].id_mapel, nilai_akhir[i].id_siswa, nilai_akhir[i].id_tingkat_kelas,
                nilai_akhir[i].id_sekolah, nilai_akhir[i].id_tahun_ajaran, nilai_akhir[i].nilai, nilai_akhir[i].id_nilai_akhir];
        } else {
            query = "INSERT INTO nilai_akhir_siswa (id_mapel, id_siswa, id_tingkat_kelas, id_sekolah, id_tahun_ajaran, nilai) VALUES (?,?,?,?,?,?)";
            requests = [nilai_akhir[i].id_mapel, nilai_akhir[i].id_siswa, nilai_akhir[i].id_tingkat_kelas,
                nilai_akhir[i].id_sekolah, nilai_akhir[i].id_tahun_ajaran, nilai_akhir[i].nilai];
        }

        connection.query(query, requests, function (error, rows, fields) {
            if (error) {
                console.log(error);
                successes = false;
            } else {
                moreSuccesses++;
                // response.ok("Nilai akhir berhasil ditambahkan!", res);
            }
        });
        i++;
    }

    if (nilai_akhir.length == moreSuccesses) {
        response.ok("Nilai akhir berhasil ditambahkan!", res);
    } else {
        console.log("Nilai gagal ditambahkan!");
    }
}

/* GET MAPEL */
exports.getAllMapel = function (req, res) {
    let tingkat = req.body.tingkat;
    let rombel = "";
    
    if (req.body.rombel) {
        rombel = req.body.rombel;
    }

    let query = "";
    let requests = [];
    
    if (rombel.length > 0 || tingkat > 7) {
        query = "SELECT * FROM mapel WHERE id_jenjang = 2 ORDER BY id_kelompok_mapel";
    } else {
        query = "SELECT * FROM mapel WHERE id_jenjang = 1 ORDER BY id_kelompok_mapel";
    }

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
}

exports.getAllExistingNilaiMapel = async function (req, res) {
    let tingkat = req.body.tingkat;
    let id_siswa = req.body.id_siswa;
    let id_tahun_ajaran = req.body.id_tahun_ajaran;
    let id_sekolah = req.body.id_sekolah;
    let rombel = "";
    
    if (req.body.rombel) {
        rombel = req.body.rombel;
    }
    
    let query = "";
    let requests = [];

    if (rombel.length > 0 || tingkat > 7) {
        query = "SELECT * FROM tingkat_kelas WHERE tingkat = ?";
        requests = [tingkat];
    } else {
        query = "SELECT * FROM tingkat_kelas WHERE tingkat = 6";
    }

    let tingkat_kelas = await resource.expandedResult(query, requests);

    query = "SELECT * FROM nilai_akhir WHERE id_tingkat_kelas=? AND id_siswa=? AND id_tahun_ajaran=? AND id_sekolah=?";
    requests = [tingkat_kelas[0].id, id_siswa, id_tahun_ajaran, id_sekolah];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
}
/* KUESIONER */
exports.testKuesioner = function (req, res) {
    let kuesioner = req.body.kuesioner;

    let query = "INSERT INTO user_choice (id_siswa, id_question, id_tahun_ajaran, id_choice) VALUES ?";
    let requests = [kuesioner.map(item => [item.id_siswa, item.id_question, item.id_tahun_ajaran, item.id_choice])];
    
    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Jawaban sudah tersimpan!", res);
        }
    });
}
