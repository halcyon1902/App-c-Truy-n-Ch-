package com.example.readingapp.model;

import java.io.Serializable;
import java.util.Arrays;

public class Truyen implements Serializable {
    private String _id;
    private String TenTruyen;
    private String[] TheLoais;
    private boolean TrangThai;
    private boolean TinhTrang;
    private String GioiThieu;
    private String AnhBia;
    private String TacGias;

    public Truyen() {
    }

    public Truyen(String _id, String tenTruyen, String[] theLoais, boolean trangThai, boolean tinhTrang, String gioiThieu, String anhBia, String tacGias) {
        this._id = _id;
        TenTruyen = tenTruyen;
        TheLoais = theLoais;
        TrangThai = trangThai;
        TinhTrang = tinhTrang;
        GioiThieu = gioiThieu;
        AnhBia = anhBia;
        TacGias = tacGias;
    }


    @Override
    public String toString() {
        return "Truyen{" +
                "_id='" + _id + '\'' +
                ", TenTruyen='" + TenTruyen + '\'' +
                ", TheLoais=" + Arrays.toString(TheLoais) +
                ", TrangThai=" + TrangThai +
                ", TinhTrang=" + TinhTrang +
                ", GioiThieu='" + GioiThieu + '\'' +
                ", AnhBia='" + AnhBia + '\'' +
                ", TacGias=" + TacGias +
//                ", Chapters=" + Arrays.toString(Chapters) +
                '}';
    }


    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTenTruyen() {
        return TenTruyen;
    }

    public void setTenTruyen(String tenTruyen) {
        TenTruyen = tenTruyen;
    }

    public String[] getTheLoais() {
        return TheLoais;
    }

    public void setTheLoais(String[] theLoais) {
        TheLoais = theLoais;
    }

    public boolean isTrangThai() {
        return TrangThai;
    }

    public void setTrangThai(boolean trangThai) {
        TrangThai = trangThai;
    }

    public boolean isTinhTrang() {
        return TinhTrang;
    }

    public void setTinhTrang(boolean tinhTrang) {
        TinhTrang = tinhTrang;
    }

    public String getGioiThieu() {
        return GioiThieu;
    }

    public void setGioiThieu(String gioiThieu) {
        GioiThieu = gioiThieu;
    }

    public String getAnhBia() {
        return AnhBia;
    }

    public void setAnhBia(String anhBia) {
        AnhBia = anhBia;
    }

    public String getTacGias() {
        return TacGias;
    }

    public void setTacGias(String tacGias) {
        TacGias = tacGias;
    }
}