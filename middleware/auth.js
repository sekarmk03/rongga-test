var connection = require('../koneksi');
var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip');

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
    let photo = req.body.photo;
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
                let id_users = rows[0].id;

                query = "UPDATE users SET no_telp=?, photo=?, alamat=?, id_sekolah=? WHERE id=?";
                requests = [no_telp, photo, alamat, id_sekolah, id_users];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {        
                        query = "INSERT INTO siswa (id_users, tahun_masuk, status_awal_siswa, id_tingkat_siswa) VALUES (?,?,?,?)";
                        requests = [id_users, tahun_masuk, status_awal_siswa, id_tingkat_kelas];

                        connection.query(query, requests, function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                            } else {
                                let access_token = jwt.sign({rows}, config.secret, {
                                    expiresIn: 1440
                                });
                                let ip_address = ip.address();
                
                                query = "INSERT INTO access_token (id_users, access_token, ip_address) VALUES (?,?,?)";
                                requests = [id_users, access_token, ip_address];
                
                                connection.query(query, requests, function (error, rows, fields) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        res.json({
                                            success: true,
                                            message: "Token terdaftar!",
                                            token: access_token,
                                            current_user: id_users
                                        });
                                        // response.ok("Registrasi berhasil!", res);
                                    }
                                });
                                // response.ok("Profil berhasil dilengkapi!", res);
                            }
                        });
                    }
                });
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
    let photo = req.body.photo;
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
                                let access_token = jwt.sign({rows}, config.secret, {
                                    expiresIn: 1440
                                });
                                let ip_address = ip.address();
                
                                query = "INSERT INTO access_token (id_users, access_token, ip_address) VALUES (?,?,?)";
                                requests = [id_users, access_token, ip_address];
                
                                connection.query(query, requests, function (error, rows, fields) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        res.json({
                                            success: true,
                                            message: "Token terdaftar!",
                                            token: access_token,
                                            current_user: id_users
                                        });
                                        // response.ok("Registrasi berhasil!", res);
                                    }
                                });

                                // response.ok("Profil berhasil dilengkapi!", res);
                            }
                        });
                    }
                });
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

    connection.query(query, requests, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if(rows.length === 1) {
                let access_token = jwt.sign({rows}, config.secret, {
                    expiresIn: 1440
                });
                let id_users = rows[0].id;
                let ip_address = ip.address();

                query = "INSERT INTO access_token (id_users, access_token, ip_address) VALUES (?,?,?)";
                requests = [id_users, access_token, ip_address];

                connection.query(query, requests, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            success: true,
                            message: "Token terdaftar!",
                            token: access_token,
                            current_user: id_users
                        });
                        // response.ok("Registrasi berhasil!", res);
                    }
                });
            } else {
                res.json({
                    success: false,
                    message: "Email atau password salah!"
                });
                // response.ok("Nomor induk (NIS atau NIP) yang dimasukkan sudah terdaftar!", res);
            }
        }
    });
}