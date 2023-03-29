package com.example.readingapp.model;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;

public class Truyen implements Serializable {
    private String _id;
    private String TenTruyen;
    private String[] TheLoais;
    private boolean TrangThai;
    private boolean TinhTrang;
    private String GioiThieu;
    private String AnhBia;
    private int LuotThich;
    private int LuotXem;
    private int LuotXemThang;
    private Date NgayXepHang;
    private String[] TacGias;

    public Truyen(boolean trangThai, boolean tinhTrang, int luotThich, int luotXem, int luotXemThang, Date ngayXepHang) {
        TrangThai = trangThai;
        TinhTrang = tinhTrang;
        LuotThich = luotThich;
        LuotXem = luotXem;
        LuotXemThang = luotXemThang;
        NgayXepHang = ngayXepHang;
    }


    public Truyen() {
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

    public int getLuotThich() {
        return LuotThich;
    }

    public void setLuotThich(int luotThich) {
        LuotThich = luotThich;
    }

    public int getLuotXem() {
        return LuotXem;
    }

    public void setLuotXem(int luotXem) {
        LuotXem = luotXem;
    }

    public int getLuotXemThang() {
        return LuotXemThang;
    }

    public void setLuotXemThang(int luotXemThang) {
        LuotXemThang = luotXemThang;
    }

    public Date getNgayXepHang() {
        return NgayXepHang;
    }

    public void setNgayXepHang(Date ngayXepHang) {
        NgayXepHang = ngayXepHang;
    }

    public String[] getTacGias() {
        return TacGias;
    }

    public void setTacGias(String[] tacGias) {
        TacGias = tacGias;
    }
}