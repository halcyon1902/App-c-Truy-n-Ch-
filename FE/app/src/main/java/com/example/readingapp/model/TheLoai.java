package com.example.readingapp.model;

import java.io.Serializable;

public class TheLoai implements Serializable {

    private String _id;
    private String TenTheLoai;

    public TheLoai() {
    }

    public TheLoai(String tenTheLoai, boolean trangThai) {
        TenTheLoai = tenTheLoai;
    }

    public TheLoai(String _id, String tenTheLoai, boolean trangThai) {
        this._id = _id;
        TenTheLoai = tenTheLoai;
    }

    public String getTenTheLoai() {
        return TenTheLoai;
    }

    public void setTenTheLoai(String tenTheLoai) {
        TenTheLoai = tenTheLoai;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    @Override
    public String toString() {
        return "TheLoai{" +
                "_id='" + _id + '\'' +
                ", TenTheLoai='" + TenTheLoai + '\'' +
                '}';
    }
}
