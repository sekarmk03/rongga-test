var connection = require('../koneksi');
var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var ip = require('ip');
var resource = require('../config/resource');

/* REGISTER */
exports.registration = function (req, res) {
    let no_induk = req.body.no_induk;
    let nama = req.body.nama;
    let email =  req.body.email;
    let password = md5(req.body.password);
    let gender = req.body.gender;
    let tipe_pengguna = req.body.tipe_pengguna;

    let query = "SELECT no_induk FROM users WHERE no_induk=?";
    let requests = [no_induk];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if(rows.length === 0) {
                query = "INSERT INTO users (no_induk, nama, email, password, gender, tipe_pengguna) VALUES (?,?,?,?,?,?)";
                requests = [no_induk, nama, email, password, gender, tipe_pengguna];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.ok("Registrasi berhasil!", res);
                    }
                });
            } else {
                response.ok("Nomor induk (NIS atau NIP) yang dimasukkan sudah terdaftar!", res);
            }
        }
    });
}

/* REGISTER DETAIL */
exports.registerStudent = function (req, res) {
    let no_induk = req.body.no_induk;
    let id_sekolah =  req.body.id_sekolah;
    let no_telp = req.body.no_telp;
    let photo = "";
    let alamat = req.body.alamat;
    let status_awal_siswa = req.body.status_awal_siswa;
    let tahun_masuk = req.body.tahun_masuk;
    let id_tingkat_kelas = req.body.id_tingkat_kelas;

    let query = "SELECT * FROM users WHERE no_induk=?";
    let requests = [no_induk];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if (rows.length === 1) {
                let id_user = rows[0].id;

                if (req.files) {
                    let file = req.files.photo;
                    let img_name = id_user + "_" + file.name;
            
                    file.mv('public/images/'+img_name, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            photo = img_name;
            
                            query = "UPDATE users SET no_telp=?, photo=?, alamat=?, id_sekolah=? WHERE id=?";
                            requests = [no_telp, photo, alamat, id_sekolah, id_user];

                            connection.query(query, requests, function (error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                } else {        
                                    query = "INSERT INTO siswa (id_users, tahun_masuk, status_awal_siswa, id_tingkat_siswa) VALUES (?,?,?,?)";
                                    requests = [id_user, tahun_masuk, status_awal_siswa, id_tingkat_kelas];

                                    connection.query(query, requests, function (error, rows, fields) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            response.ok("Registrasi berhasil!", res);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    query = "UPDATE users SET no_telp=?, photo=?, alamat=?, id_sekolah=? WHERE id=?";
                    requests = [no_telp, photo, alamat, id_sekolah, id_user];

                    connection.query(query, requests, function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                        } else {        
                            query = "INSERT INTO siswa (id_users, tahun_masuk, status_awal_siswa, id_tingkat_siswa) VALUES (?,?,?,?)";
                            requests = [id_user, tahun_masuk, status_awal_siswa, id_tingkat_kelas];

                            connection.query(query, requests, function (error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    response.ok("Registrasi berhasil!", res);
                                }
                            });
                        }
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Data pengguna yang digunakan tidak ditemukan!"
                });
            }
        }
    });
}

exports.registerTeacher = function (req, res) {
    let no_induk = req.body.no_induk;
    let id_sekolah =  req.body.id_sekolah;
    let no_telp = req.body.no_telp;
    let photo = "";
    let alamat = req.body.alamat;
    let status_kerja = req.body.status_kerja;
    let id_mapel = req.body.id_mapel;

    let query = "SELECT * FROM users WHERE no_induk=?";
    let requests = [no_induk];

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if (rows.length === 1) {
                let id_users = rows[0].id;

                if (req.files) {
                    let file = req.files.photo;
                    let img_name = id_users + "_" + file.name;
            
                    file.mv('public/images/'+img_name, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            photo = img_name;
            
                            query = "UPDATE users SET no_telp=?, photo=?, alamat=?, id_sekolah=? WHERE id=?";
                            requests = [no_telp, photo, alamat, id_sekolah, id_users];

                            connection.query(query, requests, function (error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                } else {        
                                    query = "INSERT INTO guru (id_users, id_mapel, status_ikatan_kerja) VALUES (?,?,?)";
                                    requests = [id_users, id_mapel, status_kerja];

                                    connection.query(query, requests, function (error, rows, fields) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            response.ok("Registrasi berhasil!", res);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    query = "UPDATE users SET no_telp=?, photo=?, alamat=?, id_sekolah=? WHERE id=?";
                    requests = [no_telp, photo, alamat, id_sekolah, id_users];

                    connection.query(query, requests, function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                        } else {        
                            query = "INSERT INTO guru (id_users, id_mapel, status_ikatan_kerja) VALUES (?,?,?)";
                            requests = [id_users, id_mapel, status_kerja];

                            connection.query(query, requests, function (error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    response.ok("Registrasi berhasil!", res);
                                }
                            });
                        }
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Data pengguna yang digunakan tidak ditemukan!"
                });
            }
        }
    });
}

