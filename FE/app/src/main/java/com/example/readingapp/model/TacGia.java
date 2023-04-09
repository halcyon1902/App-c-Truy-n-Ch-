package com.example.readingapp.model;

import java.io.Serializable;

public class TacGia implements Serializable {
    private String _id;
    private String TenTacGia;

    public TacGia() {
    }

    public TacGia(String tenTacGia) {
        TenTacGia = tenTacGia;
    }

    public TacGia(String _id, String tenTacGia) {
        this._id = _id;
        TenTacGia = tenTacGia;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTenTacGia() {
        return TenTacGia;
    }

    public void setTenTacGia(String tenTacGia) {
        TenTacGia = tenTacGia;
    }

    @Override
    public String toString() {
        return "TacGia{" +
                "_id='" + _id + '\'' +
                ", TenTacGia='" + TenTacGia + '\'' +
                '}';
    }
}