/* LOGIN */
exports.login = function (req, res) {
    let no_induk =  req.body.no_induk;
    let password = md5(req.body.password);

    let query = "SELECT * FROM users WHERE no_induk=? AND password=?";
    let requests = [no_induk, password];

    connection.query(query, requests, async function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if(rows.length === 1) {
                let access_token = resource.getToken(rows);
                let id_users = rows[0].id;
                let ip_address = ip.address();

                query = "INSERT INTO access_token (id_users, access_token, ip_address) VALUES (?,?,?)";
                requests = [id_users, access_token, ip_address];

                await resource.expandedResult(query, requests);
                let tahun_ajaran = await resource.expandedResult("SELECT * FROM tahun_ajaran WHERE aktif=1", []);
                let view_data, wali_kelas, kuesioner;

                if (rows[0].tipe_pengguna == 1) {
                    view_data = await resource.expandedResult("SELECT * FROM view_siswa WHERE id=?", [id_users]);
                } else if (rows[0].tipe_pengguna == 2) {
                    view_data = await resource.expandedResult("SELECT * FROM view_guru WHERE id=?", [id_users]);
                } else {
                    view_data = [];
                }

                let userdata = {
                    "id": rows[0].id,
                    "no_induk": rows[0].no_induk,
                    "nama": rows[0].nama,
                    "email": rows[0].email,
                    "password": rows[0].password,
                    "gender": rows[0].gender,
                    "no_telp": rows[0].no_telp,
                    "photo": rows[0].photo,
                    "alamat": rows[0].alamat,
                    "tipe_pengguna": rows[0].tipe_pengguna,
                    "id_sekolah": rows[0].id_sekolah,
                };

                if (rows[0].tipe_pengguna > 0) {
                    if (Array.isArray(tahun_ajaran) && Array.isArray(view_data)) {
                        if (rows[0].tipe_pengguna == 1) {
                            userdata["id_siswa"] = view_data[0].id_siswa;
                            userdata["tahun_masuk"] = view_data[0].tahun_masuk;
                            userdata["status_awal_siswa"] = view_data[0].status_awal_siswa;
                            userdata["tingkat"] = view_data[0].tingkat;
                            userdata["deskripsi"] = view_data[0].deskripsi;
                            userdata["rombel"] = view_data[0].rombel;

                            let thn_ajaran_tmp = tahun_ajaran[0].tahun_ajaran.split("/");

                            for (let i = 0; i < thn_ajaran_tmp.length; i++) {
                                thn_ajaran_tmp[i] = thn_ajaran_tmp[i] - "1";
                            }

                            userdata["prev_tahun_ajaran"] = thn_ajaran_tmp.join("/");

                            kuesioner = await resource.expandedResult("SELECT * FROM view_test_results WHERE id_siswa=? AND id_tahun_ajaran=?", [view_data[0].id_siswa, tahun_ajaran[0].id]);

                            if (Array.isArray(kuesioner) && kuesioner.length > 0) {
                                userdata["kuesioner"] = 1;
                            } else {
                                userdata["kuesioner"] = 0;
                            }
                        } else {
                            wali_kelas = await resource.expandedResult("SELECT * FROM rombel_wali_kelas WHERE id_guru=?", [view_data[0].id_guru]);

                            userdata["id_guru"] = view_data[0].id_guru;
                            userdata["status_ikatan_kerja"] = view_data[0].status_ikatan_kerja;
                            userdata["spesialisasi"] = view_data[0].spesialisasi;
                            userdata["kelompok_mapel"] = view_data[0].kelompok_mapel;

                            if (Array.isArray(wali_kelas) && wali_kelas.length > 0) {
                                userdata["wali_kelas"] = 1;
                            } else {
                                userdata["wali_kelas"] = 0;
                            }
                        }
                    }
                }

                userdata["id_tahun_ajaran"] = tahun_ajaran[0].id;
                userdata["tahun_ajaran"] = tahun_ajaran[0].tahun_ajaran;
                userdata["token"] = access_token;

                res.json({
                    success: true,
                    message: "Login Sukses!",
                    user_data: userdata,
                });
            } else {
                res.json({
                    success: false,
                    message: "Email atau password salah!",
                    user_data: {}
                });
            }
        }
    });
}